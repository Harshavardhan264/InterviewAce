import React, { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';
import { 
  ShieldAlert, 
  Users, 
  BookOpen, 
  Building2, 
  ClipboardCheck, 
  Plus, 
  Database,
  Trash2,
  Edit,
  X
} from 'lucide-react';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Edit / Creation modes
  const [editCompanyId, setEditCompanyId] = useState(null);

  // Add Company form state
  const [companyName, setCompanyName] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState('Medium');
  const [topicsInput, setTopicsInput] = useState('');
  const [tipsInput, setTipsInput] = useState('');
  
  // Question input
  const [qTitle, setQTitle] = useState('');
  const [qDiff, setQDiff] = useState('Medium');
  const [qDesc, setQDesc] = useState('');
  const [questions, setQuestions] = useState([]);

  // Experience input
  const [expTitle, setExpTitle] = useState('');
  const [expContent, setExpContent] = useState('');
  const [experiences, setExperiences] = useState([]);

  const [message, setMessage] = useState('');

  const fetchAdminData = async () => {
    try {
      const [usersRes, compsRes] = await Promise.all([
        apiClient.get('/admin/users'),
        apiClient.get('/companies')
      ]);
      setUsers(usersRes.data);
      setCompanies(compsRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleAddQuestion = () => {
    if (!qTitle) return;
    setQuestions([...questions, { title: qTitle, difficulty: qDiff, description: qDesc }]);
    setQTitle('');
    setQDesc('');
  };

  const handleRemoveQuestion = (idx) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleAddExperience = () => {
    if (!expTitle || !expContent) return;
    setExperiences([...experiences, { title: expTitle, content: expContent, author: 'User Review', date: 'Just now' }]);
    setExpTitle('');
    setExpContent('');
  };

  const handleRemoveExperience = (idx) => {
    setExperiences(experiences.filter((_, i) => i !== idx));
  };

  const handleStartEdit = (comp) => {
    setEditCompanyId(comp._id);
    setCompanyName(comp.companyName);
    setDifficultyLevel(comp.difficultyLevel);
    setTopicsInput(comp.topics ? comp.topics.join(', ') : '');
    setTipsInput(comp.preparationTips ? comp.preparationTips.join('\n') : '');
    setQuestions(comp.interviewQuestions || []);
    setExperiences(comp.interviewExperiences || []);
    setMessage(`Editing target track: ${comp.companyName}`);
  };

  const handleCancelEdit = () => {
    setEditCompanyId(null);
    setCompanyName('');
    setDifficultyLevel('Medium');
    setTopicsInput('');
    setTipsInput('');
    setQuestions([]);
    setExperiences([]);
    setMessage('');
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to permanently delete this user account?')) {
      try {
        await apiClient.delete(`/admin/users/${userId}`);
        setUsers(users.filter(u => u._id !== userId));
        setMessage('✅ User account deleted successfully!');
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleDeleteCompany = async (compId) => {
    if (window.confirm('Are you sure you want to permanently delete this company guide?')) {
      try {
        await apiClient.delete(`/companies/${compId}`);
        setCompanies(companies.filter(c => c._id !== compId));
        setMessage('✅ Company guide deleted successfully!');
        if (editCompanyId === compId) {
          handleCancelEdit();
        }
      } catch (err) {
        console.error('Error deleting company:', err);
      }
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!companyName) return;

    const topics = topicsInput.split(',').map(t => t.trim()).filter(t => t !== '');
    const preparationTips = tipsInput.split('\n').map(t => t.trim()).filter(t => t !== '');

    const companyData = {
      companyName,
      topics,
      interviewQuestions: questions,
      interviewExperiences: experiences,
      difficultyLevel,
      preparationTips
    };

    setIsSubmitting(true);
    try {
      if (editCompanyId) {
        // Edit mode
        await apiClient.put(`/companies/${editCompanyId}`, companyData);
        setMessage('✅ Company guide updated successfully!');
      } else {
        // Create mode
        await apiClient.post('/companies', companyData);
        setMessage('✅ Company guide published successfully!');
      }
      
      // Reset form & reload
      handleCancelEdit();
      const compsRes = await apiClient.get('/companies');
      setCompanies(compsRes.data);
    } catch (err) {
      console.error('Error saving company listing:', err);
      setMessage('❌ Failed to save company. Double check input fields.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-white">Admin Panel</h1>
        <p className="text-dark-400 text-sm">Manage user accounts, corporate guides, database templates, and global metrics.</p>
      </div>

      {/* Administrative KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-400">
            <Users size={20} />
          </div>
          <div>
            <span className="text-[10px] text-dark-400 block font-bold uppercase">Registered Users</span>
            <span className="text-lg font-bold text-white">{users.length} Enrolled</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
            <Building2 size={20} />
          </div>
          <div>
            <span className="text-[10px] text-dark-400 block font-bold uppercase">Company Guides</span>
            <span className="text-lg font-bold text-white">{companies.length} Configured</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-orange-400">
            <ClipboardCheck size={20} />
          </div>
          <div>
            <span className="text-[10px] text-dark-400 block font-bold uppercase">Mock Exams Pool</span>
            <span className="text-lg font-bold text-white">Live Evaluator</span>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
            <Database size={20} />
          </div>
          <div>
            <span className="text-[10px] text-dark-400 block font-bold uppercase">System Status</span>
            <span className="text-lg font-bold text-white text-emerald-450">MongoDB Sync</span>
          </div>
        </div>
      </div>

      {/* Main Admin Workspace splits */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left Side: Users List directory & Companies config */}
        <div className="space-y-6">
          {/* User Directory */}
          <div className="glass-panel border-dark-850 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Users size={18} className="text-brand-400" /> Users Database Registry
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-dark-850 text-dark-400 font-semibold uppercase">
                    <th className="py-2.5">Student</th>
                    <th className="py-2.5">Email</th>
                    <th className="py-2.5">Streak</th>
                    <th className="py-2.5">Readiness</th>
                    <th className="py-2.5">Role</th>
                    <th className="py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-900 text-white">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-dark-900/15 transition-colors">
                      <td className="py-3 font-semibold">{u.name}</td>
                      <td className="py-3 text-dark-300">{u.email}</td>
                      <td className="py-3 text-orange-400 font-bold">{u.streak || 0} Days</td>
                      <td className="py-3 text-brand-400 font-extrabold">{u.readinessScore || 0}%</td>
                      <td className="py-3 capitalize text-dark-450">{u.role}</td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          className="text-dark-500 hover:text-red-400 transition-colors p-1"
                          title="Delete User"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Company Guides Listing */}
          <div className="glass-panel border-dark-850 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Building2 size={18} className="text-brand-400" /> Configured Corporate Prep Guides
            </h3>
            <div className="space-y-3">
              {companies.map((comp) => (
                <div key={comp._id} className="flex justify-between items-center bg-dark-900/30 border border-dark-850/60 p-4 rounded-2xl hover:border-brand-500/20 transition-all duration-200">
                  <div className="space-y-0.5">
                    <span className="font-bold text-sm text-white">{comp.companyName}</span>
                    <div className="text-[10px] text-dark-400 flex gap-2">
                      <span className="font-semibold text-brand-400">Diff: {comp.difficultyLevel}</span>
                      <span>•</span>
                      <span>{comp.interviewQuestions?.length || 0} Questions</span>
                      <span>•</span>
                      <span>{comp.interviewExperiences?.length || 0} Reviews</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleStartEdit(comp)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/10 text-brand-400 hover:bg-brand-500 hover:text-white transition-colors"
                      title="Edit Track"
                    >
                      <Edit size={13} />
                    </button>
                    <button
                      onClick={() => handleDeleteCompany(comp._id)}
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-400 hover:bg-red-550 hover:text-white transition-colors"
                      title="Delete Track"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side: Create or edit company card */}
        <div className="glass-panel border-dark-850 rounded-3xl p-6 space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Plus size={18} className="text-brand-400" /> 
              {editCompanyId ? 'Edit Company Guide' : 'Create Company Guide'}
            </h3>
            {editCompanyId && (
              <button
                onClick={handleCancelEdit}
                className="flex items-center gap-1 text-[10px] bg-dark-900 hover:bg-dark-850 text-white font-bold px-2.5 py-1.5 rounded-lg border border-dark-800 transition-colors"
              >
                <X size={12} /> Cancel Edit
              </button>
            )}
          </div>

          {message && (
            <div className="p-3 bg-dark-900 border border-dark-800 text-xs font-semibold rounded-xl text-white">
              {message}
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-semibold uppercase tracking-wider text-dark-300">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-dark-400">Company Name *</label>
                <input 
                  type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)}
                  placeholder="e.g. Google"
                  className="w-full bg-dark-900 border border-dark-800 rounded-xl px-3 py-2 text-xs text-white placeholder-dark-600 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-dark-400">General Difficulty</label>
                <select 
                  value={difficultyLevel} onChange={e => setDifficultyLevel(e.target.value)}
                  className="w-full bg-dark-900 border border-dark-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-dark-400">Frequently Asked Topics (comma separated)</label>
              <input 
                type="text" value={topicsInput} onChange={e => setTopicsInput(e.target.value)}
                placeholder="e.g. Graphs, Dynamic Programming, Arrays"
                className="w-full bg-dark-900 border border-dark-800 rounded-xl px-3 py-2 text-xs text-white placeholder-dark-600 focus:outline-none"
              />
            </div>

            <div className="space-y-1 font-normal">
              <label className="text-xs font-semibold uppercase tracking-wider text-dark-300">Preparation Strategy (New line per tip)</label>
              <textarea 
                value={tipsInput} onChange={e => setTipsInput(e.target.value)}
                placeholder="Tip 1: Focus on graph structures.&#10;Tip 2: STAR methodology for behaviorals."
                rows="3"
                className="w-full bg-dark-900 border border-dark-800 rounded-xl px-3 py-2 text-xs text-white placeholder-dark-600 focus:outline-none"
              />
            </div>

            {/* Questions list creation in form */}
            <div className="border border-dark-850 p-4 rounded-2xl space-y-3 bg-dark-900/10">
              <span className="text-[10px] text-dark-400 block font-bold uppercase">Add Coding Question</span>
              <div className="grid grid-cols-3 gap-2">
                <input 
                  type="text" value={qTitle} onChange={e => setQTitle(e.target.value)} placeholder="Title"
                  className="col-span-2 bg-dark-900 border border-dark-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-dark-600 focus:outline-none"
                />
                <select 
                  value={qDiff} onChange={e => setQDiff(e.target.value)}
                  className="bg-dark-900 border border-dark-800 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none"
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
              <input 
                type="text" value={qDesc} onChange={e => setQDesc(e.target.value)} placeholder="Short description"
                className="w-full bg-dark-900 border border-dark-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-dark-600 focus:outline-none font-normal"
              />
              <button 
                type="button" onClick={handleAddQuestion}
                className="flex items-center justify-center gap-1 w-full bg-dark-900 border border-dark-800 text-[11px] text-white py-1.5 rounded-lg hover:bg-dark-850"
              >
                <Plus size={12} /> Add Question to Bank
              </button>

              {questions.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {questions.map((q, i) => (
                    <span 
                      key={i} 
                      onClick={() => handleRemoveQuestion(i)}
                      className="text-[9px] bg-brand-500/10 border border-brand-500/15 text-brand-400 px-2 py-0.5 rounded font-semibold cursor-pointer hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                      title="Click to remove"
                    >
                      {q.title} ({q.difficulty}) &times;
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Experience list creation in form */}
            <div className="border border-dark-850 p-4 rounded-2xl space-y-3 bg-dark-900/10">
              <span className="text-[10px] text-dark-400 block font-bold uppercase">Add Interview Experience</span>
              <input 
                type="text" value={expTitle} onChange={e => setExpTitle(e.target.value)} placeholder="Job Role / Title"
                className="w-full bg-dark-900 border border-dark-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-dark-600 focus:outline-none"
              />
              <textarea 
                value={expContent} onChange={e => setExpContent(e.target.value)} placeholder="Share details..."
                rows="2"
                className="w-full bg-dark-900 border border-dark-800 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-dark-600 focus:outline-none font-normal"
              />
              <button 
                type="button" onClick={handleAddExperience}
                className="flex items-center justify-center gap-1 w-full bg-dark-900 border border-dark-800 text-[11px] text-white py-1.5 rounded-lg hover:bg-dark-850"
              >
                <Plus size={12} /> Add Experience to Bank
              </button>

              {experiences.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {experiences.map((exp, i) => (
                    <span 
                      key={i} 
                      onClick={() => handleRemoveExperience(i)}
                      className="text-[9px] bg-emerald-500/10 border border-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded font-semibold cursor-pointer hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                      title="Click to remove"
                    >
                      {exp.title} &times;
                    </span>
                  ))}
                </div>
              )}
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 border border-emerald-500/20 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : editCompanyId ? 'Update Company Guide' : 'Publish Company Guide'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
