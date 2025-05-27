
import React, { useState } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Gift, DollarSign, Users, BarChart2, Copy } from 'lucide-react';

const AffiliatePage: React.FC = () => {
  const affiliateCode = "FITLIFEAI123"; // Simulated
  const [commissionRate] = useState(10); // 10%
  const [referrals, setReferrals] = useState(15); // Simulated
  const [earnings, setEarnings] = useState(75.50); // Simulated
  const [potentialEarnings, setPotentialEarnings] = useState(0);
  const [potentialReferrals, setPotentialReferrals] = useState(10);

  const calculatePotential = () => {
    // Simplified calculation: assume average subscription is R$99
    const avgSubscription = 99;
    setPotentialEarnings((potentialReferrals * avgSubscription * (commissionRate / 100)));
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(affiliateCode)
      .then(() => alert(`Código "${affiliateCode}" copiado para a área de transferência!`))
      .catch(err => console.error('Erro ao copiar:', err));
  };

  return (
    <PageWrapper title="Programa de Afiliados FitLife">
      <p className="text-lg text-neutral-DEFAULT dark:text-slate-300 mb-10 text-center max-w-3xl mx-auto">
        Ganhe comissões incríveis indicando o FitLife para seus amigos, seguidores e clientes! Ajude a transformar vidas e seja recompensado por isso.
      </p>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <Card className="text-center">
          <DollarSign size={40} className="mx-auto mb-3 text-primary" />
          <h3 className="text-2xl font-bold text-neutral-dark dark:text-white">{commissionRate}% de Comissão</h3>
          <p className="text-sm text-neutral-DEFAULT dark:text-slate-400">Recorrente em todas as assinaturas.</p>
        </Card>
        <Card className="text-center">
          <Users size={40} className="mx-auto mb-3 text-secondary" />
          <h3 className="text-2xl font-bold text-neutral-dark dark:text-white">{referrals} Indicações Ativas</h3>
          <p className="text-sm text-neutral-DEFAULT dark:text-slate-400">Seus amigos que já usam FitLife.</p>
        </Card>
        <Card className="text-center">
          <BarChart2 size={40} className="mx-auto mb-3 text-accent" />
          <h3 className="text-2xl font-bold text-neutral-dark dark:text-white">R${earnings.toFixed(2)} Ganhos Totais</h3>
          <p className="text-sm text-neutral-DEFAULT dark:text-slate-400">Seu saldo atual (simulado).</p>
        </Card>
      </div>

      <Card className="mb-10">
        <h2 className="text-xl font-semibold text-neutral-dark dark:text-white mb-4">Seu Código de Indicação Exclusivo</h2>
        <div className="flex flex-col sm:flex-row items-center gap-3 p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
          <Input 
            value={affiliateCode} 
            readOnly 
            className="text-lg font-mono flex-grow !bg-white dark:!bg-slate-700"
          />
          <Button onClick={copyToClipboard} leftIcon={Copy} variant="secondary">Copiar Código</Button>
        </div>
        <p className="text-sm text-neutral-DEFAULT dark:text-slate-400 mt-2">Compartilhe este código com sua audiência. Quando alguém assinar usando seu código, você ganha!</p>
      </Card>

      <Card className="mb-10">
        <h2 className="text-xl font-semibold text-neutral-dark dark:text-white mb-4">Calculadora de Ganhos Potenciais</h2>
        <div className="grid sm:grid-cols-2 gap-4 items-end">
          <Input 
            label="Número de Indicações Estimadas"
            type="number"
            value={potentialReferrals}
            onChange={(e) => setPotentialReferrals(parseInt(e.target.value))}
            min="0"
          />
          <Button onClick={calculatePotential} className="h-fit">Calcular Ganhos</Button>
        </div>
        {potentialEarnings > 0 && (
          <p className="mt-4 text-lg font-semibold text-green-600 dark:text-green-400">
            Com {potentialReferrals} indicações, você poderia ganhar aproximadamente R${potentialEarnings.toFixed(2)}!
          </p>
        )}
      </Card>
      
      <Card>
        <h2 className="text-xl font-semibold text-neutral-dark dark:text-white mb-4">Recursos para Afiliados (Simulado)</h2>
        <ul className="list-disc list-inside space-y-2 text-neutral-DEFAULT dark:text-slate-300">
            <li>Banners promocionais e logos do FitLife</li>
            <li>Modelos de email marketing</li>
            <li>Links diretos para páginas de planos</li>
            <li>Dicas para promover o FitLife efetivamente</li>
            <li>Dashboard detalhado de performance (em breve)</li>
        </ul>
        <Button variant="outline" className="mt-6" onClick={() => alert("Simulação: Acessando materiais de marketing.")}>Acessar Materiais</Button>
      </Card>

      <div className="mt-12 text-center">
        <Gift size={48} className="mx-auto mb-4 text-primary"/>
        <h2 className="text-2xl font-bold text-neutral-dark dark:text-white mb-3">Pronto para Começar a Ganhar?</h2>
        <p className="text-neutral-DEFAULT dark:text-slate-300 mb-6">Junte-se ao nosso programa de afiliados hoje mesmo. (Simulação)</p>
        <Button variant="primary" size="lg">Quero ser Afiliado</Button>
      </div>

    </PageWrapper>
  );
};

export default AffiliatePage;
