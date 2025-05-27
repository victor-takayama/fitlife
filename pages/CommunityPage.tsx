
import React from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Users, MessageSquare, Search, Award, ThumbsUp, MessageCircle as CommentIcon } from 'lucide-react';
import { MOCK_COMMUNITY_CHALLENGES, MOCK_COMMUNITY_POSTS } from '../constants';

const CommunityPage: React.FC = () => {
  // Placeholder state for new post
  const [newPostContent, setNewPostContent] = React.useState('');

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;
    alert(`Simulação: Novo post criado: "${newPostContent}"`);
    setNewPostContent('');
    // In a real app, add to a list of posts and potentially send to backend
  };


  return (
    <PageWrapper title="Comunidade FitLife IA">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Feed Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-neutral-dark dark:text-white mb-4 flex items-center">
              <MessageSquare size={22} className="mr-2 text-primary" /> Feed da Comunidade
            </h2>
            <form onSubmit={handleCreatePost} className="mb-6">
              {/* Fix: Removed 'textarea' prop as it's not supported by the Input component.
                  To make it appear taller, className="min-h-[80px]" is used, but it remains a single-line input.
                  A proper multi-line textarea would require a different component or modification to Input.tsx. */}
              <Input
                placeholder="Compartilhe suas conquistas, dúvidas ou dicas..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-[80px]"
              />
              <Button type="submit" variant="primary" className="mt-2">Publicar</Button>
            </form>
            
            {/* Simulated Posts */}
            <div className="space-y-4">
              {MOCK_COMMUNITY_POSTS.map(post => (
                <Card key={post.id} className="bg-slate-50 dark:bg-slate-800/70">
                  <div className="flex items-start space-x-3">
                    <img src={post.avatarUrl || 'https://picsum.photos/seed/defaultuser/40/40'} alt={post.author} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <p className="font-semibold text-neutral-dark dark:text-white">{post.author}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{new Date(post.timestamp).toLocaleString('pt-BR')}</p>
                      <p className="text-sm text-neutral-DEFAULT dark:text-slate-300 whitespace-pre-line">{post.content}</p>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center space-x-4">
                    <Button variant="ghost" size="sm" leftIcon={ThumbsUp}>Curtir ({post.likes})</Button>
                    <Button variant="ghost" size="sm" leftIcon={CommentIcon}>Comentar ({post.comments})</Button>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-neutral-dark dark:text-white mb-4 flex items-center">
              <Search size={22} className="mr-2 text-primary" /> Encontrar Amigos IA
            </h2>
            <Input placeholder="Buscar membros..." />
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Nossa IA (simulada) ajuda você a encontrar parceiros de treino com objetivos similares.
            </p>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-neutral-dark dark:text-white mb-4 flex items-center">
              <Award size={22} className="mr-2 text-accent" /> Desafios da Semana (IA)
            </h2>
            <ul className="space-y-3">
              {MOCK_COMMUNITY_CHALLENGES.map(challenge => (
                <li key={challenge.id} className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md">
                  <h4 className="font-medium text-neutral-dark dark:text-white">{challenge.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{challenge.description}</p>
                  <Button variant="outline" size="sm" className="mt-2 text-accent border-accent hover:bg-accent/10">Participar</Button>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="text-xl font-semibold text-neutral-dark dark:text-white mb-4 flex items-center">
              <Users size={22} className="mr-2 text-primary" /> Grupos de Interesse (IA)
            </h2>
            <ul className="text-sm text-slate-500 dark:text-slate-400 space-y-1">
              <li>🏋️ Amantes de Levantamento de Peso</li>
              <li>🧘 Yoga e Meditação</li>
              <li>🏃‍♂️ Corredores Matinais</li>
              <li>🥗 Nutrição Saudável e Receitas Fit</li>
            </ul>
            <Button variant="ghost" size="sm" className="mt-3">Ver todos os grupos</Button>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CommunityPage;
