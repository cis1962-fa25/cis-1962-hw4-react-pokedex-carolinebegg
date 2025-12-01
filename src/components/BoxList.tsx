// src/components/BoxList.tsx
import { useEffect, useState } from 'react';
import type { BoxEntry, Pokemon, InsertBoxEntry, UpdateBoxEntry } from '../types/types';
import { PokemonAPI } from '../api/PokemonAPI';
import BoxCard from './BoxCard';
import Modal from './Modal';
import BoxForm from './BoxForm';

interface BoxListProps {
  pokemonById: Record<number, Pokemon>;
}

interface BoxWithPokemon {
  entry: BoxEntry;
  pokemon?: Pokemon;
}

const BoxList = ({ pokemonById }: BoxListProps) => {
  const [items, setItems] = useState<BoxWithPokemon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [editingEntry, setEditingEntry] = useState<BoxEntry | null>(null);

  const loadBox = async () => {
    setLoading(true);
    setError(null);
    try {
      const ids = await PokemonAPI.getBoxIds(); // string[]
      const entries = await Promise.all(
        ids.map(id => PokemonAPI.getBoxEntry(id)),
      ); // BoxEntry[]

      const withPokemon: BoxWithPokemon[] = entries.map(entry => ({
        entry,
        pokemon: pokemonById[entry.pokemonId],
      }));

      setItems(withPokemon);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBox();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Delete this entry?');
    if (!confirmed) return;

    try {
      await PokemonAPI.deleteBoxEntry(id);
      setItems(prev => prev.filter(item => item.entry.id !== id));
    } catch (err) {
      alert((err as Error).message);
    }
  };

  const handleUpdate = async (data: InsertBoxEntry) => {
    if (!editingEntry) return;

    try {
      const update: UpdateBoxEntry = {
        location: data.location,
        level: data.level,
        notes: data.notes,
        // we typically would not change createdAt or pokemonId on edit
      };

      const updatedEntry = await PokemonAPI.updateBoxEntry(
        editingEntry.id,
        update,
      );

      setItems(prev =>
        prev.map(item =>
          item.entry.id === editingEntry.id
            ? { ...item, entry: updatedEntry }
            : item,
        ),
      );

      setEditingEntry(null);
    } catch (err) {
      // let BoxForm display this by rethrowing
      throw err;
    }
  };

  return (
    <div className="box-list-wrapper">
      <div className="box-list-header">
        <h2>My Box</h2>
        <button type="button" onClick={loadBox} disabled={loading}>
          Refresh
        </button>
      </div>

      {loading && <p>Loading box entries…</p>}
      {error && <p className="error">Error: {error}</p>}
      {!loading && items.length === 0 && !error && (
        <p>You haven&apos;t caught any Pokémon yet.</p>
      )}

      <ul className="box-list">
        {items.map(({ entry, pokemon }) => (
          <li key={entry.id} className="box-list-item">
            <BoxCard
              entry={entry}
              pokemon={pokemon}
              onEdit={e => setEditingEntry(e)}
              onDelete={handleDelete}
            />
          </li>
        ))}
      </ul>

      {/* Edit modal */}
      <Modal
        isOpen={!!editingEntry}
        onClose={() => setEditingEntry(null)}
        title={editingEntry ? 'Edit Box Entry' : ''}
      >
        {editingEntry && (
          <BoxForm
            pokemonId={editingEntry.pokemonId}
            initialEntry={editingEntry}
            onSubmit={handleUpdate}
            onCancel={() => setEditingEntry(null)}
          />
        )}
      </Modal>
    </div>
  );
};

export default BoxList;