import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";
import { Athlete } from "../../types";
import { LeaderboardList } from "./LeaderboardList";
import { AddAthleteForm } from "./AddAthleteForm";
import { AddPointsForm } from "./AddPointsForm";
import { ScoreHistory } from "./ScoreHistory";
import { ResetLeaderboardButton } from "./ResetLeaderboardButton";
import { TalkingCloud } from "./TalkingCloud";

const revatLogo = require("../../assets/revatLogo.png");
const dasha2 = require("../../assets/dasha2.png");

export const Leaderboard: React.FC = () => {
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "male" | "female">("all");

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "athletes"), (snap) => {
            const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Athlete[];
            setAthletes(data.sort((a, b) => b.totalPoints - a.totalPoints));
        });
        return () => unsub();
    }, []);

    const selectedAthlete = athletes.find((a) => a.id === selectedId);

    return (
        <div
            style={{
                position: "relative",
                maxWidth: "1500px",
                margin: "0 auto",
                color: "#fff",
                fontFamily:
                    '-apple-system,BlinkMacSystemFont,"SF Pro Text",system-ui,sans-serif',
                overflow: "hidden",
            }}
        >
            {/* --- ФОНОВА ДАША --- */}
            <img
                src={dasha2}
                alt="Dasha background"
                style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    height: "100vh",
                    width: "auto",
                    objectFit: "cover",
                    transform: "scaleX(-1)", // дзеркально
                    filter: "drop-shadow(0 0 25px #00ffff90)",
                    opacity: 0.50, // прозора, щоб не перебивала контент
                    zIndex: 0,
                }}
            />

            {/* HEADER */}
            <header
                style={{
                    marginBottom: 24,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                <img
                    src={revatLogo}
                    alt="Revat Gym"
                    style={{ width: 120, marginBottom: 10 }}
                />
                <h1
                    style={{
                        margin: 0,
                        fontSize: 32,
                        fontWeight: 800,
                        letterSpacing: "0.06em",
                        textTransform: "uppercase",
                        color: "#e32222",
                    }}
                >
                    REVAT ЛІДЕРБОРД
                </h1>
                <p style={{ marginTop: 6, fontSize: 14, color: "#d4d4d4" }}>
                    Ставай кращим разом з нами. Відстежуємо бали, прогрес і лідерів
                    кожного тренування.
                </p>
            </header>

            {/* --- ОСНОВНИЙ ЛЕЙАУТ --- */}
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "340px minmax(0, 2fr) minmax(0, 1.5fr)",
                    gap: 24,
                    alignItems: "stretch",
                    position: "relative",
                    zIndex: 1,
                }}
            >
                {/* ЛІВА КОЛОНКА */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        paddingTop: 24,
                        paddingBottom: 24,
                        gap: 16,
                    }}
                >
                    <div style={{ width: "100%", textAlign: "center" }}>
                        <TalkingCloud />
                    </div>
                </div>

                {/* СЕРЕДНЯ КОЛОНКА */}
                <section
                    style={{
                        background: "rgba(13, 13, 13, 0.5)",   // 🔹 50% прозорий фон
                        borderRadius: 18,
                        padding: 18,
                        border: "1px solid rgba(38, 38, 38, 0.8)",
                        minHeight: 400,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginBottom: 12,
                        }}
                    >
                        <h2 style={{ margin: 0, fontSize: 16, textTransform: "uppercase" }}>
                            Дошка лідерів
                        </h2>
                        <div style={{ display: "flex", gap: 8 }}>
                            {["all", "male", "female"].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f as any)}
                                    style={{
                                        background: filter === f ? "#e32222" : "transparent",
                                        border: "1px solid #e32222",
                                        borderRadius: 999,
                                        color: "#fff",
                                        padding: "4px 12px",
                                        fontSize: 12,
                                        cursor: "pointer",
                                        textTransform: "uppercase",
                                    }}
                                >
                                    {f === "all"
                                        ? "Всі"
                                        : f === "male"
                                            ? "Хлопці"
                                            : "Дівчата"}
                                </button>
                            ))}
                        </div>
                    </div>

                    <LeaderboardList
                        athletes={athletes.filter(
                            (a) => filter === "all" || a.gender === filter
                        )}
                        selectedId={selectedId}
                        onSelect={setSelectedId}
                    />
                </section>

                {/* ПРАВА КОЛОНКА */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 16,
                    }}
                >
                    <AddPointsForm selectedAthlete={selectedAthlete} />
                    <AddAthleteForm />
                    <ScoreHistory selectedAthlete={selectedAthlete} />
                    <ResetLeaderboardButton />
                </div>
            </div>
        </div>
    );
};
