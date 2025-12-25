import { useEffect, useState } from "react";
import Login from "./Login";
import AlertsDashboard from "./AlertsDashboard";
import Sidebar from "./Sidebar";
import Home from "./Home";

function App() {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [page, setPage] = useState("home");

  /* ================= FETCH ROLE ================= */
  useEffect(() => {
    if (!token) return;

    fetch("http://localhost:9090/api/user/me", {
      headers: {
        Authorization: "Basic " + token
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Role fetch failed");
        }
        return res.json();
      })
      .then(data => {
        setRole(data.role);
      })
      .catch(err => {
        console.error("Role error:", err);
        setRole("USER"); // fallback, prevents infinite loading
      });
  }, [token]);


  if (!token) return <Login onLogin={setToken} />;

  if (!role) return <p>Loading role...</p>;

  return (
    <div className="app-layout">
      <Sidebar
        role={role}
        onNavigate={setPage}
        onLogout={() => {
          setToken(null);
          setRole(null);
        }}
      />

	  <div className="content">

	    {/* TOP HEADER */}
	    <div className="top-header">
	      <h2>Security Dashboard</h2>

	      <span
	        className={`role-badge ${
	          role === "ADMIN"
	            ? "role-admin"
	            : role === "ANALYST"
	            ? "role-analyst"
	            : "role-user"
	        }`}
	      >
	        {role}
	      </span>
	    </div>

	    {page === "home" && <Home role={role} />}


        {page === "alerts" && role !== "USER" && (
          <AlertsDashboard token={token} role={role} />
        )}

        {page === "alerts" && role === "USER" && (
          <p>Access denied</p>
        )}
      </div>
    </div>
  );
}

export default App;
