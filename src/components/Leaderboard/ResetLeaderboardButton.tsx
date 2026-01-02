import React, { useState } from "react";
import styled from "styled-components";
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
        <Wrapper>
            <Warning>
                ⚠️ Небезпечна дія: повністю очистити лідерборд (видаляються всі учасники і їх фото).
            </Warning>

            <PasswordInput
                type="password"
                placeholder="Введи пароль (123)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <ResetButton onClick={handleReset} disabled={loading}>
                {loading ? "Очищення..." : "Очистити базу"}
            </ResetButton>

            {message && <Message success={message.startsWith("✅")}>{message}</Message>}
        </Wrapper>
    );
};

/* ===================== STYLES ===================== */

const Wrapper = styled.div`
    margin-top: 8px;
    padding: 12px;
    border-radius: 12px;
    border: 1px solid #3f0000;
    background: #1a0000;
    max-width: 260px; /* 🔹 обмежуємо ширину */
    margin-left: auto;
    margin-right: auto; /* 🔹 центруємо блок */
`;

const Warning = styled.p`
    margin: 0 0 8px 0;
    font-size: 13px;
    color: #ffb3b3;
    text-align: center;
`;

const PasswordInput = styled.input`
    width: 100%;
    padding: 8px;
    border-radius: 8px;
    border: 1px solid #803333;
    background: #000;
    color: #fff;
    margin-bottom: 8px;
    font-size: 13px;

    &:focus {
        outline: none;
        border-color: #ff4b3a;
    }
`;

const ResetButton = styled.button<{ disabled?: boolean }>`
    width: 100%;
    background: linear-gradient(135deg, #801010, #ff2a2a);
    border: none;
    padding: 10px;
    border-radius: 999px;
    color: #fff;
    font-weight: 700;
    cursor: pointer;
    opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.06em;
    transition: all 0.25s ease;

    &:hover {
        filter: brightness(1.1);
    }
`;

const Message = styled.p<{ success: boolean }>`
    margin-top: 6px;
    font-size: 12px;
    text-align: center;
    color: ${({ success }) => (success ? "#8dff8d" : "#ff8080")};
`;
