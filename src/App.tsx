import { useState } from 'react';
import { CameraFeed } from './components/CameraFeed';
import { BoxManagement } from './components/BoxManagement';
import { RobotMap } from './components/RobotMap';
import { StatusPanel } from './components/StatusPanel';

export default function App() {
  const [boxes, setBoxes] = useState([
    { id: '1', label: 'BOX-001', scanned: false, order: 1, color: '#3B82F6' },
    { id: '2', label: 'BOX-002', scanned: false, order: 2, color: '#10B981' },
    { id: '3', label: 'BOX-003', scanned: false, order: 3, color: '#F59E0B' },
    { id: '4', label: 'BOX-004', scanned: false, order: 4, color: '#EF4444' },
  ]);

  const [robotStatus, setRobotStatus] = useState<'idle' | 'scanning' | 'loading'>('idle');
  const [currentPosition, setCurrentPosition] = useState({ x: 50, y: 50 });

  const startScanning = () => {
    setRobotStatus('scanning');
    setBoxes(boxes.map(box => ({ ...box, scanned: false })));
    
    // Симуляция сканирования коробок
    let scanIndex = 0;
    const scanInterval = setInterval(() => {
      if (scanIndex < boxes.length) {
        setBoxes(prev => prev.map((box, idx) => 
          idx === scanIndex ? { ...box, scanned: true } : box
        ));
        scanIndex++;
      } else {
        clearInterval(scanInterval);
        setRobotStatus('loading');
      }
    }, 2000);
  };

  const resetSimulation = () => {
    setRobotStatus('idle');
    setBoxes(boxes.map(box => ({ ...box, scanned: false })));
  };

  const reorderBoxes = (newBoxes: typeof boxes) => {
    setBoxes(newBoxes);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-6">
          <h1 className="text-slate-900 mb-2">Система управления роботом-погрузчиком</h1>
          <p className="text-slate-600">Автоматическая загрузка коробок в фургон</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Левая колонка */}
          <div className="lg:col-span-2 space-y-6">
            <CameraFeed robotStatus={robotStatus} currentScannedBox={boxes.filter(b => b.scanned).pop()} />
            <RobotMap boxes={boxes} robotPosition={currentPosition} robotStatus={robotStatus} />
          </div>

          {/* Правая колонка */}
          <div className="space-y-6">
            <StatusPanel 
              robotStatus={robotStatus} 
              onStartScanning={startScanning}
              onReset={resetSimulation}
              scannedCount={boxes.filter(b => b.scanned).length}
              totalCount={boxes.length}
            />
            <BoxManagement boxes={boxes} onReorder={reorderBoxes} robotStatus={robotStatus} />
          </div>
        </div>
      </div>
    </div>
  );
}
