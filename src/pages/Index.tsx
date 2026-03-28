/**
 * Página inicial - redireciona para o dashboard
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/admin');
  }, [navigate]);

  // Loading enquanto redireciona
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
        <p className="mt-4 text-muted-foreground">Carregando...</p>
      </div>
    </div>
  );
};

export default Index;
