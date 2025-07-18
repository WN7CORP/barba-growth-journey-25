
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Brain, DollarSign, Target, User, Clock } from 'lucide-react';

interface AIQuestionnaireProps {
  onAnswersChange: (answers: QuestionnaireAnswers) => void;
}

export interface QuestionnaireAnswers {
  budget: string;
  category: string;
  purpose: string;
  priority: string;
  timeline: string;
  customNeed: string;
}

export const AIQuestionnaire = ({ onAnswersChange }: AIQuestionnaireProps) => {
  const [answers, setAnswers] = useState<QuestionnaireAnswers>({
    budget: '',
    category: '',
    purpose: '',
    priority: '',
    timeline: '',
    customNeed: ''
  });

  const updateAnswer = (key: keyof QuestionnaireAnswers, value: string) => {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);
    onAnswersChange(newAnswers);
  };

  const questions = [
    {
      id: 'budget',
      icon: DollarSign,
      title: 'Qual é o seu orçamento?',
      type: 'select',
      options: [
        { value: 'ate-50', label: 'Até R$ 50' },
        { value: '50-100', label: 'R$ 50 - R$ 100' },
        { value: '100-200', label: 'R$ 100 - R$ 200' },
        { value: '200-500', label: 'R$ 200 - R$ 500' },
        { value: 'acima-500', label: 'Acima de R$ 500' }
      ]
    },
    {
      id: 'purpose',
      icon: Target,
      title: 'Para que você vai usar?',
      type: 'select',
      options: [
        { value: 'uso-pessoal', label: 'Uso pessoal/diário' },
        { value: 'presente', label: 'Presente para alguém' },
        { value: 'trabalho', label: 'Trabalho/profissional' },
        { value: 'casa', label: 'Para casa/família' },
        { value: 'hobby', label: 'Hobby/lazer' }
      ]
    },
    {
      id: 'priority',
      icon: User,
      title: 'O que é mais importante?',
      type: 'select',
      options: [
        { value: 'preco', label: 'Melhor preço' },
        { value: 'qualidade', label: 'Melhor qualidade' },
        { value: 'marca', label: 'Marca conhecida' },
        { value: 'funcionalidade', label: 'Mais funcionalidades' },
        { value: 'design', label: 'Design/aparência' }
      ]
    },
    {
      id: 'timeline',
      icon: Clock,
      title: 'Quando você precisa?',
      type: 'select',
      options: [
        { value: 'urgente', label: 'Urgente (preciso logo)' },
        { value: 'semana', label: 'Nesta semana' },
        { value: 'mes', label: 'Neste mês' },
        { value: 'sem-pressa', label: 'Sem pressa' }
      ]
    }
  ];

  const completedAnswers = Object.values(answers).filter(answer => answer.trim() !== '').length;

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Brain className="w-6 h-6 text-purple-600" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">
          Conte-nos suas preferências
        </h3>
        <p className="text-white/80 text-sm">
          Quanto mais você nos contar, melhor será nossa recomendação
        </p>
        <div className="mt-3">
          <Badge variant="secondary" className="bg-white/20 text-white">
            {completedAnswers} de {questions.length + 1} respondidas
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        {questions.map((question) => {
          const IconComponent = question.icon;
          return (
            <Card key={question.id} className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-medium text-white text-sm">
                    {question.title}
                  </h4>
                </div>
                <Select 
                  value={answers[question.id as keyof QuestionnaireAnswers]} 
                  onValueChange={(value) => updateAnswer(question.id as keyof QuestionnaireAnswers, value)}
                >
                  <SelectTrigger className="bg-white/90 border-white/30 text-gray-900">
                    <SelectValue placeholder="Selecione uma opção..." />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-300">
                    {question.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          );
        })}

        {/* Campo customizado */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <h4 className="font-medium text-white text-sm">
                Algo específico que você procura?
              </h4>
            </div>
            <Input
              placeholder="Ex: que seja resistente à água, com boa bateria..."
              value={answers.customNeed}
              onChange={(e) => updateAnswer('customNeed', e.target.value)}
              className="bg-white/90 border-white/30 text-gray-900 placeholder:text-gray-500"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
