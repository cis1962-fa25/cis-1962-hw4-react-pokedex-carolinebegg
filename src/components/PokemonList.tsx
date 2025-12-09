// src/components/PokemonList.tsx
import { useEffect, useState } from 'react';
import type { Pokemon, InsertBoxEntry } from '../types/types';
import { PokemonAPI } from '../api/PokemonAPI';
import PokemonCard from './PokemonCard';
import Modal from './Modal';
import PokemonDetail from './PokemonDetail';
import BoxForm from './BoxForm';

interface PokemonListProps {
    pageSize?: number;
    onPokemonLoaded?: (pokemon: Pokemon[]) => void;
}

const PokemonList = ({ pageSize = 10, onPokemonLoaded }: PokemonListProps) => {
    const [pokemon, setPokemon] = useState<Pokemon[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(
        null
    );
    const [catchingPokemon, setCatchingPokemon] = useState<Pokemon | null>(
        null
    );

    // Because the API just returns Pokemon[] (no total count),
    // we treat it as the last page if we get fewer than pageSize items
    const isLastPage = pokemon.length < pageSize && currentPage > 0;

    const canGoPrev = currentPage > 0;
    const canGoNext = !isLastPage && pokemon.length === pageSize;

    useEffect(() => {
        const fetchPage = async () => {
            setLoading(true);
            setError(null);
            try {
                const offset = currentPage * pageSize;
                const data = await PokemonAPI.getPokemonList(pageSize, offset);
                setPokemon(data);
                if (onPokemonLoaded) {
                    onPokemonLoaded(data);
                }
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        void fetchPage();
    }, [currentPage, pageSize, onPokemonLoaded]);

    const handleCreateBoxEntry = async (entry: InsertBoxEntry) => {
        await PokemonAPI.createBoxEntry(entry);
        setCatchingPokemon(null);
    };

    return (
        <div className="pokemon-list-wrapper">
            <div className="pagination-controls">
                <button
                    type="button"
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={!canGoPrev}
                >
                    Previous
                </button>
                <span>Page {currentPage + 1}</span>
                <button
                    type="button"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={!canGoNext}
                >
                    Next
                </button>
            </div>

            {loading && <p>Loading Pokémon…</p>}
            {error && <p className="error">Error: {error}</p>}

            <div className="pokemon-grid">
                {pokemon.map((p) => (
                    <PokemonCard
                        key={p.id}
                        pokemon={p}
                        onClick={() => setSelectedPokemon(p)}
                    />
                ))}
            </div>

            {/* Details modal */}
            <Modal
                isOpen={!!selectedPokemon}
                onClose={() => setSelectedPokemon(null)}
                title={selectedPokemon ? selectedPokemon.name : ''}
            >
                {selectedPokemon && (
                    <PokemonDetail
                        pokemon={selectedPokemon}
                        onCatch={() => {
                            setCatchingPokemon(selectedPokemon);
                        }}
                    />
                )}
            </Modal>

            {/* Add-to-Box modal */}
            <Modal
                isOpen={!!catchingPokemon}
                onClose={() => setCatchingPokemon(null)}
                title={
                    catchingPokemon
                        ? `Add ${catchingPokemon.name} to Box`
                        : 'Add to Box'
                }
            >
                {catchingPokemon && (
                    <BoxForm
                        pokemonId={catchingPokemon.id}
                        onSubmit={handleCreateBoxEntry}
                        onCancel={() => setCatchingPokemon(null)}
                    />
                )}
            </Modal>
        </div>
    );
};

export default PokemonList;
