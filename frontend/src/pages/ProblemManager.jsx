import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../context/AuthContext';
import { 
  Search, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Tag, 
  Filter,
  RefreshCw,
  Clock,
  FileEdit
} from 'lucide-react';

const ProblemManager = () => {
  const [problems, setProblems] = useState([]);
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [search, setSearch] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Add Problem form state
  const [showAddModal, setShowAddModal] = useState(false);
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Medium');
  const [topic, setTopic] = useState('Arrays');
  const [platform, setPlatform] = useState('LeetCode');
  const [link, setLink] = useState('');
  const [timeTaken, setTimeTaken] = useState(30);
  const [status, setStatus] = useState('Not Started');
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const fetchProblems = async () => {
    try {
      const res = await axios.get(`${API_URL}/problems`, {
        params: {
          topic: selectedTopic,
          difficulty: selectedDifficulty,
          status: selectedStatus,
          search
        }
      });
      setProblems(res.data);
    } catch (err) {
      console.error('Error fetching problems:', err);
    }
  };

  const fetchTopics = async () => {
    try {
      const res = await axios.get(`${API_URL}/topics`);
      setTopics(res.data);
    } catch (err) {
      console.error('Error fetching topics list:', err);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProblems();
    }, 300); // 300ms debounce for search query
    return () => clearTimeout(delayDebounce);
  }, [search, selectedTopic, selectedDifficulty, selectedStatus]);

  useEffect(() => {
    fetchTopics();
    setLoading(false);
  }, []);

  const handleCreateProblem = async (e) => {
    e.preventDefault();
    const tagsArray = tagsInput.split(',').map(t => t.trim()).filter(t => t !== '');
    try {
      await axios.post(`${API_URL}/problems`, {
        title,
        difficulty,
        topic,
        platform,
        problemLink: link,
        timeTaken: Number(timeTaken),
        status,
        notes,
        tags: tagsArray
      });

      // Clear Form and close modal
      setTitle('');
      setLink('');
      setTimeTaken(30);
      setStatus('Not Started');
      setNotes('');
      setTagsInput('');
      setShowAddModal(false);

      // Refresh list
      fetchProblems();
    } catch (err) {
      console.error('Error creating coding problem:', err);
    }
  };

  const handleStatusUpdate = async (probId, newStatus) => {
    try {
      await axios.put(`${API_URL}/problems/${probId}`, { status: newStatus });
      fetchProblems();
    } catch (err) {
      console.error('Error updating problem status:', err);
    }
  };

  const handleDeleteProblem = async (probId) => {
    if (window.confirm('Delete this coding problem?')) {
      try {
        await axios.delete(`${API_URL}/problems/${probId}`);
        setProblems(problems.filter(p => p._id !== probId));
      } catch (err) {
        console.error('Error deleting coding problem:', err);
      }
    }
  };

  return (
    <div className="relative space-y-6 p-1 sm:p-4">
      {/* Background radial decorations */}
      <div className="absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full glow-accent opacity-60 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-white">Problem Manager</h1>
          <p className="text-dark-400 text-sm">Add, update, and search across your coding questions.</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold px-4 py-2.5 rounded-xl border border-brand-500/20 shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 self-start sm:self-auto transition-all duration-200"
        >
          <Plus size={18} /> Add Coding Problem
        </button>
      </div>

      {/* Filter panel */}
      <div className="glass-panel border-dark-850 rounded-2xl p-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        {/* Search Input */}
        <div className="relative flex items-center col-span-1 sm:col-span-2 md:col-span-1">
          <Search className="absolute left-3 text-dark-500" size={16} />
          <input 
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search problems or tags..."
            className="w-full bg-dark-900/50 border border-dark-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-dark-500 focus:border-brand-500 focus:outline-none"
          />
        </div>

        {/* Topic Filter */}
        <select
          value={selectedTopic}
          onChange={e => setSelectedTopic(e.target.value)}
          className="bg-dark-900/50 border border-dark-800 rounded-xl py-2 px-3 text-xs text-white focus:border-brand-500 focus:outline-none"
        >
          <option value="">Filter by Topic (All)</option>
          {topics.map(t => (
            <option key={t._id} value={t.topicName}>{t.topicName}</option>
          ))}
        </select>

        {/* Difficulty Filter */}
        <select
          value={selectedDifficulty}
          onChange={e => setSelectedDifficulty(e.target.value)}
          className="bg-dark-900/50 border border-dark-800 rounded-xl py-2 px-3 text-xs text-white focus:border-brand-500 focus:outline-none"
        >
          <option value="">Filter by Difficulty (All)</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>

        {/* Status Filter */}
        <select
          value={selectedStatus}
          onChange={e => setSelectedStatus(e.target.value)}
          className="bg-dark-900/50 border border-dark-800 rounded-xl py-2 px-3 text-xs text-white focus:border-brand-500 focus:outline-none"
        >
          <option value="">Filter by Status (All)</option>
          <option value="Not Started">Not Started</option>
          <option value="Attempted">Attempted</option>
          <option value="Solved">Solved</option>
          <option value="Revision Needed">Revision Needed</option>
        </select>
      </div>

      {/* Problems table */}
      <div className="glass-panel rounded-2xl p-5 overflow-hidden">
        {problems.length === 0 ? (
          <div className="text-center py-10 space-y-2">
            <RefreshCw size={24} className="text-dark-500 animate-spin mx-auto mb-2" />
            <p className="text-sm text-dark-400">No problems match your search filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-dark-850 text-dark-400 font-semibold uppercase text-xs">
                  <th className="py-3 px-2">Title</th>
                  <th className="py-3 px-2">Topic</th>
                  <th className="py-3 px-2">Platform</th>
                  <th className="py-3 px-2">Difficulty</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Time spent</th>
                  <th className="py-3 px-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-900">
                {problems.map(prob => (
                  <tr key={prob._id} className="text-white hover:bg-dark-900/10 transition-colors">
                    <td className="py-4 px-2 max-w-xs">
                      <div className="space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          {prob.problemLink ? (
                            <a href={prob.problemLink} target="_blank" rel="noopener noreferrer" className="hover:text-brand-400 hover:underline flex items-center gap-1">
                              {prob.title} <ExternalLink size={11} className="text-dark-500 shrink-0" />
                            </a>
                          ) : prob.title}
                        </div>
                        {/* Tags */}
                        {prob.tags && prob.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {prob.tags.map((t, idx) => (
                              <span key={idx} className="text-[9px] bg-dark-900 border border-dark-800 text-dark-400 px-1.5 py-0.5 rounded flex items-center gap-0.5 font-semibold">
                                <Tag size={8} /> {t}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* Notes */}
                        {prob.notes && (
                          <p className="text-[11px] text-dark-400 italic font-normal line-clamp-1">{prob.notes}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-2 text-dark-300 font-medium">{prob.topic}</td>
                    <td className="py-4 px-2 text-dark-400">{prob.platform}</td>
                    <td className="py-4 px-2">
                      <span className={`text-xs px-2 py-0.5 rounded font-bold
                        ${prob.difficulty === 'Easy' ? 'bg-emerald-500/10 text-emerald-400' : prob.difficulty === 'Medium' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'}
                      `}>
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="py-4 px-2">
                      <select 
                        value={prob.status} 
                        onChange={(e) => handleStatusUpdate(prob._id, e.target.value)}
                        className={`bg-dark-950 border border-dark-800 rounded-lg px-2 py-1 text-xs text-white focus:outline-none font-semibold
                          ${prob.status === 'Solved' ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5' : prob.status === 'Attempted' ? 'text-amber-400' : prob.status === 'Revision Needed' ? 'text-indigo-400' : 'text-dark-400'}
                        `}
                      >
                        <option>Not Started</option>
                        <option>Attempted</option>
                        <option>Solved</option>
                        <option>Revision Needed</option>
                      </select>
                    </td>
                    <td className="py-4 px-2 text-dark-300 font-semibold flex items-center gap-1 mt-2.5">
                      <Clock size={12} className="text-dark-500" />
                      {prob.timeTaken} mins
                    </td>
                    <td className="py-4 px-2 text-right">
                      <button 
                        onClick={() => handleDeleteProblem(prob._id)}
                        className="text-dark-500 hover:text-red-400 transition-colors p-1"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add problem modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-panel rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-dark-850 pb-3">
              <h3 className="font-extrabold text-lg text-white">Log Coding Problem</h3>
              <button onClick={() => setShowAddModal(false)} className="text-dark-400 hover:text-white font-bold text-sm">Close</button>
            </div>
            <form onSubmit={handleCreateProblem} className="space-y-4 text-xs font-semibold uppercase tracking-wider text-dark-300">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-dark-400">Problem Title *</label>
                  <input 
                    type="text" required value={title} onChange={e => setTitle(e.target.value)}
                    placeholder="e.g. Reverse Linked List"
                    className="w-full bg-dark-900 border border-dark-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-dark-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-dark-400">Topic Area *</label>
                  <select 
                    value={topic} onChange={e => setTopic(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    {topics.map(t => (
                      <option key={t._id} value={t.topicName}>{t.topicName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-dark-400">Difficulty</label>
                  <select 
                    value={difficulty} onChange={e => setDifficulty(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-dark-400">Platform</label>
                  <select 
                    value={platform} onChange={e => setPlatform(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option>LeetCode</option>
                    <option>GeeksforGeeks</option>
                    <option>HackerRank</option>
                    <option>Codeforces</option>
                    <option>Interview Questions</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-dark-400">Time Taken (mins)</label>
                  <input 
                    type="number" value={timeTaken} onChange={e => setTimeTaken(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-dark-400">Problem Link</label>
                  <input 
                    type="url" value={link} onChange={e => setLink(e.target.value)}
                    placeholder="https://leetcode.com/problems/..."
                    className="w-full bg-dark-900 border border-dark-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-dark-600 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-dark-400">Status</label>
                  <select 
                    value={status} onChange={e => setStatus(e.target.value)}
                    className="w-full bg-dark-900 border border-dark-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none"
                  >
                    <option>Not Started</option>
                    <option>Attempted</option>
                    <option>Solved</option>
                    <option>Revision Needed</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-dark-400">Tags (comma separated)</label>
                <input 
                  type="text" value={tagsInput} onChange={e => setTagsInput(e.target.value)}
                  placeholder="e.g. String, Stack, Two Pointer"
                  className="w-full bg-dark-900 border border-dark-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder-dark-600 focus:outline-none"
                />
              </div>

              <div className="space-y-1 font-normal">
                <label className="text-xs font-semibold uppercase tracking-wider text-dark-300">Personal Notes</label>
                <textarea 
                  value={notes} onChange={e => setNotes(e.target.value)}
                  placeholder="Write hints, approach optimizations, complexities..."
                  rows="3"
                  className="w-full bg-dark-900 border border-dark-800 rounded-xl px-3 py-2 text-xs text-white placeholder-dark-600 focus:outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold py-3 border border-brand-500/20 shadow-md transition-colors"
              >
                Log Problem
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProblemManager;
