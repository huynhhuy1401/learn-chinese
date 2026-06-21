'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Eraser, Eye, EyeOff } from 'lucide-react';

interface CharacterCanvasProps {
  character: string;
}

export function CharacterCanvas({ character }: CharacterCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [showTemplate, setShowTemplate] = useState(true);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Redraw function: template + user drawing
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save any existing drawing
    const existing = hasDrawn ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw template
    if (showTemplate) {
      ctx.font = `220px "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(180, 180, 180, 0.25)';
      ctx.fillText(character, canvas.width / 2, canvas.height / 2);
    }

    // Restore user drawing
    if (existing) {
      ctx.putImageData(existing, 0, 0);
    }
  }, [character, showTemplate]);

  useEffect(() => { redraw(); }, [redraw]);

  const getPos = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ('touches' in e) {
      return { x: (e.touches[0].clientX - rect.left) * scaleX, y: (e.touches[0].clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }, []);

  const startDrawing = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setIsDrawing(true);
    setHasDrawn(true);
  }, [getPos]);

  const draw = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }, [isDrawing, getPos]);

  const stopDrawing = useCallback(() => setIsDrawing(false), []);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    redraw();
  };

  return (
    <div className="space-y-3">
      <div className="relative rounded-2xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-zinc-900 overflow-hidden">
        <canvas
          ref={canvasRef}
          width={300}
          height={300}
          className="w-full aspect-square touch-none cursor-crosshair"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>
      <div className="flex justify-center gap-2">
        <Button variant="outline" size="sm" onClick={clear} disabled={!hasDrawn}>
          <Eraser className="w-4 h-4 mr-1" /> Clear
        </Button>
        <Button variant="outline" size="sm" onClick={() => setShowTemplate(!showTemplate)}>
          {showTemplate ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
          {showTemplate ? 'Hide Guide' : 'Show Guide'}
        </Button>
      </div>
    </div>
  );
}
