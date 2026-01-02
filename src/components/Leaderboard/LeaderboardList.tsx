import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Athlete } from "../../types";

interface Props {
    athletes: Athlete[];
    selectedId: string | null;
    onSelect: (id: string) => void;
    isAdminMode?: boolean;
}

export const LeaderboardList: React.FC<Props> = ({
                                                     athletes,
                                                     selectedId,
                                                     onSelect,
                                                     isAdminMode = false,
                                                 }) => {
    const sorted = [...athletes].sort(
        (a, b) => (b.totalPoints || 0) - (a.totalPoints || 0)
    );
    const maxPoints = Math.max(...sorted.map((a) => a.totalPoints || 0), 1);

    const males = sorted.filter((a) => a.gender === "male");
    const females = sorted.filter((a) => a.gender === "female");

    const [isMobile, setIsMobile] = useState(false);
    const [activeFilter, setActiveFilter] = useState<"female" | "male">("female");
    const [loading, setLoading] = useState(true);

    // визначаємо мобілку
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 900);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const renderList = (list: Athlete[], title: string, icon: string) => (
        <Column>
            <ColumnTitle>
                {icon} {title}
            </ColumnTitle>
            {list.map((a, i) => (
                <Item
                    key={a.id}
                    isSelected={a.id === selectedId}
                    onClick={() => onSelect(a.id)}
                    rank={i + 1}
                >
                    <Place>{i + 1}</Place>
                    <Avatar
                        src={a.photoURL || "/default-avatar.png"}
                        alt={a.name}
                        rank={i + 1}
                    />
                    <PlayerInfo>
                        <PlayerName>{a.name}</PlayerName>
                        <BarBackground>
                            <BarFill percent={((a.totalPoints || 0) / maxPoints) * 100} />
                        </BarBackground>
                    </PlayerInfo>
                    <Points>{a.totalPoints}</Points>
                </Item>
            ))}
        </Column>
    );

    return (
        <>
            {!isAdminMode && isMobile && (
                <MobileToggle>
                    <button
                        className={activeFilter === "female" ? "active" : ""}
                        onClick={() => setActiveFilter("female")}
                    >
                        🤸‍♀️ Дівчата
                    </button>
                    <button
                        className={activeFilter === "male" ? "active" : ""}
                        onClick={() => setActiveFilter("male")}
                    >
                        🏋️‍♂️ Хлопці
                    </button>
                </MobileToggle>
            )}

            <Wrapper $isMobile={isMobile} $isAdmin={isAdminMode}>
                {isAdminMode ? (
                    renderList(sorted, "Учасники", "🏆")
                ) : (
                    <>
                        {(!isMobile || activeFilter === "male") &&
                            renderList(males, "Хлопці", "🏋️‍♂️")}
                        {(!isMobile || activeFilter === "female") &&
                            renderList(females, "Дівчата", "🤸‍♀️")}
                    </>
                )}
            </Wrapper>
        </>
    );
};

/* ===================== STYLES ===================== */

const Wrapper = styled.div<{ $isMobile: boolean; $isAdmin: boolean }>`
    display: grid;
    grid-template-columns: ${({ $isMobile, $isAdmin }) =>
            $isAdmin ? "1fr" : $isMobile ? "1fr" : "1fr 1fr"};
    gap: 24px;
    width: 100%;
    max-width: 100%;
    overflow-x: hidden;
    box-sizing: border-box;
    padding-right: 2px;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 14px;
`;

const ColumnTitle = styled.h3`
    text-align: center;
    color: #e32222;
    font-size: clamp(18px, 2.5vw, 20px);
    font-weight: 700;
    margin: 0 0 10px 0;
    text-transform: uppercase;
    letter-spacing: 0.05em;
`;

const Item = styled.div<{ isSelected: boolean; rank?: number }>`
    background: ${({ isSelected }) => (isSelected ? "#1a1a1a" : "#111")};
    border: ${({ isSelected }) =>
            isSelected ? "1px solid #e32222" : "1px solid #333"};
    border-radius: 14px;
    padding: clamp(10px, 2vw, 14px);
    cursor: pointer;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: clamp(10px, 2vw, 14px);
    transition: all 0.2s ease;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    min-width: 0;
    position: relative;

    ${({ rank }) =>
            rank && rank <= 3 &&
            `
&::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 65px;
  transform: translate(-50%, -50%);
  width: 20px;   /* 🔹 трохи більший за аватар */
  height: 20px;
  border-radius: 50%;
  background: radial-gradient(
    ${
                    rank === 1
                            ? "rgba(255, 0, 0, 0.7)"
                            : rank === 2
                                    ? "rgba(0, 255, 0, 0.7)"
                                    : "rgba(255, 255, 0, 0.7)"
            },
    rgba(0, 0, 0, 0) 20%
  );
  filter: blur(1.5px); /* 🔹 менше розмиття */
  z-index: 0;
  animation: blink-${rank} 1.2s linear infinite;
}

/* Легке коротке блимання */
@keyframes blink-1 {
  0%, 85%, 100% { opacity: 0.3; }
  40% { opacity: 1; }
  
@keyframes blink-2 {
  0%, 85%, 100% { opacity: 0.1; }
  40% { opacity: 1; }
}
@keyframes blink-3 {
  0%, 85%, 100% { opacity: 0.3; }
  40% { opacity: 1; }
}
  `}

    &:hover {
        border-color: #e32222;
        transform: translateY(-2px);
    }
`;

const Avatar = styled.img<{ rank?: number }>`
  width: clamp(70px, 10vw, 120px);
  height: clamp(70px, 10vw, 120px);
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid #e32222;
  flex-shrink: 0;
  transition: transform 0.2s ease;
  position: relative;
  z-index: 1;

  ${({ rank }) =>
    rank === 1 &&
    `box-shadow: 0 0 12px 3px rgba(255, 0, 0, 0.7),
                 0 0 25px 8px rgba(255, 0, 0, 0.3);`}
  ${({ rank }) =>
    rank === 2 &&
    `box-shadow: 0 0 12px 3px rgba(0, 255, 0, 0.7),
                 0 0 25px 8px rgba(0, 255, 0, 0.3);`}
  ${({ rank }) =>
    rank === 3 &&
    `box-shadow: 0 0 12px 3px rgba(255, 255, 0, 0.7),
                 0 0 25px 8px rgba(255, 255, 0, 0.3);`}

  ${Item}:hover & {
    transform: scale(1.05);
  }

  @media (max-width: 600px) {
    width: 65px;
    height: 65px;
    border-width: 2px;
  }

  @media (max-width: 400px) {
    width: 55px;
    height: 55px;
  }
`;


const Place = styled.div`
    font-weight: 800;
    font-size: clamp(16px, 2.5vw, 22px);
    color: #ff4b3a;
    width: clamp(24px, 4vw, 32px);
    text-align: center;
    flex-shrink: 0;
`;

const PlayerInfo = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
`;

const PlayerName = styled.div`
    font-weight: 600;
    font-size: clamp(14px, 2vw, 16px);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const BarBackground = styled.div`
    height: 8px;
    background: #333;
    border-radius: 4px;
    margin-top: 6px;
    overflow: hidden;
    width: 100%;
`;

const BarFill = styled.div<{ percent: number }>`
    width: ${({ percent }) => `${percent}%`};
    height: 100%;
    background: linear-gradient(90deg, #e32222, #ff4b3a);
    border-radius: 4px;
    transition: width 0.3s ease;
`;

const Points = styled.div`
    font-weight: 700;
    color: #ff4b3a;
    font-size: clamp(14px, 2vw, 18px);
    margin-left: 6px;
    min-width: 32px;
    text-align: right;
    flex-shrink: 0;

    @media (max-width: 400px) {
        font-size: 14px;
        min-width: 26px;
    }
`;

const MobileToggle = styled.div`
    display: flex;
    justify-content: center;
    gap: 12px;
    margin-bottom: 16px;

    button {
        border: 1px solid #e32222;
        background: rgba(0, 0, 0, 0.5);
        color: #fff;
        padding: 8px 18px;
        border-radius: 999px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.25s ease;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        box-shadow: 0 0 6px rgba(227, 34, 34, 0.3);
    }

    button.active {
        background: #e32222;
        color: #fff;
        box-shadow: 0 0 15px rgba(227, 34, 34, 0.8),
        0 0 30px rgba(227, 34, 34, 0.4);
        /* 🔸 забрано мерехтіння */
    }

    @media (min-width: 901px) {
        display: none;
    }
`;
