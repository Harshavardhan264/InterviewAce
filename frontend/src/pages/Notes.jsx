import React, { useEffect, useState } from 'react';
import apiClient from '../utils/apiClient';
import { 
  FileText, 
  Search, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  X, 
  Folder,
  BookOpen
} from 'lucide-react';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Filter & Search states
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('DSA');

  // Edit / Creation states
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('DSA');
  const [editContent, setEditContent] = useState('');

  const categories = ['DSA', 'OS', 'DBMS', 'CN', 'SQL', 'Interview Tips'];

  const fetchNotes = async () => {
    try {
      const res = await apiClient.get('/notes', {
        params: {
          category: activeCategory,
          search
        }
      });
      setNotes(res.data);
      if (res.data.length > 0 && !selectedNote) {
        // Default select first note
        setSelectedNote(res.data[0]);
      }
    } catch (err) {
      console.error('Error fetching notes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [activeCategory, search]);

  useEffect(() => {
    if (selectedNote) {
      setEditTitle(selectedNote.title);
      setEditCategory(selectedNote.category);
      setEditContent(selectedNote.content);
    }
  }, [selectedNote]);

  const handleCreateNote = async () => {
    try {
      const res = await apiClient.post('/notes', {
        title: 'Untitled Note',
        category: activeCategory,
        content: 'Write details here...'
      });
      // Refresh list, select new note
      const newNote = res.data;
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote);
      setIsEditing(true);
    } catch (err) {
      console.error('Error creating note:', err);
    }
  };

  const handleSaveNote = async () => {
    setIsSaving(true);
    try {
      const res = await apiClient.put(`/notes/${selectedNote._id}`, {
        title: editTitle,
        category: editCategory,
        content: editContent
      });
      
      const updatedNote = res.data;
      
      // Update local state list
      const updatedNotes = notes.map(n => n._id === updatedNote._id ? updatedNote : n);
      setNotes(updatedNotes);
      setSelectedNote(updatedNote);
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving note:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteNote = async () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        await apiClient.delete(`/notes/${selectedNote._id}`);
        const remainingNotes = notes.filter(n => n._id !== selectedNote._id);
        setNotes(remainingNotes);
        setSelectedNote(remainingNotes[0] || null);
        setIsEditing(false);
      } catch (err) {
        console.error('Error deleting note:', err);
      }
    }
  };

  if (loading && notes.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center bg-transparent">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-dark-700 border-t-brand-500"></div>
      </div>
    );
  }

  return (
    <div className="relative space-y-6 p-1 sm:p-4">
      {/* Background radial decorations */}
      <div className="absolute -left-20 -top-20 -z-10 h-72 w-72 rounded-full glow-accent opacity-60 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl text-white">Study Notes</h1>
          <p className="text-dark-400 text-sm">Write, search, and edit your DSA and core Computer Science notes.</p>
        </div>
        <button 
          onClick={handleCreateNote}
          className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold px-4 py-2.5 rounded-xl border border-brand-500/20 shadow-lg shadow-brand-500/10 hover:shadow-brand-500/20 self-start sm:self-auto transition-all duration-200"
        >
          <Plus size={18} /> New Note
        </button>
      </div>

      {/* Categories Horizontal Selector */}
      <div className="flex overflow-x-auto gap-2 pb-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setSelectedNote(null);
            }}
            className={`
              flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold shrink-0 border transition-colors
              ${activeCategory === cat 
                ? 'bg-brand-600/10 text-brand-400 border-brand-500/30' 
                : 'bg-dark-900/10 border-transparent text-dark-400 hover:bg-dark-900/30 hover:text-white'}
            `}
          >
            <Folder size={14} />
            {cat}
          </button>
        ))}
      </div>

      {/* Notebook Split Workspace */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 h-[500px]">
        {/* Left Side: Notes list under active category */}
        <div className="glass-panel rounded-3xl p-4 flex flex-col gap-4 h-full">
          {/* Quick Search */}
          <div className="relative flex items-center shrink-0">
            <Search className="absolute left-3 text-dark-500" size={14} />
            <input 
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search notes..."
              className="w-full bg-dark-900/50 border border-dark-800 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-dark-500 focus:outline-none"
            />
          </div>

          {/* Notes list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {notes.length === 0 ? (
              <p className="text-xs text-dark-500 text-center py-10 font-medium">No notes under this category yet.</p>
            ) : (
              notes.map(note => {
                const isSelected = selectedNote?._id === note._id;
                return (
                  <button
                    key={note._id}
                    onClick={() => {
                      setSelectedNote(note);
                      setIsEditing(false);
                    }}
                    className={`
                      w-full rounded-2xl p-4 text-left border flex flex-col gap-1.5 transition-colors
                      ${isSelected 
                        ? 'bg-brand-600/10 border-brand-500/30 shadow-inner' 
                        : 'bg-dark-900/10 border-transparent hover:bg-dark-900/20'}
                    `}
                  >
                    <h3 className="font-bold text-sm text-white line-clamp-1">{note.title}</h3>
                    <p className="text-[11px] text-dark-400 line-clamp-2 leading-relaxed font-normal">{note.content}</p>
                    <span className="text-[9px] text-dark-500 self-end font-semibold">
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Detailed Reader / Editor */}
        <div className="glass-panel rounded-3xl p-6 h-full flex flex-col md:col-span-2 overflow-hidden">
          {selectedNote ? (
            <div className="flex flex-col h-full space-y-4">
              {/* Note actions toolbar */}
              <div className="flex justify-between items-center border-b border-dark-850 pb-3 shrink-0">
                <div className="space-y-1">
                  <span className="text-[9px] bg-dark-900 border border-dark-800 px-2 py-0.5 rounded font-extrabold uppercase text-dark-300">
                    Category: {selectedNote.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  {isEditing ? (
                    <>
                      <button 
                        onClick={handleSaveNote}
                        disabled={isSaving}
                        className="flex items-center gap-1 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-3 py-1.5 rounded-xl border border-emerald-500/20 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Save size={14} /> {isSaving ? 'Saving...' : 'Save Note'}
                      </button>
                      <button 
                        onClick={() => setIsEditing(false)}
                        className="flex items-center gap-1 text-xs bg-dark-900 hover:bg-dark-850 text-white font-semibold px-3 py-1.5 rounded-xl border border-dark-800 shadow-md transition-colors"
                      >
                        <X size={14} /> Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1 text-xs bg-brand-600 hover:bg-brand-500 text-white font-semibold px-3 py-1.5 rounded-xl border border-brand-500/20 shadow-md transition-colors"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button 
                        onClick={handleDeleteNote}
                        className="flex items-center gap-1 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold px-3 py-1.5 rounded-xl border border-red-500/20 shadow-md transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* View / Edit Mode content splits */}
              {isEditing ? (
                <div className="flex-1 flex flex-col gap-3 overflow-y-auto">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] text-dark-400 font-bold uppercase block">Note Title</label>
                      <input 
                        type="text"
                        value={editTitle}
                        onChange={e => setEditTitle(e.target.value)}
                        className="w-full bg-dark-900 border border-dark-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] text-dark-400 font-bold uppercase block">Category</label>
                      <select 
                        value={editCategory}
                        onChange={e => setEditCategory(e.target.value)}
                        className="w-full bg-dark-900 border border-dark-800 rounded-xl px-2 py-2 text-xs text-white focus:outline-none"
                      >
                        {categories.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col space-y-1">
                    <label className="text-[10px] text-dark-400 font-bold uppercase block">Note Details</label>
                    <textarea 
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      rows="10"
                      placeholder="Write notes... supports standard text"
                      className="w-full flex-1 bg-dark-900 border border-dark-800 rounded-2xl p-4 text-xs text-white focus:outline-none focus:border-brand-500 resize-none font-sans leading-relaxed"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                  <h2 className="text-2xl font-bold text-white tracking-tight">{selectedNote.title}</h2>
                  <div className="text-sm text-dark-300 leading-relaxed whitespace-pre-wrap font-sans">
                    {selectedNote.content}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-dark-500 space-y-2">
              <FileText size={40} className="stroke-1 text-dark-600" />
              <p className="text-sm">Select or create a study note to view details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notes;
