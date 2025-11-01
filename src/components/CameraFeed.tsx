import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface CameraFeedProps {
  robotStatus: 'idle' | 'scanning' | 'loading';
  currentScannedBox?: { id: string; label: string; color: string; order: number };
}

export function CameraFeed({ robotStatus, currentScannedBox }: CameraFeedProps) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-slate-900 p-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-white">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <span>Трансляция с камеры робота</span>
        </div>
        <div className="flex items-center gap-2">
          {robotStatus === 'scanning' && (
            <Badge variant="default" className="bg-blue-500">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
              </svg>
              Сканирование
            </Badge>
          )}
          {robotStatus === 'loading' && (
            <Badge variant="default" className="bg-green-500">
              Загрузка
            </Badge>
          )}
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        </div>
      </div>
      
      <div className="relative aspect-video bg-slate-800">
        <ImageWithFallback 
          src="https://images.unsplash.com/photo-1664925192139-ea4124caa72b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3YXJlaG91c2UlMjByb2JvdCUyMGNhbWVyYXxlbnwxfHx8fDE3NjE4OTkzNjl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Camera feed"
          className="w-full h-full object-cover opacity-60"
        />
        
        {/* Overlay сетка как у камеры */}
        <div className="absolute inset-0 border-2 border-green-500/30 pointer-events-none">
          <div className="absolute top-0 left-1/2 w-px h-full bg-green-500/20" />
          <div className="absolute left-0 top-1/2 w-full h-px bg-green-500/20" />
        </div>

        {/* Информация о сканированной коробке */}
        {currentScannedBox && robotStatus === 'scanning' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/80 border-2 border-green-500 p-8 rounded-lg text-center animate-pulse">
              <div className="text-green-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <p className="text-green-400 text-xl mb-2">Метка обнаружена</p>
              <p className="text-white mb-4">{currentScannedBox.label}</p>
              <div 
                className="inline-block px-6 py-3 rounded-lg text-white"
                style={{ backgroundColor: currentScannedBox.color }}
              >
                Очередь загрузки: #{currentScannedBox.order}
              </div>
            </div>
          </div>
        )}

        {/* Информация в углах */}
        <div className="absolute top-4 left-4 text-green-400 text-sm font-mono">
          <div>CAM_01</div>
          <div>FPS: 30</div>
        </div>
        <div className="absolute top-4 right-4 text-green-400 text-sm font-mono">
          {new Date().toLocaleTimeString('ru-RU')}
        </div>
      </div>
    </Card>
  );
}
