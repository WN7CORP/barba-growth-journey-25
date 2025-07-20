
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 sm:p-12 text-center max-w-lg w-full animate-fade-in">
        {/* Ícone de Erro */}
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <div className="text-6xl sm:text-8xl">😵</div>
        </div>

        {/* Título Principal */}
        <h1 className="text-6xl sm:text-8xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent mb-4">
          404
        </h1>
        
        {/* Subtítulo */}
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
          Oops! Página não encontrada
        </h2>
        
        {/* Descrição */}
        <p className="text-gray-600 mb-8 text-lg leading-relaxed">
          A página que você está procurando não existe ou foi movida. 
          Que tal explorar nossos produtos incríveis?
        </p>

        {/* Rota Atual (para debug) */}
        <div className="bg-gray-100 rounded-lg p-3 mb-6 text-sm text-gray-500 font-mono">
          Rota tentada: <span className="font-semibold text-red-600">{location.pathname}</span>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="bg-white hover:bg-gray-50 text-gray-700 border-gray-300 hover:border-gray-400 transition-all duration-300 hover:scale-105 py-3 px-6 rounded-xl shadow-md"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar
          </Button>
          
          <Button
            onClick={() => navigate('/')}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Home className="w-5 h-5 mr-2" />
            Ir para Home
          </Button>
          
          <Button
            onClick={() => navigate('/explorar')}
            variant="outline"
            className="bg-white hover:bg-purple-50 text-purple-600 border-purple-300 hover:border-purple-400 transition-all duration-300 hover:scale-105 py-3 px-6 rounded-xl shadow-md"
          >
            <Search className="w-5 h-5 mr-2" />
            Explorar
          </Button>
        </div>

        {/* Sugestões */}
        <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
          <h3 className="font-semibold text-blue-800 mb-2">Sugestões:</h3>
          <div className="text-sm text-blue-700 space-y-1">
            <p>• Verifique se digitou o endereço corretamente</p>
            <p>• Explore nossa categoria de produtos</p>
            <p>• Use a busca para encontrar o que precisa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
