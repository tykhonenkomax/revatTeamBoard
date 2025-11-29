import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { Gender } from "../../types";

const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file); // отримаємо "data:image/jpeg;base64,...."
    });
};

export const AddAthleteForm: React.FC = () => {
    const [name, setName] = useState("");
    const [gender, setGender] = useState<Gender>("male");
    const [photo, setPhoto] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleAdd = async () => {
        if (!name.trim() || loading) return;

        setLoading(true);
        let photoURL = "";

        try {
            if (photo) {
                // конвертуємо файл у base64-рядок
                photoURL = await fileToDataUrl(photo);
            }

            await addDoc(collection(db, "athletes"), {
                name: name.trim(),
                gender,
                totalPoints: 0,
                photoURL,       // тепер тут зберігається data URL
                scoreHistory: [],
            });

            setName("");
            setPhoto(null);
        } catch (err) {
            console.error("Помилка при додаванні:", err);
        } finally {
            setLoading(false);
        }
    };

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
                Новий учасник
            </h3>

            <input
                placeholder="Ім’я"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                    width: "100%",
                    padding: 8,
                    borderRadius: 8,
                    border: "1px solid #333",
                    background: "#000",
                    color: "#fff",
                    marginBottom: 8,
                }}
            />

            <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                <label>
                    <input
                        type="radio"
                        checked={gender === "male"}
                        onChange={() => setGender("male")}
                    />{" "}
                    Хлопець
                </label>
                <label>
                    <input
                        type="radio"
                        checked={gender === "female"}
                        onChange={() => setGender("female")}
                    />{" "}
                    Дівчина
                </label>
            </div>

            <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhoto(e.target.files?.[0] || null)}
                style={{ marginBottom: 8 }}
            />

            <button
                onClick={handleAdd}
                disabled={loading}
                style={{
                    width: "100%",
                    background: "linear-gradient(135deg,#e32222,#ff4b3a)",
                    border: "none",
                    padding: 10,
                    borderRadius: 999,
                    color: "#fff",
                    fontWeight: 700,
                    cursor: "pointer",
                    opacity: loading ? 0.6 : 1,
                }}
            >
                {loading ? "Завантаження..." : "+ Додати учасника"}
            </button>
        </div>
    );
};
