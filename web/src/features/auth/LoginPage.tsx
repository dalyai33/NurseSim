import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../../lib/validate";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [errors, setErrors] = useState<{ email?: string; pw?: string }>({});

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const nextErrors: typeof errors = {};

    if (!email) nextErrors.email = "Email is required.";
    else if (!isValidEmail(email)) nextErrors.email = "Invalid email or password.";

    if (!pw) nextErrors.pw = "Password is required.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      navigate("/landing");
    }
  }

  return (
    <div className="app-shell">
      <div className="login-wrap">
        <div className="card">
          <h1 className="brand">NurseSim</h1>

          <form onSubmit={handleSubmit} noValidate>
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

            <button className="btn" type="submit">Log In</button>

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
