
import { useState } from 'react';
import { Calendar, Clock, Bell, Smartphone, CheckCircle, Plus, Settings, Link as LinkIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Header from '@/components/Header';

const Lembrete = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [morningTime, setMorningTime] = useState('08:00');
  const [eveningTime, setEveningTime] = useState('20:00');
  const [notifications, setNotifications] = useState(true);

  const reminders = [
    { id: 1, time: '08:00', type: 'Manhã', status: 'completed', message: 'Aplicar minoxidil - manhã' },
    { id: 2, time: '20:00', type: 'Noite', status: 'pending', message: 'Aplicar minoxidil - noite' },
  ];

  const calendarFeatures = [
    "Lembretes automáticos no Google Calendar",
    "Notificações no celular",
    "Histórico de aplicações",
    "Estatísticas de consistência",
    "Sincronização em todos os dispositivos"
  ];

  const handleConnectCalendar = () => {
    // Em uma implementação real, aqui seria feita a integração com Google Calendar API
    setIsConnected(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Lembrete Minoxidil</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Nunca mais esqueça de aplicar o minoxidil. Configure lembretes automáticos integrados ao Google Calendar
          </p>
        </div>

        <Tabs defaultValue="configurar" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="configurar">Configurar</TabsTrigger>
            <TabsTrigger value="lembretes">Meus Lembretes</TabsTrigger>
            <TabsTrigger value="estatisticas">Estatísticas</TabsTrigger>
          </TabsList>

          <TabsContent value="configurar" className="space-y-8">
            {/* Calendar Integration */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-6 h-6 text-green-600" />
                  Integração Google Calendar
                </CardTitle>
                <CardDescription>
                  Conecte sua conta do Google para criar lembretes automáticos
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!isConnected ? (
                  <div className="text-center space-y-6">
                    <div className="max-w-md mx-auto">
                      <div className="bg-white p-8 rounded-lg shadow-lg border">
                        <Calendar className="w-16 h-16 mx-auto text-green-600 mb-4" />
                        <h3 className="text-xl font-semibold mb-4">Conectar ao Google Calendar</h3>
                        <p className="text-gray-600 mb-6">
                          Permita que criemos eventos automáticos no seu calendário para lembrar das aplicações de minoxidil
                        </p>
                        <Button 
                          onClick={handleConnectCalendar}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <LinkIcon className="w-4 h-4 mr-2" />
                          Conectar Google Calendar
                        </Button>
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {calendarFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 p-3 bg-white rounded-lg shadow-sm">
                          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <div>
                          <h3 className="font-semibold text-green-800">Calendário Conectado</h3>
                          <p className="text-sm text-green-600">Lembretes automáticos ativados</p>
                        </div>
                      </div>
                      <Badge className="bg-green-600">Ativo</Badge>
                    </div>

                    {/* Time Settings */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Horário da Manhã</CardTitle>
                          <CardDescription>Defina o horário para aplicação matinal</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <Select value={morningTime} onValueChange={setMorningTime}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 12 }, (_, i) => {
                                  const hour = (i + 6).toString().padStart(2, '0');
                                  return (
                                    <SelectItem key={hour} value={`${hour}:00`}>
                                      {hour}:00
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={notifications}
                                onCheckedChange={setNotifications}
                              />
                              <span className="text-sm">Notificação push</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Horário da Noite</CardTitle>
                          <CardDescription>Defina o horário para aplicação noturna</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <Select value={eveningTime} onValueChange={setEveningTime}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: 6 }, (_, i) => {
                                  const hour = (i + 18).toString().padStart(2, '0');
                                  return (
                                    <SelectItem key={hour} value={`${hour}:00`}>
                                      {hour}:00
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={notifications}
                                onCheckedChange={setNotifications}
                              />
                              <span className="text-sm">Notificação push</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Settings className="w-4 h-4 mr-2" />
                      Salvar Configurações
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Setup */}
            <Card>
              <CardHeader>
                <CardTitle>Configuração Rápida</CardTitle>
                <CardDescription>
                  Presets populares para começar rapidamente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold mb-2">Rotina Padrão</h3>
                    <p className="text-sm text-gray-600 mb-3">8h da manhã e 8h da noite</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Usar Preset
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold mb-2">Trabalhador</h3>
                    <p className="text-sm text-gray-600 mb-3">7h da manhã e 9h da noite</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Usar Preset
                    </Button>
                  </div>
                  <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <h3 className="font-semibold mb-2">Personalizado</h3>
                    <p className="text-sm text-gray-600 mb-3">Defina seus próprios horários</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Configurar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lembretes" className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-6 h-6 text-blue-600" />
                  Lembretes de Hoje
                </CardTitle>
                <CardDescription>
                  Seus lembretes programados para hoje
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {reminders.map((reminder) => (
                    <div 
                      key={reminder.id} 
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        reminder.status === 'completed' 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-orange-50 border-orange-200'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          reminder.status === 'completed' 
                            ? 'bg-green-100 text-green-600' 
                            : 'bg-orange-100 text-orange-600'
                        }`}>
                          {reminder.status === 'completed' ? (
                            <CheckCircle className="w-6 h-6" />
                          ) : (
                            <Clock className="w-6 h-6" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold">{reminder.message}</h3>
                          <p className="text-sm text-gray-600">{reminder.time} - {reminder.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={reminder.status === 'completed' ? 'default' : 'secondary'}>
                          {reminder.status === 'completed' ? 'Concluído' : 'Pendente'}
                        </Badge>
                        {reminder.status === 'pending' && (
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Marcar Feito
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Próximos Lembretes</CardTitle>
                <CardDescription>
                  Lembretes programados para os próximos dias
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Amanhã', 'Quinta-feira', 'Sexta-feira'].map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{day}</div>
                        <div className="text-sm text-gray-600">2 lembretes programados</div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {morningTime} e {eveningTime}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="estatisticas" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                  <div className="text-sm text-gray-600">Taxa de Consistência</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">28</div>
                  <div className="text-sm text-gray-600">Dias Consecutivos</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-purple-600 mb-2">56</div>
                  <div className="text-sm text-gray-600">Aplicações Feitas</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-orange-600 mb-2">3</div>
                  <div className="text-sm text-gray-600">Aplicações Perdidas</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Histórico Semanal</CardTitle>
                <CardDescription>
                  Sua consistência nas últimas semanas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { week: 'Esta semana', completed: 12, total: 14, percentage: 86 },
                    { week: 'Semana passada', completed: 14, total: 14, percentage: 100 },
                    { week: '2 semanas atrás', completed: 13, total: 14, percentage: 93 },
                    { week: '3 semanas atrás', completed: 11, total: 14, percentage: 79 }
                  ].map((week, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{week.week}</span>
                        <span>{week.completed}/{week.total} aplicações</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${week.percentage}%` }}
                        />
                      </div>
                      <div className="text-right text-xs text-gray-500">
                        {week.percentage}% consistência
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Lembrete;
