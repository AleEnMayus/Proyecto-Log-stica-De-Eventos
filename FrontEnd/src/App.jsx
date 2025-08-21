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
import Schedule from './UCliente/Schedule'
import Survay from './Uadmin/survay'  
import  CreateSurvay from './Uadmin/createsurvay'
import SurvayClient from './UCliente/survey' // Importación del componente de encuesta del cliente
import Notifications from './UCliente/Notification-tray' // Importación del componente de notificaciones
import Notification from './Uadmin/Notification' // Importación del componente de notificaciones del administrador

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
          <Route path="/Schedule-client" element={<Schedule />} />

          {/* Ruta a la página de encuestas */}
          <Route path="/survay" element={<Survay />} />

          {/* Ruta a la página de creación de encuestas */}
          <Route path="/createsurvay" element={<CreateSurvay />} />

          {/* Ruta a la encuesta del cliente */}
          <Route path="/survey" element={<SurvayClient />} />

          {/* Ruta a las notificaciones del cliente */}
          <Route path="/Notification-tray" element={<Notifications />} />

          {/* Ruta a las notificaciones del administrador */}
          <Route path="/Notification" element={<Notifications />} />

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
