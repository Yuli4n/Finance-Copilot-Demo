import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import axios from 'axios';
import NavBar from './NavBar';
import ProfileModal from './ProfileModal';

const stockSymbols = [
    { 
        symbol: 'MSTR', 
        name: 'MicroStrategy', 
        description: 'MicroStrategy es una empresa líder en inteligencia empresarial que proporciona software y servicios para el análisis de datos. Su plataforma permite a las empresas aprovechar el poder de los datos para tomar decisiones más informadas. MicroStrategy es conocida por su enfoque en soluciones de BI y recientemente por sus inversiones en criptomonedas como Bitcoin.' 
    },
    { 
        symbol: 'COIN', 
        name: 'Coinbase', 
        description: 'Coinbase es una plataforma de intercambio de criptomonedas que permite a los usuarios comprar, vender y almacenar diversas criptodivisas, como Bitcoin y Ethereum. Es una de las plataformas más grandes y populares en el espacio de criptomonedas y blockchain, con un enfoque en la seguridad y la facilidad de uso para los inversores minoristas y empresas.' 
    },
    { 
        symbol: 'TSLA', 
        name: 'Tesla', 
        description: 'Tesla es una empresa pionera en la fabricación de vehículos eléctricos y soluciones de energía limpia. Fundada por Elon Musk, la empresa ha revolucionado la industria automotriz con sus vehículos eléctricos de alto rendimiento, y también está comprometida con la producción de baterías de almacenamiento de energía y paneles solares, promoviendo un futuro más sostenible.' 
    },
    { 
        symbol: 'AAPL', 
        name: 'Apple', 
        description: 'Apple es una de las empresas tecnológicas más valiosas del mundo, conocida por sus productos innovadores como el iPhone, iPad, Mac, Apple Watch y Apple TV. La compañía se centra en la integración de hardware, software y servicios, lo que proporciona una experiencia de usuario única. También ha crecido en áreas como los servicios digitales y la tecnología portátil.' 
    },
    { 
        symbol: 'QCOM', 
        name: 'Qualcomm', 
        description: 'Qualcomm es una empresa multinacional especializada en la producción de semiconductores y tecnología de telecomunicaciones. Es un actor clave en el desarrollo de chips para teléfonos móviles y redes 5G, y sus soluciones tecnológicas impulsan gran parte de la conectividad inalámbrica en dispositivos móviles, IoT y automóviles.' 
    },
    { 
        symbol: 'NVDA', 
        name: 'Nvidia', 
        description: 'Nvidia es un líder mundial en la fabricación de unidades de procesamiento gráfico (GPU) y tecnologías de inteligencia artificial (IA). Sus chips gráficos son fundamentales para el gaming, diseño gráfico, centros de datos y aplicaciones de inteligencia artificial, además de ser esenciales para el desarrollo de la tecnología de conducción autónoma.' 
    },
    { 
        symbol: 'KO', 
        name: 'CocaCola', 
        description: 'CocaCola es una de las empresas de bebidas más grandes del mundo, famosa por su refresco homónimo, pero también por su amplia cartera de marcas que incluyen aguas, jugos, bebidas deportivas y cafés. La compañía opera en más de 200 países y es un icono global en la industria de alimentos y bebidas.' 
    },
    { 
        symbol: 'V', 
        name: 'Visa', 
        description: 'Visa es una compañía global de tecnología de pagos que facilita las transacciones electrónicas a nivel mundial. A través de su vasta red, Visa conecta consumidores, empresas, instituciones financieras y gobiernos, permitiendo pagos seguros y confiables en cualquier parte del mundo.' 
    },
    { 
        symbol: 'WFC', 
        name: 'Wells Fargo', 
        description: 'Wells Fargo es una multinacional de servicios financieros con sede en los Estados Unidos. Ofrece una amplia gama de servicios financieros que incluyen banca personal y comercial, inversiones, seguros e hipotecas. Es una de las instituciones financieras más grandes y antiguas del mundo.' 
    }
];

const Graphics = () => {
  const [stockData, setStockData] = useState({});
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStockData = async (symbol) => {
  try {
    const response = await axios.get(
      `http://34.173.131.99:8080/https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1mo&interval=1d`
    );
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
    console.error(`Error fetching data for ${symbol}:`, error);
    setError(error);
  }
};


  useEffect(() => {
    stockSymbols.forEach(({ symbol }) => fetchStockData(symbol));
  }, []);

  const getTradeMessage = () => {
    const days = Math.floor(Math.random() * 20) + 1;
    const isLong = Math.random() > 0.5;
  
    return isLong
      ? { text: `Trade Long for ${days} days`, color: 'text-green-500' }
      : { text: `Trade Short for ${days} days`, color: 'text-red-500' };
  };

  const handleApplyChanges = () => {
    setStockData({}); // Reset stock data to trigger re-render
    stockSymbols.forEach(({ symbol }) => fetchStockData(symbol));
  };

  return (
    <>
      <NavBar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-400 to-blue-500 py-10 pt-28">
        
        {/* Botón de "Ajuste su perfil" */}
        <button
          className="bg-white text-blue-500 font-semibold py-2 px-4 rounded shadow-lg hover:bg-blue-500 hover:text-white transition-all mb-6"
          onClick={() => setIsModalOpen(true)}
        >
          Ajuste su perfil
        </button>

        {/* Modal */}
        <ProfileModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onApplyChanges={handleApplyChanges}
        />

        {/* Sección de perfiles de riesgo */}
        {['High Risk Profile', 'Mid Risk Profile', 'Low Risk Profile'].map((riskProfile, idx) => (
          <div key={idx} className="w-full mb-10">
            <h1 className="text-center text-4xl font-bold text-white mb-6">{riskProfile}</h1>
            <div className="grid grid-cols-3 gap-8 justify-items-center">
              {stockSymbols.slice(idx * 3, (idx + 1) * 3).map(({ symbol, name, description }) => {
                const data = stockData[symbol];
                const { text: tradeText, color: tradeColor } = getTradeMessage();

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
                    <p className={`text-center font-semibold mt-4 ${tradeColor}`}>{tradeText}</p>
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
