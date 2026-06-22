import React, { useState, useEffect, useCallback } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { Plus, Search, Tag, StickyNote, X, ArrowLeft } from 'lucide-react';
import NoteCard from './components/NoteCard';
import RichEditor from './components/RichEditor';
import TagInput from './components/TagInput';
import SaveStatus from './components/SaveStatus';
import { useAutoSave } from './hooks/useAutoSave';
import { useDebounce } from './hooks/useDebounce';
import { fetchNotes, createNote, deleteNote, updateNote, fetchTags } from './utils/api';
import './App.css';

const NOTE_COLORS = ['#ffffff', '#fef9c3', '#dcfce7', '#dbeafe', '#fce7f3', '#ede9fe', '#ffedd5'];

export default function App() {
  const [notes, setNotes] = useState([]);
  const [activeNote, setActiveNote] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [color, setColor] = useState('#ffffff');
  const [allTags, setAllTags] = useState([]);
  const [search, setSearch] = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [loading, setLoading] = useState(true);
  const [showEditor, setShowEditor] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const saveStatus = useAutoSave(
    activeNote?._id,
    { title, content, tags, color },
    !!activeNote
  );

  const loadNotes = useCallback(async () => {
    try {
      const { data } = await fetchNotes({
        search: debouncedSearch || undefined,
        tag: activeTag || undefined,
      });
      setNotes(data.notes);
    } catch {
      toast.error('Could not load notes');
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, activeTag]);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  // tags reload - notes pe dependent nahi, sirf start pe
  useEffect(() => {
    fetchTags()
      .then(({ data }) => setAllTags(data.tags))
      .catch(() => { });
  }, []);

  function openNote(note) {
    setActiveNote(note);
    setTitle(note.title);
    setContent(note.content);
    setTags(note.tags);
    setColor(note.color || '#ffffff');
    setShowEditor(true);
  }

  async function handleNewNote() {
    try {
      const { data } = await createNote({ title: 'Untitled Note', content: '', tags: [] });
      setNotes(prev => [data.note, ...prev]);
      openNote(data.note);
      toast.success('New note created');
    } catch {
      toast.error('Failed to create note');
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this note?')) return;
    try {
      await deleteNote(id);
      setNotes(prev => prev.filter(n => n._id !== id));
      if (activeNote?._id === id) {
        setActiveNote(null);
        setTitle('');
        setContent('');
        setTags([]);
        setShowEditor(false);
      }
      toast.success('Note deleted');
    } catch {
      toast.error('Failed to delete note');
    }
  }

  async function handlePin(note) {
    try {
      const { data } = await updateNote(note._id, { isPinned: !note.isPinned });
      setNotes(prev => prev.map(n => n._id === note._id ? data.note : n));
      if (activeNote?._id === note._id) setActiveNote(data.note);
    } catch {
      toast.error('Failed to pin note');
    }
  }

  // sidebar mein note update karo bina reload ke
  useEffect(() => {
    if (!activeNote) return;
    setNotes(prev => prev.map(n =>
      n._id === activeNote._id
        ? { ...n, title, content, tags, color }
        : n
    ));
  }, [title, content, tags, color]);

  const pinnedNotes = notes.filter(n => n.isPinned);
  const unpinnedNotes = notes.filter(n => !n.isPinned);

  return (
    <div className="app">
      <Toaster position="bottom-right" toastOptions={{ duration: 2000 }} />

      <aside className={`sidebar ${showEditor ? 'mobile-hidden' : ''}`}>
        <div className="sidebar-header">
          <div className="brand">
            <StickyNote size={20} className="brand-icon" />
            <span>NoteFlow</span>
          </div>
          <button className="new-note-btn" onClick={handleNewNote} title="New note">
            <Plus size={16} />
          </button>
        </div>

        <div className="search-wrapper">
          <Search size={14} className="search-icon" />
          <input
            className="search-input"
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <button className="search-clear" onClick={() => setSearch('')}>
              <X size={12} />
            </button>
          )}
        </div>

        {allTags.length > 0 && (
          <div className="tag-filter">
            <div className="tag-filter-label"><Tag size={11} /> Tags</div>
            <div className="tag-filter-list">
              <button
                className={"tag-filter-item " + (!activeTag ? 'active' : '')}
                onClick={() => setActiveTag('')}
              >All</button>
              {allTags.map(t => (
                <button
                  key={t}
                  className={"tag-filter-item " + (activeTag === t ? 'active' : '')}
                  onClick={() => setActiveTag(activeTag === t ? '' : t)}
                >#{t}</button>
              ))}
            </div>
          </div>
        )}

        <div className="notes-list">
          {loading ? (
            <div className="list-empty">Loading...</div>
          ) : notes.length === 0 ? (
            <div className="list-empty">
              {search || activeTag ? 'No notes found' : 'No notes yet — create one!'}
            </div>
          ) : (
            <>
              {pinnedNotes.length > 0 && (
                <>
                  <div className="list-section-label">Pinned</div>
                  {pinnedNotes.map(note => (
                    <NoteCard
                      key={note._id}
                      note={note}
                      isActive={activeNote?._id === note._id}
                      onClick={() => openNote(note)}
                      onDelete={handleDelete}
                      onPin={handlePin}
                    />
                  ))}
                  {unpinnedNotes.length > 0 && <div className="list-section-label">Notes</div>}
                </>
              )}
              {unpinnedNotes.map(note => (
                <NoteCard
                  key={note._id}
                  note={note}
                  isActive={activeNote?._id === note._id}
                  onClick={() => openNote(note)}
                  onDelete={handleDelete}
                  onPin={handlePin}
                />
              ))}
            </>
          )}
        </div>
      </aside>

      <main
        className={`editor-pane ${!showEditor ? 'mobile-hidden' : ''}`}
        style={{ background: color }}
      >
        {activeNote ? (
          <>
            <div className="editor-topbar">
              <button className="back-btn" onClick={() => setShowEditor(false)}>
                <ArrowLeft size={16} />
              </button>
              <input
                className="note-title-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Note title"
              />
              <div className="editor-topbar-right">
                <div className="color-picker">
                  {NOTE_COLORS.map(c => (
                    <button
                      key={c}
                      className={"color-dot " + (color === c ? 'selected' : '')}
                      style={{ background: c, border: c === '#ffffff' ? '1px solid #d1d5db' : 'none' }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
                <SaveStatus status={saveStatus} />
              </div>
            </div>

            <div className="editor-tags">
              <TagInput tags={tags} onChange={setTags} allTags={allTags} />
            </div>

            <div className="editor-body">
              <RichEditor value={content} onChange={setContent} />
            </div>
          </>
        ) : (
          <div className="editor-empty">
            <StickyNote size={48} opacity={0.15} />
            <p>Select a note or create a new one</p>
            <button className="empty-new-btn" onClick={handleNewNote}>
              <Plus size={14} /> New Note
            </button>
          </div>
        )}
      </main>
    </div>
  );
}