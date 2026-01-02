import React, {useEffect, useState} from "react";
import styled, {createGlobalStyle, keyframes} from "styled-components";
import {collection, onSnapshot} from "firebase/firestore";
import {db} from "../../firebase";
import {Athlete} from "../../types";
import {LeaderboardList} from "./LeaderboardList";
import {AddPointsForm} from "./AddPointsForm";
import {AddAthleteForm} from "./AddAthleteForm";
import {ScoreHistory} from "./ScoreHistory";
import {ResetLeaderboardButton} from "./ResetLeaderboardButton";
import {TalkingCloud} from "./TalkingCloud";
import {DeleteAthleteButton} from "./DeleteAthleteButton";
import {UpdateAthletePhoto} from "./UpdateAthletePhoto";
import {NeonLoader} from "./NeonLoader";
import {ResetScoresButton} from "./Button/ResetScoresButton";
import { auth } from "../../firebase";

import { onAuthStateChanged, signInAnonymously } from "firebase/auth";

type LeaderboardProps = {
    isAdminRoute?: boolean;
};

const GlobalStyle = createGlobalStyle`
    html, body, #root {
        margin: 0;
        padding: 0;
        width: 100%;
        min-height: 100%;
        background-color: #000;
    }

    * {
        box-sizing: border-box;
    }
`;

export const Leaderboard: React.FC<LeaderboardProps> = ({isAdminRoute = false}) => {
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filter, setFilter] = useState<"all" | "male" | "female">("all");
    const [isAdminMode, setIsAdminMode] = useState<boolean>(isAdminRoute);
    const [loading, setLoading] = useState(true);

    const revatLogo = require("../../assets/revatLogo.png");
    const dasha2 = require("../../assets/girl.png");

    // ✅ Анонімна авторизація, щоб Firestore дозволяв запис
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            if (!user) {
                try {
                    await signInAnonymously(auth);
                    console.log("✅ Signed in anonymously");
                } catch (error) {
                    console.error("❌ Anonymous sign-in failed:", error);
                }
            } else {
                console.log("👤 Authenticated user:", user.uid);
            }
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        if (isAdminRoute) {
            setIsAdminMode(true);
            localStorage.setItem("revat-admin", "1");
        }
    }, [isAdminRoute]);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, "athletes"), (snap: any) => {
            const data = snap.docs.map((d: any) => ({
                id: d.id,
                ...(d.data() as Omit<Athlete, "id">),
            }));
            setAthletes(data.sort((a: any, b: any) => (b.totalPoints || 0) - (a.totalPoints || 0)));
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const selectedAthlete: Athlete | undefined = athletes.find((a) => a.id === selectedId);
    const effectiveSelectedAthlete: Athlete | undefined =
        athletes.length > 0 ? selectedAthlete ?? athletes[0] : undefined;

    const filteredAthletes = athletes.filter((a) => filter === "all" || a.gender === filter);

    return (
        <>
            <GlobalStyle />
            <Wrapper>
                <DashaBackground src={dasha2} alt="Dasha" />

                <Grid className={isAdminMode ? "admin" : ""}>
                    <Sidebar>
                        <LogoBlock>
                            <Logo src={revatLogo} alt="Revat Gym" />
                            <Title>REVAT Leaderboard of Machines</Title>
                            <Subtitle>
                                Ставай кращим разом з нами. Відстежуй бали, прогрес і лідерів кожного тренування.
                            </Subtitle>
                        </LogoBlock>
                        <TalkingCloud />
                    </Sidebar>

                    <Board>
                        <BoardHeader>
                            <Filters>
                                {["all", "male", "female"].map((f) => (
                                    <FilterButton
                                        key={f}
                                        active={filter === f}
                                        onClick={() => setFilter(f as any)}
                                    >
                                        {f === "all" ? "Всі" : f === "male" ? "Хлопці" : "Дівчата"}
                                    </FilterButton>
                                ))}
                            </Filters>
                        </BoardHeader>

                        {loading ? (
                            <NeonLoader />
                        ) : athletes.length === 0 ? (
                            <Empty>Ще немає учасників. Додай першого в адмін-панелі 👉</Empty>
                        ) : (
                            <LeaderboardList
                                athletes={filteredAthletes}
                                selectedId={selectedId}
                                onSelect={setSelectedId}
                            />
                        )}
                    </Board>

                    {isAdminMode && (
                        <AdminPanel>
                            <AddPointsForm selectedAthlete={effectiveSelectedAthlete} />
                            <AddAthleteForm />
                            <UpdateAthletePhoto selectedAthlete={effectiveSelectedAthlete} />
                            <ScoreHistory selectedAthlete={effectiveSelectedAthlete} />
                            <DeleteAthleteButton selectedAthlete={effectiveSelectedAthlete} />
                            <ResetLeaderboardButton />
                            <ResetScoresButton />
                        </AdminPanel>
                    )}
                </Grid>
                <GlobalFix />
            </Wrapper>
        </>
    );
};

/* ===================== STYLES ===================== */

const Wrapper = styled.div`
    position: relative;
    max-width: 100%;
    margin: 0 auto;
    color: #fff;
    font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif;
    min-height: 100vh;
    overflow: hidden;
    padding: clamp(8px, 2vw, 20px);
    box-sizing: border-box;
`;

const neonPulse = keyframes`
    0% {
        filter: drop-shadow(0 0 6px rgba(227, 34, 34, 0.6)) drop-shadow(0 0 14px rgba(227, 34, 34, 0.4));
        opacity: 0.42;
    }
    50% {
        filter: drop-shadow(0 0 10px rgba(227, 34, 34, 0.8)) drop-shadow(0 0 20px rgba(227, 34, 34, 0.55));
        opacity: 0.48;
    }
    100% {
        filter: drop-shadow(0 0 6px rgba(227, 34, 34, 0.6)) drop-shadow(0 0 14px rgba(227, 34, 34, 0.4));
        opacity: 0.42;
    }
`;

const DashaBackground = styled.img`
    position: absolute;
    left: 0;
    bottom: 0;
    height: 100vh;
    z-index: 0;
    transform: scaleX(-1);
    object-fit: contain;
    pointer-events: none;
    animation: ${neonPulse} 4s ease-in-out infinite;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: 340px minmax(0, 3.5fr) minmax(0, 1fr);
    gap: 24px;
    position: relative;
    z-index: 1;
    align-items: flex-start;

    &.admin {
        grid-template-columns: 340px minmax(0, 3.5fr) minmax(0, 1fr);
    }

    @media (max-width: 900px) {
        grid-template-columns: 1fr;
    }
`;

const Sidebar = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 32px;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 18px;
`;

const LogoBlock = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
`;

const Logo = styled.img`
    width: clamp(80px, 20vw, 160px);
    height: auto;
`;

const Title = styled.h1`
    color: #e32222;
    font-size: clamp(15px, 2.2vw, 22px);
    font-weight: 600;
    margin: 4px 0 0;
    text-transform: uppercase;
    letter-spacing: 0.08em;
`;

const Subtitle = styled.p`
    color: #d4d4d4;
    font-size: clamp(11px, 1.3vw, 13px);
    margin: 4px;
    max-width: 260px;
    line-height: 1.4;
`;

const Board = styled.section`
    background: rgba(0, 0, 0, 0.35);
    border: 1px solid rgba(38, 38, 38, 0.5);
    border-radius: 18px;
    padding: 16px;
    min-height: calc(100vh - 90px);
    height: auto;
    overflow-y: auto;
    backdrop-filter: blur(4px);
    box-sizing: border-box;
    max-width: 100%;
`;

const BoardHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;

    h2 {
        font-size: 18px;
        font-weight: 700;
    },
@media (max-width: 768 px) {
    flex-direction: column;
    align-items: center;
    text-align: center;

    h2 {
        width: 100%;
        text-align: center;
    }
`;

const Filters = styled.div`
    display: flex;
    gap: 8px;

    @media (max-width: 900px) {
        display: none;
    }
`;

const FilterButton = styled.button<{ active: boolean }>`
    border: 1px solid #e32222;
    border-radius: 999px;
    background: ${({active}) => (active ? "#e32222" : "transparent")};
    color: #fff;
    padding: 4px 12px;
    cursor: pointer;
    font-size: 13px;
    transition: 0.2s;

    &:hover {
        background: #e32222;
    }
`;

const Empty = styled.div`
    margin-top: 40px;
    text-align: center;
    color: #c7c7c7;
    font-size: 14px;
`;

const AdminPanel = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    background: rgba(0, 0, 0, 0.45);
    border-radius: 18px;
    padding: 8px;
    min-height: calc(100vh - 90px);
    overflow-y: auto;
    width: fit-content;
    max-width: 320px;
    margin-left: auto;
    margin-right: 0;
`;

const GlobalFix = styled.div`
    html, body, #root {
        width: 100%;
        overflow-x: hidden;
    }

    * {
        box-sizing: border-box;
    }

    img, video {
        max-width: 100%;
        height: auto;
    }

    @media (max-width: 900px) {
        .leaderboard-wrapper, .leaderboard-grid, section, div {
            max-width: 100vw;
            overflow-x: hidden;
        }
    }
`;
