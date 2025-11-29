import React, { useEffect, useState } from "react";

// const messages = [
//     "Привіт, я Даша 😎",
//     "Хто сьогодні на першому місці?",
//     "Не забувай тренуватись 💪",
//     "Ти можеш більше, ніж думаєш!",
// ];

export const TalkingCloud: React.FC = () => {
    // const [index, setIndex] = useState(0);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setIndex((prev) => (prev + 1) % messages.length);
    //     }, 3000); // змінюється кожні 3 секунди
    //     return () => clearInterval(interval);
    // }, []);

    return (
        <div
            style={{
                position: "absolute",
                top: 0,
                right: "15%",
                background: "rgba(20, 20, 20, 0.8)",
                borderRadius: "30px",
                padding: "12px 20px",
                color: "#0ff",
                textShadow: "0 0 10px #0ff, 0 0 20px #0ff",
                fontSize: 16,
                fontWeight: 600,
                animation: "fadeIn 1s ease-in-out",
                transition: "opacity 0.6s",
            }}
        >
            {/*{messages[index]}*/}
        </div>
    );
};
