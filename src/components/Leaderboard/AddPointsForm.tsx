import React, { useState } from "react";
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from "../../firebase";
import { Athlete } from "../../types";

const POINT_OPTIONS = [
    { label: "Прийшов і старався 😁", points: 2 },
    { label: "Закінчив комплекс 💪", points: 3 },
    { label: "Новий навик 🔥", points: 4 },
    { label: "Лідер дня 🏆", points: 5 },
];

export const AddPointsForm: React.FC<{ selectedAthlete?: Athlete }> = ({
                                                                           selectedAthlete,
                                                                       }) => {
    const [reason, setReason] = useState(POINT_OPTIONS[0]);
    const [loading, setLoading] = useState(false);

    const handleAddPoints = async () => {
        if (!selectedAthlete || loading) return;
        setLoading(true);

        const athleteRef = doc(db, "athletes", selectedAthlete.id);
        const newEvent = {
            id: Date.now().toString(),
            date: new Date().toISOString(),
            reason: reason.label,
            points: reason.points,
        };

        await updateDoc(athleteRef, {
            totalPoints: increment(reason.points),
            scoreHistory: arrayUnion(newEvent),
        });

        setLoading(false);
    };

    return (
        <div
            style={{
                background: "#0d0d0d",
                borderRadius: 18,
                padding: 16,
                border: "1px solid #262626",
            }}
        >
            <h3 style={{ margin: 0, marginBottom: 8, fontSize: 15, color: "#fff" }}>
                Додати бали
            </h3>
            <div style={{ marginBottom: 8, color: "#aaa", fontSize: 14 }}>
                {selectedAthlete
                    ? `👤 ${selectedAthlete.name}`
                    : "Оберіть учасника зліва"}
            </div>

            <select
                value={reason.label}
                onChange={(e) =>
                    setReason(
                        POINT_OPTIONS.find((r) => r.label === e.target.value) ||
                        POINT_OPTIONS[0]
                    )
                }
                style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 8,
                    background: "#000",
                    color: "#fff",
                    border: "1px solid #333",
                    marginBottom: 8,
                }}
            >
                {POINT_OPTIONS.map((r) => (
                    <option key={r.label} value={r.label}>
                        {r.label} (+{r.points})
                    </option>
                ))}
            </select>

            <button
                onClick={handleAddPoints}
                disabled={!selectedAthlete || loading}
                style={{
                    width: "100%",
                    background: "linear-gradient(135deg,#e32222,#ff4b3a)",
                    border: "none",
                    padding: 10,
                    borderRadius: 999,
                    color: "#fff",
                    fontWeight: 700,
                    cursor: loading ? "default" : "pointer",
                    opacity: !selectedAthlete ? 0.6 : 1,
                }}
            >
                {loading ? "Збереження..." : "+ Додати бали"}
            </button>
        </div>
    );
};
