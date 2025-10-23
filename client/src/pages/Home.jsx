import { useAuth } from "../providers/AuthProvider";

function Home() {
  const { auth } = useAuth();

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      {auth && (
        <p>
          Logged in as <strong>{auth.name}</strong> ({auth.email})
        </p>
      )}
    </div>
  );
}

export default Home;