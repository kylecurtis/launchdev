import React, { useState } from "react";

export default function SignUpForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState(""); // <-- NEW state for name

    async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);
        formData.append("name", name); // <-- append name to formData

        const res = await fetch("/api/signup", {
            method: "POST",
            body: formData,
        });
        if (res.ok) {
            // Logged in or just signed up
            localStorage.setItem("loggedIn", "true");
            window.location.href = "/";
        } else {
            alert("Sign-up failed! Maybe that email is already in use?");
        }
    }

    return (
        <div className="w-full max-w-md mx-4 p-8 bg-[#1e1e2e] rounded-lg shadow-lg border-2 border-[#cba6f7]">
            <h2 className="text-2xl font-bold text-center mb-8 text-[#cdd6f4]">
                Sign Up
            </h2>

            <form onSubmit={handleSignUp} className="space-y-6">
                {/* Name input */}
                <div>
                    <label
                        htmlFor="signupName"
                        className="block text-sm font-medium text-[#cdd6f4] mb-2"
                    >
                        Name
                    </label>
                    <input
                        id="signupName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-[#11111b] border border-[#cdd6f4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8839ef] text-[#cdd6f4]"
                    />
                </div>

                {/* Email input */}
                <div>
                    <label
                        htmlFor="signupEmail"
                        className="block text-sm font-medium text-[#cdd6f4] mb-2"
                    >
                        Email
                    </label>
                    <input
                        id="signupEmail"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-[#11111b] border border-[#cdd6f4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8839ef] text-[#cdd6f4]"
                    />
                </div>

                {/* Password input */}
                <div>
                    <label
                        htmlFor="signupPassword"
                        className="block text-sm font-medium text-[#cdd6f4] mb-2"
                    >
                        Password
                    </label>
                    <input
                        id="signupPassword"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-[#11111b] border border-[#cdd6f4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8839ef] text-[#cdd6f4]"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-[#89dceb] text-[#11111b] rounded-md"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
}
