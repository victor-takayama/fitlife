
import React, { useContext, useState, StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Outlet, Navigate, useLocation, NavLink, Link } from 'react-router-dom';

// Contexts
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, AuthContext, AuthContextType } from './contexts/AuthContext';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import PageWrapper from './components/layout/PageWrapper';
import LoadingSpinner from './components/ui/LoadingSpinner'; // Used in ProtectedRoute and DashboardLayout

// Main Pages
import HomePage from './pages/HomePage';
import PlansPage from './pages/PlansPage';
import AboutPage from './pages/AboutPage';
import FaqPage from './pages/FaqPage';
import AuthPage from './pages/AuthPage';
import CommunityPage from './pages/CommunityPage'; // Added
import AffiliatePage from './pages/AffiliatePage'; // Added


// Dashboard Pages & Components
import DashboardOverview from './components/features/UserDashboard/DashboardOverview';
import DashboardWorkouts from './components/features/UserDashboard/DashboardWorkouts';
import DashboardNutrition from '@/components/features/UserDashboard/DashboardNutrition'; // Changed to aliased path
import DashboardProgress from './components/features/UserDashboard/DashboardProgress';
import DashboardProfilePage from './components/features/UserDashboard/DashboardProfilePage'; // Added

import { ROUTES, DASHBOARD_NAVIGATION_ITEMS, APP_NAME } from './constants';
import { Flame, LogOut, UserCircle, Menu, X } from 'lucide-react'; // Icons for DashboardLayout
import { ToastContainer, useToasts, ToastType } from './components/ui/Toast';

// ProtectedRoute Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authContextValue = useContext(AuthContext); // Changed from React.useContext

  if (!authContextValue) {
    // AuthContext is not available, redirect to login. This should ideally not happen if AuthProvider wraps the app.
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  const { isAuthenticated, isLoading } = authContextValue;

  if (isLoading) {
      return (
        <div className="flex flex-col justify-center items-center h-screen bg-slate-100 dark:bg-slate-900">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-neutral-dark dark:text-neutral-light">Carregando sua sessão...</p>
        </div>
      );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <>{children}</>;
};

// DashboardLayout Component
const DashboardLayout: React.FC = () => {
  const authContextValue = useContext(AuthContext); // Changed from React.useContext
  const [isMobileSidebarOpen, setIsMobileSidebarOpenValue] = useState(false); // Changed from React.useState
  const location = useLocation(); 
  const { addToast } = useToasts(); 
  
  if (!authContextValue) {
    addToast("Erro de autenticação. Por favor, faça login novamente.", ToastType.Error);
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  const { user, logout } = authContextValue;

  if (!user) {
    addToast("Usuário não encontrado. Por favor, faça login novamente.", ToastType.Error);
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group transform hover:translate-x-1 ${
      isActive
        ? 'bg-primary shadow-lg text-white dark:bg-primary-dark'
        : 'text-slate-700 hover:bg-primary/10 hover:text-primary dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-primary-light'
    }`;
  
  const handleLogout = () => {
    logout();
    addToast("Você saiu da sua conta.", ToastType.Info); 
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-900">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-lg">
        <div className="flex items-center justify-center h-20 border-b border-slate-200 dark:border-slate-700 px-4">
          <Link to={ROUTES.HOME} className="flex items-center space-x-2 text-2xl font-bold text-primary dark:text-primary-light transition-transform hover:scale-105">
            <Flame size={30} />
            <span>{APP_NAME}</span>
          </Link>
        </div>
        <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
          {DASHBOARD_NAVIGATION_ITEMS.map(item => (
            <NavLink 
              key={item.path} 
              to={item.path} 
              className={navLinkClass} 
              end={item.path === ROUTES.DASHBOARD_OVERVIEW}
              aria-current={location.pathname === item.path ? "page" : undefined}
            >
              {item.icon && <item.icon size={20} className="mr-3 flex-shrink-0 group-hover:animate-spin_once" />}
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center space-x-3 mb-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-700/50">
                {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/50" />
                ) : (
                    <UserCircle size={40} className="text-slate-500 dark:text-slate-400" />
                )}
                <div className="truncate">
                    <p className="text-sm font-semibold text-neutral-dark dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                </div>
            </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center px-3 py-2.5 rounded-lg text-sm font-medium bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-400/30 transition-colors duration-150"
            aria-label="Sair da conta"
          >
            <LogOut size={18} className="mr-2" /> Sair
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar (Drawer style) */}
      <div className={`fixed inset-0 z-50 flex md:hidden transition-transform duration-300 ease-in-out ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
            <aside className="flex flex-col w-72 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 shadow-xl">
                 <div className="flex items-center justify-between h-20 border-b border-slate-200 dark:border-slate-700 px-4">
                    <Link to={ROUTES.HOME} className="flex items-center space-x-2 text-xl font-bold text-primary dark:text-primary-light">
                        <Flame size={28} />
                        <span>{APP_NAME}</span>
                    </Link>
                    <button onClick={() => setIsMobileSidebarOpenValue(false)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Fechar menu lateral">
                        <X size={24} />
                    </button>
                </div>
                <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                {DASHBOARD_NAVIGATION_ITEMS.map(item => (
                    <NavLink key={item.path} to={item.path} className={navLinkClass} end={item.path === ROUTES.DASHBOARD_OVERVIEW} onClick={() => setIsMobileSidebarOpenValue(false)} aria-current={location.pathname === item.path ? "page" : undefined}>
                      {item.icon && <item.icon size={20} className="mr-3 flex-shrink-0" />}
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                ))}
                </nav>
                 <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                    <div className="flex items-center space-x-3 mb-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-700/50">
                        {user.avatarUrl ? (
                            <img src={user.avatarUrl} alt={user.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/50" />
                        ) : (
                            <UserCircle size={40} className="text-slate-500 dark:text-slate-400" />
                        )}
                        <div className="truncate">
                            <p className="text-sm font-semibold text-neutral-dark dark:text-white truncate">{user.name}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => { handleLogout(); setIsMobileSidebarOpenValue(false); }}
                        className="w-full flex items-center justify-center px-3 py-2.5 rounded-lg text-sm font-medium bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-400/30 transition-colors duration-150"
                        aria-label="Sair da conta"
                    >
                        <LogOut size={18} className="mr-2" /> Sair
                    </button>
                </div>
            </aside>
            {/* Backdrop */}
            <div className="flex-1 bg-black/30" onClick={() => setIsMobileSidebarOpenValue(false)}></div>
      </div>


      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar for mobile */}
        <header className="md:hidden flex items-center justify-between h-20 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-4 shadow-sm">
            <button onClick={() => setIsMobileSidebarOpenValue(true)} className="text-slate-600 hover:text-primary dark:text-slate-300 dark:hover:text-primary-light p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700" aria-label="Abrir menu lateral">
                <Menu size={24} />
            </button>
             <Link to={ROUTES.HOME} className="flex items-center space-x-2 text-lg font-bold text-primary dark:text-primary-light">
                <Flame size={26} />
                {/* Optionally hide APP_NAME on very small screens if space is an issue */}
            </Link>
            {/* Placeholder for potential actions like theme toggle or user avatar if needed in mobile top bar */}
            <div className="w-8 h-8"> {/* Spacer to balance menu icon */}
                {user.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                    <UserCircle size={28} className="text-slate-500 dark:text-slate-400" />
                )}
            </div>
        </header>
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};


// App Component
const App: React.FC = () => {
  const { toasts, addToast, dismissToast } = useToasts(); // Toast context

  return (
    <StrictMode>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
            <ToastContainer toasts={toasts} dismissToast={dismissToast} />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </StrictMode>
  );
};

// AppContent to access AuthContext for Header/Footer or global logic
const AppContent: React.FC = () => {
  const authContextValue = useContext(AuthContext);
  const location = useLocation();
  const isDashboardRoute = location.pathname.startsWith(ROUTES.DASHBOARD);
  const isAuthRoute = location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER;

  // If still loading authentication, show a full-page loader
  if (authContextValue && authContextValue.isLoading && !authContextValue.isAuthenticated) {
    // This specific check is to avoid full page loader if already authenticated but user object is being refined.
    // More nuanced loading states could be handled within AuthProvider or ProtectedRoute for specific scenarios.
    // If it's the initial load and we don't know auth state yet:
     if (sessionStorage.getItem('fitlife-user') === null) { // A simple check for first-ever load
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-slate-100 dark:bg-slate-900">
                <LoadingSpinner size="lg" />
                <p className="mt-4 text-neutral-dark dark:text-neutral-light">Iniciando FitLife AI...</p>
            </div>
        );
     }
  }

  return (
    <div className={`flex flex-col min-h-screen font-sans text-neutral-dark dark:text-neutral-light ${isDashboardRoute ? '' : 'bg-white dark:bg-slate-900'}`}>
      {!isDashboardRoute && <Header />}
      <div className="flex-grow"> {/* This div will take up available space */}
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.PLANS} element={<PlansPage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.FAQ} element={<FaqPage />} />
          <Route path={ROUTES.COMMUNITY} element={<CommunityPage />} />
          <Route path={ROUTES.AFFILIATE} element={<AffiliatePage />} />
          
          <Route path={ROUTES.LOGIN} element={isAuthRoute && authContextValue?.isAuthenticated ? <Navigate to={ROUTES.DASHBOARD_OVERVIEW} replace /> : <AuthPage />} />
          <Route path={ROUTES.REGISTER} element={isAuthRoute && authContextValue?.isAuthenticated ? <Navigate to={ROUTES.DASHBOARD_OVERVIEW} replace /> : <AuthPage />} />

          {/* Dashboard Routes */}
          <Route 
            path={ROUTES.DASHBOARD} 
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.DASHBOARD_OVERVIEW} element={<DashboardOverview />} />
            <Route index element={<Navigate to={ROUTES.DASHBOARD_OVERVIEW} replace />} /> {/* Default to overview */}
            <Route path={ROUTES.DASHBOARD_WORKOUTS} element={<DashboardWorkouts />} />
            <Route path={ROUTES.DASHBOARD_NUTRITION} element={<DashboardNutrition />} />
            <Route path={ROUTES.DASHBOARD_PROGRESS} element={<DashboardProgress />} />
            <Route path={ROUTES.DASHBOARD_PROFILE} element={<DashboardProfilePage />} />
          </Route>

          {/* Catch-all for undefined routes */}
          <Route path="*" element={
            <PageWrapper title="404 - Página Não Encontrada">
              <div className="text-center">
                <p className="text-xl mb-4">Oops! Parece que esta página não existe.</p>
                <Link to={ROUTES.HOME} className="text-primary hover:underline">Voltar para a Home</Link>
              </div>
            </PageWrapper>
          } />
        </Routes>
      </div>
      {!isDashboardRoute && <Footer />}
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
} else {
  console.error("Root element not found. Make sure you have a div with id='root' in your HTML.");
}