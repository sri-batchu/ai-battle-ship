import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ShipWheel, Anchor, Target, Grid3x3, Trophy, Crosshair } from "lucide-react";

export const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 via-blue-100 to-blue-200 p-6">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <ShipWheel className="w-20 h-20 text-white animate-spin-slow" style={{ animationDuration: '20s' }} />
              <Anchor className="w-10 h-10 text-blue-200 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-3">AI Battleship</h1>
          <p className="text-xl text-blue-100">
            Classic Naval Combat Game
          </p>
        </div>

        <div className="p-8 space-y-8">
          {/* Game Description */}
          <div className="text-center space-y-4">
            <p className="text-lg text-gray-700 leading-relaxed">
              Test your strategic skills in this classic naval combat game against an AI opponent.
              Place your ships wisely and be the first to sink the entire enemy fleet!
            </p>
            <Button
              size="lg"
              className="text-lg px-8 py-6 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl font-bold"
              onClick={() => navigate('/game')}
            >
              <Crosshair className="w-5 h-5 mr-2" />
              Start New Game
            </Button>
          </div>

          {/* How to Play Section */}
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Grid3x3 className="w-6 h-6 text-blue-600" />
              How to Play
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Place Your Ships</h3>
                  <p className="text-gray-700 text-sm">Position 5 ships on your board horizontally or vertically. Use the orientation toggle or random placement.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Take Turns Attacking</h3>
                  <p className="text-gray-700 text-sm">Click cells on the enemy grid to launch attacks. You and the AI alternate turns.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Hit or Miss</h3>
                  <p className="text-gray-700 text-sm">See red markers for hits and circle markers for misses. Track your attacks carefully!</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Sink the Fleet</h3>
                  <p className="text-gray-700 text-sm">Destroy all enemy ships before they destroy yours to win the game!</p>
                </div>
              </div>
            </div>
          </div>

          {/* Ship Fleet Section */}
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-600" />
              Your Fleet
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-blue-200">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Carrier</p>
                  <p className="text-xs text-gray-500">5 cells</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-blue-200">
                <div className="flex gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Battleship</p>
                  <p className="text-xs text-gray-500">4 cells</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-blue-200">
                <div className="flex gap-0.5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Cruiser</p>
                  <p className="text-xs text-gray-500">3 cells</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-blue-200">
                <div className="flex gap-0.5">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Submarine</p>
                  <p className="text-xs text-gray-500">3 cells</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm border border-blue-200">
                <div className="flex gap-0.5">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-blue-600 rounded-sm"></div>
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Destroyer</p>
                  <p className="text-xs text-gray-500">2 cells</p>
                </div>
              </div>
            </div>
          </div>

          {/* Objective Section */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-amber-600" />
              Victory Objective
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Locate and destroy all enemy ships before they sink your fleet. Use strategy, pattern recognition, and deduction to outsmart the AI opponent. Each hit reveals valuable information about ship locations!
            </p>
          </div>

          {/* Start Button */}
          <div className="text-center space-y-4">
            <Button
              size="lg"
              className="w-full max-w-md text-xl py-7 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl font-bold"
              onClick={() => navigate('/game')}
            >
              <Crosshair className="w-6 h-6 mr-2" />
              Start New Game
            </Button>
            <p className="text-sm text-gray-500">
              Ready to command your fleet? Click above to begin!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
