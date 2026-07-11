import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import { 
  ClipboardList, 
  Clock, 
  Award, 
  Check, 
  X, 
  AlertTriangle, 
  HelpCircle,
  Play,
  Calendar,
  ChevronRight
} from 'lucide-react';

const MockPlanner = () => {
  const [history, setHistory] = useState([]);
  const [activeTest, setActiveTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [reviewTest, setReviewTest] = useState(null);

  // Selector states
  const [company, setCompany] = useState('Google');
  const [difficulty, setDifficulty] = useState('Medium');
  const [duration, setDuration] = useState('60');

  // Timer states
  const [timeLeft, setTimeLeft] = useState(0);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_URL}/mock-tests`);
      setHistory(res.data);
    } catch (err) {
      console.error('Error fetching mock history:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Timer Hook
  useEffect(() => {
    if (!activeTest || timeLeft <= 0) {
      if (timeLeft === 0 && activeTest) {
        handleSubmitTest();
      }
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, activeTest]);

  const handleStartTest = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/mock-tests`, {
        company,
        difficulty,
        duration: Number(duration)
      });
      setActiveTest(res.data);
      setAnswers({});
      setTimeLeft(Number(duration) * 60);
      setReviewTest(null);
    } catch (err) {
      console.error('Error starting mock test:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (qIndex, value) => {
    setAnswers({
      ...answers,
      [qIndex]: value
    });
  };

  const handleSubmitTest = async () => {
    setSubmitting(true);
    try {
      const res = await axios.post(`${API_URL}/mock-tests/submit`, {
        testId: activeTest._id,
        answers
      });
      setActiveTest(null);
      setReviewTest(res.data);
      fetchHistory();
    } catch (err) {
      console.error('Error submitting test:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleViewReview = (test) => {
    setReviewTest(test);
    setActiveTest(null);
  };

  return (
    <div className="relative space-y-6 p-1 sm:p-4">
      {/* Background decorations */}
      <div className="absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full glow-accent opacity-60 blur-3xl pointer-events-none" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-white">Mock Interview Planner</h1>
        <p className="text-dark-400 text-sm">Generate company-specific mock tests with coding, CS, and aptitude sections.</p>
      </div>

      {/* Main dashboard splits */}
      {!activeTest && !reviewTest && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Setup Mock Panel */}
          <div className="glass-panel border-dark-850 rounded-3xl p-6 space-y-5 lg:col-span-1 h-fit">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Play size={18} className="text-brand-400" /> Start Preparation Mock
            </h3>
            <div className="space-y-4 text-xs font-semibold uppercase tracking-wider text-dark-300">
              {/* Target Company Select */}
              <div className="space-y-1.5">
                <label className="text-dark-400">Target Company</label>
                <select
                  value={company}
                  onChange={e => setCompany(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option>Google</option>
                  <option>Amazon</option>
                  <option>Microsoft</option>
                  <option>TCS</option>
                  <option>Infosys</option>
                  <option>Accenture</option>
                  <option>Deloitte</option>
                </select>
              </div>

              {/* Difficulty */}
              <div className="space-y-1.5">
                <label className="text-dark-400">Mock Difficulty</label>
                <select
                  value={difficulty}
                  onChange={e => setDifficulty(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <label className="text-dark-400">Time Duration (minutes)</label>
                <select
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                >
                  <option value="30">30 Minutes (Short Assessment)</option>
                  <option value="45">45 Minutes (Standard Interview)</option>
                  <option value="60">60 Minutes (Full Length)</option>
                  <option value="90">90 Minutes (Hard Comprehensive)</option>
                </select>
              </div>

              <button
                onClick={handleStartTest}
                disabled={loading}
                className="w-full rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 border border-brand-500/20 shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 focus:outline-none transition-colors"
              >
                {loading ? 'Initializing Test...' : 'Launch Mock Exam'}
              </button>
            </div>
          </div>

          {/* History log panel */}
          <div className="glass-panel border-dark-850 rounded-3xl p-6 space-y-4 lg:col-span-2">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <ClipboardList size={18} className="text-brand-400" /> Mock Exams Logs
            </h3>
            {history.length === 0 ? (
              <p className="text-sm text-dark-500 text-center py-10">No mock tests completed yet. Start your first mock exam above!</p>
            ) : (
              <div className="space-y-3 max-h-[450px] overflow-y-auto pr-1">
                {history.map((test) => (
                  <div 
                    key={test._id} 
                    className="bg-dark-900/30 border border-dark-850/60 p-4 rounded-2xl flex items-center justify-between hover:border-brand-500/20 transition-all duration-200"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{test.company} Mock</span>
                        <span className="text-[10px] bg-dark-800 text-dark-300 px-1.5 py-0.5 rounded uppercase font-extrabold">{test.difficulty}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-dark-400">
                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(test.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {test.duration} mins</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <span className="text-[10px] text-dark-400 block font-bold uppercase">Graded Score</span>
                        <span className="text-sm font-extrabold text-brand-400">{test.score} / {test.totalPoints} pts</span>
                      </div>
                      <button 
                        onClick={() => handleViewReview(test)}
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500 hover:text-white transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Active test taking environment */}
      {activeTest && (
        <div className="space-y-6">
          {/* Header Dashboard Banner */}
          <div className="sticky top-0 z-30 glass-panel border-dark-800 rounded-3xl p-5 flex items-center justify-between shadow-2xl">
            <div>
              <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider block">Assigned Assessment</span>
              <h2 className="text-xl font-extrabold text-white">{activeTest.company} Interview Mock ({activeTest.difficulty})</h2>
            </div>
            
            {/* Active Countdown */}
            <div className="flex items-center gap-2 bg-brand-600/10 border border-brand-500/20 px-4 py-2 rounded-2xl text-brand-400 font-bold">
              <Clock size={18} className="animate-pulse" />
              <span className="font-mono text-lg">{formatTime(timeLeft)}</span>
            </div>
          </div>

          {/* Test Questions checklist */}
          <div className="space-y-6">
            {activeTest.questions.map((q, idx) => (
              <div key={idx} className="glass-panel border-dark-850 rounded-3xl p-6 space-y-4">
                <div className="flex justify-between items-start border-b border-dark-850 pb-3 gap-2">
                  <div className="space-y-1">
                    <span className="text-[9px] bg-brand-500/10 text-brand-400 px-2 py-0.5 rounded-full font-bold uppercase">
                      Q{idx + 1} • {q.type}
                    </span>
                    <h3 className="font-bold text-white text-base pt-1">{q.title}</h3>
                  </div>
                  <span className="text-xs text-dark-400 shrink-0 font-bold">{q.points} Points</span>
                </div>

                <p className="text-sm text-dark-300 leading-relaxed font-sans">{q.description}</p>

                {/* Question form options */}
                {q.type === 'Coding' ? (
                  <div className="space-y-2">
                    <label className="text-[10px] text-dark-400 font-bold uppercase block">Write your code solution here (Javascript / Java / C++):</label>
                    <textarea
                      rows="8"
                      value={answers[idx] || ''}
                      onChange={e => handleAnswerChange(idx, e.target.value)}
                      placeholder="function solve() { \n  // Your code here...\n}"
                      className="w-full bg-dark-900 border border-dark-800 rounded-2xl p-4 text-xs font-mono text-emerald-400 placeholder-dark-600 focus:outline-none focus:border-brand-500"
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                    {q.options.map((opt, oIdx) => {
                      const isSelected = answers[idx] === opt;
                      return (
                        <button
                          key={oIdx}
                          onClick={() => handleAnswerChange(idx, opt)}
                          className={`
                            flex items-center gap-3 rounded-xl p-3 text-xs font-semibold border text-left transition-all duration-200
                            ${isSelected 
                              ? 'bg-brand-600/10 text-brand-400 border-brand-500/40 shadow-inner' 
                              : 'bg-dark-900/30 border-dark-850/60 text-dark-300 hover:bg-dark-900/50'}
                          `}
                        >
                          <span className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0
                            ${isSelected ? 'border-brand-400 bg-brand-500/20' : 'border-dark-700'}
                          `}>
                            {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />}
                          </span>
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Test Submit Footer panel */}
          <div className="flex justify-end gap-4">
            <button
              onClick={() => {
                if (window.confirm('Abandon test? Progress will be lost.')) {
                  setActiveTest(null);
                }
              }}
              className="rounded-xl border border-dark-800 bg-dark-900/40 hover:bg-dark-900 text-dark-300 font-semibold px-6 py-3 text-sm transition-colors"
            >
              Cancel Mock
            </button>
            <button
              onClick={handleSubmitTest}
              disabled={submitting}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 text-sm border border-emerald-500/20 shadow-lg shadow-emerald-500/10 transition-colors"
            >
              {submitting ? 'Evaluating Mock...' : 'Finish and Submit'}
            </button>
          </div>
        </div>
      )}

      {/* Review completed test state */}
      {reviewTest && (
        <div className="space-y-6">
          {/* Graded Summary Header banner */}
          <div className="glass-panel border-dark-850 rounded-3xl p-6 relative overflow-hidden">
            <div className="absolute right-0 bottom-0 h-44 w-44 rounded-full glow-accent opacity-50 blur-2xl pointer-events-none" />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-dark-850/80 pb-5">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-brand-400 uppercase tracking-wider block">Graded Assessment Report</span>
                <h2 className="text-2xl font-extrabold text-white">{reviewTest.company} Interview Review</h2>
                <span className="text-xs text-dark-400 flex items-center gap-1 font-semibold"><Calendar size={12} /> Finished on {new Date(reviewTest.completedAt).toLocaleString()}</span>
              </div>
              <div className="flex gap-4">
                <div className="bg-dark-900/60 border border-dark-800 px-5 py-3 rounded-2xl text-center shadow-lg">
                  <span className="text-[10px] text-dark-400 block font-bold uppercase">Scored Points</span>
                  <span className="text-xl font-extrabold text-brand-400">{reviewTest.score} / {reviewTest.totalPoints}</span>
                </div>
                <div className="bg-dark-900/60 border border-dark-800 px-5 py-3 rounded-2xl text-center shadow-lg">
                  <span className="text-[10px] text-dark-400 block font-bold uppercase">Evaluation Rate</span>
                  <span className="text-xl font-extrabold text-white">{Math.round((reviewTest.score / reviewTest.totalPoints) * 100)}%</span>
                </div>
              </div>
            </div>

            {/* Suggestions & Weak Areas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5">
              <div className="space-y-2">
                <h4 className="font-bold text-red-400 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                  <AlertTriangle size={14} /> Weak Areas Identified
                </h4>
                <ul className="space-y-1.5">
                  {reviewTest.weakAreas.length === 0 ? (
                    <li className="text-xs text-emerald-400 font-semibold flex items-center gap-1"><Check size={12} /> Excellent performance across all areas!</li>
                  ) : (
                    reviewTest.weakAreas.map((area, idx) => (
                      <li key={idx} className="text-xs text-white bg-dark-900/60 border border-dark-850 px-3 py-2 rounded-xl flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-red-400 shrink-0" />
                        <span>{area}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-brand-400 text-xs flex items-center gap-1.5 uppercase tracking-wide">
                  <Award size={14} /> Recommended Action Steps
                </h4>
                <div className="bg-brand-600/5 border border-brand-500/15 p-4 rounded-2xl text-xs text-dark-300 leading-relaxed space-y-2 shadow-inner">
                  {reviewTest.suggestions.map((s, idx) => (
                    <p key={idx} className="flex gap-2">
                      <span className="text-brand-400 font-extrabold">•</span>
                      <span>{s}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Graded questions overview list */}
          <div className="space-y-6">
            <h3 className="font-bold text-white text-lg border-b border-dark-850 pb-2">Graded Questions Overview</h3>
            {reviewTest.questions.map((q, idx) => {
              const isCoding = q.type === 'Coding';
              const isCorrect = isCoding ? (q.userAnswer.trim().length > 10) : (q.userAnswer === q.correctAnswer);
              return (
                <div key={idx} className="glass-panel border-dark-850 rounded-3xl p-6 space-y-4">
                  <div className="flex justify-between items-start border-b border-dark-850 pb-3 gap-2">
                    <div className="space-y-1">
                      <span className="text-[9px] bg-brand-500/10 text-brand-400 px-2 py-0.5 rounded-full font-bold uppercase">
                        Q{idx + 1} • {q.type}
                      </span>
                      <h4 className="font-bold text-white text-sm pt-1">{q.title}</h4>
                    </div>
                    
                    {/* Correction indicators */}
                    <div className="flex items-center gap-2">
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full font-bold border border-emerald-500/20">
                          <Check size={10} /> Correct (+{q.points} pts)
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-[10px] bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full font-bold border border-red-500/20">
                          <X size={10} /> Incorrect (0 pts)
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-dark-300 leading-relaxed font-sans">{q.description}</p>

                  {/* Answers review details */}
                  <div className="bg-dark-950/60 border border-dark-850/60 p-4 rounded-2xl text-xs space-y-3 font-semibold">
                    {isCoding ? (
                      <div className="space-y-2">
                        <span className="text-[10px] text-dark-400 block font-bold uppercase">Submitted Code Snippet:</span>
                        <pre className="w-full bg-dark-900 border border-dark-850 rounded-xl p-3 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                          {q.userAnswer || '// No answer submitted'}
                        </pre>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-[10px] text-dark-400 block font-bold uppercase mb-1">Your Choice:</span>
                          <span className={`p-2 border rounded-xl block text-xs
                            ${isCorrect ? 'text-emerald-400 border-emerald-500/25 bg-emerald-500/5' : 'text-red-400 border-red-500/25 bg-red-500/5'}
                          `}>
                            {q.userAnswer || 'No Option Selected'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-dark-400 block font-bold uppercase mb-1">Correct Solution:</span>
                          <span className="p-2 border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 rounded-xl block text-xs">
                            {q.correctAnswer}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Review exit buttons */}
          <div className="flex justify-end pt-2">
            <button
              onClick={() => setReviewTest(null)}
              className="rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold px-6 py-3 text-xs border border-brand-500/20 shadow-md transition-colors"
            >
              Exit Review Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MockPlanner;
