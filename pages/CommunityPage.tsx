
import React, { useState, useContext } from 'react';
import PageWrapper from '../components/layout/PageWrapper';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { Users, MessageSquare, Search, Award, ThumbsUp, MessageCircle as CommentIcon, Send, Sparkles, ShieldPlus } from 'lucide-react';
import { MOCK_COMMUNITY_CHALLENGES, MOCK_COMMUNITY_POSTS } from '../constants';
import { CommunityPost, CommunityChallenge } from '../types';
import { AuthContext, AuthContextType } from '../contexts/AuthContext';
import { useToasts, ToastType } from '../components/ui/Toast';
import { generateCommunityPostOrChallenge } from '../services/geminiService';
import LoadingSpinner from '../components/ui/LoadingSpinner';


interface DisplayPost extends CommunityPost {
  localLikes: number;
  localComments: number;
}
interface DisplayChallenge extends CommunityChallenge {
    // Potentially add local interaction state for challenges if needed
}


const CommunityPage: React.FC = () => {
  const { user } = useContext(AuthContext) as AuthContextType;
  const { addToast } = useToasts();
  const [newPostContent, setNewPostContent] = useState('');
  const [isLoadingAiContent, setIsLoadingAiContent] = useState(false);
  
  const [posts, setPosts] = useState<DisplayPost[]>(() => 
    MOCK_COMMUNITY_POSTS.map(post => ({
      ...post,
      localLikes: post.likes,
      localComments: post.comments,
    }))
  );
  const [challenges, setChallenges] = useState<DisplayChallenge[]>(MOCK_COMMUNITY_CHALLENGES);


  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) {
      addToast("O conteúdo do post não pode estar vazio.", ToastType.Warning);
      return;
    }
    if (!user) {
      addToast("Você precisa estar logado para postar.", ToastType.Error);
      return;
    }

    const newPost: DisplayPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      author: user.name,
      avatarUrl: user.avatarUrl || `https://picsum.photos/seed/${user.name.replace(/\s+/g, '')}/40/40`,
      content: newPostContent,
      timestamp: new Date(),
      likes: 0,
      comments: 0,
      localLikes: 0,
      localComments: 0,
    };

    setPosts(prevPosts => [newPost, ...prevPosts]);
    setNewPostContent('');
    addToast("Post publicado na comunidade!", ToastType.Success);
  };

  const handleGenerateAiPost = async () => {
    if (!user) {
      addToast("Você precisa estar logado para que a IA gere um post.", ToastType.Error);
      return;
    }
    setIsLoadingAiContent(true);
    const aiContent = await generateCommunityPostOrChallenge('post');
    if (aiContent) {
        const aiPost: DisplayPost = {
            id: `aipost-${Date.now()}`,
            author: "FitLife AI",
            avatarUrl: '/vite.svg', // Default AI avatar
            content: aiContent,
            timestamp: new Date(),
            likes: Math.floor(Math.random() * 50), // Random initial engagement
            comments: Math.floor(Math.random() * 10),
            localLikes: 0, // User hasn't liked it yet
            localComments: 0,
        };
        setPosts(prevPosts => [aiPost, ...prevPosts]);
        addToast("Post gerado pela IA adicionado ao feed!", ToastType.Info);
    } else {
        addToast("Não foi possível gerar o post com IA. Tente novamente.", ToastType.Error);
    }
    setIsLoadingAiContent(false);
  };

  const handleGenerateAiChallenge = async () => {
     if (!user) {
      addToast("Você precisa estar logado para que a IA gere um desafio.", ToastType.Error);
      return;
    }
    setIsLoadingAiContent(true);
    const aiChallengeContent = await generateCommunityPostOrChallenge('challenge');
    // Example parsing (very basic, assumes "Title: Description" format from AI)
    let title = "Novo Desafio IA";
    let description = aiChallengeContent || "Complete uma atividade surpresa hoje!";
    if (aiChallengeContent && aiChallengeContent.includes(':')) {
        [title, description] = aiChallengeContent.split(':', 2);
    }

    if (aiChallengeContent) {
        const newChallenge: DisplayChallenge = {
            id: `aichallenge-${Date.now()}`,
            title: title.trim(),
            description: description.trim(),
            generatedBy: "AI",
            durationDays: 7, // Default or parse from AI
            rewardPoints: Math.floor(Math.random() * 50) + 50, // Random points
        };
        setChallenges(prevChallenges => [newChallenge, ...prevChallenges]);
        addToast("Novo desafio gerado pela IA!", ToastType.Info);
    } else {
        addToast("Não foi possível gerar o desafio com IA. Tente novamente.", ToastType.Error);
    }
    setIsLoadingAiContent(false);
  }


  const handleLike = (postId: string) => {
    if (!user) { addToast("Faça login para curtir.", ToastType.Warning); return; }
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId ? { ...post, localLikes: post.localLikes + 1 } : post
    ));
  };

  const handleComment = (postId: string) => {
    if (!user) { addToast("Faça login para comentar.", ToastType.Warning); return; }
    setPosts(prevPosts => prevPosts.map(post => 
      post.id === postId ? { ...post, localComments: post.localComments + 1 } : post
    ));
    addToast("Comentário adicionado (simulação)!", ToastType.Info);
  };


  return (
    <PageWrapper title="Comunidade FitLife IA">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Feed Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-neutral-dark dark:text-white mb-4 flex items-center">
              <MessageSquare size={22} className="mr-2 text-primary" /> Crie uma Publicação
            </h2>
            <form onSubmit={handleCreatePost} className="mb-6">
              <Input
                placeholder={user ? `No que você está pensando, ${user.name}?` : "Compartilhe suas conquistas, dúvidas ou dicas..."}
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-[60px]"
                disabled={!user}
              />
              <div className="flex flex-wrap gap-2 mt-3">
                <Button type="submit" variant="primary" leftIcon={Send} disabled={!user || !newPostContent.trim()}>
                    Publicar
                </Button>
                <Button type="button" variant="outline" leftIcon={Sparkles} onClick={handleGenerateAiPost} disabled={!user || isLoadingAiContent}>
                    {isLoadingAiContent && posts.length % 2 === 0 ? <LoadingSpinner size="sm"/> : "Gerar Post com IA"}
                </Button>
              </div>
              {!user && <p className="text-xs text-red-500 mt-1">Você precisa estar logado para publicar ou usar a IA.</p>}
            </form>
            
            <h3 className="text-lg font-semibold text-neutral-dark dark:text-white mb-3 pt-4 border-t border-slate-200 dark:border-slate-700">Feed da Comunidade</h3>
            {posts.length > 0 ? (
              <div className="space-y-4 max-h-[1000px] overflow-y-auto pr-2">
                {posts.map(post => (
                  <Card key={post.id} className="bg-slate-50 dark:bg-slate-800/70">
                    <div className="flex items-start space-x-3">
                      <img src={post.avatarUrl || 'https://picsum.photos/seed/defaultuser/40/40'} alt={post.author} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                      <div>
                        <p className="font-semibold text-neutral-dark dark:text-white">{post.author}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">{new Date(post.timestamp).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</p>
                        <p className="text-sm text-neutral-DEFAULT dark:text-slate-300 whitespace-pre-line">{post.content}</p>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center space-x-2">
                      <Button variant="ghost" size="sm" leftIcon={ThumbsUp} onClick={() => handleLike(post.id)} disabled={!user}>
                        Curtir ({post.localLikes + post.likes - MOCK_COMMUNITY_POSTS.find(p=>p.id === post.id)?.likes || post.localLikes}) {/* Show combined likes if it was a mock post initially */}
                      </Button>
                      <Button variant="ghost" size="sm" leftIcon={CommentIcon} onClick={() => handleComment(post.id)} disabled={!user}>
                        Comentar ({post.localComments + post.comments - MOCK_COMMUNITY_POSTS.find(p=>p.id === post.id)?.comments || post.localComments})
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-center text-slate-500 dark:text-slate-400 py-4">Ainda não há posts na comunidade. Seja o primeiro!</p>
            )}
          </Card>
        </div>

        {/* Sidebar Section */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h2 className="text-xl font-semibold text-neutral-dark dark:text-white mb-4 flex items-center">
              <Search size={22} className="mr-2 text-primary" /> Encontrar Amigos IA
            </h2>
            <Input placeholder="Buscar membros..." disabled={!user} />
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
              Nossa IA (simulada) ajuda você a encontrar parceiros de treino com objetivos similares.
            </p>
          </Card>

          <Card>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-neutral-dark dark:text-white flex items-center">
                <Award size={22} className="mr-2 text-accent" /> Desafios (IA)
                </h2>
                <Button variant="ghost" size="icon" onClick={handleGenerateAiChallenge} disabled={!user || isLoadingAiContent} aria-label="Gerar novo desafio com IA">
                    {isLoadingAiContent && challenges.length % 2 !== 0 ? <LoadingSpinner size="sm"/> : <ShieldPlus size={20} className="text-accent"/>}
                </Button>
            </div>
            {challenges.length > 0 ? (
              <ul className="space-y-3 max-h-80 overflow-y-auto pr-1">
                {challenges.map(challenge => (
                  <li key={challenge.id} className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md">
                    <h4 className="font-medium text-neutral-dark dark:text-white">{challenge.title} {challenge.generatedBy === "AI" && <Sparkles size={14} className="inline text-accent ml-1" aria-label="Gerado por IA"/>}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Duração: {challenge.durationDays} dias. Recompensa: {challenge.rewardPoints || 'Prestígio'} pts.</p>
                    <p className="text-xs text-slate-600 dark:text-slate-300">{challenge.description}</p>
                    <Button variant="outline" size="sm" className="mt-2 text-accent border-accent hover:bg-accent/10" disabled={!user}>Participar</Button>
                  </li>
                ))}
              </ul>
            ) : (
               <p className="text-sm text-slate-500 dark:text-slate-400">Nenhum desafio ativo no momento.</p>
            )}
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
            <Button variant="ghost" size="sm" className="mt-3" disabled={!user}>Ver todos os grupos</Button>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
};

export default CommunityPage;
