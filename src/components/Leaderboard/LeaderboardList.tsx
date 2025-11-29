import React from "react";
import { Athlete } from "../../types";

interface Props {
    athletes: Athlete[];
    selectedId: string | null;
    onSelect: (id: string) => void;
}

export const LeaderboardList: React.FC<Props> = ({ athletes, selectedId, onSelect }) => {
    const maxPoints = Math.max(...athletes.map(a => a.totalPoints || 0), 1);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {athletes.map((a, i) => {
                const percent = (a.totalPoints / maxPoints) * 100;
                return (
                    <div
                        key={a.id}
                        onClick={() => onSelect(a.id)}
                        style={{
                            background: a.id === selectedId ? "#1a1a1a" : "#111",
                            border: a.id === selectedId ? "1px solid #e32222" : "1px solid #333",
                            borderRadius: 10,
                            padding: 10,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <img
                            src={a.photoURL || "/default-avatar.png"}
                            alt={a.name}
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: "50%",
                                objectFit: "cover",
                                border: "2px solid #e32222",
                            }}
                        />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600 }}>{i + 1}. {a.name}</div>
                            <div style={{ height: 6, background: "#333", borderRadius: 4, marginTop: 4 }}>
                                <div
                                    style={{
                                        width: `${percent}%`,
                                        height: "100%",
                                        background: "linear-gradient(90deg,#e32222,#ff4b3a)",
                                        borderRadius: 4,
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ fontWeight: 700, color: "#ff4b3a" }}>{a.totalPoints}</div>
                    </div>
                );
            })}
        </div>
    );
};
