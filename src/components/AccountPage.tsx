import React, { useEffect, useState } from "react";

interface User {
    id: number;
    name: string;
    email: string;
    is_paid: boolean;
    plan: string | null;
}

export default function AccountPage() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // For the purchase popup
    const [showModal, setShowModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<"monthly" | "lifetime">(
        "monthly"
    );

    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        if (!email) {
            setError("No user email found!");
            setLoading(false);
            return;
        }

        fetch(`/api/getUser?email=${encodeURIComponent(email)}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    setError(data.error);
                } else {
                    setUser(data.user);
                }
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to fetch user");
            })
            .finally(() => setLoading(false));
    }, []);

    // open the popup
    function handleOpenModal() {
        setShowModal(true);
    }

    // close the popup
    function handleCloseModal() {
        setShowModal(false);
    }

    // buy the selected plan
    async function handleBuyPlan() {
        if (!user) return;

        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: user.email,
                    plan: selectedPlan,
                }),
            });
            const data = await res.json();
            if (data.success) {
                // Update local user state to reflect that they're paid
                setUser((prev) =>
                    prev ? { ...prev, is_paid: true, plan: selectedPlan } : null
                );
                alert(`You purchased the ${selectedPlan} plan!`);
            } else {
                alert("Subscription error!");
            }
        } catch (error) {
            console.error(error);
            alert("Subscription error!");
        }

        setShowModal(false);
    }

    if (loading) {
        return <div>Loading...</div>;
    }
    if (error) {
        return <div className="text-red-500">{error}</div>;
    }
    if (!user) {
        return <div>No user data.</div>;
    }

    return (
        <div className="w-[900px] border-2 border-[#cba6f7] bg-[#1e1e2e] text-[#cdd6f4] p-8 rounded-lg shadow-lg">
            <h2 className="text-4xl font-bold mb-4">My Account</h2>
            <div className="p-4"></div>
            <p className="mb-2">ID: {user.id}</p>
            <p className="mb-2">Name: {user.name}</p>
            <p className="mb-2">Email: {user.email}</p>

            {/* If user is paid show plan and the start learning button */}
            {user.is_paid ? (
                <>
                    <p className="mb-2">
                        Plan: {user.plan === "monthly" ? "Monthly" : "Lifetime"}
                    </p>
                    <p className="mb-2 text-green-400">Status: Paid User</p>
                    <div className="p-4"></div>
                    <a href="/0-learn" className="hover:text-white">
                        <div className="w-[200px] p-4 border-2 text-center bg-[#a6e3a1] text-black">
                            <p>Start Learning</p>
                        </div>
                    </a>
                </>
            ) : (
                <>
                    {/* If not paid, show a button to subscribe */}
                    <p className="mb-2 text-red-400">Status: Not Paid</p>
                    <div className="p-4"></div>
                    <button
                        onClick={handleOpenModal}
                        className="w-[200px] p-4 border-2 text-center bg-[#89dceb] text-black"
                    >
                        Buy a Subscription
                    </button>
                </>
            )}
            {/* POPUP FOR SELECTING PLAN */}
            {showModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                    <div className="bg-[#1e1e2e] p-6 rounded-md w-[300px] text-[#cdd6f4] border border-[#cba6f7]">
                        <h3 className="text-xl font-semibold mb-4">
                            Choose your plan
                        </h3>

                        <div className="flex flex-col gap-2 mb-4">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="plan"
                                    value="monthly"
                                    checked={selectedPlan === "monthly"}
                                    onChange={() => setSelectedPlan("monthly")}
                                />
                                <span>Monthly Plan</span>
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="plan"
                                    value="lifetime"
                                    checked={selectedPlan === "lifetime"}
                                    onChange={() => setSelectedPlan("lifetime")}
                                />
                                <span>Lifetime Plan</span>
                            </label>
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={handleCloseModal}
                                className="px-4 py-2 bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBuyPlan}
                                className="px-4 py-2 bg-[#89dceb] text-black"
                            >
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
