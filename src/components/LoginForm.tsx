import React, { useState } from "react";

export default function LoginForm() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                body: formData,
            });

            if (res.ok) {
                localStorage.setItem("loggedIn", "true");
                window.location.href = "/";
            } else {
                alert("Login failed! Check your credentials.");
            }
        } catch (err) {
            console.error(err);
            alert("An unexpected error occurred.");
        }
    }

    return (
        <div className="w-full max-w-md mx-4 p-8 bg-[#1e1e2e] rounded-lg shadow-lg border-2 border-[#cba6f7]">
            <h2 className="text-2xl font-bold text-center mb-8 text-[#cdd6f4]">
                Sign In
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-[#cdd6f4] mb-2"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-[#11111b] border border-[#cdd6f4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8839ef] text-[#cdd6f4]"
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-[#cdd6f4] mb-2"
                    >
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 bg-[#11111b] border border-[#cdd6f4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8839ef] text-[#cdd6f4]"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-[#a6e3a1] text-[#11111b] rounded-md"
                >
                    Sign In
                </button>
            </form>
        </div>
    );
}
