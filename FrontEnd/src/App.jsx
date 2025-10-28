import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import useNotifications from "./hooks/useNotifications"
import autoLogoutService from "./services/autoLogoutService"

// Importación de toasts
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Importación de estilos
import './Views/CSS/components.css'

// Importación de vistas
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
  ListResource,
  CreateResource,
  Survay,
  CreateSurvay,
  Notification,
  ImageGallery,
  ManagerImageGallery,
  AdminCalendar,
  ContractsAdmin,
  ContractsList,
  PromotionsAdmin,
  PromotionsForm,
  PromotionsEdit
} from './imports/adminImports'

import {
  Schedule,
  EventDetailsC,
  ListEventsC,
  SurvayClient,
  NotificationsClient,
  ImageGalleryC,
  ImageGalleryViewerC,
  ClientCalendar,
  ContractsClient
} from './imports/clientImports'
import ImageGalleryA from './Views/admin/gallery/gallery1'

// Configuración de rutas
const routeConfig = {
  public: [{ path: '/', component: HomePage }],
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
    { path: '/NotificationsAdmin', component: Notification },
    { path: '/HomeResources', component: ListResource },
    { path: '/CreateResource', component: CreateResource },
    { path: '/SurvayHome', component: Survay },
    { path: '/SurvayHome/create', component: CreateSurvay },
    
    // Galería
    { path: '/GalleryAdmin2', component: ImageGalleryA },
    { path: '/GalleryViewAdmin', component: ImageGallery },
    { path: '/GalleryAdmin', component: ManagerImageGallery },
    { path: '/ManageAccounts', component: AdminAccountsList },
    { path: '/CreateAccount', component: CreateAccountForm },
    { path: '/ManageAccounts/edit/:userId', component: EditAccountPage },
    { path: '/CalendarAdmin', component: AdminCalendar },
    { path: '/SendContractsAdmin', component: ContractsAdmin },
    { path: '/ListContracts', component: ContractsList },
    { path: '/EventsHomeAdmin', component: ListEventsA },
    { path: '/EventsHomeAdmin/Details/:eventId', component: EventDetailsA },
    { path: '/CreateEvent', component: CreateEvent },
    { path: '/EditEvent/:eventId', component: EditEvent },
    { path: '/PromotionsAdmin', component: PromotionsAdmin },
    { path: '/PromotionsForm', component: PromotionsForm },
    { path: '/PromotionsEdit/:promoId', component: PromotionsEdit }
  ],
  client: [
    { path: '/Schedule', component: Schedule },
    { path: '/Survey/:eventId', component: SurvayClient },
    { path: '/GalleryView', component: ImageGalleryViewerC },
    { path: '/Gallery', component: ImageGalleryC },
    { path: '/Calendar', component: ClientCalendar },
    { path: '/HomeContractsCl', component: ContractsClient },
    { path: '/EventsHome/Details/:eventId', component: EventDetailsC },
    { path: '/EventsHome', component: ListEventsC },
    { path: '/Notification-tray', component: NotificationsClient }
  ],
  development: [{ path: '/test', component: TestC }]
}

// Hook de autenticación
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userRole, setUserRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const token = localStorage.getItem("authToken")
      const storedUser = localStorage.getItem("user")
      if (token && storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setIsAuthenticated(true)
        setUserRole(parsedUser.role)
      }
    } catch (err) {
      console.error("Error checking authentication:", err)
    } finally {
      setLoading(false)
    }
  }, [])

  return { isAuthenticated, userRole, loading }
}

// Componentes de protección de rutas
const ProtectedRoute = ({ children, requiredRole, userRole, isAuthenticated }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (requiredRole && userRole !== requiredRole) return <Navigate to="/" replace />
  return children
}

const PublicOnlyRoute = ({ children, isAuthenticated }) => {
  if (isAuthenticated) return <Navigate to="/" replace />
  return children
}

// Función para renderizar rutas
const renderRoutes = (routes, routeType, authProps = {}) => {
  return routes.map(({ path, component: Component }) => {
    const element = <Component />
    switch (routeType) {
      case 'public': return <Route key={path} path={path} element={element} />
      case 'publicOnly':
        return <Route key={path} path={path} element={<PublicOnlyRoute isAuthenticated={authProps.isAuthenticated}>{element}</PublicOnlyRoute>} />
      case 'authenticated':
        return <Route key={path} path={path} element={<ProtectedRoute isAuthenticated={authProps.isAuthenticated}>{element}</ProtectedRoute>} />
      case 'admin':
        return <Route key={path} path={path} element={<ProtectedRoute requiredRole="admin" userRole={authProps.userRole} isAuthenticated={authProps.isAuthenticated}>{element}</ProtectedRoute>} />
      case 'user':
        return <Route key={path} path={path} element={<ProtectedRoute requiredRole="user" userRole={authProps.userRole} isAuthenticated={authProps.isAuthenticated}>{element}</ProtectedRoute>} />
      case 'development': return <Route key={path} path={path} element={element} />
      default: return null
    }
  })
}

// Componente principal
function App() {
  const { isAuthenticated, userRole, loading } = useAuth()

  // Hook de notificaciones en tiempo real
  useNotifications();

  // Auto logout por inactividad
  useEffect(() => {
    if (isAuthenticated) {
      autoLogoutService.start(() => {
        localStorage.removeItem("authToken")
        localStorage.removeItem("user")
        window.location.href = "/login"
      }, 30 * 60 * 1000) // 30 minutos
    }
    return () => autoLogoutService.stop()
  }, [isAuthenticated])

  if (loading) return <div className="loading-container"><div>Cargando...</div></div>

  const authProps = { isAuthenticated, userRole }

  return (
    <div className="Aplicacion">
      <>
      <BrowserRouter>
        <Routes>
          {renderRoutes(routeConfig.public, 'public')}
          {renderRoutes(routeConfig.publicOnly, 'publicOnly', authProps)}
          {renderRoutes(routeConfig.authenticated, 'authenticated', authProps)}
          {renderRoutes(routeConfig.admin, 'admin', authProps)}
          {renderRoutes(routeConfig.client, 'user', authProps)}
          {renderRoutes(routeConfig.development, 'development')}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
      </>
    </div>
  )
}

export default App