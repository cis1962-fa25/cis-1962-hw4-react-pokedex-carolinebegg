import type { Pokemon } from '../types/types';

interface PokemonCardProps {
  pokemon: Pokemon;
  onClick: () => void;
}

const PokemonCard = ({ pokemon, onClick }: PokemonCardProps) => {
  return (
    <button className="pokemon-card" onClick={onClick}>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className="pokemon-card-image"
      />
      <h3 className="pokemon-card-name">
        #{pokemon.id} {pokemon.name}
      </h3>
      <div className="pokemon-card-types">
        {pokemon.types.map(t => (
          <span
            key={t.name}
            className="type-pill"
            style={{ backgroundColor: t.color }}
          >
            {t.name}
          </span>
        ))}
      </div>
    </button>
  );
};

export default PokemonCard;