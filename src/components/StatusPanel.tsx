import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface StatusPanelProps {
  robotStatus: 'idle' | 'scanning' | 'loading';
  onStartScanning: () => void;
  onReset: () => void;
  scannedCount: number;
  totalCount: number;
}

export function StatusPanel({ 
  robotStatus, 
  onStartScanning, 
  onReset,
  scannedCount,
  totalCount 
}: StatusPanelProps) {
  const progress = (scannedCount / totalCount) * 100;

  const getStatusInfo = () => {
    switch (robotStatus) {
      case 'idle':
        return {
          text: 'Ожидание',
          color: 'bg-slate-500',
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
      case 'scanning':
        return {
          text: 'Сканирование',
          color: 'bg-blue-500',
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          ),
        };
      case 'loading':
        return {
          text: 'Загрузка',
          color: 'bg-green-500',
          icon: (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-slate-900 mb-1">Статус робота</h2>
        <p className="text-slate-600 text-sm">Управление процессом загрузки</p>
      </div>

      {/* Текущий статус */}
      <div className="mb-6 p-4 bg-slate-50 rounded-lg">
        <div className="flex items-center gap-3 mb-3">
          <div className={`w-10 h-10 ${statusInfo.color} rounded-lg flex items-center justify-center`}>
            {statusInfo.icon}
          </div>
          <div className="flex-1">
            <p className="text-slate-600 text-sm">Текущий статус</p>
            <p className="text-slate-900">{statusInfo.text}</p>
          </div>
          <div className={`w-3 h-3 rounded-full ${statusInfo.color} ${robotStatus !== 'idle' ? 'animate-pulse' : ''}`} />
        </div>

        {/* Прогресс сканирования */}
        {robotStatus !== 'idle' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Прогресс</span>
              <span className="text-slate-900">{scannedCount} / {totalCount}</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
      </div>

      {/* Информационные метрики */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-600 text-sm mb-1">Коробок</p>
          <p className="text-blue-900 text-2xl">{totalCount}</p>
        </div>
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-600 text-sm mb-1">Отсканировано</p>
          <p className="text-green-900 text-2xl">{scannedCount}</p>
        </div>
      </div>

      {/* Кнопки управления */}
      <div className="space-y-3">
        <Button 
          className="w-full"
          size="lg"
          onClick={onStartScanning}
          disabled={robotStatus !== 'idle'}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Начать сканирование
        </Button>
        
        <Button 
          className="w-full"
          variant="outline"
          size="lg"
          onClick={onReset}
          disabled={robotStatus === 'idle'}
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Сбросить
        </Button>
      </div>

      {/* Подсказки */}
      <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-amber-900 text-sm">
          <strong>💡 Совет:</strong> Установите очередность загрузки до начала сканирования. 
          После начала процесса изменение порядка будет недоступно.
        </p>
      </div>

      {/* Дополнительная информация */}
      <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-600">Время работы</span>
          <span className="text-slate-900">
            {robotStatus === 'idle' ? '00:00' : new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Батарея</span>
          <Badge variant="outline" className="text-green-600 border-green-600">
            85%
          </Badge>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-600">Связь</span>
          <Badge variant="outline" className="text-green-600 border-green-600">
            Отлично
          </Badge>
        </div>
      </div>
    </Card>
  );
}
