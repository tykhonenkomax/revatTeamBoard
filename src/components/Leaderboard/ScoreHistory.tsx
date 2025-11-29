import React from "react";
import { Athlete } from "../../types";

export const ScoreHistory: React.FC<{ selectedAthlete?: Athlete }> = ({
                                                                          selectedAthlete,
                                                                      }) => {
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
                Історія балів
            </h3>

            {!selectedAthlete || selectedAthlete.scoreHistory.length === 0 ? (
                <div style={{ color: "#888", fontSize: 13 }}>
                    Поки немає історії. Додай перші бали ✨
                </div>
            ) : (
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {[...selectedAthlete.scoreHistory]
                        .reverse()
                        .slice(0, 6)
                        .map((s) => (
                            <li
                                key={s.id}
                                style={{
                                    padding: "6px 0",
                                    borderBottom: "1px solid #222",
                                    color: "#ccc",
                                    fontSize: 13,
                                }}
                            >
                <span style={{ color: "#ff4b3a", marginRight: 6 }}>
                  +{s.points}
                </span>
                                {s.reason}
                            </li>
                        ))}
                </ul>
            )}
        </div>
    );
};
