import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../../lib/validate";

export default function SignUpPage(){
    // to navigate between pages
    const navigate = useNavigate();
    // to creload the ui after it changes from email (init statE) to set email
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [studentID, setstudentID] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [errors, setErrors] = useState<{
        email?: string; pw?: string, firstName?: string, lastName?: string, studentID?: string, phoneNumber?: string
    }>({});

function handleSubmit(e: React.FormEvent){
    e.preventDefault(); // to prevent reloading the whole page
    const nextErrors: typeof errors = {}; // init errors to 0
    if (!isValidEmail(email)) nextErrors.email = "Invalid email address, please check";
    if (!pw) nextErrors.pw = "Really bro? no password???";
    if (!firstName) nextErrors.firstName = "You should have a first name!";
    if (!lastName) nextErrors.lastName = "You should have a last name!";
    if (!studentID) nextErrors.studentID = "You should have a student ID number!";
    if (!phoneNumber) nextErrors.phoneNumber = "You should have a phone number!";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
        // in case no errors, go to success page
        navigate("/login")
    }
}

return (
    <div className="sign-up-wrap">
        <div className="card">
            <h1 className="brand"> NurseSim</h1>
            <form onSubmit={handleSubmit} noValidate>
                <div className="name-fields">
                    <div className="field">
                        <label htmlFor="firstName">First Name</label>
                        <input 
                            id="firstName"
                            type="firstName"
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
                            type="lastName"
                            value={firstName}
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
                        type="studentID"
                        value={studentID}
                        onChange={(e) => setstudentID(e.target.value)}
                        placeholder="97XXXXXXX"
                        aria-invalid={!!errors.studentID}
                    />
                    {errors.studentID && <p className="error">{errors.studentID}</p>}
                </div>
                <div className="field">
                    <label htmlFor="phoneNumber">Phone Number</label>
                    <input 
                        id="phoneNumber"
                        type="phoneNumber"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1 (234) 567-8910"
                        aria-invalid={!!errors.firstName}
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
                    {errors.pw && <p className="error"> {errors.pw}</p>}
                </div>
                <button className="btn" type="submit">Sign Up</button>

                <div className="links">
                    <button className="btn-signin" type="submit">Sign In</button>
                </div>
            </form>
        </div>
    </div>
)

}