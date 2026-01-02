import React, { useState } from "react";
import styled from "styled-components";
import { doc, updateDoc, arrayUnion, increment } from "firebase/firestore";
import { db } from "../../firebase";
import { Athlete } from "../../types";

const POINT_OPTIONS = [
    { label: "Прийшов і старався 😁", points: 2 },
    { label: "Закінчив комплекс 💪", points: 3 },
    { label: "Новий навик 🔥", points: 4 },
    { label: "Лідер дня 🏆", points: 5 },
    { label: "2 місце дня 🏆", points: 4 },
    { label: "3 місце дня 🏆", points: 4 },
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
        <Wrapper>
            <Title>Додати бали</Title>
            <Subtitle>
                {selectedAthlete
                    ? `👤 ${selectedAthlete.name}`
                    : "Оберіть учасника зліва"}
            </Subtitle>

            <Select
                value={reason.label}
                onChange={(e) =>
                    setReason(
                        POINT_OPTIONS.find((r) => r.label === e.target.value) ||
                        POINT_OPTIONS[0]
                    )
                }
            >
                {POINT_OPTIONS.map((r) => (
                    <option key={r.label} value={r.label}>
                        {r.label} (+{r.points})
                    </option>
                ))}
            </Select>

            <SubmitButton
                onClick={handleAddPoints}
                disabled={!selectedAthlete || loading}
            >
                {loading ? "Збереження..." : "+ Додати бали"}
            </SubmitButton>
        </Wrapper>
    );
};

/* ===================== STYLES ===================== */

const Wrapper = styled.div`
    background: #0d0d0d;
    border-radius: 18px;
    padding: 16px;
    border: 1px solid #262626;
    max-width: 260px;      /* 🔹 звузили */
    margin-left: auto;     /* 🔹 центрування */
    margin-right: auto;
`;

const Title = styled.h3`
    margin: 0 0 8px 0;
    font-size: 15px;
    color: #fff;
`;

const Subtitle = styled.div`
    margin-bottom: 8px;
    color: #aaa;
    font-size: 14px;
`;

const Select = styled.select`
    width: 100%;
    padding: 8px;
    border-radius: 8px;
    background: #000;
    color: #fff;
    border: 1px solid #333;
    margin-bottom: 8px;
    font-size: 14px;

    &:focus {
        outline: none;
        border-color: #e32222;
    }
`;

const SubmitButton = styled.button<{ disabled?: boolean }>`
    width: 100%;
    background: linear-gradient(135deg, #e32222, #ff4b3a);
    border: none;
    padding: 10px;
    border-radius: 999px;
    color: #fff;
    font-weight: 700;
    cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
    opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
    font-size: 14px;
    transition: transform 0.15s ease, filter 0.15s ease;

    &:hover {
        ${({ disabled }) =>
                !disabled &&
                `
      transform: translateY(-1px);
      filter: brightness(1.05);
    `}
    }
`;
