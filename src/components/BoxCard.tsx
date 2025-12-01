// src/components/BoxCard.tsx
import type { BoxEntry, Pokemon } from '../types/types';

interface BoxCardProps {
  entry: BoxEntry;
  pokemon?: Pokemon;
  onEdit: (entry: BoxEntry) => void;
  onDelete: (id: string) => void;
}

const BoxCard = ({ entry, pokemon, onEdit, onDelete }: BoxCardProps) => {
  return (
    <div className="box-card">
      <div className="box-card-main">
        {pokemon ? (
          <>
            <div className="box-card-header">
              <strong>
                #{pokemon.id} {pokemon.name}
              </strong>
            </div>
            {pokemon.sprites.front_default && (
              <img
                src={pokemon.sprites.front_default}
                alt={pokemon.name}
                className="box-pokemon-sprite"
              />
            )}
          </>
        ) : (
          <strong>Unknown Pokémon (id: {entry.pokemonId})</strong>
        )}

        <div className="box-entry-details">
          <div>Location: {entry.location}</div>
          <div>Level: {entry.level}</div>
          <div>
            Caught:{' '}
            {new Date(entry.createdAt).toLocaleString(undefined, {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </div>
          {entry.notes && <div>Notes: {entry.notes}</div>}
        </div>
      </div>

      <div className="box-card-actions">
        <button type="button" onClick={() => onEdit(entry)}>
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(entry.id)}
          className="danger"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default BoxCard;