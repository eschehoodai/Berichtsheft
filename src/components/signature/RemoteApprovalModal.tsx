import React, { useState } from 'react';
import { Send, Link as LinkIcon, CheckCircle, AlertTriangle, Copy, X } from 'lucide-react';
import type { Wochenbericht } from '../../types/report';

interface RemoteApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: Wochenbericht;
  onSendRemoteLink: (email: string) => void;
  onRejectReport: (reason: string) => void;
  onOpenTrainerSignature: () => void;
}

export const RemoteApprovalModal: React.FC<RemoteApprovalModalProps> = ({
  isOpen,
  onClose,
  report,
  onSendRemoteLink,
  onRejectReport,
  onOpenTrainerSignature
}) => {
  const [email, setEmail] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = `${window.location.origin}/#approve-token=${report.remoteApprovalToken || 'demo-token-156'}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card rounded-2xl max-w-lg w-full p-6 border border-slate-800 shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Freigabe & Ausbilder-Prüfung</h3>
              <p className="text-xs text-slate-400">KW {report.kalenderwoche} / {report.jahr} ({report.ausbildungsjahr}. Ausbildungsjahr)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option 1: Signature on-site */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Option 1: Unterschrift vor Ort
            </h4>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/30">
              Direkt am Gerät
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Der Ausbilder unterzeichnet den Wochenbericht direkt auf dem Smartphone/Tablet des Auszubildenden.
          </p>
          <button
            onClick={() => {
              onClose();
              onOpenTrainerSignature();
            }}
            className="w-full py-2.5 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/10"
          >
            Jetzt vor Ort abzeichnen (Ausbilder)
          </button>
        </div>

        {/* Option 2: Remote E-Mail approval link */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <LinkIcon className="w-4 h-4 text-blue-400" /> Option 2: Remote Freigabelink per E-Mail
            </h4>
            <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded border border-blue-500/30">
              Tokenisiert
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Senden Sie einen sicheren Einmallink per E-Mail an den Ausbilder zur Prüfung am Desktop.
          </p>

          <div className="space-y-2">
            <input
              type="email"
              placeholder="E-Mail-Adresse des Ausbilders..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 text-xs text-white px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-blue-500/50"
            />
            <div className="flex gap-2">
              <button
                disabled={!email.trim()}
                onClick={() => onSendRemoteLink(email)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold bg-blue-600 text-white hover:bg-blue-500 disabled:opacity-50 transition"
              >
                Prüflink senden
              </button>

              <button
                onClick={handleCopyLink}
                className="px-3 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Kopiert!' : 'Link kopieren'}
              </button>
            </div>
          </div>
        </div>

        {/* Option 3: Reject / Beanstanden */}
        {!showRejectForm ? (
          <div className="text-center pt-2">
            <button
              onClick={() => setShowRejectForm(true)}
              className="text-xs text-rose-400 hover:text-rose-300 underline font-medium"
            >
              Bericht als Ausbilder beanstanden / Zurückweisen
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-3">
            <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" /> Beanstandungsgrund eintragen
            </h4>
            <textarea
              rows={3}
              placeholder="Bitte korrigieren Sie die folgenden Punkte..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-slate-950 text-xs text-white p-2.5 rounded-lg border border-rose-900 focus:outline-none focus:border-rose-500"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRejectForm(false)}
                className="px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white bg-slate-900"
              >
                Abbrechen
              </button>
              <button
                disabled={!rejectionReason.trim()}
                onClick={() => {
                  onRejectReport(rejectionReason);
                  onClose();
                }}
                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-500 disabled:opacity-50"
              >
                Zurückweisen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
