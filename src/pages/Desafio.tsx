
import { useState, useEffect } from 'react';
import { Calendar, Camera, Trophy, Target, TrendingUp, Award, Clock, CheckCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';
import { useDesafio90Dias } from '@/hooks/useDesafio90Dias';
import { PhotoUpload } from '@/components/PhotoUpload';
import { EvolutionCarousel } from '@/components/EvolutionCarousel';
import { useToast } from '@/hooks/use-toast';

const Desafio = () => {
  const { desafio, fotos, loading, iniciarDesafio, uploadFoto, marcarAplicacao } = useDesafio90Dias();
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-600">Carregando seu desafio...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!desafio) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Header />
        <div className="desktop-container py-16">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="animate-fade-in-scale">
              <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-gentle">
                <Trophy className="w-12 h-12 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Pronto para o <span className="text-blue-600">Desafio?</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Comece sua jornada de transformação hoje mesmo! 90 dias para uma barba épica.
              </p>
              <Button
                size="lg"
                onClick={iniciarDesafio}
                className="bg-blue-600 hover:bg-blue-700 text-white py-4 px-8 text-lg btn-primary-animated hover-glow"
              >
                <Trophy className="w-6 h-6 mr-2" />
                Iniciar Desafio 90 Dias
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const progressPercentage = (desafio.dia_atual / 90) * 100;
  
  const milestones = [
    {
      day: 30,
      title: "Primeiros Resultados",
      description: "Pelos começam a aparecer",
      completed: desafio.dia_atual >= 30
    },
    {
      day: 60,
      title: "Crescimento Visível",
      description: "Densidade aumenta significativamente",
      completed: desafio.dia_atual >= 60
    },
    {
      day: 90,
      title: "Transformação Completa",
      description: "Barba cheia conquistada!",
      completed: desafio.dia_atual >= 90
    }
  ];

  const handlePhotoUpload = async (file: File, observacoes?: string) => {
    try {
      await uploadFoto(file, desafio.dia_atual, observacoes);
      toast({
        title: "Foto enviada com sucesso!",
        description: `Foto do dia ${desafio.dia_atual} salva na sua galeria de evolução.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao enviar foto",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  };

  const handleMarcarAplicacao = async (periodo: 'manha' | 'noite') => {
    try {
      await marcarAplicacao(desafio.dia_atual, periodo);
      toast({
        title: "Aplicação registrada!",
        description: `Aplicação da ${periodo} do dia ${desafio.dia_atual} marcada como concluída.`,
      });
    } catch (error) {
      toast({
        title: "Erro ao registrar aplicação",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-20 md:pb-0 ${isVisible ? 'animate-slide-in-up' : 'opacity-0'}`}>
      <Header />
      
      <div className="desktop-container py-8">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in-scale">
          <h1 className="text-responsive-hero font-bold text-gray-900 mb-4">Desafio 90 Dias</h1>
          <p className="text-responsive-body text-gray-600 max-w-2xl mx-auto">
            Acompanhe sua jornada de transformação dia a dia e documente seu progresso
          </p>
        </div>

        <Tabs defaultValue="progresso" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-4 max-w-2xl mx-auto">
            <TabsTrigger value="progresso">Progresso</TabsTrigger>
            <TabsTrigger value="foto">Foto do Dia</TabsTrigger>
            <TabsTrigger value="evolucao">Evolução</TabsTrigger>
            <TabsTrigger value="dicas" className="hidden md:block">Dicas</TabsTrigger>
          </TabsList>

          <TabsContent value="progresso" className="space-y-8">
            {/* Progress Overview */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-6 h-6 text-yellow-600 animate-bounce-gentle" />
                  Seu Progresso
                </CardTitle>
                <CardDescription>
                  Dia {desafio.dia_atual} de 90 - Continue firme na jornada!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Progresso Geral</span>
                      <span className="text-sm text-gray-600">{Math.round(progressPercentage)}%</span>
                    </div>
                    <Progress value={progressPercentage} className="h-3 animate-pulse-slow" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-6 bg-blue-50 rounded-lg hover-lift">
                      <div className="text-3xl font-bold text-blue-600 animate-pulse-slow">{desafio.dia_atual}</div>
                      <div className="text-sm text-gray-600">Dias Completos</div>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-lg hover-lift">
                      <div className="text-3xl font-bold text-green-600 animate-pulse-slow">{90 - desafio.dia_atual}</div>
                      <div className="text-sm text-gray-600">Dias Restantes</div>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-lg hover-lift">
                      <div className="text-3xl font-bold text-purple-600 animate-pulse-slow">{Math.floor(desafio.dia_atual / 7)}</div>
                      <div className="text-sm text-gray-600">Semanas</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Milestones */}
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-6 h-6 text-green-600" />
                  Marcos da Jornada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {milestones.map((milestone, index) => (
                    <div 
                      key={index} 
                      className={`flex items-center gap-4 p-6 border rounded-lg transition-all hover-lift ${
                        milestone.completed ? 'bg-green-50 border-green-200' : 'bg-gray-50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        milestone.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {milestone.completed ? <Award className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">Dia {milestone.day}: {milestone.title}</h3>
                        <p className="text-sm text-gray-600">{milestone.description}</p>
                      </div>
                      <Badge variant={milestone.completed ? "default" : "secondary"}>
                        {milestone.completed ? "Conquistado" : "Em Progresso"}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Daily Action */}
            <Card className="hover-lift hover-glow">
              <CardHeader>
                <CardTitle>Ação do Dia {desafio.dia_atual}</CardTitle>
                <CardDescription>
                  Marque como concluído após aplicar o minoxidil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-6 bg-blue-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Aplicação Manhã</h3>
                    <p className="text-sm text-gray-600 mb-4">2ml de minoxidil</p>
                    <Button 
                      className="w-full bg-blue-600 hover:bg-blue-700 btn-primary-animated"
                      onClick={() => handleMarcarAplicacao('manha')}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar Manhã
                    </Button>
                  </div>
                  <div className="p-6 bg-indigo-50 rounded-lg">
                    <h3 className="font-semibold mb-2">Aplicação Noite</h3>
                    <p className="text-sm text-gray-600 mb-4">2ml de minoxidil</p>
                    <Button 
                      className="w-full bg-indigo-600 hover:bg-indigo-700 btn-primary-animated"
                      onClick={() => handleMarcarAplicacao('noite')}
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Marcar Noite
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="foto" className="space-y-8">
            <PhotoUpload 
              onUpload={handlePhotoUpload}
              dia={desafio.dia_atual}
            />
          </TabsContent>

          <TabsContent value="evolucao" className="space-y-8">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-6 h-6 text-blue-600" />
                  Sua Evolução
                </CardTitle>
                <CardDescription>
                  Veja como sua barba está evoluindo ao longo dos dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <EvolutionCarousel fotos={fotos} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dicas" className="space-y-8">
            <Card className="hover-lift">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                  Dica do Dia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    Consistência é a Chave - Dia {desafio.dia_atual}
                  </h3>
                  <p className="text-blue-800">
                    Aplicar o minoxidil na mesma hora todos os dias ajuda a criar o hábito. 
                    Configure lembretes no seu celular para não esquecer! Você está no dia {desafio.dia_atual} - continue assim!
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Desafio;
