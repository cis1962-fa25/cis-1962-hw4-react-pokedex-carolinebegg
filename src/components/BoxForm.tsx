// src/components/BoxForm.tsx
import { useState, type FormEvent } from 'react';
import type { BoxEntry, InsertBoxEntry } from '../types/types';

interface BoxFormProps {
    pokemonId: number;
    initialEntry?: BoxEntry;
    onSubmit: (data: InsertBoxEntry) => Promise<void> | void;
    onCancel: () => void;
}

const BoxForm = ({
    pokemonId,
    initialEntry,
    onSubmit,
    onCancel,
}: BoxFormProps) => {
    const [location, setLocation] = useState(initialEntry?.location ?? '');
    // store level as text so the input can be blank while editing
    const [levelText, setLevelText] = useState(
        initialEntry?.level != null ? String(initialEntry.level) : '1'
    );
    const [notes, setNotes] = useState(initialEntry?.notes ?? '');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!location.trim()) {
            setError('Location is required.');
            return;
        }

        // Convert levelText -> number and validate
        const levelNum = Number(levelText);
        if (
            !Number.isFinite(levelNum) ||
            !Number.isInteger(levelNum) ||
            levelNum < 1 ||
            levelNum > 100
        ) {
            setError('Level must be an integer between 1 and 100.');
            return;
        }

        setError(null);
        setSubmitting(true);

        try {
            const data: InsertBoxEntry = {
                pokemonId,
                location: location.trim(),
                level: levelNum,
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
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={submitting}
                />
            </label>

            <label>
                Level (1–100)
                <input
                    type="number"
                    min={1}
                    max={100}
                    value={levelText}
                    onChange={(e) => setLevelText(e.target.value)}
                    disabled={submitting}
                />
            </label>

            <label>
                Notes (optional)
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
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
