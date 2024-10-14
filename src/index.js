import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Graphics from './components/Graphics';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/graphics" element={<Graphics />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
