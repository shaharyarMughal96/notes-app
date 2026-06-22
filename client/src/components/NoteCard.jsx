import React from 'react';
import { Pin, Trash2 } from 'lucide-react';

function stripHtml(html) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function timeAgo(date) {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function NoteCard({ note, isActive, onClick, onDelete, onPin }) {
  const preview = stripHtml(note.content).slice(0, 100);

  return (
    <div
      className={`note-card ${isActive ? 'active' : ''}`}
      style={{ borderLeft: `3px solid ${note.color || '#6366f1'}` }}
      onClick={onClick}
    >
      <div className="note-card-header">
        <span className="note-card-title">{note.title || 'Untitled Note'}</span>
        <div className="note-card-actions">
          <button
            className={`icon-btn pin-btn ${note.isPinned ? 'pinned' : ''}`}
            onClick={e => { e.stopPropagation(); onPin(note); }}
            title={note.isPinned ? 'Unpin' : 'Pin'}
          >
            <Pin size={13} />
          </button>
          <button
            className="icon-btn delete-btn"
            onClick={e => { e.stopPropagation(); onDelete(note._id); }}
            title="Delete"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {preview && <p className="note-card-preview">{preview}</p>}
      <div className="note-card-footer">
        <div className="note-card-tags">
          {note.tags.slice(0, 3).map(tag => (
            <span key={tag} className="note-tag-small">#{tag}</span>
          ))}
        </div>
        <span className="note-card-time">{timeAgo(note.updatedAt)}</span>
      </div>
    </div>
  );
}
