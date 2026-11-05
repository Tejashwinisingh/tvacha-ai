
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "./VerifyEmail.css";

function VerifyEmail() {
    const [searchParams] = useSearchParams();

    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState(
        "We're securely confirming your email address. This will only take a moment."
    );

    useEffect(() => {
        const token = searchParams.get("token");

        if (!token) {
            setStatus("error");
            setMessage("Your verification link is missing its token. Please request a new verification email.");
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/api/auth/verify-email?token=" +
                    encodeURIComponent(token),
                    {
                        method: "POST"
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.detail || "Email verification failed."
                    );
                }

                setStatus("success");
                setMessage(
                    "Your email address has been verified successfully. Your TvachaAI account is ready!"
                );

            } catch (error) {
                setStatus("error");
                setMessage(error.message);
            }
        };

        verifyEmail();
    }, [searchParams]);

    const icon = {
        verifying: <div className="verify-spinner" />,
        success: "✓",
        error: "!"
    };

    const heading = {
        verifying: "Verifying your email",
        success: "You're all verified!",
        error: "Verification unsuccessful"
    };

    return (
        <div className="verify-page">
            <div className="verify-card">

                <div className="verify-brand">
                    🌿 Tvacha<span>AI</span>
                </div>

                <div className={`verify-icon ${status}`}>
                    {icon[status]}
                </div>

                <h1>{heading[status]}</h1>

                <p>{message}</p>

                {status === "success" && (
                    <Link to="/login" className="verify-button">
                        Continue to Login →
                    </Link>
                )}

                {status === "error" && (
                    <Link to="/login" className="verify-button">
                        Back to Login
                    </Link>
                )}

                {status === "verifying" && (
                    <p>Please don't close this page.</p>
                )}

                <div className="verify-footer">
                    Your Skin. Your Care. Your <span>Intelligence.</span>
                    <br /><br />
                    © 2026 TvachaAI
                </div>

            </div>
        </div>
    );
}

export default VerifyEmail;
