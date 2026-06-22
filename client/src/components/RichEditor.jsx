import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, false] }],
  ['bold', 'italic', 'underline', 'strike'],
  [{ color: [] }, { background: [] }],
  ['blockquote', 'code-block'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link'],
  ['clean'],
];

export default function RichEditor({ value, onChange }) {
  const containerRef = useRef(null);
  const quillRef = useRef(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => { onChangeRef.current = onChange; }, [onChange]);

  useEffect(() => {
    if (!containerRef.current) return;
    if (quillRef.current) return; // already initialized

    const quill = new Quill(containerRef.current, {
      theme: 'snow',
      modules: { toolbar: TOOLBAR_OPTIONS },
      placeholder: 'Start writing your note...',
    });

    quillRef.current = quill;

    quill.on('text-change', () => {
      onChangeRef.current?.(quill.root.innerHTML);
    });
  }, []);

  useEffect(() => {
    const quill = quillRef.current;
    if (!quill) return;
    if (quill.root.innerHTML !== value) {
      quill.root.innerHTML = value || '';
    }
  }, [value]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div ref={containerRef} />
    </div>
  );
}