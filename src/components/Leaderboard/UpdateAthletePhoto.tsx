import React, { useState } from "react";
import styled from "styled-components";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Athlete } from "../../types";

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

interface Props {
    selectedAthlete?: Athlete;
}

export const UpdateAthletePhoto: React.FC<Props> = ({ selectedAthlete }) => {
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleSave = async () => {
        if (!selectedAthlete || !file || loading) return;

        try {
            setLoading(true);
            setMessage(null);

            const dataUrl = await fileToDataUrl(file);

            await updateDoc(doc(db, "athletes", selectedAthlete.id), {
                photoURL: dataUrl,
            });

            setMessage("✅ Фото оновлено");
            setFile(null);
        } catch (e) {
            console.error("Помилка при оновленні фото:", e);
            setMessage("❌ Не вдалося оновити фото");
        } finally {
            setLoading(false);
        }
    };

    const disabled = !selectedAthlete || !file || loading;

    return (
        <Wrapper>
            <Title>Оновити фото</Title>

            <Subtitle>
                {selectedAthlete
                    ? `👤 ${selectedAthlete.name}`
                    : "Оберіть учасника зліва"}
            </Subtitle>

            {selectedAthlete && selectedAthlete.photoURL && (
                <Preview src={selectedAthlete.photoURL} alt={selectedAthlete.name} />
            )}

            <FileInput
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <SaveButton onClick={handleSave} disabled={disabled}>
                {loading ? "Збереження..." : "💾 Зберегти нове фото"}
            </SaveButton>

            {message && (
                <Message success={message.startsWith("✅")}>{message}</Message>
            )}
        </Wrapper>
    );
};

/* ============ STYLES ============ */

const Wrapper = styled.div`
  background: #0d0d0d;
  border-radius: 18px;
  padding: 16px;
  border: 1px solid #262626;
  max-width: 260px;
  margin-left: auto;
  margin-right: auto;
`;

const Title = styled.h3`
  margin: 0 0 6px 0;
  font-size: 15px;
  color: #fff;
`;

const Subtitle = styled.div`
  margin-bottom: 8px;
  color: #aaa;
  font-size: 13px;
`;

const Preview = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e32222;
  margin-bottom: 8px;
`;

const FileInput = styled.input`
  width: 100%;
  margin-bottom: 8px;
  font-size: 12px;
  color: #ccc;
`;

const SaveButton = styled.button<{ disabled?: boolean }>`
  width: 100%;
  background: linear-gradient(135deg, #e32222, #ff4b3a);
  border: none;
  padding: 10px;
  border-radius: 999px;
  color: #fff;
  font-weight: 700;
  cursor: ${({ disabled }) => (disabled ? "default" : "pointer")};
  opacity: ${({ disabled }) => (disabled ? 0.6 : 1)};
  font-size: 13px;
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

const Message = styled.p<{ success: boolean }>`
  margin-top: 6px;
  font-size: 12px;
  text-align: center;
  color: ${({ success }) => (success ? "#8dff8d" : "#ff8080")};
`;
