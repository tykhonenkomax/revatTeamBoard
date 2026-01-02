import React, { useState } from "react";
import styled from "styled-components";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Athlete } from "../../types";

interface Props {
    selectedAthlete?: Athlete;
}

export const DeleteAthleteButton: React.FC<Props> = ({ selectedAthlete }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!selectedAthlete || loading) return;

        const confirmDelete = window.confirm(
            `Видалити ${selectedAthlete.name}? Це не можна буде відмінити.`
        );
        if (!confirmDelete) return;

        try {
            setLoading(true);
            await deleteDoc(doc(db, "athletes", selectedAthlete.id));
            setMessage(`✅ ${selectedAthlete.name} видалено`);
        } catch (err) {
            console.error("Помилка при видаленні:", err);
            setMessage("❌ Сталася помилка при видаленні");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Wrapper>
            <Button onClick={handleDelete} disabled={!selectedAthlete || loading}>
                {loading ? "Видалення..." : "🗑️ Видалити учасника"}
            </Button>
            {message && (
                <Message success={message.startsWith("✅")}>{message}</Message>
            )}
        </Wrapper>
    );
};

/* ========== STYLES ========== */
const Wrapper = styled.div`
  margin-top: 8px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #331111;
  background: #150000;
  max-width: 260px;
  margin-left: auto;
  margin-right: auto;
`;

const Button = styled.button<{ disabled?: boolean }>`
  width: 100%;
  background: linear-gradient(135deg, #801010, #ff2a2a);
  border: none;
  padding: 10px;
  border-radius: 999px;
  color: #fff;
  font-weight: 700;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 0.06em;
  transition: all 0.25s ease;

  &:hover {
    ${({ disabled }) =>
    !disabled &&
    `
      filter: brightness(1.1);
    `}
  }
`;

const Message = styled.p<{ success: boolean }>`
  margin-top: 6px;
  font-size: 12px;
  text-align: center;
  color: ${({ success }) => (success ? "#8dff8d" : "#ff8080")};
`;
