
// Esta página foi removida - funcionalidade de vídeo não mais necessária
// Redirecionando para página inicial
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Explorar = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/', { replace: true });
  }, [navigate]);

  return null;
};

export default Explorar;
