import React from "react";
import { Leaderboard } from "./components/Leaderboard";

function App() {
    return (
        <div
            style={{
                minHeight: "100vh",
                margin: 0,
                padding: "24px",
                background: "radial-gradient(circle at top, #1f1f1f 0, #000 55%, #000 100%)",
                boxSizing: "border-box",
            }}
        >
            <Leaderboard />
        </div>
    );
}

export default App;
