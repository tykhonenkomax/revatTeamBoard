import React from "react";
import { motion } from "framer-motion";

export const NeonLoader: React.FC = () => {
    const mashinGay = require("../../assets/mashinGay.png");

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "40px 0",
                width: "100%",
            }}
        >
            {/* ⚡ Фото / лого з неоновим світлом */}
            <motion.img
                src={mashinGay}
                alt="Neon logo"
                initial={{ opacity: 0.7, scale: 0.95 }}
                animate={{
                    opacity: [0.7, 1, 0.7],
                    scale: [0.95, 1, 0.95],
                }}
                transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                style={{
                    width: 180,
                    height: 180,
                    objectFit: "contain",
                    marginBottom: 25,
                    filter:
                        "drop-shadow(0 0 10px #e32222) drop-shadow(0 0 25px #ff4b3a)",
                }}
            />

            {/* 🔥 Кардіограма */}
            <svg
                width="220"
                height="60"
                viewBox="0 0 220 60"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ marginBottom: 20 }}
            >
                <motion.path
                    d="M0 30 H40 L50 10 L60 50 L70 20 L80 30 H110 L120 30 L130 10 L140 50 L150 20 L160 30 H220"
                    stroke="#e32222"
                    strokeWidth="2"
                    fill="none"
                    strokeLinejoin="round"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: [0, 1, 0] }}
                    transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{
                        filter:
                            "drop-shadow(0 0 4px #e32222) drop-shadow(0 0 10px #ff4b3a)",
                    }}
                />
            </svg>

            {/* ❤️ Неоновий текст */}
            <motion.div
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 1.6, repeat: Infinity }}
                style={{
                    color: "#e32222",
                    fontFamily: "Orbitron, sans-serif",
                    fontSize: "1.2rem",
                    fontWeight: 700,
                    textShadow:
                        "0 0 6px #e32222, 0 0 15px #ff4b3a, 0 0 30px #ff0000",
                    textAlign: "center",
                    letterSpacing: 1,
                }}
            >
                МАШИНИ!!! зачекайте, я завантажую оновленні дані!!!
            </motion.div>
        </div>
    );
};
