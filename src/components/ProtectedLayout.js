import React from "react";
import Sidebar from "./sidebar";

function ProtectedLayout({ children }) {
    return (
        <div style={{ display: "flex", height: "100vh" }}>
            <Sidebar />
            <main style={{ flex: 1, padding: "20px", backgroundColor: "#f0f0f0" }}>
                {children}
            </main>
        </div>
    );
}

export default ProtectedLayout;
