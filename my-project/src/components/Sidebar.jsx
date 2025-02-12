"use client"; // Adicionado no início do arquivo

import React, { useState } from "react";
import logo from "../assets/images/logo.jpeg";
import { useRouter } from "next/navigation";

function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuVisible, setIsMobileMenuVisible] = useState(false);
    const router = useRouter();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleMobileMenu = () => {
        setIsMobileMenuVisible(!isMobileMenuVisible);
    };

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        router.push("/login");
    };

    const goToDashboard = () => {
        router.push("/");
    };

    const goToConsultas = () => {
        router.push("/consultas");
    };

    const goToRelatorios = () => {
        router.push("/Relatorios");
    };

    const goToConfiguracoes = () => {
        router.push("/configuracoes");
    };

    return (
        <>
            {/* Sidebar para desktop */}
            <div
                className={`hidden md:flex flex-col h-screen transition-all duration-300 bg-white ${
                    isCollapsed ? "w-20" : "w-64"
                }`}
            >
                <div className="flex items-center justify-between p-4 border-b">
                    <button
                        onClick={toggleSidebar}
                        className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                    >
                        {isCollapsed ? ">" : "<"}
                    </button>
                </div>

                <div className="flex flex-col items-center p-4">
                    <img
                        src={logo}
                        alt="Logo"
                        className={`rounded-full transition-all duration-300 ${
                            isCollapsed ? "w-12 h-12" : "w-24 h-24"
                        }`}
                    />
                </div>

                <ul className="flex flex-col flex-1 p-4 space-y-2">
                    <li
                        onClick={goToDashboard}
                        className="flex items-center p-3 text-lg font-medium transition-all duration-300 cursor-pointer hover:bg-blue-500 hover:text-white"
                    >
                        <span className="mr-2">🏠</span>
                        {!isCollapsed && <span>Dashboard</span>}
                    </li>
                    <li
                        onClick={goToConsultas}
                        className="flex items-center p-3 text-lg font-medium transition-all duration-300 cursor-pointer hover:bg-blue-500 hover:text-white"
                    >
                        <span className="mr-2">📅</span>
                        {!isCollapsed && <span>Consultas</span>}
                    </li>
                    <li
                        onClick={goToRelatorios}
                        className="flex items-center p-3 text-lg font-medium transition-all duration-300 cursor-pointer hover:bg-blue-500 hover:text-white"
                    >
                        <span className="mr-2">📊</span>
                        {!isCollapsed && <span>Relatórios</span>}
                    </li>
                    <li
                        onClick={goToConfiguracoes}
                        className="flex items-center p-3 text-lg font-medium transition-all duration-300 cursor-pointer hover:bg-blue-500 hover:text-white"
                    >
                        <span className="mr-2">⚙️</span>
                        {!isCollapsed && <span>Configurações</span>}
                    </li>
                    <li
                        onClick={handleLogout}
                        className="flex items-center p-3 text-lg font-medium text-red-500 transition-all duration-300 cursor-pointer hover:bg-red-500 hover:text-white"
                    >
                        <span className="mr-2">⬅️</span>
                        {!isCollapsed && <span>Sair</span>}
                    </li>
                </ul>
            </div>

            {/* Sidebar para mobile */}
            <div>
                <button
                    className="fixed bottom-4 right-4 w-12 h-12 text-2xl text-white bg-blue-500 rounded-full shadow-lg md:hidden hover:bg-blue-700"
                    onClick={toggleMobileMenu}
                >
                    ☰
                </button>
                {isMobileMenuVisible && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
                        <div className="bg-white h-full w-64 p-4">
                            <button
                                onClick={toggleMobileMenu}
                                className="mb-4 text-white bg-blue-500 px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Fechar
                            </button>
                            <ul className="space-y-4">
                                <li
                                    onClick={goToDashboard}
                                    className="cursor-pointer hover:bg-blue-100 p-2 rounded"
                                >
                                    🏠 Dashboard
                                </li>
                                <li
                                    onClick={goToConsultas}
                                    className="cursor-pointer hover:bg-blue-100 p-2 rounded"
                                >
                                    📅 Consultas
                                </li>
                                <li
                                    onClick={goToRelatorios}
                                    className="cursor-pointer hover:bg-blue-100 p-2 rounded"
                                >
                                    📊 Relatórios
                                </li>
                                <li
                                    onClick={goToConfiguracoes}
                                    className="cursor-pointer hover:bg-blue-100 p-2 rounded"
                                >
                                    ⚙️ Configurações
                                </li>
                                <li
                                    onClick={handleLogout}
                                    className="cursor-pointer hover:bg-red-100 p-2 rounded text-red-500"
                                >
                                    ⬅️ Sair
                                </li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default Sidebar;
