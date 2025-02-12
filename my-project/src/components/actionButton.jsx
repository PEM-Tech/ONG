"use client";
import React, { useState } from "react";

const ActionButton = ({ color, onClick, icon, withDropdown }) => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleDropdownToggle = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleButtonClick = () => {
    if (withDropdown) {
      handleDropdownToggle();
    } else {
      setIsModalVisible(true);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="relative inline-block">
      <button
        className={`px-0.5 py-1 text-white rounded-full ${color} hover:scale-110 transition-transform duration-200 shadow-md flex items-center justify-center`}
        onClick={handleButtonClick}
      >
        {icon && <span className="text-2xl">{icon}</span>}
      </button>

      {withDropdown && isDropdownVisible && (
        <div className="absolute left-0 mt-2 bg-white border border-gray-300 rounded shadow-lg z-10">
          <ul className="py-2">
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setIsDropdownVisible(false);
                onClick("Doença");
              }}
            >
              Doença
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setIsDropdownVisible(false);
                onClick("Motivos pessoais");
              }}
            >
              Motivos pessoais
            </li>
            <li
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setIsDropdownVisible(false);
                onClick("Trânsito");
              }}
            >
              Trânsito
            </li>
          </ul>
        </div>
      )}

      {isModalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-6 shadow-lg w-1/3">
            <h2 className="text-xl font-bold mb-4">Confirmação</h2>
            <p className="mb-6">Tem certeza que deseja realizar esta ação?</p>
            <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                onClick={closeModal}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  setIsModalVisible(false);
                  onClick();
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActionButton;
