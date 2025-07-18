
import { Users, TrendingUp, Clock } from 'lucide-react';

export const StatsBar = () => {
  const stats = [
    { number: "15K+", label: "Transformações", icon: Users },
    { number: "95%", label: "Taxa de Sucesso", icon: TrendingUp },
    { number: "24/7", label: "Suporte Diário", icon: Clock }
  ];

  return (
    <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 backdrop-blur-sm rounded-2xl p-3 md:p-6 border border-blue-200/20">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <stat.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <div className="text-center sm:text-left">
              <div className="text-lg md:text-2xl font-bold text-blue-600 animate-pulse-slow">
                {stat.number}
              </div>
              <div className="text-xs md:text-sm text-gray-600 font-medium whitespace-nowrap">
                {stat.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
