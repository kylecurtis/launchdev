import { useEffect, useState } from "react";

interface User {
    id: number;
    name: string;
    email: string;
    is_paid: boolean;
    plan: string | null;
}

interface CartItem {
    id: string;
    name: string;
    price: number;
}

// Data for subscriptions
const PLAN_OPTIONS = [
    { id: "monthly", name: "Monthly Plan", price: 0 },
    { id: "lifetime", name: "Lifetime Plan", price: 0 },
];

export default function AccountPage() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    // Cart state
    const [cart, setCart] = useState<CartItem[]>([]);

    // Plan selection
    const [showPlanModal, setShowPlanModal] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<string>("monthly");

    // Cart checkout
    const [showCartModal, setShowCartModal] = useState(false);

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

    // Plan selection modal
    function handleOpenPlanModal() {
        setShowPlanModal(true);
    }
    function handleClosePlanModal() {
        setShowPlanModal(false);
    }

    // Cart checkout modal
    function handleOpenCartModal() {
        setShowCartModal(true);
    }
    function handleCloseCartModal() {
        setShowCartModal(false);
    }

    // ADD PLAN TO CART
    function handleAddPlanToCart() {
        // Find plan info
        const planInfo = PLAN_OPTIONS.find((p) => p.id === selectedPlan);
        if (!planInfo) return;

        // Add plan to the cart
        setCart((prev) => [...prev, planInfo]);
        alert(`${planInfo.name} was added to your cart.`);
        setShowPlanModal(false); // close the plan selection
    }

    // REMOVE AN ITEM FROM CART
    function handleRemoveCartItem(id: string) {
        setCart((prev) => prev.filter((item) => item.id !== id));
    }

    // CHECKOUT
    async function handleCheckout() {
        if (!user) return;
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        // Only one subscription item can exist in the cart
        const item = cart[0];

        try {
            const res = await fetch("/api/subscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: user.email,
                    plan: item.id, // monthly or lifetime
                }),
            });
            const data = await res.json();
            if (data.success) {
                // Mark user as paid
                setUser((prev) =>
                    prev ? { ...prev, is_paid: true, plan: item.id } : null
                );
                alert(`You purchased the ${item.name} successfully!`);
                // Clear the cart after purchase
                setCart([]);
            } else {
                alert("Subscription error!");
            }
        } catch (err) {
            console.error(err);
            alert("Subscription error!");
        }

        setShowCartModal(false);
    }

    // RENDERING LOGIC
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
                    <p className="mb-2 text-red-400">Status: Not Paid</p>
                    <div className="p-4"></div>

                    {/* Buttons to open plan selection or view cart */}
                    <div className="flex gap-4">
                        <button
                            onClick={handleOpenPlanModal}
                            className="w-[200px] p-4 border-2 text-center bg-[#89dceb] text-black"
                        >
                            Select a Plan
                        </button>
                        <button
                            onClick={handleOpenCartModal}
                            className="w-[200px] p-4 border-2 text-center bg-purple-300 text-black"
                        >
                            View Cart ({cart.length})
                        </button>
                    </div>
                </>
            )}

            {/* PLAN SELECT */}
            {showPlanModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
                    <div className="bg-[#1e1e2e] p-6 rounded-md w-[500px] text-[#cdd6f4] border border-[#cba6f7]">
                        <h3 className="text-xl font-semibold mb-4">
                            Choose your plan
                        </h3>

                        <div className="flex flex-col gap-2 mb-4">
                            {PLAN_OPTIONS.map((plan) => (
                                <label
                                    key={plan.id}
                                    className="flex items-center gap-2"
                                >
                                    <input
                                        type="radio"
                                        name="plan"
                                        value={plan.id}
                                        checked={selectedPlan === plan.id}
                                        onChange={() =>
                                            setSelectedPlan(plan.id)
                                        }
                                    />
                                    <span>{plan.name}</span>
                                </label>
                            ))}
                        </div>

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={handleClosePlanModal}
                                className="px-4 py-2 bg-gray-500"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddPlanToCart}
                                className="px-4 py-2 bg-[#89dceb] text-black"
                            >
                                Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CART MODAL */}
            {showCartModal && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-90">
                    <div className="bg-[#1e1e2e] p-6 rounded-md w-[400px] text-[#cdd6f4] border border-[#cba6f7]">
                        <h3 className="text-xl font-semibold mb-4">
                            Your Cart
                        </h3>

                        {cart.length === 0 ? (
                            <p>Your cart is empty.</p>
                        ) : (
                            <ul className="mb-4">
                                {cart.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex justify-between items-center mb-2"
                                    >
                                        <div>
                                            <p className="font-semibold">
                                                {item.name}
                                            </p>
                                            <p>Price: ${item.price}</p>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handleRemoveCartItem(item.id)
                                            }
                                            className="text-red-400"
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}

                        <div className="flex justify-end gap-4">
                            <button
                                onClick={handleCloseCartModal}
                                className="px-4 py-2 bg-gray-500"
                            >
                                Close
                            </button>
                            {/* If there's an item in the cart, show Checkout */}
                            {cart.length > 0 && (
                                <button
                                    onClick={handleCheckout}
                                    className="px-4 py-2 bg-[#89dceb] text-black"
                                >
                                    Checkout
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
