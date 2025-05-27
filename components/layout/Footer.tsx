
import React from 'react';
import { Flame, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { APP_NAME, ROUTES, FOOTER_LINKS } from '../../constants'; // Updated to use FOOTER_LINKS
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const socialLinks = [
    { icon: Facebook, href: '#', name: 'Facebook' },
    { icon: Twitter, href: '#', name: 'Twitter' },
    { icon: Instagram, href: '#', name: 'Instagram' },
    { icon: Linkedin, href: '#', name: 'LinkedIn' },
  ];

  // FOOTER_LINKS now comes from constants.ts

  return (
    <footer className="bg-neutral-light dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
            <Link to={ROUTES.HOME} className="flex items-center space-x-2 text-2xl font-bold text-primary dark:text-primary-light">
                <Flame size={32} />
                <span>{APP_NAME}</span>
            </Link>
            <p className="text-neutral-DEFAULT dark:text-slate-400 text-sm">
              Transforme sua vida com o poder da inteligência artificial. Saúde e bem-estar personalizados para você.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-dark dark:text-slate-300 tracking-wider uppercase">Links Úteis</h3>
            <ul role="list" className="mt-4 space-y-2">
              {FOOTER_LINKS.map((link) => ( // Using FOOTER_LINKS from constants
                <li key={link.label}>
                  <Link to={link.path} className="text-base text-neutral-DEFAULT hover:text-primary dark:text-slate-400 dark:hover:text-primary-light transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social and Contact */}
          <div>
            <h3 className="text-sm font-semibold text-neutral-dark dark:text-slate-300 tracking-wider uppercase">Conecte-se</h3>
            <div className="mt-4 flex space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-neutral-DEFAULT hover:text-primary dark:text-slate-400 dark:hover:text-primary-light transition-colors"
                  aria-label={item.name}
                >
                  <item.icon className="h-6 w-6" />
                </a>
              ))}
            </div>
            <p className="mt-4 text-sm text-neutral-DEFAULT dark:text-slate-400">
                Email: contato@fitlife.ai (simulado)
            </p>
          </div>
        </div>
        
        <div className="mt-12 border-t border-slate-200 dark:border-slate-700 pt-8">
          <p className="text-base text-neutral-DEFAULT dark:text-slate-400 text-center">
            &copy; {new Date().getFullYear()} {APP_NAME}. Todos os direitos reservados. Uma plataforma de IA para seu bem-estar.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
