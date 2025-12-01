// src/App.tsx
import { useState } from 'react';
import './App.css';
import PokemonList from './components/PokemonList';
import BoxList from './components/BoxList';
import { PokemonAPI } from './api/PokemonAPI';
import type { Pokemon } from './types/types';

// Set your JWT token once here
PokemonAPI.setToken(
  'eyJhbGciOiJIUzI1NiJ9.eyJwZW5ua2V5IjoiY2JlZ2ciLCJpYXQiOjE3NTkwOTgyMTgsImlzcyI6ImVkdTp1cGVubjpzZWFzOmNpczE5NjIiLCJhdWQiOiJlZHU6dXBlbm46c2VhczpjaXMxOTYyIiwiZXhwIjoxNzY0MjgyMjE4fQ.cmtQffMytUwrU6CNX_8_lLoyXP3t2Bo8AtUZ9JeLt4c',
);

function App() {
  // which view is active: all Pokémon or box
  const [view, setView] = useState<'pokemon' | 'box'>('pokemon');

  // map of pokemonId -> Pokemon, built from pages loaded in the list view
  const [pokemonById, setPokemonById] = useState<Record<number, Pokemon>>({});

  const handlePokemonLoaded = (pokemonList: Pokemon[]) => {
    setPokemonById(prev => {
      const updated: Record<number, Pokemon> = { ...prev };
      for (const p of pokemonList) {
        updated[p.id] = p;
      }
      return updated;
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Pokedex</h1>
      </header>

      <div className="view-toggle">
        <button
          type="button"
          onClick={() => setView('pokemon')}
          className={view === 'pokemon' ? 'active' : ''}
        >
          All Pokémon
        </button>
        <button
          type="button"
          onClick={() => setView('box')}
          className={view === 'box' ? 'active' : ''}
        >
          My Box
        </button>
      </div>

      <main>
        {view === 'pokemon' && (
          <PokemonList onPokemonLoaded={handlePokemonLoaded} />
        )}
        {view === 'box' && <BoxList pokemonById={pokemonById} />}
      </main>
    </div>
  );
}

export default App;