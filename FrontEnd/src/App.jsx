// Importación de hooks y componentes necesarios
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import './components/components.css'
import HomePage from './HomePage'
import LoginPage from './LogIn'
import RegisterPage from './Register'
import RecoverPassword from './RecoverPassword'
import Contracts from './UCliente/Contracts'
import Schedule from './UCliente/Schedule'
import Survay from './Uadmin/survay'  
import  CreateSurvay from './Uadmin/createsurvay'

import ListEventsA from './Uadmin/Events/HomeEventsAdm'
import EventDetailsA from './Uadmin/Events/EventDetailsAdm'
import EventDetailsC from './UCliente/Events/EventDetailsCl'
import ListEventsC from './UCliente/Events/HomeEventsCl'
import EventState from './Uadmin/Events/EventState'
import CreateEvent from './Uadmin/Events/CreateEvent'
import EditEvent from './Uadmin/Events/EditEvent'
import RequestCancel from './UCliente/Events/RequestEvent'
import CancelEvent from './Uadmin/Events/CancelRequest'

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

          <Route path="/EventsHomeAdmin" element={<ListEventsA />} />

          <Route path="/EventDetailsAdmin" element={<EventDetailsA />} />

          <Route path="/create-event" element={<CreateEvent />} />

          <Route path="/edit-event" element={<EditEvent />} />

          <Route path='/EventDetails' element={<EventDetailsC />}/>
          
          <Route path='/EventsHome' element={<ListEventsC />}/>

          <Route path='/EventStateAdmin' element={<EventState />}/>

          <Route path='/EventCancel' element={<RequestCancel />}/>

          <Route path='/RequestEvent' element={<CancelEvent />}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
