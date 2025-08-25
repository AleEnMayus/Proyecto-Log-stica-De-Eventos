import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// Importación de estilos y vistas
import './components/components.css'
import HomePage from './HomePage'
import LoginPage from './LogIn'
import RegisterPage from './Register'
import RecoverPassword from './RecoverPassword'
import Contracts from './Uadmin/Contracts'
import Schedule from './UCliente/Schedule'
import Survay from './Uadmin/CreateSurvey/survey'  
import  CreateSurvay from './Uadmin/CreateSurvey/createsurvey'


import Logout from './components/LogOut'
import UpdatePassword from './components/AccountModal/NewPassword'
import AdminAccountsList from './Uadmin/ManageAcc/HomeAccounts'
import CreateAccountForm from './Uadmin/ManageAcc/CreateAcc'
import EditAccountPage from './Uadmin/ManageAcc/EditAccAdmin'

import ListEventsA from './Uadmin/Events/HomeEventsAdm'
import EventDetailsA from './Uadmin/Events/EventDetailsAdm'
import EventDetailsC from './UCliente/Events/EventDetailsCl'
import ListEventsC from './UCliente/Events/HomeEventsCl'
import EventState from './Uadmin/Events/EventState'
import CreateEvent from './Uadmin/Events/CreateEvent'
import EditEvent from './Uadmin/Events/EditEvent'
import RequestCancel from './UCliente/Events/RequestEvent'
import CancelEvent from './Uadmin/Events/CancelRequest'

import Mainresources from './Uadmin/Resource/Mainresource'
import Secondaryresources from './Uadmin/Resource/Secondaryresource'

import SurvayClient from './UCliente/survey'
import Notifications from './UCliente/Notification-tray'
import Notification from './Uadmin/Notification'

import ImageGalleryViewer from './Uadmin/gallery/gallery'
import ImageGallery from './Uadmin/gallery/gallery2'
import EventGalleryManager from './Uadmin/gallery/galleryof'
import  ImageGalleryC from './UCliente/gallerycli/galleryC'
import ImageGalleryViewerC from  './UCliente/gallerycli/galleryC2'


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
          <Route path="/ContractsAdmin" element={<Contracts />} />

           {/* Ruta a la página principal */}
          <Route path="/Schedule" element={<Schedule />} />

          {/* Ruta a la página de encuestas */}
          <Route path="/Survay" element={<Survay />} />

          {/* Ruta a la página de creación de encuestas */}
          <Route path="/createsurvay" element={<CreateSurvay />} />

          {/* Ale */}
          <Route path='/change-password' element={<UpdatePassword />}/>
          <Route path='/logout' element={<Logout />} />
          <Route path='/ManageAccounts' element={<AdminAccountsList />}/>
          <Route path='/CreateAccount' element={<CreateAccountForm />}/>
          <Route path='/users/edit/:userId' element={<EditAccountPage />} />

          {/* Diego */}
          <Route path="/EventsHomeAdmin" element={<ListEventsA />} />
          <Route path="/EventDetailsAdmin" element={<EventDetailsA />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/edit-event" element={<EditEvent />} />
          <Route path='/EventDetails' element={<EventDetailsC />}/>
          <Route path='/EventsHome' element={<ListEventsC />}/>
          <Route path='/EventStateAdmin' element={<EventState />}/>
          <Route path='/EventCancel' element={<RequestCancel />}/>
          <Route path='/RequestEvent' element={<CancelEvent />}/>

          {/* Nicol */}
          <Route path="/mainresources-admin" element={<Mainresources />} />
          <Route path="/secondaryresources-admin" element={< Secondaryresources/>} />

          {/* Nury */}
          <Route path="/survey" element={<SurvayClient />} />
          <Route path="/Notification-tray" element={<Notifications />} />
          <Route path="/Notification" element={<Notification />} />

          {/* David */}
          <Route path='/galleryC2' element={< ImageGalleryViewerC/>}/>
          <Route path='/galleryC' element={< ImageGalleryC/>}/>
          <Route path='/gallery2' element={< ImageGallery/>}/>
          <Route path='/galleryof' element={<EventGalleryManager />}/>
          <Route path='/gallery' element={< ImageGalleryViewer/>}/>

          </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App