import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../../lib/validate";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [errors, setErrors] = useState<{ email?: string; pw?: string; form?: string }>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: typeof errors = {};

    if (!email) nextErrors.email = "Email is required.";
    else if (!isValidEmail(email)) nextErrors.email = "Invalid email or password.";

    if (!pw) nextErrors.pw = "Password is required.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password: pw }),
      });
      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrors((prev) => ({
          ...prev,
          form: data.error || "Login failed. Please check your email and password.",
        }));
        return;
      }

      navigate("/landing");
    } catch (err) {
      console.error("Login error:", err);
      setErrors((prev) => ({
        ...prev,
        form: "Could not reach the server. Try again.",
      }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="login-wrap">
        <div className="card">
          <h1 className="brand">NurseSim</h1>

          <form onSubmit={handleSubmit} noValidate>
            {errors.form && <p className="error">{errors.form}</p>}

            <div className="field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="username@ohsu.edu"
                aria-invalid={!!errors.email}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <div className="field">
              <label htmlFor="pw">Password</label>
              <input
                id="pw"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="************"
                aria-invalid={!!errors.pw}
              />
              {errors.pw && <p className="error">{errors.pw}</p>}
            </div>

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </button>

            <div className="links">
              <a href="#">Forgot Password?</a>
              <span> · </span>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/signup");
                }}
              >
                Create Account
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
