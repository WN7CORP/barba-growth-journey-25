
import { User, Heart, Eye, ShoppingCart, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import { useFavorites } from '@/hooks/useFavorites';

const Perfil = () => {
  const { favoritesCount } = useFavorites();

  const stats = [
    {
      title: 'Produtos Favoritos',
      value: favoritesCount,
      icon: Heart,
      color: 'text-red-500',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Produtos Visualizados',
      value: '156',
      icon: Eye,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Links Acessados',
      value: '23',
      icon: ShoppingCart,
      color: 'text-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Sessões de Uso',
      value: '47',
      icon: TrendingUp,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50'
    }
  ];

  const achievements = [
    { name: 'Primeiro Favorito', description: 'Favoritou seu primeiro produto', unlocked: favoritesCount > 0 },
    { name: 'Colecionador', description: 'Possui 10+ produtos favoritos', unlocked: favoritesCount >= 10 },
    { name: 'Super Colecionador', description: 'Possui 25+ produtos favoritos', unlocked: favoritesCount >= 25 },
    { name: 'Explorador', description: 'Visitou todas as categorias', unlocked: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-500 to-pink-500">
      <Header />
      
      <section className="px-4 md:px-6 py-8 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-bounce-gentle shadow-2xl backdrop-blur-sm">
              <User className="w-10 h-10 md:w-12 md:h-12 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Meu Perfil
            </h1>
            <p className="text-lg text-white/80">
              Acompanhe suas estatísticas e conquistas
            </p>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/95 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center mx-auto mb-3`}>
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.title}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Conquistas */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg mb-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                🏆 Conquistas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                      achievement.unlocked 
                        ? 'bg-gradient-to-r from-green-50 to-green-100 border-green-200' 
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${achievement.unlocked ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                      <div>
                        <h3 className={`font-semibold ${achievement.unlocked ? 'text-green-700' : 'text-gray-600'}`}>
                          {achievement.name}
                        </h3>
                        <p className={`text-sm ${achievement.unlocked ? 'text-green-600' : 'text-gray-500'}`}>
                          {achievement.description}
                        </p>
                      </div>
                      {achievement.unlocked && (
                        <Badge className="ml-auto bg-green-500 text-white">
                          Desbloqueado
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Categorias Favoritas */}
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">
                📊 Suas Categorias Favoritas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                  <span className="font-medium text-gray-700">Eletrônicos</span>
                  <Badge variant="secondary">15 produtos</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="font-medium text-gray-700">Casa & Jardim</span>
                  <Badge variant="secondary">8 produtos</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="font-medium text-gray-700">Moda</span>
                  <Badge variant="secondary">5 produtos</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Perfil;
