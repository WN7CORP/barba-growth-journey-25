
import { Clock, User, ArrowRight, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from '@/components/Header';
import { useState } from 'react';

const Blog = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const blogPosts = [
    {
      id: 1,
      title: "Como Aplicar Minoxidil Corretamente na Barba",
      excerpt: "Guia completo sobre a aplicação correta do minoxidil para maximizar os resultados na barba",
      category: "Dicas",
      author: "Dr. Barba",
      date: "2024-01-15",
      readTime: "5 min",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=250&fit=crop"
    },
    {
      id: 2,
      title: "Os 10 Erros Mais Comuns no Uso do Minoxidil",
      excerpt: "Evite estes erros para ter melhores resultados no crescimento da sua barba",
      category: "Cuidados",
      author: "Especialista Barba",
      date: "2024-01-10",
      readTime: "7 min",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=250&fit=crop"
    },
    {
      id: 3,
      title: "Alimentação para Crescimento da Barba",
      excerpt: "Descubra quais alimentos podem acelerar o crescimento natural dos pelos faciais",
      category: "Nutrição",
      author: "Nutricionista",
      date: "2024-01-05",
      readTime: "6 min",
      image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?w=400&h=250&fit=crop"
    },
    {
      id: 4,
      title: "Minoxidil 5% vs 10%: Qual Escolher?",
      excerpt: "Comparação detalhada entre as concentrações mais populares de minoxidil",
      category: "Produtos",
      author: "Dr. Barba",
      date: "2024-01-01",
      readTime: "8 min",
      image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=400&h=250&fit=crop"
    },
    {
      id: 5,
      title: "Rotina Completa de Cuidados com a Barba",
      excerpt: "Passo a passo para manter sua barba saudável e bem cuidada todos os dias",
      category: "Rotina",
      author: "Barbeiro Pro",
      date: "2023-12-28",
      readTime: "10 min",
      image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?w=400&h=250&fit=crop"
    },
    {
      id: 6,
      title: "Efeitos Colaterais do Minoxidil: O que Esperar",
      excerpt: "Informações importantes sobre possíveis efeitos colaterais e como lidar com eles",
      category: "Saúde",
      author: "Dr. Dermatologista",
      date: "2023-12-25",
      readTime: "9 min",
      image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=250&fit=crop"
    }
  ];

  const filteredPosts = blogPosts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categories = [...new Set(blogPosts.map(post => post.category))];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Blog Minha Barba</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Dicas especializadas, guias completos e tudo que você precisa saber sobre cuidados com a barba
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar artigos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge key={category} variant="outline" className="cursor-pointer hover:bg-amber-50">
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Featured Post */}
        <Card className="mb-12 overflow-hidden hover:shadow-lg transition-shadow">
          <div className="md:flex">
            <div className="md:w-1/2">
              <img 
                src={filteredPosts[0]?.image} 
                alt={filteredPosts[0]?.title}
                className="w-full h-64 md:h-full object-cover"
              />
            </div>
            <div className="md:w-1/2 p-8">
              <Badge className="mb-4 bg-amber-100 text-amber-800">Destaque</Badge>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">{filteredPosts[0]?.title}</h2>
              <p className="text-gray-600 mb-6">{filteredPosts[0]?.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {filteredPosts[0]?.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {filteredPosts[0]?.readTime}
                  </div>
                </div>
                <Button className="bg-amber-600 hover:bg-amber-700">
                  Ler Artigo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.slice(1).map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="secondary">{post.category}</Badge>
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                </div>
                <CardTitle className="line-clamp-2 hover:text-amber-600 transition-colors">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    {post.author}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(post.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Section */}
        <Card className="mt-16 bg-gradient-to-r from-amber-600 to-orange-600 text-white">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Receba Dicas Semanais</h3>
            <p className="mb-6 opacity-90">
              Inscreva-se em nossa newsletter e receba as melhores dicas sobre cuidados com a barba
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Seu e-mail"
                className="flex-1 bg-white text-gray-900"
              />
              <Button className="bg-white text-amber-600 hover:bg-gray-100">
                Inscrever-se
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Blog;
