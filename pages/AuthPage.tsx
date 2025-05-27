

import React, { useState, useContext, useEffect } from 'react';
// Fix: Import Link from react-router-dom
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';
import { ROUTES } from '../constants';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { User, AtSign, Lock, LogIn, UserPlus, Flame } from 'lucide-react';
import { APP_NAME } from '../constants';

const AuthPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, register, isAuthenticated, isLoading } = useContext(AuthContext) as AuthContextType;

  const [isLogin, setIsLogin] = useState(location.pathname === ROUTES.LOGIN);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // For registration
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLogin(location.pathname === ROUTES.LOGIN);
  }, [location.pathname]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD_OVERVIEW);
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        if (!email || !password) {
          setError('Por favor, preencha email e senha.');
          return;
        }
        await login({ email, name: 'Usuário' }); // Name is not used for login here, but type expects it
      } else {
        if (!name || !email || !password) {
          setError('Por favor, preencha nome, email e senha.');
          return;
        }
        await register({ name, email }); // Password handling is simulated within context
      }
      // Navigation is handled by useEffect watching isAuthenticated
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary via-sky-600 to-indigo-700 p-4">
      <Card className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          {/* Fix: Link component was used without import */}
          <Link to={ROUTES.HOME} className="inline-flex items-center space-x-2 text-3xl font-bold text-primary dark:text-primary-light mb-2">
            <Flame size={36} />
            <span>{APP_NAME}</span>
          </Link>
          <h2 className="text-2xl font-semibold text-neutral-dark dark:text-white">
            {isLogin ? 'Bem-vindo de Volta!' : 'Crie sua Conta FitLife'}
          </h2>
          <p className="text-sm text-neutral-DEFAULT dark:text-slate-300">
            {isLogin ? 'Acesse sua jornada de bem-estar.' : 'Comece sua transformação hoje mesmo.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <Input
              id="name"
              label="Nome Completo"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              icon={<User size={18} className="text-slate-400" />}
              placeholder="Seu nome"
              required={!isLogin}
            />
          )}
          <Input
            id="email"
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<AtSign size={18} className="text-slate-400" />}
            placeholder="seuemail@exemplo.com"
            required
          />
          <Input
            id="password"
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<Lock size={18} className="text-slate-400" />}
            placeholder="Sua senha segura"
            required
          />

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <Button type="submit" variant="primary" size="lg" className="w-full" isLoading={isLoading}>
            {isLogin ? <><LogIn size={20} className="mr-2" />Entrar</> : <><UserPlus size={20} className="mr-2" />Criar Conta</>}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-neutral-DEFAULT dark:text-slate-300">
          {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}
          <button
            onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                // Fix: Link component was used without import, this navigate usage is correct.
                navigate(isLogin ? ROUTES.REGISTER : ROUTES.LOGIN);
            }}
            className="ml-1 font-medium text-primary hover:underline dark:text-primary-light"
          >
            {isLogin ? 'Cadastre-se' : 'Faça Login'}
          </button>
        </p>
      </Card>
    </div>
  );
};

export default AuthPage;