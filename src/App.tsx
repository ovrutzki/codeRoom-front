import React from 'react';
import HomePage from './component/HomePage/HomePage';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CodeRoom from './component/CodeRoom/CodeRoom';
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="room/:topic" element={<CodeRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
