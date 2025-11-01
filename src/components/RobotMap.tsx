import { Card } from './ui/card';
import { useEffect, useState } from 'react';

interface Box {
  id: string;
  label: string;
  scanned: boolean;
  order: number;
  color: string;
}

interface RobotMapProps {
  boxes: Box[];
  robotPosition: { x: number; y: number };
  robotStatus: 'idle' | 'scanning' | 'loading';
}

export function RobotMap({ boxes, robotPosition, robotStatus }: RobotMapProps) {
  const [animatedPosition, setAnimatedPosition] = useState({ x: 50, y: 450 });
  
  const boxPositions: { [key: string]: { x: number; y: number } } = {
    '1': { x: 50, y: 100 },
    '2': { x: 700, y: 50 },
    '3': { x: 150, y: 250 },
    '4': { x: 500, y: 150 },
  };

  // Позиция фургона
  const vanPosition = { x: 250, y: 450 };
  const robotDepo = { x: 350, y: 50 }

  useEffect(() => {
    if (robotStatus === 'loading') {
      const sortedBoxes = [...boxes].sort((a, b) => a.order - b.order);
      let currentBox = 0;

      const loadInterval = setInterval(() => {
        if (currentBox < sortedBoxes.length) {
          const box = sortedBoxes[currentBox];
          setAnimatedPosition(boxPositions[box.id]);
          currentBox++;
        } else {
          setAnimatedPosition(vanPosition);
          clearInterval(loadInterval);
        }
      }, 2000);

      return () => clearInterval(loadInterval);
    } else {
      setAnimatedPosition(robotDepo);
    }
  }, [robotStatus, boxes]);

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="text-slate-900 mb-1">Карта движения робота</h2>
        <p className="text-slate-600 text-sm">Текущее положение и маршрут</p>
      </div>

      <div className="relative bg-slate-100 rounded-lg p-8 h-[500px]">
        {/* Сетка */}
        <div className="absolute inset-0 opacity-20">
          {[...Array(10)].map((_, i) => (
            <div key={`h-${i}`} className="absolute left-0 right-0 border-t border-slate-300" style={{ top: `${i * 10}%` }} />
          ))}
          {[...Array(10)].map((_, i) => (
            <div key={`v-${i}`} className="absolute top-0 bottom-0 border-l border-slate-300" style={{ left: `${i * 10}%` }} />
          ))}
        </div>

        {/* Коробки */}
        {boxes.map((box) => {
          const pos = boxPositions[box.id];
          return (
            <div
              key={box.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
              style={{ left: pos.x, top: pos.y }}
            >
              <div className="relative">
                <div
                  className={`w-16 h-16 rounded-lg flex items-center justify-center border-3 ${
                    box.scanned ? 'ring-4 ring-offset-2' : ''
                  }`}
                  style={{
                    backgroundColor: `${box.color}30`,
                    borderColor: box.color
                  }}
                >
                  <svg
                    className="w-8 h-8"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ color: box.color }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                </div>
                <div 
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-white text-sm"
                  style={{ backgroundColor: box.color }}
                >
                  {box.order}
                </div>
                <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-slate-600">
                  {box.label}
                </div>
              </div>
            </div>
          );
        })}

        {/* Фургон */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: vanPosition.x, top: vanPosition.y }}
        >
          <div className="relative">
            <div className="w-24 h-20 bg-slate-700 rounded-lg flex items-center justify-center border-4 border-slate-800">
              <div className="text-white text-center">
                <div className="text-2xl mb-1">🚐</div>
                <div className="text-xs">Фургон</div>
              </div>
            </div>
          </div>
        </div>

        {/* Робот */}
        <div
          className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ease-in-out z-10"
          style={{ left: animatedPosition.x, top: animatedPosition.y }}
        >
          <div className="relative">
            <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg ${
              robotStatus !== 'idle' ? 'animate-pulse' : ''
            }`}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>
            {robotStatus !== 'idle' && (
              <div className="absolute -inset-2 rounded-full border-2 border-blue-400 animate-ping opacity-75" />
            )}
            <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs bg-blue-600 text-white px-2 py-1 rounded">
              Робот
            </div>
          </div>
        </div>

        {/* Легенда */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-xs space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>Робот</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span>Коробки</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-700 rounded" />
            <span>Фургон</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
