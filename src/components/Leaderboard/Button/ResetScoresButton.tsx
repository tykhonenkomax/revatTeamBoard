import React, { useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase";
import styled from "styled-components";

export const ResetScoresButton: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [confirmed, setConfirmed] = useState(false);
    const [error, setError] = useState("");

    const handleReset = async () => {
        if (!confirmed) {
            const password = prompt("Введіть пароль для скидання балів:");
            if (password !== "321") {
                setError("Невірний пароль");
                return;
            }
            setConfirmed(true);
        }

        try {
            setLoading(true);
            const querySnapshot = await getDocs(collection(db, "athletes"));
            for (const athleteDoc of querySnapshot.docs) {
                await updateDoc(doc(db, "athletes", athleteDoc.id), { totalPoints: 0 });
            }
            alert("✅ Усі бали скинуто до нуля!");
        } catch (err) {
            console.error("Помилка при скиданні:", err);
            alert("❌ Помилка при скиданні балів.");
        } finally {
            setLoading(false);
            setConfirmed(false);
        }
    };

    return (
        <Wrapper>
            <Button onClick={handleReset} disabled={loading}>
                {loading ? "Скидання..." : "Скинути всі бали"}
            </Button>
            {error && <ErrorText>{error}</ErrorText>}
        </Wrapper>
    );
};

// 💅 styled-components
const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 16px;
`;

const Button = styled.button`
  background-color: #c62828;
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background-color: #b71c1c;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.div`
  color: red;
  margin-top: 8px;
  font-size: 14px;
`;

