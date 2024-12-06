import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavigationBar } from "./components/NavigationBar";
import { Dashboard } from "./pages/Dashboard";
import { EventRegister } from "./pages/EventRegister"; // Exemplo de outra página

export function App() {
  return (
    <BrowserRouter>
      <div className="flex">
        {/* Barra de Navegação Fixa */}
        <NavigationBar />
        {/* Conteúdo da Página baseado na Rota */}
        <div className="flex-grow overflow-x-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/eventregister" element={<EventRegister />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
