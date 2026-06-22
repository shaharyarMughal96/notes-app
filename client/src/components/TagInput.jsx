import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function TagInput({ tags = [], onChange, allTags = [] }) {
  const [input, setInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const suggestions = allTags.filter(
    t => t.toLowerCase().includes(input.toLowerCase()) && !tags.includes(t)
  );

  function addTag(tag) {
    const clean = tag.trim().toLowerCase().replace(/\s+/g, '-');
    if (clean && !tags.includes(clean)) {
      onChange([...tags, clean]);
    }
    setInput('');
    setShowSuggestions(false);
  }

  function removeTag(tag) {
    onChange(tags.filter(t => t !== tag));
  }

  function handleKeyDown(e) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault();
      addTag(input);
    } else if (e.key === 'Backspace' && !input && tags.length) {
      removeTag(tags[tags.length - 1]);
    }
  }

  return (
    <div className="tag-input-wrapper">
      <div className="tag-chips">
        {tags.map(tag => (
          <span key={tag} className="tag-chip">
            #{tag}
            <button onClick={() => removeTag(tag)} className="tag-remove">
              <X size={10} />
            </button>
          </span>
        ))}
        <div className="tag-input-container">
          <input
            type="text"
            value={input}
            onChange={e => { setInput(e.target.value); setShowSuggestions(true); }}
            onKeyDown={handleKeyDown}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onFocus={() => setShowSuggestions(true)}
            placeholder={tags.length === 0 ? 'Add tags...' : ''}
            className="tag-input"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="tag-suggestions">
              {suggestions.slice(0, 6).map(s => (
                <button key={s} className="tag-suggestion-item" onMouseDown={() => addTag(s)}>
                  #{s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
