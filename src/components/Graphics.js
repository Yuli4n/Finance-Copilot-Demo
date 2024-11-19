import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import NavBar from './NavBar';
import ProfileModal from './ProfileModal';

const stockSymbols = [
    { symbol: 'MSTR', name: 'MicroStrategy', description: 'MicroStrategy es una empresa líder en inteligencia empresarial.' },
    { symbol: 'COIN', name: 'Coinbase', description: 'Coinbase es una plataforma de intercambio de criptomonedas.' },
    { symbol: 'TSLA', name: 'Tesla', description: 'Tesla es una empresa pionera en vehículos eléctricos.' },
    { symbol: 'AAPL', name: 'Apple', description: 'Apple es una de las empresas tecnológicas más valiosas del mundo.' },
    { symbol: 'QCOM', name: 'Qualcomm', description: 'Qualcomm es una empresa especializada en semiconductores y 5G.' },
    { symbol: 'NVDA', name: 'Nvidia', description: 'Nvidia es un líder mundial en GPU y tecnologías de IA.' },
];

const Graphics = () => {
  const [stockData, setStockData] = useState({});
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Axios Interceptor para agregar encabezados predeterminados
  useEffect(() => {
    axios.defaults.headers.common['Origin'] = 'http://localhost'; // Ajusta si tu origen es diferente
  }, []);

  const fetchStockData = async (symbol) => {
    try {
      console.log(`Fetching data for ${symbol}...`); // Mensaje de depuración
      const response = await axios.get(
        `http://34.173.131.99:8080/https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=7d&interval=1d`
      );
      console.log(`Response for ${symbol}:`, response.data); // Depuración de la respuesta
      const result = response.data.chart.result[0];
      const prices = result.indicators.quote[0].close.map((price, index) => ({
        date: new Date(result.timestamp[index] * 1000).toLocaleDateString(),
        price,
      }));
      setStockData((prevData) => ({
        ...prevData,
        [symbol]: prices,
      }));
    } catch (error) {
      console.error(`Error fetching data for ${symbol}:`, error); // Mensaje de error detallado
      setError(error.message || 'An unknown error occurred');
    }
  };

  useEffect(() => {
    stockSymbols.forEach(({ symbol }) => fetchStockData(symbol));
  }, []);

  const handleApplyChanges = () => {
    setStockData({}); // Resetea datos al aplicar cambios
    stockSymbols.forEach(({ symbol }) => fetchStockData(symbol));
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 py-10 pt-28">
        
        <button
          className="bg-white text-blue-500 font-semibold py-2 px-4 rounded shadow-lg hover:bg-blue-500 hover:text-white transition-all mb-6"
          onClick={() => setIsModalOpen(true)}
        >
          Ajuste su perfil
        </button>

        <ProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onApplyChanges={handleApplyChanges}
        />

        {['High Risk Profile', 'Mid Risk Profile', 'Low Risk Profile'].map((riskProfile, idx) => (
          <div key={idx} className="w-full mb-10">
            <h1 className="text-center text-4xl font-bold text-white mb-6">{riskProfile}</h1>
            <div className="grid grid-cols-3 gap-8 justify-items-center">
              {stockSymbols.slice(idx * 3, (idx + 1) * 3).map(({ symbol, name, description }) => {
                const data = stockData[symbol];

                return (
                  <div key={symbol} className="bg-white p-4 rounded-lg shadow-lg">
                    <h2 className="text-center font-bold mb-2">{name}</h2>
                    {data ? (
                      <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={data}>
                          <XAxis dataKey="date" stroke="#ffffff" />
                          <YAxis domain={['auto', 'auto']} stroke="#ffffff" />
                          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                          <Tooltip />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#00BFFF"
                            strokeWidth={2}
                            dot={{ stroke: '#00BFFF', strokeWidth: 2, r: 3 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    ) : (
                      <p className="text-center">Loading...</p>
                    )}
                    <p className="text-center text-gray-600 mt-2">{description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Graphics;
