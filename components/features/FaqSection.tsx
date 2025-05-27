
import React, { useState, useMemo } from 'react';
import { MOCK_FAQS } from '../../constants';
import Input from '../ui/Input';
import { ChevronDown, Search, MessageCircle } from 'lucide-react';
import { FaqItem as FaqItemType } from '../../types';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants';

interface FaqItemProps {
  item: FaqItemType;
  isOpen: boolean;
  onToggle: () => void;
}

const FaqItem: React.FC<FaqItemProps> = ({ item, isOpen, onToggle }) => (
  <div className="border-b border-slate-200 dark:border-slate-700">
    <button
      onClick={onToggle}
      className="flex justify-between items-center w-full py-5 text-left text-neutral-dark dark:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-md transition-colors"
      aria-expanded={isOpen}
    >
      <span className="font-medium">{item.question}</span>
      <ChevronDown
        size={20}
        className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
      />
    </button>
    {isOpen && (
      <div className="pb-5 px-2 text-neutral-DEFAULT dark:text-slate-300 animate-fade-in text-sm leading-relaxed">
        {item.answer}
      </div>
    )}
  </div>
);

const FaqSection: React.FC<{isPage?: boolean}> = ({ isPage = false }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaqs = useMemo(() => {
    if (!searchTerm) return MOCK_FAQS;
    return MOCK_FAQS.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  
  const faqsToDisplay = isPage ? filteredFaqs : filteredFaqs.slice(0, 5); // Show limited on homepage

  return (
    <section className={`py-16 md:py-24 ${isPage ? 'bg-white dark:bg-slate-900' : 'bg-white dark:bg-slate-900'}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-dark dark:text-white mb-4">
            Perguntas Frequentes
          </h2>
          <p className="text-lg text-neutral-DEFAULT dark:text-slate-300 max-w-2xl mx-auto">
            Encontre respostas rápidas para suas dúvidas sobre o FitLife.
          </p>
        </div>

        {isPage && (
          <div className="mb-8 max-w-xl mx-auto">
            <Input
              type="text"
              placeholder="Buscar por dúvida..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={18} className="text-slate-400" />}
            />
          </div>
        )}

        <div className="max-w-3xl mx-auto">
          {faqsToDisplay.length > 0 ? (
            faqsToDisplay.map((faq, index) => (
              <FaqItem
                key={faq.id}
                item={faq}
                isOpen={openIndex === index}
                onToggle={() => handleToggle(index)}
              />
            ))
          ) : (
            <p className="text-center text-neutral-DEFAULT dark:text-slate-300">Nenhuma pergunta encontrada com o termo "{searchTerm}".</p>
          )}
        </div>
        
        {!isPage && MOCK_FAQS.length > 5 && (
            <div className="text-center mt-12">
                <Link to={ROUTES.FAQ}>
                    <Button variant="primary">Ver todas as FAQs</Button>
                </Link>
            </div>
        )}

        {isPage && (
          <div className="mt-16 text-center p-8 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <MessageCircle size={40} className="text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-neutral-dark dark:text-white mb-2">Não encontrou sua resposta?</h3>
            <p className="text-neutral-DEFAULT dark:text-slate-300 mb-4">
              Nosso chatbot inteligente está pronto para ajudar com qualquer outra dúvida que você possa ter.
            </p>
            {/* This button would typically open a chat modal or redirect to a contact/chat page */}
            <Button variant="secondary" onClick={() => alert('Simulação: Abrindo chat com IA para dúvidas...')}>
              Perguntar ao Chatbot IA
            </Button>
          </div>
        )}

      </div>
    </section>
  );
};

export default FaqSection;
    