import React, { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';
import ReactMarkdown from 'react-markdown';
import 'tailwindcss/tailwind.css';
import './App.css';
import NavBar from './components/NavBar';

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, user: true }];
      setMessages(newMessages);
      setInput('');

      try {
        setLoading(true);
        const response = await axios.post(
          'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=AIzaSyB5jZ0z0gPdw4PoWYsW7dVyZOdyN9elzW8',
          {
            "contents": [
              {
                "parts": [
                  {
                    "text": input
                  }
                ]
              }
            ]
          }
        );
        const botResponse = response.data.candidates[0].content.parts[0].text;
        setLoading(false);
        setMessages([...newMessages, { text: botResponse, user: false }]);
      } catch (error) {
        console.error('Error sending message:', error);
        setLoading(false);
        setMessages([...newMessages, { text: 'Error: Could not get response from AI', user: false }]);
      }
    }
  };

  const suggestions = {
    examples: [
      "Dame 5 noticias relevantes para alguien que quiera invertir en Nvidia",
      "¿Cuáles son las métricas clave para evaluar a Tesla en el mercado actual?",
      "Quiero entender las implicaciones de la subida de tasas de interés en el sector financiero",
      "¿Qué tendencias de inversión están en auge en el sector de la tecnología?",
      "Explícame los fundamentos para evaluar acciones de Amazon"
    ],
    templates: [
      "Tengo un perfil de riesgo <bajo, medio, alto>, ¿qué debería analizar más en <técnico, fundamental> para invertir en <tecnología, materias primas, sector financiero>?",
      "¿Qué sectores sugieres para alguien con interés en <sostenibilidad, alta rentabilidad, bajo riesgo>?",
      "Quiero mejorar mi diversificación en <acciones, bonos, criptomonedas>, ¿qué estrategias me recomiendas?",
      "Soy nuevo en la inversión, ¿qué cosas debo entender sobre el análisis <técnico, fundamental>?",
      "Si quiero invertir en <empresas emergentes, acciones estables>, ¿qué debería tener en cuenta para minimizar riesgos?"
    ]
  };

  return (
    <>
      <NavBar />
      <div className="flex flex-col items-center bg-gradient-to-r from-green-400 to-blue-500 min-h-screen overflow-y-auto p-12">
        <h1 className="mb-8 font-bold text-[3rem] drop-shadow-lg text-blue-50">Finance Copilot</h1>
        
        {/* Chatbot Container */}
        <div className="bg-white w-full max-w-lg shadow-lg rounded-lg overflow-hidden mb-6">
          <div className="p-4 h-96 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.user ? 'justify-end' : 'justify-start'} mb-2`}>
                <div className={`rounded-lg p-2 shadow-md overflow-x-hidden flex flex-wrap ${msg.user ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            {loading && (
              <div className="wrapper">
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="circle"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
                <div className="shadow"></div>
                <span>Loading</span>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-200 flex">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-lg outline-none"
              placeholder="Ask copilot a finance question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button
              className="ml-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
              onClick={handleSendMessage}
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>

        {/* Suggestions Section */}
        <div className="bg-white w-full max-w-2xl p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-gray-700 mb-4">Sugerencias de Prompts</h2>
          
          <div>
            <h3 className="font-semibold text-gray-600">Ejemplos:</h3>
            <ul className="list-disc list-inside mb-4 text-gray-600">
              {suggestions.examples.map((example, index) => (
                <li key={index} className="mb-2">{example}</li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-600">Plantillas:</h3>
            <ul className="list-disc list-inside text-gray-600">
              {suggestions.templates.map((template, index) => (
                <li key={index} className="mb-2">{template}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
