import React, { useState, useEffect } from 'react';
import { Settings, Check, X, Building, User, Award, Calendar } from 'lucide-react';
import type { AppProfile } from '../../types/report';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile?: AppProfile;
  onSaveProfile: (profile: AppProfile) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile
}) => {
  const [formData, setFormData] = useState<AppProfile>({
    traineeName: '',
    birthDate: '',
    companyName: '',
    trainerName: '',
    ihkName: '',
    ausbildungsStart: '2026-08-01',
    ausbildungsEnde: '2029-07-31'
  });

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="glass-card rounded-2xl max-w-lg w-full p-6 border border-slate-800 shadow-2xl relative space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Stammdaten & IHK Profileinstellungen</h3>
              <p className="text-xs text-slate-400">Rechtliche Vorgaben für Kopfdaten der Berichtsheft-PDFs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Trainee Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" /> Name Auszubildende/r
            </label>
            <input
              type="text"
              required
              value={formData.traineeName}
              onChange={(e) => setFormData({ ...formData, traineeName: e.target.value })}
              className="w-full bg-slate-900 text-sm text-white px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500/50"
              placeholder="Vor- und Nachname"
            />
          </div>

          {/* Company Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-amber-400" /> Ausbildungsbetrieb (Name & Ort)
            </label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              className="w-full bg-slate-900 text-sm text-white px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500/50"
              placeholder="z.B. Hotel & Restaurant Sonnenhof"
            />
          </div>

          {/* Trainer Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-400" /> Ausbilder/in (Küchenmeister/in)
            </label>
            <input
              type="text"
              required
              value={formData.trainerName}
              onChange={(e) => setFormData({ ...formData, trainerName: e.target.value })}
              className="w-full bg-slate-900 text-sm text-white px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500/50"
              placeholder="z.B. Hans Müller"
            />
          </div>

          {/* IHK Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" /> Zuständige IHK (Industrie- und Handelskammer)
            </label>
            <input
              type="text"
              required
              value={formData.ihkName}
              onChange={(e) => setFormData({ ...formData, ihkName: e.target.value })}
              className="w-full bg-slate-900 text-sm text-white px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500/50"
              placeholder="z.B. IHK Dresden"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Ausbildungsbeginn
              </label>
              <input
                type="date"
                value={formData.ausbildungsStart}
                onChange={(e) => setFormData({ ...formData, ausbildungsStart: e.target.value })}
                className="w-full bg-slate-900 text-xs text-white px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500/50"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> Vorauss. Ende
              </label>
              <input
                type="date"
                value={formData.ausbildungsEnde}
                onChange={(e) => setFormData({ ...formData, ausbildungsEnde: e.target.value })}
                className="w-full bg-slate-900 text-xs text-white px-3 py-2 rounded-lg border border-slate-800 focus:outline-none focus:border-amber-500/50"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-bold bg-amber-500 text-slate-950 hover:bg-amber-400 transition"
            >
              <Check className="w-4 h-4" /> Speichern
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
