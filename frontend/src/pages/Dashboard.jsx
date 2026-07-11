import React, { useContext, useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';
import { AuthContext } from '../context/AuthContext';
import { 
  Flame, 
  Clock, 
  CheckCircle2, 
  Zap, 
  TrendingUp, 
  ChevronRight, 
  AlertTriangle,
  Award,
  BookOpen
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, recsRes] = await Promise.all([
          apiClient.get('/dashboard'),
          apiClient.get('/recommendations')
        ]);
        setStats(statsRes.data);
        setRecs(recsRes.data);
      } catch (err) {
        console.error('Error fetching dashboard datasets:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-transparent">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-dark-700 border-t-brand-500"></div>
      </div>
    );
  }

  // Fallback defaults
  const data = stats || {
    readinessScore: 10,
    streak: 0,
    problemsSolved: { total: 0, easy: 0, medium: 0, hard: 0 },
    studyHours: 0,
    strongTopics: [],
    weakTopics: [],
    recentActivity: [],
    topicCompletionData: []
  };

  // Pie chart data for difficulty distribution
  const difficultyData = [
    { name: 'Easy', value: data.problemsSolved.easy, color: '#22c55e' },
    { name: 'Medium', value: data.problemsSolved.medium, color: '#f97316' },
    { name: 'Hard', value: data.problemsSolved.hard, color: '#ef4444' },
  ].filter(d => d.value > 0);

  // If no problems are solved, display a dummy pie chart element to represent empty state
  const isPieEmpty = difficultyData.length === 0;
  const pieDisplayData = isPieEmpty 
    ? [{ name: 'No Problems Solved', value: 1, color: '#475569' }] 
    : difficultyData;

  return (
    <div className="relative space-y-6 p-1 sm:p-4">
      {/* Background glowing decorations */}
      <div className="absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full glow-accent opacity-75 blur-3xl pointer-events-none" />
      <div className="absolute right-0 bottom-0 -z-10 h-96 w-96 rounded-full glow-accent-cyan opacity-40 blur-3xl pointer-events-none" />

      {/* Header welcome banner */}
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-white">
            Welcome back, <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">{user?.name}</span>!
          </h1>
          <p className="text-dark-400 text-sm">Here is a summary of your interview preparation health.</p>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-dark-900/40 border border-dark-850 px-4 py-2 self-start md:self-auto">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
            <Flame size={20} className="animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-dark-400 block font-medium uppercase">Active Streak</span>
            <span className="font-bold text-sm text-white">{data.streak} Days Practice</span>
          </div>
        </div>
      </div>

      {/* Top statistics cards layout */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Interview Readiness Score Ring Gauge */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex items-center justify-between col-span-1 sm:col-span-2">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-brand-400">
              <TrendingUp size={18} />
              <span className="text-xs font-semibold uppercase tracking-wider">Readiness Assessment</span>
            </div>
            <h2 className="text-2xl font-bold text-white">Interview Readiness</h2>
            <p className="text-xs text-dark-400 max-w-[200px] leading-relaxed">
              Calculated based on average topics completion, accuracy rates, and active study streak.
            </p>
          </div>
          
          <div className="relative flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="h-28 w-28 transform -rotate-90">
              <circle 
                cx="56" cy="56" r="44" 
                className="stroke-dark-800" 
                strokeWidth="8" fill="transparent" 
              />
              <circle 
                cx="56" cy="56" r="44" 
                className="stroke-brand-500 transition-all duration-1000 ease-out" 
                strokeWidth="9" fill="transparent" 
                strokeDasharray={2 * Math.PI * 44}
                strokeDashoffset={2 * Math.PI * 44 * (1 - data.readinessScore / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute text-center">
              <span className="text-2xl font-extrabold text-white">{data.readinessScore}%</span>
              <span className="text-[10px] text-dark-400 block font-bold tracking-wider uppercase">Score</span>
            </div>
          </div>
        </div>

        {/* Problems Solved count */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Solved Progress</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-4xl font-extrabold text-white">{data.problemsSolved.total}</span>
            <span className="text-xs text-dark-400 block mt-1">Coding Problems Completed</span>
          </div>
          <div className="mt-4 flex gap-2">
            <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded font-bold">E: {data.problemsSolved.easy}</span>
            <span className="text-[10px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded font-bold">M: {data.problemsSolved.medium}</span>
            <span className="text-[10px] bg-red-500/10 text-red-400 px-2 py-0.5 rounded font-bold">H: {data.problemsSolved.hard}</span>
          </div>
        </div>

        {/* Study Hours spent */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">Effort Tracker</span>
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-4xl font-extrabold text-white">{data.studyHours}</span>
            <span className="text-xs text-dark-400 block mt-1">Total Hours Practiced</span>
          </div>
          <div className="mt-4 text-[10px] text-dark-400 flex items-center gap-1">
            <Zap size={10} className="text-amber-400" />
            Keep consistency to boost your score
          </div>
        </div>
      </div>

      {/* Analytics Dashboard Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Charts area (Left 2 columns) */}
        <div className="space-y-6 lg:col-span-2">
          {/* Topic completion bar chart */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <BookOpen size={18} className="text-brand-400" /> Topic Practice Distribution
            </h3>
            <div className="h-64 w-full">
              {data.topicCompletionData.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-dark-500">
                  No topic completion data available. Add problems to start tracking.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.topicCompletionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={10} domain={[0, 100]} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} 
                      labelStyle={{ color: '#fff', fontWeight: 'bold' }}
                    />
                    <Bar dataKey="completion" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                      {data.topicCompletionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#8b5cf6' : '#a78bfa'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Weakness vs Strengths lists */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Strong Topics */}
            <div className="glass-panel rounded-2xl p-5 space-y-3">
              <h4 className="font-bold text-emerald-400 text-sm flex items-center gap-2 uppercase tracking-wide">
                <Award size={16} /> Key Strengths
              </h4>
              <div className="space-y-2">
                {data.strongTopics.length === 0 ? (
                  <p className="text-xs text-dark-400 italic py-2">Solve more questions with high accuracy to list strengths here.</p>
                ) : (
                  data.strongTopics.map((topic, i) => (
                    <div key={i} className="flex justify-between items-center bg-dark-900/20 border border-dark-850/60 p-2.5 rounded-xl">
                      <span className="text-sm font-semibold text-white truncate max-w-[120px]">{topic.topicName}</span>
                      <div className="flex gap-2 text-xs">
                        <span className="text-emerald-400 font-bold">{topic.accuracy}% Acc</span>
                        <span className="text-dark-400">({topic.completion}% Done)</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Weak Topics */}
            <div className="glass-panel rounded-2xl p-5 space-y-3">
              <h4 className="font-bold text-red-400 text-sm flex items-center gap-2 uppercase tracking-wide">
                <AlertTriangle size={16} /> Areas to Focus
              </h4>
              <div className="space-y-2">
                {data.weakTopics.length === 0 ? (
                  <p className="text-xs text-dark-400 italic py-2">No critical weak areas detected yet. Good job!</p>
                ) : (
                  data.weakTopics.map((topic, i) => (
                    <div key={i} className="flex justify-between items-center bg-dark-900/20 border border-dark-850/60 p-2.5 rounded-xl">
                      <span className="text-sm font-semibold text-white truncate max-w-[120px]">{topic.topicName}</span>
                      <div className="flex gap-2 text-xs">
                        <span className="text-red-400 font-bold">{topic.accuracy}% Acc</span>
                        <span className="text-dark-400">({topic.completion}% Done)</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar panels (Right 1 column) */}
        <div className="space-y-6">
          {/* Difficulty Pie Chart */}
          <div className="glass-panel rounded-2xl p-5 space-y-4 flex flex-col items-center">
            <h3 className="font-bold text-white text-sm self-start uppercase tracking-wider">Difficulty Distribution</h3>
            <div className="h-44 w-44 relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieDisplayData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieDisplayData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute text-center">
                <span className="text-xl font-extrabold text-white">{data.problemsSolved.total}</span>
                <span className="text-[9px] text-dark-400 block font-bold tracking-wider uppercase">Solved</span>
              </div>
            </div>
            {/* Color labels */}
            <div className="flex justify-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Easy</div>
              <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-orange-500" /> Medium</div>
              <div className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-red-500" /> Hard</div>
            </div>
          </div>

          {/* Intelligent Recommendations */}
          <div className="glass-panel rounded-2xl p-5 space-y-4">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider flex items-center justify-between">
              <span>Next Topics Recommended</span>
              <span className="text-[10px] bg-brand-500/10 text-brand-400 px-2 py-0.5 rounded-full font-bold">Smart Match</span>
            </h3>
            
            <div className="space-y-3">
              {recs.slice(0, 3).map((rec, idx) => (
                <div key={idx} className="bg-dark-900/40 border border-dark-850 p-3 rounded-xl hover:border-brand-500/30 transition-all duration-200">
                  <div className="flex justify-between items-start mb-1.5">
                    <span className="font-bold text-sm text-white">{rec.topicName}</span>
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-extrabold uppercase
                      ${rec.priority === 'High' ? 'bg-red-500/10 text-red-400' : rec.priority === 'Medium' ? 'bg-orange-500/10 text-orange-400' : 'bg-brand-500/10 text-brand-400'}
                    `}>
                      {rec.priority}
                    </span>
                  </div>
                  <p className="text-xs text-dark-400 leading-normal mb-2">{rec.reason}</p>
                  
                  <div className="flex flex-wrap gap-1">
                    {rec.subtopics.slice(0, 3).map((sub, i) => (
                      <span key={i} className="text-[9px] bg-dark-800 text-dark-300 px-1.5 py-0.5 rounded">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity log table */}
      <div className="glass-panel rounded-2xl p-5 space-y-4">
        <h3 className="font-bold text-white text-lg">Recent Activities</h3>
        {data.recentActivity.length === 0 ? (
          <p className="text-sm text-dark-500 text-center py-4">No recent activity logged. Try solving a problem!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-dark-850 text-dark-400 font-medium">
                  <th className="py-2.5">Problem Title</th>
                  <th className="py-2.5">Topic</th>
                  <th className="py-2.5">Difficulty</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Updated At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-900">
                {data.recentActivity.map((act) => (
                  <tr key={act._id} className="text-white hover:bg-dark-900/10 transition-colors">
                    <td className="py-3 font-semibold">{act.title}</td>
                    <td className="py-3 text-dark-300">{act.topic}</td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded font-bold
                        ${act.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : act.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'}
                      `}>
                        {act.difficulty}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-bold
                        ${act.status === 'Solved' ? 'bg-emerald-500/10 text-emerald-400' : act.status === 'Attempted' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}
                      `}>
                        {act.status}
                      </span>
                    </td>
                    <td className="py-3 text-right text-xs text-dark-400">
                      {new Date(act.updatedAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
