import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import { 
  Building2, 
  ChevronRight, 
  HelpCircle, 
  Lightbulb, 
  MessageSquare,
  Trophy,
  Activity,
  Users
} from 'lucide-react';

const CompanyPrep = () => {
  const [companies, setCompanies] = useState([]);
  const [selectedComp, setSelectedComp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await axios.get(`${API_URL}/companies`);
        setCompanies(res.data);
        if (res.data.length > 0) {
          setSelectedComp(res.data[0]); // Default to first company
        }
      } catch (err) {
        console.error('Error fetching companies:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-transparent">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-dark-700 border-t-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 p-1 sm:p-4">
      {/* Background decorations */}
      <div className="absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full glow-accent opacity-60 blur-3xl pointer-events-none" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-white">Company Preparation</h1>
        <p className="text-dark-400 text-sm">Study company-specific interview tracks, questions, and guides.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Left side: Company Select Tabs */}
        <div className="space-y-2 lg:col-span-1">
          <span className="text-[10px] text-dark-500 font-bold uppercase tracking-wider block px-2 mb-2">Target Companies</span>
          <div className="flex flex-row overflow-x-auto gap-2 lg:flex-col lg:overflow-visible pb-2 lg:pb-0">
            {companies.map((comp) => {
              const isActive = selectedComp?.companyName === comp.companyName;
              return (
                <button
                  key={comp._id}
                  onClick={() => setSelectedComp(comp)}
                  className={`
                    flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold shrink-0 text-left border transition-all duration-200 w-auto lg:w-full
                    ${isActive 
                      ? 'bg-brand-600/10 text-brand-400 border-brand-500/30' 
                      : 'bg-dark-900/10 border-transparent text-dark-400 hover:bg-dark-900/30 hover:text-white'}
                  `}
                >
                  <Building2 size={16} />
                  <span>{comp.companyName}</span>
                  <ChevronRight size={14} className="ml-auto hidden lg:block" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right side: Detailed Prep Resources */}
        {selectedComp && (
          <div className="space-y-6 lg:col-span-3">
            {/* Overview Banner Card */}
            <div className="glass-panel border-dark-850 rounded-3xl p-6 relative overflow-hidden">
              <div className="absolute right-0 bottom-0 h-44 w-44 rounded-full glow-accent opacity-40 blur-2xl pointer-events-none" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider">Company Profile</span>
                  <h2 className="text-3xl font-extrabold text-white">{selectedComp.companyName}</h2>
                </div>
                <div className="flex gap-4">
                  <div className="bg-dark-900/50 border border-dark-800 px-4 py-2.5 rounded-2xl text-center">
                    <span className="text-[10px] text-dark-400 block font-bold uppercase">Difficulty</span>
                    <span className={`text-sm font-extrabold 
                      ${selectedComp.difficultyLevel === 'Hard' ? 'text-red-400' : selectedComp.difficultyLevel === 'Medium' ? 'text-orange-400' : 'text-emerald-400'}
                    `}>
                      {selectedComp.difficultyLevel}
                    </span>
                  </div>
                  <div className="bg-dark-900/50 border border-dark-800 px-4 py-2.5 rounded-2xl text-center">
                    <span className="text-[10px] text-dark-400 block font-bold uppercase">Problems Count</span>
                    <span className="text-sm font-extrabold text-white">
                      {selectedComp.interviewQuestions?.length || 0} Listed
                    </span>
                  </div>
                </div>
              </div>

              {/* Frequently Asked Topics */}
              <div className="mt-6 space-y-2">
                <span className="text-[10px] text-dark-400 font-bold uppercase tracking-wider block">Frequently Asked Subjects</span>
                <div className="flex flex-wrap gap-2">
                  {selectedComp.topics.map((t, idx) => (
                    <span key={idx} className="text-xs bg-dark-900/80 border border-dark-800 text-dark-300 px-3 py-1 rounded-full font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Preparation Tips */}
            <div className="glass-panel border-dark-850 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Lightbulb size={18} className="text-brand-400" /> Preparation Strategy & Tips
              </h3>
              <ul className="space-y-2.5 text-sm text-dark-300 list-none">
                {selectedComp.preparationTips.map((tip, idx) => (
                  <li key={idx} className="flex gap-2.5 items-start">
                    <span className="h-5 w-5 bg-brand-500/10 border border-brand-500/20 text-brand-400 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Questions Bank */}
            <div className="glass-panel border-dark-850 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <HelpCircle size={18} className="text-brand-400" /> Common Interview Questions
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {selectedComp.interviewQuestions.map((q, idx) => (
                  <div key={idx} className="bg-dark-900/40 border border-dark-850/60 p-4 rounded-2xl flex flex-col justify-between hover:border-brand-500/20 transition-colors">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-bold text-sm text-white line-clamp-1">{q.title}</h4>
                        <span className={`text-[9px] px-2 py-0.5 rounded font-extrabold uppercase shrink-0
                          ${q.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : q.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'}
                        `}>
                          {q.difficulty}
                        </span>
                      </div>
                      <p className="text-xs text-dark-400 leading-relaxed pt-1.5">{q.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interview Experiences */}
            <div className="glass-panel border-dark-850 rounded-3xl p-6 space-y-4">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <MessageSquare size={18} className="text-brand-400" /> Interview Experiences
              </h3>
              <div className="space-y-4">
                {selectedComp.interviewExperiences.map((exp, idx) => (
                  <div key={idx} className="bg-dark-900/30 border border-dark-850/40 p-5 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-sm text-white">{exp.title}</h4>
                        <span className="text-[10px] text-dark-400">Written by {exp.author}</span>
                      </div>
                      <span className="text-[10px] bg-dark-800 text-dark-300 px-2 py-1 rounded font-semibold">
                        {exp.date}
                      </span>
                    </div>
                    <p className="text-xs text-dark-300 leading-relaxed italic bg-dark-900/20 p-3 rounded-xl border border-dark-850/30">
                      "{exp.content}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyPrep;
