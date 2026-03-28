/**
 * Página inicial - redireciona para produção
 */

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/loja', { replace: true });
  }, [navigate]);

  return null;
};

export default Index;
