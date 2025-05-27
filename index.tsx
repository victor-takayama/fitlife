
import React from 'react';
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
import DashboardNutrition from './components/features/UserDashboard/DashboardNutrition';
import DashboardProgress from './components/features/UserDashboard/DashboardProgress';
import DashboardProfilePage from './components/features/UserDashboard/DashboardProfilePage'; // Added

import { ROUTES, DASHBOARD_NAVIGATION_ITEMS, APP_NAME } from './constants';
import { Flame, LogOut, UserCircle, Menu, X } from 'lucide-react'; // Icons for DashboardLayout
import { ToastContainer, useToasts, ToastType } from './components/ui/Toast';

// ProtectedRoute Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authContext = React.useContext(AuthContext);

  if (!authContext) {
    console.error("AuthContext is undefined, make sure AuthProvider is wrapping the app.");
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  const { isAuthenticated, isLoading } = authContext;

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
  const authContext = React.useContext(AuthContext);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = React.useState(false);
  const location = useLocation(); // Added to get current path
  
  if (!authContext) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  const { user, logout } = authContext;

  if (!user) {
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
    // addToast("Você saiu da sua conta.", ToastType.Info); // Needs to be available here
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
              end={item.path === ROUTES.DASHBOARD_OVERVIEW} // Ensure exact match for overview or other index-like routes
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
                    <button onClick={() => setIsMobileSidebarOpen(false)} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                        <X size={24} />
                    </button>
                </div>
                <nav className="flex-grow p-4 space-y-2 overflow-y-auto">
                {DASHBOARD_NAVIGATION_ITEMS.map(item => (
                    <NavLink key={item.path} to={item.path} className={navLinkClass} end={item.path === ROUTES.DASHBOARD_OVERVIEW} onClick={() => setIsMobileSidebarOpen(false)}>
                      {item.icon && <item.icon size={20} className="mr-3 flex-shrink-0" />}
                      <span className="truncate">{item.label}</span>
                    </NavLink>
                ))}
                </nav>
                 <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                     <button 
                        onClick={() => { handleLogout(); setIsMobileSidebarOpen(false); }}
                        className="w-full flex items-center justify-center px-3 py-2.5 rounded-lg text-sm font-medium bg-red-500/10 text-red-600 hover:bg-red-500/20 dark:text-red-400 dark:hover:bg-red-400/30 transition-colors duration-150"
                      >
                        <LogOut size={18} className="mr-2" /> Sair
                    </button>
                </div>
            </aside>
            <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileSidebarOpen(false)}></div>
        </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
         {/* Mobile Header for Dashboard */}
        <header className="md:hidden h-20 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 shadow-sm">
             <button onClick={() => setIsMobileSidebarOpen(true)} className="text-slate-600 dark:text-slate-300 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                <Menu size={24} />
            </button>
            <h1 className="text-lg font-semibold text-primary dark:text-primary-light truncate px-2">
              {DASHBOARD_NAVIGATION_ITEMS.find(item => location.pathname === item.path)?.label || `${APP_NAME} AI`}
            </h1>
            <Link to={ROUTES.DASHBOARD_PROFILE} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
                {user.avatarUrl ? <img src={user.avatarUrl} alt="avatar" className="w-9 h-9 rounded-full object-cover ring-1 ring-primary/30" /> : <UserCircle size={30} className="text-slate-600 dark:text-slate-300" /> }
            </Link>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet /> {/* Nested routes will render here */}
        </main>
      </div>
    </div>
  );
};

// Component to manage overall app structure including conditional footer
const AppContent: React.FC = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.REGISTER;
  const isDashboardPage = location.pathname.startsWith(ROUTES.DASHBOARD);
  
  if (isDashboardPage) {
    return (
      // No need for <Routes> here, as DashboardLayout uses <Outlet /> for nested routes.
      // The parent route in main App component handles the /dashboard/* path.
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900 text-neutral-dark dark:text-neutral-light font-sans">
      {!isAuthPage && <Header />}
      <div className="flex-grow">
        <Routes>
          <Route path={ROUTES.HOME} element={<HomePage />} />
          <Route path={ROUTES.PLANS} element={<PlansPage />} />
          <Route path={ROUTES.ABOUT} element={<AboutPage />} />
          <Route path={ROUTES.COMMUNITY} element={<CommunityPage />} /> 
          <Route path={ROUTES.FAQ} element={<FaqPage />} />
          <Route path={ROUTES.LOGIN} element={<AuthPage />} />
          <Route path={ROUTES.REGISTER} element={<AuthPage />} />
          <Route path={ROUTES.AFFILIATE} element={<AffiliatePage />} />
          
          {/* Catch-all for non-dashboard, non-auth routes */}
          <Route path="*" element={<PageWrapper title="404 - Página Não Encontrada"><div className="text-center"><p>Oops! A página que você está procurando não existe.</p><Link to={ROUTES.HOME} className="text-primary hover:underline">Voltar para Home</Link></div></PageWrapper>} />
        </Routes>
      </div>
      {!isAuthPage && !isDashboardPage && <Footer />}
    </div>
  );
}

// Main App Component that includes ToastContainer at the top level
const App: React.FC = () => {
  const { toasts, dismissToast } = useToasts(); // Get toasts methods
  return (
    <>
      {/* Define all routes here, including the dashboard parent route */}
      <Routes>
        {/* Dashboard Routes */}
        <Route 
          path={`${ROUTES.DASHBOARD}/*`} // Match /dashboard and any sub-paths
          element={
            <ProtectedRoute>
              <DashboardLayout /> 
            </ProtectedRoute>
          }
        >
          {/* Nested routes for DashboardLayout's <Outlet /> */}
          <Route index element={<Navigate to={ROUTES.DASHBOARD_OVERVIEW} replace />} />
          <Route path="overview" element={<DashboardOverview />} />
          <Route path="workouts" element={<DashboardWorkouts />} />
          <Route path="nutrition" element={<DashboardNutrition />} />
          <Route path="progress" element={<DashboardProgress />} />
          <Route path="profile" element={<DashboardProfilePage />} /> 
          <Route path="*" element={<PageWrapper title="404 - Não Encontrado no Dashboard"><div className="text-center"><p>Oops! Esta seção do dashboard não existe.</p><Link to={ROUTES.DASHBOARD_OVERVIEW} className="text-primary hover:underline">Voltar para Visão Geral</Link></div></PageWrapper>} />
        </Route>

        {/* Non-Dashboard Routes */}
        <Route path="/*" element={<AppContent />} /> 
      </Routes>
      <ToastContainer toasts={toasts} dismissToast={dismissToast} />
    </>
  );
}

// Root Render
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <BrowserRouter> {/* BrowserRouter should wrap AuthProvider and ThemeProvider if they use hooks like useLocation/useNavigate */}
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
} else {
  console.error('Root element #root not found in index.html');
}

// Helper style for animations if not covered by Tailwind config
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  .animation-delay-200 { animation-delay: 0.2s; }
  .animation-delay-400 { animation-delay: 0.4s; }
  .animation-delay-600 { animation-delay: 0.6s; }

  @keyframes spin_once {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  .group-hover\\:animate-spin_once:hover .lucide { /* More specific if needed */
    animation: spin_once 0.5s ease-in-out;
  }
`;
document.head.appendChild(styleSheet);
