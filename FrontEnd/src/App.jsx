// Importación de hooks y componentes necesarios
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'



// Importación de estilos y vistas
import './components/components.css'
import HomePage from './HomePage'
import LoginPage from './LogIn'
import RegisterPage from './Register'
import RecoverPassword from './RecoverPassword'
import Contracts from './UCliente/Contracts'
import ScheduleAppointment from './UCliente/ScheduleAppointment'

// Componente principal de la aplicación
function App() {
  // Estado local para contar interacciones o elementos (ejemplo)
  const [count, setCount] = useState(0)

  return (
    <div className="Aplicacion">
      <BrowserRouter>
        <Routes>
          {/* Ruta a la página principal */}
          <Route path="/" element={<HomePage />} />

          {/* Ruta a la página de inicio de sesión */}
          <Route path="/login" element={<LoginPage />} />

          {/* Ruta a la página de registro */}
          <Route path="/register" element={<RegisterPage />} />

          {/* Ruta a la página de recuperación de contraseña */}
          <Route path="/recover" element={<RecoverPassword />} />
           
           {/* Ruta a la página principal */}
          <Route path="/contracts-client" element={<Contracts />} />

           {/* Ruta a la página principal */}
          <Route path="/ScheduleAppointment-client" element={<ScheduleAppointment />} />

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
