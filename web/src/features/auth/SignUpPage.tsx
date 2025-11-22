import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../../lib/validate";

export default function SignUpPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentID, setStudentID] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [errors, setErrors] = useState<{
    firstName?: string;
    lastName?: string;
    studentID?: string;
    phoneNumber?: string;
    email?: string;
    pw?: string;
    form?: string; 
  }>({});
  const [loading, setLoading] = useState(false); 

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const nextErrors: typeof errors = {};

    if (!firstName) nextErrors.firstName = "First name required.";
    if (!lastName) nextErrors.lastName = "Last name required.";
    if (!studentID) nextErrors.studentID = "Student ID required.";
    if (!phoneNumber) nextErrors.phoneNumber = "Phone required.";

    if (!email) nextErrors.email = "Email is required.";
    else if (!isValidEmail(email)) nextErrors.email = "Enter a valid OHSU email.";

    if (!pw) nextErrors.pw = "Password required.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName,
          last_name: lastName,
          student_id: studentID,
          phone_number: phoneNumber,
          email,
          password: pw,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        setErrors((prev) => ({
          ...prev,
          form: data.error || "Sign up failed. Please try again.",
        }));
        return;
      }

      navigate("/landing");
    } catch (err) {
      console.error("Signup error:", err);
      setErrors((prev) => ({
        ...prev,
        form: "Could not reach the server. Please try again.",
      }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app-shell">
      <div className="sign-up-wrap">
        <div className="card">
          <h1 className="brand">NurseSim</h1>

          <form onSubmit={handleSubmit} noValidate>
            {errors.form && <p className="error">{errors.form}</p>}

            <div className="name-fields">
              <div className="field">
                <label htmlFor="firstName">First Name</label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Alex"
                  aria-invalid={!!errors.firstName}
                />
                {errors.firstName && <p className="error">{errors.firstName}</p>}
              </div>

              <div className="field">
                <label htmlFor="lastName">Last Name</label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Smith"
                  aria-invalid={!!errors.lastName}
                />
                {errors.lastName && <p className="error">{errors.lastName}</p>}
              </div>
            </div>

            <div className="field">
              <label htmlFor="studentID">Student ID</label>
              <input
                id="studentID"
                type="text"
                value={studentID}
                onChange={(e) => setStudentID(e.target.value)}
                placeholder="97XXXXXXX"
                aria-invalid={!!errors.studentID}
              />
              {errors.studentID && <p className="error">{errors.studentID}</p>}
            </div>

            <div className="field">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                type="text"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 (234) 567-8910"
                aria-invalid={!!errors.phoneNumber}
              />
              {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
            </div>

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
              {loading ? "Signing up..." : "Sign Up"}
            </button>

            <div className="links">
              <button
                className="btn-signin"
                type="button"
                onClick={() => navigate("/login")}
              >
                Already have an account? Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
