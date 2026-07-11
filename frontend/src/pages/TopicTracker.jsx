import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import { 
  ChevronDown, 
  ChevronUp, 
  Plus, 
  Calendar, 
  BookOpen, 
  Settings, 
  Trash2, 
  ExternalLink,
  PlusCircle
} from 'lucide-react';

const TopicTracker = () => {
  const [topics, setTopics] = useState([]);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // New problem form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDifficulty, setNewDifficulty] = useState('Medium');
  const [newPlatform, setNewPlatform] = useState('LeetCode');
  const [newLink, setNewLink] = useState('');
  const [newTime, setNewTime] = useState(30);

  const fetchTopics = async () => {
    try {
      const res = await axios.get(`${API_URL}/topics`);
      setTopics(res.data);
    } catch (err) {
      console.error('Error fetching topics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleExpandTopic = async (topicName) => {
    if (expandedTopic === topicName) {
      setExpandedTopic(null);
      setProblems([]);
      setShowAddForm(false);
    } else {
      setExpandedTopic(topicName);
      setProblems([]);
      setShowAddForm(false);
      try {
        const res = await axios.get(`${API_URL}/problems?topic=${encodeURIComponent(topicName)}`);
        setProblems(res.data);
      } catch (err) {
        console.error('Error fetching problems under topic:', err);
      }
    }
  };

  const handleStatusChange = async (probId, newStatus) => {
    try {
      await axios.put(`${API_URL}/problems/${probId}`, { status: newStatus });
      // Re-fetch problems under topic
      const res = await axios.get(`${API_URL}/problems?topic=${encodeURIComponent(expandedTopic)}`);
      setProblems(res.data);
      // Re-fetch topics stats
      fetchTopics();
    } catch (err) {
      console.error('Error updating problem status:', err);
    }
  };

  const handleDeleteProblem = async (probId) => {
    if (window.confirm('Are you sure you want to delete this problem?')) {
      try {
        await axios.delete(`${API_URL}/problems/${probId}`);
        setProblems(problems.filter(p => p._id !== probId));
        fetchTopics();
      } catch (err) {
        console.error('Error deleting problem:', err);
      }
    }
  };

  const handleAddProblem = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/problems`, {
        title: newTitle,
        difficulty: newDifficulty,
        topic: expandedTopic,
        platform: newPlatform,
        problemLink: newLink,
        timeTaken: Number(newTime),
        status: 'Not Started'
      });
      
      // Reset form
      setNewTitle('');
      setNewLink('');
      setNewTime(30);
      setShowAddForm(false);

      // Re-fetch datasets
      const res = await axios.get(`${API_URL}/problems?topic=${encodeURIComponent(expandedTopic)}`);
      setProblems(res.data);
      fetchTopics();
    } catch (err) {
      console.error('Error adding problem inline:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-transparent">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-dark-700 border-t-brand-500"></div>
      </div>
    );
  }

  const dsaTopics = topics.filter(t => t.category === 'DSA');
  const coreTopics = topics.filter(t => t.category === 'Core CS');

  const renderTopicCard = (topic) => {
    const isExpanded = expandedTopic === topic.topicName;
    return (
      <div key={topic._id} className="glass-panel border-dark-850 rounded-2xl overflow-hidden transition-all duration-200">
        <div 
          onClick={() => handleExpandTopic(topic.topicName)}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 cursor-pointer hover:bg-dark-900/10 transition-colors gap-4"
        >
          {/* Left Topic Name / Solved Count */}
          <div className="space-y-1">
            <h3 className="font-bold text-base text-white">{topic.topicName}</h3>
            <span className="text-xs text-dark-400 block font-semibold uppercase tracking-wider">
              {topic.solvedProblems} / {topic.totalProblems} Solved
            </span>
          </div>

          {/* Progress stats bar */}
          <div className="flex-1 w-full sm:max-w-xs space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-dark-400">Progress</span>
              <span className="text-white">{topic.completionPercentage}%</span>
            </div>
            <div className="h-2 w-full bg-dark-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-500 rounded-full transition-all duration-500" 
                style={{ width: `${topic.completionPercentage}%` }} 
              />
            </div>
          </div>

          {/* Accuracy and Last Practiced */}
          <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-start">
            <div className="text-right">
              <span className="text-[10px] text-dark-400 block font-bold uppercase tracking-wider">Accuracy</span>
              <span className={`text-sm font-extrabold ${topic.accuracy >= 65 ? 'text-emerald-400' : topic.accuracy > 0 ? 'text-orange-400' : 'text-dark-400'}`}>
                {topic.accuracy}%
              </span>
            </div>

            <div className="text-right hidden md:block">
              <span className="text-[10px] text-dark-400 block font-bold uppercase tracking-wider">Last Practiced</span>
              <span className="text-xs text-white">
                {topic.lastPracticed ? new Date(topic.lastPracticed).toLocaleDateString() : 'Never'}
              </span>
            </div>

            <div className="text-dark-400">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </div>
          </div>
        </div>

        {/* Expanded Panel */}
        {isExpanded && (
          <div className="border-t border-dark-850 bg-dark-900/10 p-5 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-bold text-sm text-brand-400 uppercase tracking-wider">Practiced Problems</h4>
              <button 
                onClick={() => setShowAddForm(!showAddForm)}
                className="flex items-center gap-1.5 text-xs bg-brand-600 hover:bg-brand-500 text-white font-semibold px-3 py-1.5 rounded-xl border border-brand-500/20 shadow-md transition-colors"
              >
                <Plus size={14} /> Add Problem
              </button>
            </div>

            {/* Inline Add Problem Form */}
            {showAddForm && (
              <form onSubmit={handleAddProblem} className="bg-dark-900/50 border border-dark-850 p-4 rounded-xl grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                <div className="space-y-1 col-span-1 md:col-span-2">
                  <label className="text-[10px] text-dark-300 font-bold uppercase">Problem Title</label>
                  <input 
                    type="text" required value={newTitle} onChange={e => setNewTitle(e.target.value)}
                    placeholder="e.g. Reverse Linked List" 
                    className="w-full bg-dark-950 border border-dark-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-dark-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-300 font-bold uppercase">Difficulty</label>
                  <select 
                    value={newDifficulty} onChange={e => setNewDifficulty(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-dark-300 font-bold uppercase">Platform</label>
                  <select 
                    value={newPlatform} onChange={e => setNewPlatform(e.target.value)}
                    className="w-full bg-dark-950 border border-dark-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                  >
                    <option>LeetCode</option>
                    <option>GeeksforGeeks</option>
                    <option>HackerRank</option>
                    <option>Codeforces</option>
                    <option>Interview Questions</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-1.5 rounded-lg text-xs"
                >
                  Confirm Add
                </button>
              </form>
            )}

            {problems.length === 0 ? (
              <p className="text-xs text-dark-500 py-2">No problems logged under this topic yet. Click "Add Problem" to log one.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-dark-850 text-dark-400 font-semibold uppercase">
                      <th className="py-2">Title</th>
                      <th className="py-2">Difficulty</th>
                      <th className="py-2">Platform</th>
                      <th className="py-2">Status</th>
                      <th className="py-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-dark-900">
                    {problems.map(prob => (
                      <tr key={prob._id} className="text-white hover:bg-dark-900/20 transition-colors">
                        <td className="py-2.5 font-semibold">
                          {prob.problemLink ? (
                            <a href={prob.problemLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-brand-400 hover:underline">
                              {prob.title} <ExternalLink size={10} className="text-dark-500" />
                            </a>
                          ) : prob.title}
                        </td>
                        <td className="py-2.5">
                          <span className={`px-1.5 py-0.5 rounded font-bold text-[10px]
                            ${prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : prob.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'}
                          `}>
                            {prob.difficulty}
                          </span>
                        </td>
                        <td className="py-2.5 text-dark-300">{prob.platform}</td>
                        <td className="py-2.5">
                          <select 
                            value={prob.status} 
                            onChange={(e) => handleStatusChange(prob._id, e.target.value)}
                            className="bg-dark-950 border border-dark-800 rounded px-1.5 py-0.5 text-[11px] text-white focus:outline-none"
                          >
                            <option>Not Started</option>
                            <option>Attempted</option>
                            <option>Solved</option>
                            <option>Revision Needed</option>
                          </select>
                        </td>
                        <td className="py-2.5 text-right">
                          <button 
                            onClick={() => handleDeleteProblem(prob._id)}
                            className="text-dark-500 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative space-y-6 p-1 sm:p-4">
      {/* Background glow decoration */}
      <div className="absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full glow-accent opacity-60 blur-3xl pointer-events-none" />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-white">Topic Tracker</h1>
        <p className="text-dark-400 text-sm">Monitor DSA and Core Computer Science subjects preparation logs.</p>
      </div>

      {/* Category Tabs */}
      <div className="space-y-6">
        {/* DSA Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 border-b border-dark-850 pb-2">
            <BookOpen size={18} className="text-brand-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Data Structures & Algorithms</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {dsaTopics.map(renderTopicCard)}
          </div>
        </div>

        {/* Core CS Section */}
        <div className="space-y-3 pt-4">
          <div className="flex items-center gap-2 border-b border-dark-850 pb-2">
            <Settings size={18} className="text-brand-400" />
            <h2 className="text-lg font-bold text-white uppercase tracking-wider">Core Computer Science Subjects</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {coreTopics.map(renderTopicCard)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopicTracker;
