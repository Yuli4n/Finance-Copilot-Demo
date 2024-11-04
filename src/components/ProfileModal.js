// src/components/ProfileModal.js

import React, { useState } from 'react';

const sectors = ['Materias primas', 'Empresas tecnológicas', 'Financieras', 'Alimentos', 'Transporte', 'Energía'];

const ProfileModal = ({ isOpen, onClose, onApplyChanges }) => {
  const [riskProfile, setRiskProfile] = useState('Medio');
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [successMessage, setSuccessMessage] = useState(false);

  const toggleSector = (sector) => {
    setSelectedSectors((prevSectors) =>
      prevSectors.includes(sector)
        ? prevSectors.filter((s) => s !== sector)
        : [...prevSectors, sector]
    );
  };

  const handleApplyChanges = () => {
    setSuccessMessage(true);
    setTimeout(() => {
      setSuccessMessage(false);
      onApplyChanges();
      onClose();
    }, 3000); // 3 seconds delay before closing modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800">
          ✖
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center">Ajustar Perfil</h2>

        {successMessage ? (
          <p className="text-green-500 text-center font-semibold">Cambios aplicados exitosamente</p>
        ) : (
          <>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Perfil de Riesgo</h3>
              <select
                value={riskProfile}
                onChange={(e) => setRiskProfile(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="Alto">Alto</option>
                <option value="Medio">Medio</option>
                <option value="Bajo">Bajo</option>
              </select>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold text-gray-700 mb-2">Sectores de Interés</h3>
              <div className="grid grid-cols-2 gap-2">
                {sectors.map((sector) => (
                  <label key={sector} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedSectors.includes(sector)}
                      onChange={() => toggleSector(sector)}
                      className="text-blue-500"
                    />
                    <span>{sector}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              onClick={handleApplyChanges}
              className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 transition-all"
            >
              Subir los cambios
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
