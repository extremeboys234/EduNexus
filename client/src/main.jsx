import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from "./providers/AuthProvider";
// src/main.jsx (or index.js)
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css'; // pick whichever theme you like
import './index.css'; // your app styles
// src/main.jsx (near other global imports)
import 'katex/dist/katex.min.css';
import 'highlight.js/styles/github-dark.css'; // <- pick any highlight.js theme here
import './index.css';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <AuthProvider> */}
      <App />
    {/* </AuthProvider> */}
  </StrictMode>
)
