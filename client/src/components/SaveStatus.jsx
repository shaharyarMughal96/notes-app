import React from 'react';
import { Check, Loader2, AlertCircle } from 'lucide-react';

export default function SaveStatus({ status }) {
  if (status === 'saving') return (
    <span className="save-status saving">
      <Loader2 size={12} className="spin" /> Saving…
    </span>
  );
  if (status === 'error') return (
    <span className="save-status error">
      <AlertCircle size={12} /> Save failed
    </span>
  );
  return (
    <span className="save-status saved">
      <Check size={12} /> Saved
    </span>
  );
}
