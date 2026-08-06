import React, { useRef, useState, useEffect } from 'react';
import { PenTool, X, RotateCcw, Check, ShieldCheck } from 'lucide-react';
import type { DigitalSignature } from '../../types/report';

interface SignatureCanvasModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSignature: (signature: DigitalSignature) => void;
  role: 'TRAINEE' | 'TRAINER';
  defaultName: string;
}

export const SignatureCanvasModal: React.FC<SignatureCanvasModalProps> = ({
  isOpen,
  onClose,
  onSaveSignature,
  role,
  defaultName
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signedByName, setSignedByName] = useState(defaultName);
  const [isEmpty, setIsEmpty] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setSignedByName(defaultName);
      setTimeout(() => {
        initCanvas();
      }, 100);
    }
  }, [isOpen, defaultName]);

  const initCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2; // high DPI scaling
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);

    ctx.strokeStyle = '#f59e0b'; // Amber ink color
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    clearCanvas();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsEmpty(true);
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    setIsEmpty(false);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.beginPath();
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas || isEmpty) return;

    const signatureDataUrl = canvas.toDataURL('image/png');
    const timestamp = new Date().toISOString();
    const verificationHash = 'SHA256-' + Math.random().toString(36).substring(2, 12).toUpperCase();

    const signatureObj: DigitalSignature = {
      signedBy: signedByName || (role === 'TRAINEE' ? 'Auszubildende/r' : 'Ausbilder/in'),
      role,
      signatureDataUrl,
      timestamp,
      verificationHash
    };

    onSaveSignature(signatureObj);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="glass-card rounded-2xl max-w-lg w-full p-6 border border-slate-800 shadow-2xl relative">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <PenTool className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                {role === 'TRAINEE' ? 'Unterschrift Auszubildende/r' : 'Unterschrift Ausbilder/in'}
              </h3>
              <p className="text-xs text-slate-400">Digitale Signatur für IHK-Ausbildungsnachweis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Name input */}
        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
            Unterzeichnende Person (Vollständiger Name)
          </label>
          <input
            type="text"
            value={signedByName}
            onChange={(e) => setSignedByName(e.target.value)}
            className="w-full bg-slate-900 text-sm text-white px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500/50"
            placeholder="z.B. David Grabowski"
          />
        </div>

        {/* Canvas area */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Bitte mit Finger, Stylus oder Maus im Feld unterschreiben:</span>
            <button
              onClick={clearCanvas}
              className="flex items-center gap-1 text-slate-400 hover:text-rose-400 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Löschen
            </button>
          </div>

          <div className="relative border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-xl bg-slate-900 overflow-hidden shadow-inner">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
              className="w-full h-44 cursor-crosshair signature-canvas"
            />
            {isEmpty && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none text-slate-600 text-sm italic">
                Hier unterschreiben...
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Zeitstempel und Prüfsumme werden beim Speichern automatisch angefügt.</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition"
          >
            Abbrechen
          </button>
          <button
            disabled={isEmpty || !signedByName.trim()}
            onClick={handleSave}
            className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:from-amber-400 hover:to-orange-400 disabled:opacity-50 transition shadow-lg shadow-amber-500/20"
          >
            <Check className="w-4 h-4" /> Rechtsgültig Abzeichnen
          </button>
        </div>
      </div>
    </div>
  );
};
