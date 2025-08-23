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
import ImageGalleryViewer from './Uadmin/gallery'
import ImageGallery from './Uadmin/gallery2'
import EventGalleryManager from './Uadmin/galleryof'



// Componente principal de la aplicación
function App() {
  // Estado local para contar interacciones o elementos (ejemplo)
  const [count, setCount] = useState(0)

  return (
    <div className="Aplicacion">
      <BrowserRouter>
        <Routes>
          {/*Ruta a la pagina */}
          <Route path='/gallery2' element={< ImageGallery/>}/>

          {/*Ruta a la pagina */}
          <Route path='/galleryof' element={<EventGalleryManager />}/>

          {/*Ruta a la pagina */}
          <Route path='/gallery' element={< ImageGalleryViewer/>}/>

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

        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
