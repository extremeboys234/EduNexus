// src/components/Notes/UploadNotes.jsx
import { useState } from 'react';
import Tesseract from 'tesseract.js';
import { Upload, Loader2, CheckCircle } from 'lucide-react';
import mammoth from 'mammoth';

// UNIVERSAL pdf.js import (works on all pdfjs-dist versions)
import * as pdfjsLib from 'pdfjs-dist';
import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Fix worker version mismatch
pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

export default function UploadNotes() {
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  const renderPageToBlob = async (page, scale = 2) => {
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: ctx, viewport }).promise;

    return await new Promise((resolve) =>
      canvas.toBlob((blob) => resolve(blob), 'image/png')
    );
  };

  const extractTextFromPDF = async (buffer) => {
    setStatus('Opening PDF...');
    const pdf = await pdfjsLib.getDocument({ data: buffer }).promise;

    const numPages = pdf.numPages;
    let fullText = '';

    // Try searchable text first
    setStatus(`Extracting text from ${numPages} pages...`);
    let searchable = '';

    for (let i = 1; i <= numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      searchable += content.items.map((i) => i.str).join(' ') + '\n\n';
    }

    if (searchable.trim().length > 50) return searchable;

    // If not searchable → OCR each page
    for (let i = 1; i <= numPages; i++) {
      setStatus(`Rendering page ${i}/${numPages}...`);
      const page = await pdf.getPage(i);
      const blob = await renderPageToBlob(page);

      setStatus(`OCR page ${i}/${numPages}...`);
      const { data } = await Tesseract.recognize(blob, 'eng', {
        logger: (m) =>
          m.status === 'recognizing text' &&
          setStatus(`OCR: Page ${i}/${numPages} — ${Math.round(m.progress * 100)}%`),
      });

      fullText += data.text + '\n\n';
    }

    return fullText;
  };

  const extractText = async (file) => {
    const name = file.name.toLowerCase();

    if (name.endsWith('.docx')) {
      setStatus('Reading DOCX...');
      const { value } = await mammoth.extractRawText({
        arrayBuffer: await file.arrayBuffer(),
      });
      return value;
    }

    if (name.endsWith('.txt')) {
      setStatus('Reading TXT...');
      return await file.text();
    }

    if (name.endsWith('.pdf')) {
      return await extractTextFromPDF(await file.arrayBuffer());
    }

    setStatus('OCR (image)...');
    const { data } = await Tesseract.recognize(file, 'eng', {
      logger: (m) =>
        m.status === 'recognizing text' &&
        setStatus(`OCR: ${Math.round(m.progress * 100)}%`),
    });

    return data.text;
  };

  const handleFile = async (file) => {
    if (!file) return;

    setLoading(true);
    setStatus('Starting...');

    try {
      const text = await extractText(file);

      if (!text.trim()) throw new Error('No text extracted');

      setStatus('Uploading...');
      const token = localStorage.getItem('token');

      const res = await fetch('http://localhost:5000/api/upload/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          text,
          filename: file.name,
        }),
      });

      const data = await res.json();
      setStatus(data.success ? `BOOM! ${data.chunks} chunks ready!` : data.error);
    } catch (err) {
      console.error(err);
      setStatus('Error: ' + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="p-10 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-2">Upload Any Notes</h1>
      <p className="text-muted-foreground mb-10">
        PDF • DOCX • Images • TXT (OCR for scanned PDFs & images)
      </p>

      <div
        className={`border-4 border-dashed rounded-3xl p-24 text-center transition-all ${
          dragging ? 'border-primary bg-primary/5 scale-105' : 'border-border'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files[0]);
        }}
      >
        {loading ? (
          <div className="space-y-6">
            <Loader2 className="w-20 h-20 animate-spin mx-auto text-primary" />
            <p className="text-2xl font-medium">{status}</p>
          </div>
        ) : (
          <>
            <Upload className="w-20 h-20 mx-auto mb-6 text-muted-foreground" />
            <p className="text-2xl font-semibold">Drop ANY file here</p>
            <p className="text-muted-foreground text-lg mt-2">
              PDFs & images may take longer (OCR for scanned pages)
            </p>

            <label className="mt-8 inline-block">
              <input
                type="file"
                accept=".pdf,.docx,.txt,.jpg,.jpeg,.png"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />
              <div className="px-8 py-4 bg-primary text-primary-foreground rounded-xl cursor-pointer font-medium hover:bg-primary/90">
                Choose File
              </div>
            </label>
          </>
        )}
      </div>

      {status.includes('BOOM') && (
        <div className="mt-8 p-8 bg-emerald-500/10 border-2 border-emerald-500 rounded-3xl text-center">
          <CheckCircle className="w-20 h-20 mx-auto text-emerald-500 mb-4" />
          <p className="text-3xl font-bold text-emerald-400">{status}</p>
          <p className="text-muted-foreground mt-2">Your notes are in the AI brain — go chat!</p>
        </div>
      )}
    </div>
  );
}
