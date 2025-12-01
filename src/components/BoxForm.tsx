// src/components/BoxForm.tsx
import { useState, type FormEvent } from 'react';
import type { BoxEntry, InsertBoxEntry } from '../types/types';

interface BoxFormProps {
  pokemonId: number;
  initialEntry?: BoxEntry; // 👈 NEW – used for editing
  onSubmit: (data: InsertBoxEntry) => Promise<void> | void;
  onCancel: () => void;
}

const BoxForm = ({ pokemonId, initialEntry, onSubmit, onCancel }: BoxFormProps) => {
  const [location, setLocation] = useState(initialEntry?.location ?? '');
  const [level, setLevel] = useState(initialEntry?.level ?? 1);
  const [notes, setNotes] = useState(initialEntry?.notes ?? '');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validation
    if (!location.trim()) {
      setError('Location is required.');
      return;
    }
    if (level < 1 || level > 100) {
      setError('Level must be between 1 and 100.');
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const data: InsertBoxEntry = {
        pokemonId,
        location: location.trim(),
        level,
        notes: notes.trim() || undefined,
        // For edits, keep original createdAt; for new ones, use now
        createdAt: initialEntry?.createdAt ?? new Date().toISOString(),
      };

      await onSubmit(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="box-form" onSubmit={handleSubmit}>
      {error && <p className="error">{error}</p>}

      <label>
        Location
        <input
          value={location}
          onChange={e => setLocation(e.target.value)}
          disabled={submitting}
        />
      </label>

      <label>
        Level
        <input
          type="number"
          value={level}
          min={1}
          max={100}
          onChange={e => setLevel(Number(e.target.value))}
          disabled={submitting}
        />
      </label>

      <label>
        Notes (optional)
        <textarea
          value={notes}
          onChange={e => setNotes(e.target.value)}
          disabled={submitting}
        />
      </label>

      <div className="form-actions">
        <button type="button" onClick={onCancel} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default BoxForm;