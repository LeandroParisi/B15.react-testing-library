import React from 'react';
import { fireEvent } from '@testing-library/react';
import renderWithRouter from './services/renderWithRouter';
import Pokedex from '../components/Pokedex';
import pokemons from '../data';

const isFavoriteById = {};

function extractPokemonTypes() {
  const pokemonTypesWithDuplicates = pokemons.map((pokemon) => pokemon.type);
  const pokemonTypesWithoutDuplicates = [...(new Set(pokemonTypesWithDuplicates))];
  return pokemonTypesWithoutDuplicates;
}

function checkAllFilterCircling(getByTestId) {
  const firstDisplayedPokemon = getByTestId('pokemon-name').textContent;
  let counter = 1;

  pokemons.forEach(() => {
    fireEvent.click(getByTestId('next-pokemon'));
    const currentDisplayedPokemon = getByTestId('pokemon-name').textContent;
    if (currentDisplayedPokemon !== firstDisplayedPokemon) {
      counter += 1;
    }
  });
  const lastDisplayedPokemon = getByTestId('pokemon-name').textContent;

  expect(counter).toBe(pokemons.length);
  expect(lastDisplayedPokemon).toBe(firstDisplayedPokemon);
}

it('should Properlly render Pokedex', () => {
  const { getByRole } = renderWithRouter(<Pokedex
    pokemons={ pokemons }
    isPokemonFavoriteById={ isFavoriteById }
  />);

  const heading = getByRole('heading', { name: 'Encountered pokémons', level: 2 });
  expect(heading).toBeInTheDocument();
});

describe('Test NEXT Pokemon button click', () => {
  it('O botão deve conter o texto Próximo pokémon', () => {
    const { getByTestId, getByText } = renderWithRouter(<Pokedex
      pokemons={ pokemons }
      isPokemonFavoriteById={ isFavoriteById }
    />);
    const nextPokemon = getByTestId('next-pokemon');
    expect(nextPokemon).toBeInTheDocument();
    const nextPokemonByText = getByText('Próximo pokémon');
    expect(nextPokemonByText).toBeInTheDocument();
    expect(nextPokemon).toStrictEqual(nextPokemonByText);
  });

  it('Should display next pokemon on click and first pokemon after last one', () => {
    const { getByTestId } = renderWithRouter(<Pokedex
      pokemons={ pokemons }
      isPokemonFavoriteById={ isFavoriteById }
    />);
    const numberOfClicks = pokemons.length;
    const initialIndex = 1;
    const nextPokemon = getByTestId('next-pokemon');

    for (let index = initialIndex; index <= numberOfClicks; index += 1) {
      fireEvent.click(nextPokemon);
      const currentPokemon = getByTestId('pokemon-name').textContent;
      if (index === numberOfClicks) {
        expect(currentPokemon).toBe(pokemons[0].name);
      } else {
        expect(currentPokemon).toBe(pokemons[index].name);
      }
    }
  });
});

it('Should display one pokemon at a time', () => {
  const { getAllByTestId } = renderWithRouter(<Pokedex
    pokemons={ pokemons }
    isPokemonFavoriteById={ isFavoriteById }
  />);
  const displayedPokemons = getAllByTestId('pokemon-name');
  expect(displayedPokemons.length).toBe(1);
});

describe('testing filter buttons', () => {
  const pokemonTypes = extractPokemonTypes();

  it('Button text should equal pokemonType', () => {
    const { getAllByTestId, getByTestId } = renderWithRouter(<Pokedex
      pokemons={ pokemons }
      isPokemonFavoriteById={ isFavoriteById }
    />);
    const pokemonButtons = getAllByTestId('pokemon-type-button');
    pokemonButtons.forEach((pokemonButton) => {
      const buttonInnerText = pokemonButton.textContent;
      expect(pokemonTypes).toContain(buttonInnerText);

      fireEvent.click(pokemonButton);
      const displayedPokemonType = getByTestId('pokemonType').textContent;
      expect(buttonInnerText).toBe((displayedPokemonType));
    });
  });

  it('Should circle through pokemons of certain type after filtering', () => {
    const { getAllByTestId, getByTestId } = renderWithRouter(<Pokedex
      pokemons={ pokemons }
      isPokemonFavoriteById={ isFavoriteById }
    />);

    const pokemonButtons = getAllByTestId('pokemon-type-button');

    pokemonButtons.forEach((pokemonButton) => {
      fireEvent.click(pokemonButton);
      const pokemonButtonText = pokemonButton.textContent;
      let displayedPokemonType = getByTestId('pokemonType').textContent;
      expect(displayedPokemonType).toBe(pokemonButtonText);

      fireEvent.click(getByTestId('next-pokemon'));
      displayedPokemonType = getByTestId('pokemonType').textContent;
      expect(displayedPokemonType).toBe(pokemonButtonText);
    });
  });
});

describe('pokedex should have a filter  reset button', () => {
  it('filter reset button should have text <all>', () => {
    const { getByRole } = renderWithRouter(<Pokedex
      pokemons={ pokemons }
      isPokemonFavoriteById={ isFavoriteById }
    />);
    const filterAllButton = getByRole('button', { name: 'All' });
    expect(filterAllButton.textContent).toBe('All');
  });

  it('Selected filter should be ALL on page load', () => {
    const { getByTestId } = renderWithRouter(<Pokedex
      pokemons={ pokemons }
      isPokemonFavoriteById={ isFavoriteById }
    />);

    checkAllFilterCircling(getByTestId);
  });

  it('Pokedex should circle through ALL pokemons after button click on ALL', () => {
    const { getByTestId, getByRole } = renderWithRouter(<Pokedex
      pokemons={ pokemons }
      isPokemonFavoriteById={ isFavoriteById }
    />);

    fireEvent.click(getByRole('button', { name: 'All' }));

    checkAllFilterCircling(getByTestId);
  });
});

describe('Filter by type buttons SHOULD be created dynamically', () => {
  it('Filter by type buttons SHOULD be created dynamically', () => {
    const { getAllByTestId } = renderWithRouter(<Pokedex
      pokemons={ pokemons }
      isPokemonFavoriteById={ isFavoriteById }
    />);

    const pokemonTypes = extractPokemonTypes();

    const filterByTypeButtons = getAllByTestId('pokemon-type-button')
      .map((button) => button.textContent);

    expect(pokemonTypes).toStrictEqual(filterByTypeButtons);
  });

  it('All button SHOULD always be visible', () => {
    const { getAllByTestId, getByTestId, getByRole } = renderWithRouter(<Pokedex
      pokemons={ pokemons }
      isPokemonFavoriteById={ isFavoriteById }
    />);

    const filterByTypeButtons = getAllByTestId('pokemon-type-button');

    filterByTypeButtons.forEach((filterButton) => {
      const filteredPokemonList = pokemons
        .filter((pokemon) => pokemon.type === filterButton.textContent);

      fireEvent.click(filterButton);

      filteredPokemonList.forEach(() => {
        fireEvent.click(getByTestId('next-pokemon'));

        const filterAllButton = getByRole('button', { name: 'All' });
        expect(filterAllButton).toBeEnabled();
      });
    });
  });
});

it('Next pokemon Button SHOULD be disabled if current list has one pokemon', () => {
  const { getByTestId, getByRole } = renderWithRouter(<Pokedex
    pokemons={ pokemons }
    isPokemonFavoriteById={ isFavoriteById }
  />);

  const poisonFilterButton = getByRole('button', { name: 'Poison' });
  fireEvent.click(poisonFilterButton);

  const pokemonName = getByTestId('pokemon-name').textContent;
  expect(pokemonName).toBe('Ekans');

  const nextPokemonButton = getByTestId('next-pokemon');
  expect(nextPokemonButton).not.toBeEnabled();
});
