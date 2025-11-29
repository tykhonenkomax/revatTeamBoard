import React, { useState } from "react";
import { collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";

export const ResetLeaderboardButton: React.FC = () => {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleReset = async () => {
        setMessage(null);

        if (password !== "123") {
            setMessage("❌ Невірний пароль");
            return;
        }

        if (loading) return;

        const confirmDelete = window.confirm(
            "Ти впевнений, що хочеш повністю очистити лідерборд? Це не можна буде відмінити."
        );
        if (!confirmDelete) return;

        try {
            setLoading(true);

            const snap = await getDocs(collection(db, "athletes"));
            const deletions = snap.docs.map((docSnap) => deleteDoc(docSnap.ref));
            await Promise.all(deletions);

            setMessage("✅ Лідерборд очищено");
            setPassword("");
        } catch (err) {
            console.error("Помилка при очищенні:", err);
            setMessage("❌ Сталася помилка при очищенні");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                marginTop: 8,
                padding: 12,
                borderRadius: 12,
                border: "1px solid #3f0000",
                background: "#1a0000",
            }}
        >
            <p
                style={{
                    margin: 0,
                    marginBottom: 8,
                    fontSize: 13,
                    color: "#ffb3b3",
                }}
            >
                ⚠️ Небезпечна дія: повністю очистити лідерборд (видаляються всі учасники і їх фото).
            </p>

            <input
                type="password"
                placeholder="Введи пароль (123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 8,
                    border: "1px solid #803333",
                    background: "#000",
                    color: "#fff",
                    marginBottom: 8,
                    fontSize: 13,
                }}
            />

            <button
                onClick={handleReset}
                disabled={loading}
                style={{
                    width: "100%",
                    background: "linear-gradient(135deg,#801010,#ff2a2a)",
                    border: "none",
                    padding: 10,
                    borderRadius: 999,
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                    opacity: loading ? 0.6 : 1,
                    textTransform: "uppercase",
                    fontSize: 12,
                    letterSpacing: "0.06em",
                }}
            >
                {loading ? "Очищення..." : "Очистити базу"}
            </button>

            {message && (
                <p
                    style={{
                        marginTop: 6,
                        fontSize: 12,
                        color: message.startsWith("✅") ? "#8dff8d" : "#ff8080",
                    }}
                >
                    {message}
                </p>
            )}
        </div>
    );
};
