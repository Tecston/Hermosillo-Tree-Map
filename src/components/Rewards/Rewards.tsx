// src/components/Rewards/Rewards.tsx
import React from "react";
import { useAppContext } from "../../context/AppContext";
import { Trophy, Star, Gift, ChevronRight } from "lucide-react";

const Rewards: React.FC = () => {
  const { currentUser } = useAppContext();

  // Calculate level and progress
  const level = Math.floor(currentUser.points / 100) + 1;
  const progress = currentUser.points % 100;
  const nextLevelPoints = level * 100 - currentUser.points;

  const rewards = [
    {
      id: 1,
      name: "Cupón de transporte",
      points: 100,
      icon: <Gift className="w-6 h-6" />,
      description: "Válido para un viaje en transporte público",
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: 2,
      name: "Entrada a evento cultural",
      points: 200,
      icon: <Star className="w-6 h-6" />,
      description: "Acceso a eventos culturales de la ciudad",
      color: "bg-purple-100 text-purple-600",
    },
    {
      id: 3,
      name: "Donación a ONG",
      points: 300,
      icon: <Trophy className="w-6 h-6" />,
      description: "Tu contribución será donada a una ONG local",
      color: "bg-green-100 text-green-600",
    },
  ];

  return (
    <div className="min-h-full w-full bg-white border border-gray-6 p-2 rounded flex flex-col md:items-center md:justify-center">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* User Profile Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                {currentUser.name}
              </h2>
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium">
                  Nivel {level}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  {currentUser.points} puntos acumulados
                </span>
              </div>
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-md">
              <Trophy className="w-8 h-8 text-white" />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progreso al siguiente nivel</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-500">
              {nextLevelPoints} puntos para alcanzar el nivel {level + 1}
            </p>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rewards.map((reward) => (
            <div
              key={reward.id}
              className={`group relative bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-blue-100 transition-all duration-300 cursor-pointer ${
                currentUser.points >= reward.points
                  ? "hover:shadow-md"
                  : "opacity-50"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`${reward.color} p-3 rounded-lg`}>
                  {reward.icon}
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {reward.points} pts
                </span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {reward.name}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{reward.description}</p>
              <div className="flex items-center text-blue-600 text-sm group-hover:translate-x-1 transition-transform duration-300">
                <span>Canjear recompensa</span>
                <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </div>
          ))}
        </div>

        {/* Achievement Stats */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Logros</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {currentUser.points}
              </div>
              <div className="text-sm text-gray-600">Puntos Totales</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {level}
              </div>
              <div className="text-sm text-gray-600">Nivel Actual</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {Math.floor(currentUser.points / 100)}
              </div>
              <div className="text-sm text-gray-600">Recompensas Canjeadas</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {nextLevelPoints}
              </div>
              <div className="text-sm text-gray-600">Puntos Restantes</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards;
