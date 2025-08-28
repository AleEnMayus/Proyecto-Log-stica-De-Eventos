import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

// Importación de estilos y vistas
import './components/components.css'

// Importaciones organizadas por tipo
import {
  HomePage,
  LoginPage,
  RegisterPage,
  RecoverPassword,
  Logout,
  UpdatePassword,
  TestC
} from './imports/commonImports'

import {
  AdminAccountsList,
  CreateAccountForm,
  EditAccountPage,
  ListEventsA,
  EventDetailsA,
  CreateEvent,
  EditEvent,
  Mainresources,
  Secondaryresources,
  Survay,
  CreateSurvay,
  Notification,
  ImageGallery,
  ManagerImageGallery,
  AdminCalendar,
  ContractsAdmin,
  ContractsList
} from './imports/adminImports'

import {
  Schedule,
  EventDetailsC,
  ListEventsC,
  SurvayClient,
  Notifications,
  ImageGalleryC,
  ImageGalleryViewerC,
  ClientCalendar,
  ContractsClient
} from './imports/clientImports'

// Configuración de rutas
const routeConfig = {
  public: [
    { path: '/', component: HomePage }
  ],
  
  publicOnly: [
    { path: '/login', component: LoginPage },
    { path: '/register', component: RegisterPage },
    { path: '/recover', component: RecoverPassword }
  ],
  
  authenticated: [
    { path: '/logout', component: Logout },
    { path: '/updatePassword', component: UpdatePassword }
  ],
  
  admin: [
    // Notificaciones
    { path: '/NotificationsAdmin', component: Notification },
    
    // Recursos
    { path: '/MainResources', component: Mainresources },
    { path: '/SecondaryResources', component: Secondaryresources },
    
    // Encuestas
    { path: '/SurvayHome', component: Survay },
    { path: '/createsurvay', component: CreateSurvay },
    
    // Galería
    { path: '/GalleryViewAdmin', component: ImageGallery },
    { path: '/GalleryAdmin', component: ManagerImageGallery },
    
    // Cuentas
    { path: '/ManageAccounts', component: AdminAccountsList },
    { path: '/CreateAccount', component: CreateAccountForm },
    { path: '/users/edit/:userId', component: EditAccountPage },
    
    // Calendario
    { path: '/CalendarAdmin', component: AdminCalendar },
    
    // Contratos
    { path: '/HomeContractsAdmin', component: ContractsAdmin },
    { path: '/ListContracts', component: ContractsList },
    
    // Eventos
    { path: '/EventsHomeAdmin', component: ListEventsA },
    { path: '/EventDetailsAdmin', component: EventDetailsA },
    { path: '/CreateEvent', component: CreateEvent },
    { path: '/EditEvent', component: EditEvent }
  ],
  
  client: [
    // Notificaciones
    { path: '/Notifications', component: Notifications },
    
    // Citas
    { path: '/Schedule', component: Schedule },
    
    // Encuestas
    { path: '/Survey', component: SurvayClient },
    
    // Galería
    { path: '/GalleryView', component: ImageGalleryViewerC },
    { path: '/Gallery', component: ImageGalleryC },
    
    // Calendario
    { path: '/Calendar', component: ClientCalendar },
    
    // Contratos
    { path: '/HomeContractsCl', component: ContractsClient },
    
    // Eventos
    { path: '/EventDetails', component: EventDetailsC },
    { path: '/EventsHome', component: ListEventsC }
  ],
  
  development: [
    { path: '/test', component: TestC }
  ]
}

// Hook de autenticación
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      try {
        const token = localStorage.getItem('authToken')
        const storedRole = localStorage.getItem('userRole')
        
        if (token && storedRole) {
          setIsAuthenticated(true)
          setUserRole(storedRole)
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return { isAuthenticated, userRole, loading }
}

// Componentes de protección de rutas
const ProtectedRoute = ({ children, requiredRole, userRole, isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/" replace />
  }
  
  return children
}

const PublicOnlyRoute = ({ children, isAuthenticated }) => {
  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return children
}

// Función para renderizar rutas
const renderRoutes = (routes, routeType, authProps = {}) => {
  return routes.map(({ path, component: Component }) => {
    const element = <Component />
    
    switch (routeType) {
      case 'public':
        return <Route key={path} path={path} element={element} />
      
      case 'publicOnly':
        return (
          <Route 
            key={path} 
            path={path} 
            element={
              <PublicOnlyRoute isAuthenticated={authProps.isAuthenticated}>
                {element}
              </PublicOnlyRoute>
            } 
          />
        )
      
      case 'authenticated':
        return (
          <Route 
            key={path} 
            path={path} 
            element={
              <ProtectedRoute isAuthenticated={authProps.isAuthenticated}>
                {element}
              </ProtectedRoute>
            } 
          />
        )
      
      case 'admin':
        return (
          <Route 
            key={path} 
            path={path} 
            element={
              <ProtectedRoute 
                requiredRole="admin" 
                userRole={authProps.userRole} 
                isAuthenticated={authProps.isAuthenticated}
              >
                {element}
              </ProtectedRoute>
            } 
          />
        )
      
      case 'client':
        return (
          <Route 
            key={path} 
            path={path} 
            element={
              <ProtectedRoute 
                requiredRole="user" 
                userRole={authProps.userRole} 
                isAuthenticated={authProps.isAuthenticated}
              >
                {element}
              </ProtectedRoute>
            } 
          />
        )
      
      case 'development':
        return <Route key={path} path={path} element={element} />
      
      default:
        return null
    }
  })
}

// Componente principal
function App() {
  const { isAuthenticated, userRole, loading } = useAuth()

  if (loading) {
    return (
      <div className="loading-container">
        <div>Cargando...</div>
      </div>
    )
  }

  const authProps = { isAuthenticated, userRole }

  return (
    <div className="Aplicacion">
      <BrowserRouter>
        <Routes>
          {/* Rutas públicas */}
          {renderRoutes(routeConfig.public, 'public')}
          
          {/* Rutas solo para no autenticados */}
          {renderRoutes(routeConfig.publicOnly, 'publicOnly', authProps)}
          
          {/* Rutas para usuarios autenticados */}
          {renderRoutes(routeConfig.authenticated, 'authenticated', authProps)}
          
          {/* Rutas de administrador */}
          {renderRoutes(routeConfig.admin, 'admin', authProps)}
          
          {/* Rutas de cliente */}
          {renderRoutes(routeConfig.client, 'client', authProps)}
          
          {/* Rutas de desarrollo */}
          {renderRoutes(routeConfig.development, 'development')}
          
          {/* Ruta 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App