import React from "react";

export default function Navbar() {
    function handleSignOut(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        localStorage.removeItem("loggedIn");
        window.location.href = "/";
    }

    // Default to not signed in
    let isSignedIn = false;
    if (typeof window !== "undefined") {
        isSignedIn = localStorage.getItem("loggedIn") === "true";
    }

    return (
        <nav className="bg-[#1e1e2e] text-[#cdd6f4] border-b-2 border-[#cba6f7]">
            <div className="container mx-auto flex justify-between items-center px-4 py-6">
                <a href="/" className="text-2xl font-bold">
                    🚀 launch.dev
                </a>
                <ul className="flex space-x-4">
                    <li>
                        <a href="/" className="hover:text-white">
                            Home
                        </a>
                    </li>
                    <li>
                        <a href="/about" className="hover:text-white">
                            About
                        </a>
                    </li>
                    {isSignedIn ? (
                        <>
                            <li>
                                <a href="/plan" className="hover:text-white">
                                    My Plan
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    className="hover:text-white"
                                    onClick={handleSignOut}
                                >
                                    Sign Out
                                </a>
                            </li>
                        </>
                    ) : (
                        <li>
                            <a href="/login" className="hover:text-white">
                                Sign In
                            </a>
                        </li>
                    )}
                </ul>
            </div>
        </nav>
    );
}
