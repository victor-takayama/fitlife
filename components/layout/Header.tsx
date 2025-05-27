
import React, { useState, useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Flame, Menu, X, Sun, Moon, UserCircle } from 'lucide-react';
import { APP_NAME, NAVIGATION_ITEMS, AUTH_NAVIGATION_ITEMS, ROUTES } from '../../constants';
import { ThemeContext, ThemeContextType } from '../../contexts/ThemeContext';
import { AuthContext, AuthContextType } from '../../contexts/AuthContext';
import Button from '../ui/Button';

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useContext(ThemeContext) as ThemeContextType;
  const { user, logout } = useContext(AuthContext) as AuthContextType;

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
      isActive
        ? 'bg-primary/10 text-primary dark:text-primary-light'
        : 'text-neutral-dark hover:text-primary dark:text-neutral-light dark:hover:text-primary-light'
    }`;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex items-center space-x-2 text-2xl font-bold text-primary dark:text-primary-light">
            <Flame size={32} />
            <span>{APP_NAME}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {NAVIGATION_ITEMS.map((item) => (
              <NavLink key={item.path} to={item.path} className={navLinkClass}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* Actions: Theme toggle, Auth/User */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </Button>

            {user ? (
              <div className="relative group">
                 <Link to={ROUTES.DASHBOARD_OVERVIEW}>
                    <Button variant="ghost" size="icon" className="rounded-full">
                    {user.avatarUrl ? (
                        <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                        <UserCircle size={28} className="text-neutral-dark dark:text-neutral-light" />
                    )}
                    </Button>
                 </Link>
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 hidden group-hover:block ring-1 ring-black ring-opacity-5">
                  <div className="px-4 py-2 text-sm text-neutral-dark dark:text-neutral-light border-b dark:border-slate-700">
                    Logado como <strong className="block">{user.name}</strong>
                  </div>
                  <Link to={ROUTES.DASHBOARD_OVERVIEW} className="block px-4 py-2 text-sm text-neutral-dark hover:bg-slate-100 dark:text-neutral-light dark:hover:bg-slate-700">
                    Dashboard
                  </Link>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to={ROUTES.LOGIN}>
                  <Button variant="ghost" size="sm">Login</Button>
                </Link>
                <Link to={ROUTES.REGISTER}>
                  <Button variant="primary" size="sm">Comece Agora</Button>
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} aria-label="Open menu">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 inset-x-0 p-2 transition transform origin-top-right bg-white dark:bg-slate-900 shadow-lg z-30">
          <div className="rounded-lg ring-1 ring-black ring-opacity-5 divide-y divide-slate-200 dark:divide-slate-700">
            <div className="pt-5 pb-6 px-5 space-y-1">
              {NAVIGATION_ITEMS.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-md text-base font-medium ${
                      isActive
                        ? 'bg-primary/10 text-primary dark:text-primary-light'
                        : 'text-neutral-dark hover:bg-slate-50 dark:text-neutral-light dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
            {!user && (
              <div className="py-6 px-5 space-y-4">
                <Link to={ROUTES.REGISTER} onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="primary" size="md" className="w-full">Comece Agora</Button>
                </Link>
                <p className="text-center text-base font-medium text-neutral-DEFAULT dark:text-slate-400">
                  Já tem uma conta?{' '}
                  <Link to={ROUTES.LOGIN} onClick={() => setIsMobileMenuOpen(false)} className="text-primary hover:underline dark:text-primary-light">
                    Login
                  </Link>
                </p>
              </div>
            )}
             {user && (
                <div className="py-6 px-5">
                     <Button variant="outline" size="md" className="w-full" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>Sair</Button>
                </div>
             )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
    