'use client';

import React, { useState } from 'react';
import { LogIn, Lock, Mail, ShieldCheck, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'student' | 'teacher'>('student');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === 'student') {
      // Сурагчийн систем рүү шилжих
      router.push('/student/dashboard');
    } else {
      // Багшийн систем рүү шилжих
      router.push('/teacher/pisa-builder');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
      <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-500 rounded-2xl mx-auto flex items-center justify-center text-white font-black text-2xl shadow-lg">
            PISA
          </div>
          <h1 className="text-xl font-black text-slate-900">"Бүтээлч уншлага-2" Платформ</h1>
          <p className="text-xs text-slate-500">Системд нэвтрэх хэсэг</p>
        </div>

        {/* Сонголт: Сурагч / Багш */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition ${
              role === 'student' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'
            }`}
          >
            Сурагч нэвтрэх
          </button>
          <button
            type="button"
            onClick={() => setRole('teacher')}
            className={`flex-1 py-2 rounded-xl text-xs font-extrabold transition ${
              role === 'teacher' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-500'
            }`}
          >
            Багш нэвтрэх
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {role === 'student' ? 'MOES Цахим хаяг:' : 'Багшийн и-мэйл хаяг:'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder={role === 'student' ? 'altantsetseg4dgx@moes.edu.mn' : 'tsedev@school.edu.mn'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Нууц үг:</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 pl-9 pr-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-start gap-2 text-[11px] text-amber-900">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              {role === 'student'
                ? 'Дүрмийн дагуу сурагч өдөрт 1-ээс дээш сорил ажиллах боломжгүй.'
                : 'Арга зүйч багш нар зөвхөн өөрийн хичээлийн сорилын дүнг хянана.'}
            </span>
          </div>

          <button
            type="submit"
            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs py-3 rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Системд Нэвтрэх
          </button>
        </form>

      </div>
    </div>
  );
}