import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './components/components.css'
import HomePage from './HomePage'
import LoginPage from './LogIn';
import RegisterPage from './Register';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="Aplicacion">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/Register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
