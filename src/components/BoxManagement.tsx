import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { useState } from 'react';

interface Box {
  id: string;
  label: string;
  scanned: boolean;
  order: number;
  color: string;
}

interface BoxManagementProps {
  boxes: Box[];
  onReorder: (boxes: Box[]) => void;
  robotStatus: 'idle' | 'scanning' | 'loading';
}

interface DraggableBoxItemProps {
  box: Box;
  index: number;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
  disabled: boolean;
  isDragging: boolean;
}

function DraggableBoxItem({ 
  box, 
  index, 
  onDragStart, 
  onDragOver, 
  onDragEnd, 
  disabled, 
  isDragging 
}: DraggableBoxItemProps) {
  return (
    <div
      draggable={!disabled}
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(index);
      }}
      onDragEnd={onDragEnd}
      className={`flex items-center gap-3 p-4 bg-white border-2 rounded-lg transition-all ${
        isDragging ? 'opacity-50 scale-95' : ''
      } ${disabled ? 'cursor-not-allowed opacity-60' : 'cursor-move hover:border-slate-300'}`}
      style={{ borderColor: box.scanned ? box.color : '#e2e8f0' }}
    >
      {!disabled && (
        <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
        </svg>
      )}
      <div 
        className="w-12 h-12 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${box.color}20` }}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: box.color }}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-slate-900">{box.label}</span>
          {box.scanned && (
            <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
        <p className="text-slate-500 text-sm">Вес: 15.5 кг</p>
      </div>
      <Badge 
        variant="outline" 
        className="text-lg px-3 py-1"
        style={{ 
          borderColor: box.color,
          color: box.color,
          backgroundColor: `${box.color}10`
        }}
      >
        #{box.order}
      </Badge>
    </div>
  );
}

export function BoxManagement({ boxes, onReorder, robotStatus }: BoxManagementProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const disabled = robotStatus !== 'idle';

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedIndex === null || draggedIndex === index) return;

    const newBoxes = [...boxes];
    const draggedBox = newBoxes[draggedIndex];
    newBoxes.splice(draggedIndex, 1);
    newBoxes.splice(index, 0, draggedBox);
    
    // Обновляем order
    const reorderedBoxes = newBoxes.map((box, idx) => ({
      ...box,
      order: idx + 1,
    }));
    
    onReorder(reorderedBoxes);
    setDraggedIndex(index);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="text-slate-900 mb-1">Очередность загрузки</h2>
        <p className="text-slate-600 text-sm">
          {disabled 
            ? 'Изменение очередности недоступно во время работы' 
            : 'Перетащите коробки для изменения порядка'}
        </p>
      </div>

      <div className="space-y-3">
        {boxes.map((box, index) => (
          <DraggableBoxItem
            key={box.id}
            box={box}
            index={index}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            disabled={disabled}
            isDragging={draggedIndex === index}
          />
        ))}
      </div>

      {disabled && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 text-sm">
            ℹ️ Очередность будет зафиксирована после завершения операции
          </p>
        </div>
      )}
    </Card>
  );
}
