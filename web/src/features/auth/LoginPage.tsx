import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../../lib/validate";

export default function LoginPage(){
    // to navigate between pages
    const navigate = useNavigate();
    // to creload the ui after it changes from email (init statE) to set email
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [errors, setErrors] = useState<{ email?: string; pw?: string}>({});

function handleSubmit(e: React.FormEvent){
    e.preventDefault(); // to prevent reloading the whole page
    const nextErrors: typeof errors = {}; // init errors to 0
    if (!isValidEmail(email)) nextErrors.email = "Invalid email address, please check";
    if (!pw) nextErrors.pw = "Really bro? no password?";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
        // in case no errors, go to success page
        navigate("/dashboard");
    }
}

return (
    <div className="login-wrap">
        <div className="card">
            <h1 className="brand"> NurseSim</h1>
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
                    <span> . </span>
                    <a href="/signup">Create Account</a>
                </div>
            </form>
        </div>
    </div>
);

}