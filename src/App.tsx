import React, { useEffect, useState } from "react";
import {
    HashRouter as Router,   // 🔹 використовуємо HashRouter
    Routes,
    Route,
    Navigate,
    useNavigate,
} from "react-router-dom";
import styled from "styled-components";
import { Leaderboard } from "./components/Leaderboard";

/* --- Захищений маршрут для адмінки --- */
const ProtectedAdminRoute: React.FC = () => {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const stored = localStorage.getItem("revat-admin");
        if (stored === "1") {
            setIsAuthorized(true);
            return;
        }

        const pass = window.prompt("🔒 Введи адмінський пароль:");
        if (pass === "11082008") {
            localStorage.setItem("revat-admin", "1");
            setIsAuthorized(true);
        } else {
            alert("Неправильний пароль 🙅‍♂️");
            navigate("/leaderboard", { replace: true });
        }
    }, [navigate]);

    if (!isAuthorized) return null;
    return <Leaderboard isAdminRoute={true} />;
};

const AppContainer = styled.div`
    min-height: 100vh;
    margin: 0;
    padding: 24px;
    background: radial-gradient(circle at top, #1f1f1f 0, #000 55%, #000 100%);
    box-sizing: border-box;
`;

const App: React.FC = () => {
    return (
        <Router>
            {/* 🔹 У GitHub Pages URL буде:
          https://tykhonenkomax.github.io/revatTeamBoard/#/leaderboard
          https://tykhonenkomax.github.io/revatTeamBoard/#/admin
      */}
            <AppContainer>
                <Routes>
                    {/* 👥 Звичайна версія без адмінки */}
                    <Route
                        path="/leaderboard"
                        element={<Leaderboard isAdminRoute={false} />}
                    />

                    {/* 🔐 Захищена адмінка */}
                    <Route path="/admin" element={<ProtectedAdminRoute />} />

                    {/* Редірект за замовчуванням */}
                    <Route path="*" element={<Navigate to="/leaderboard" />} />
                </Routes>
            </AppContainer>
        </Router>
    );
};

export default App;
