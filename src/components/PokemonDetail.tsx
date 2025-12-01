// src/components/PokemonDetail.tsx
import { useState } from 'react';
import type { Pokemon } from '../types/types';

interface PokemonDetailProps {
  pokemon: Pokemon;
  onCatch?: () => void;
}

const PokemonDetail = ({ pokemon, onCatch }: PokemonDetailProps) => {
  const spriteOptions = [
    { key: 'front_default', src: pokemon.sprites.front_default, label: 'Front' },
    { key: 'back_default', src: pokemon.sprites.back_default, label: 'Back' },
    { key: 'front_shiny', src: pokemon.sprites.front_shiny, label: 'Shiny front' },
    { key: 'back_shiny', src: pokemon.sprites.back_shiny, label: 'Shiny back' },
  ].filter(option => option.src);

  const [spriteIndex, setSpriteIndex] = useState(0);

  const hasSprites = spriteOptions.length > 0;
  const currentSprite = hasSprites ? spriteOptions[spriteIndex] : null;

  const goPrev = () => {
    if (!hasSprites) return;
    setSpriteIndex(i => (i - 1 + spriteOptions.length) % spriteOptions.length);
  };

  const goNext = () => {
    if (!hasSprites) return;
    setSpriteIndex(i => (i + 1) % spriteOptions.length);
  };

  return (
    <div className="pokemon-details">
      <div className="pokemon-detail-card">
        {/* Header bar */}
        <div className="pokemon-detail-header">
          <span className="pokemon-detail-id">#{pokemon.id}</span>
          <h2 className="pokemon-detail-name">{pokemon.name}</h2>
        </div>

        {/* Art box with sprite + arrows */}
        {hasSprites && (
          <div className="pokemon-detail-art-box">
            <button
              type="button"
              className="sprite-nav sprite-nav-left"
              onClick={goPrev}
              disabled={spriteOptions.length <= 1}
            >
              ‹
            </button>

            <img
              src={currentSprite!.src}
              alt={`${pokemon.name} ${currentSprite!.label.toLowerCase()}`}
              className="pokemon-main-sprite"
            />

            <button
              type="button"
              className="sprite-nav sprite-nav-right"
              onClick={goNext}
              disabled={spriteOptions.length <= 1}
            >
              ›
            </button>
          </div>
        )}

        {/* Body content */}
        <p className="pokemon-description">{pokemon.description}</p>

        {/* Types row */}
        <div className="pokemon-detail-section">
          <h3>Types</h3>
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
        </div>

        {/* Stats + Moves side by side on wide screens */}
        <div className="pokemon-detail-layout">
          <div className="pokemon-detail-section">
            <h3>Stats</h3>
            <ul className="stats-list">
              <li>HP: {pokemon.stats.hp}</li>
              <li>Attack: {pokemon.stats.attack}</li>
              <li>Defense: {pokemon.stats.defense}</li>
              <li>Special Attack: {pokemon.stats.specialAttack}</li>
              <li>Special Defense: {pokemon.stats.specialDefense}</li>
              <li>Speed: {pokemon.stats.speed}</li>
            </ul>
          </div>

          <div className="pokemon-detail-section">
            <h3>Moves</h3>
            <ul className="moves-list">
              {pokemon.moves.slice(0, 10).map(move => (
                <li key={move.name}>
                  {move.name}{' '}
                  <span className="move-type">
                    ({move.type.name}
                    {move.power != null ? `, power ${move.power}` : ''}
                    )
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {onCatch && (
          <button
            type="button"
            onClick={onCatch}
            className="pokemon-detail-cta"
          >
            Add to Box
          </button>
        )}
      </div>
    </div>
  );
};

export default PokemonDetail;