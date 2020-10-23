import React from 'react';
import { fireEvent } from '@testing-library/react';
import renderWithRouter from './services/renderWithRouter';
import PokemonDetails from '../components/PokemonDetails';
import pokemons from '../data';

function mockRenderPokemon() {
  return renderWithRouter(<PokemonDetails
    isPokemonFavoriteById={ { 25: true } }
    match={ { params: { id: '25' } } }
    pokemons={ pokemons }
    onUpdateFavoritePokemons={ () => {} }
  />);
}

const pikachu = pokemons.find((pokemon) => pokemon.name === 'Pikachu');

console.log(pikachu);

describe('Test pokemon informations display on screen', () => {
  it('shoud contain <name> beeing pokemon name', () => {
    const { getByRole } = mockRenderPokemon();

    expect(getByRole('heading', { name: 'Pikachu Details' })).toBeInTheDocument();
  });

  it('should NOT render <Pokemon /> with details link', () => {
    const { queryByRole } = mockRenderPokemon();

    expect(queryByRole('link', { name: 'More details' })).toBeNull();
  });

  it('details section SHOULD have a h2 with text Summary', () => {
    const { getByRole } = mockRenderPokemon();

    const summaryHeading = getByRole('heading', { name: 'Summary' });

    expect(summaryHeading).toBeInTheDocument();
  });

  it('details section SHOULD have a paragraph with pokemon info', () => {
    const { getByText } = mockRenderPokemon();

    const summaryHeading = getByText(/This intelligent Pokémon/);

    expect(summaryHeading).toBeInTheDocument();
    expect(summaryHeading.tagName).toBe('P');
  });
});

describe('Test map section', () => {
  it('should have a heading with (game locations of <pokemon>', () => {
    const { getByRole } = mockRenderPokemon();

    const locationsHeading = getByRole('heading', { name: 'Game Locations of Pikachu' });

    expect(locationsHeading).toBeInTheDocument();
  });

  it('should display locations - TEXT', () => {
    const { getByText } = mockRenderPokemon();

    (pikachu.foundAt).forEach((place) => {
      const locationName = place.location;
      expect(getByText(locationName)).toBeInTheDocument();
    });
  });

  it('Should display locations - MAPS with proper: src and alt', () => {
    const { getAllByAltText } = mockRenderPokemon();

    (pikachu.foundAt).forEach((place, index) => {
      const locationMap = getAllByAltText('Pikachu location');

      expect(locationMap[index]).toHaveAttribute('src', `${place.map}`);
    });
  });
});

describe('Check if displayed pokemon can liked', () => {
  it('Page should display a checkBox to like pokemon', () => {
    const { getByRole } = mockRenderPokemon();

    const checkBox = getByRole('checkbox');

    expect(checkBox).toBeInTheDocument();
    expect(checkBox).toHaveAttribute('id', 'favorite');
  });

  it('CheckBox label should be <Pokémon favoritado?>', () => {
    const { getByLabelText, getByRole } = mockRenderPokemon();

    const checkBoxLabel = getByLabelText('Pokémon favoritado?');
    expect(checkBoxLabel).toBeInTheDocument();

    const checkBox = getByRole('checkbox');
    expect(checkBox).toBeInTheDocument();

    expect(checkBox).toStrictEqual(checkBoxLabel);
  });

  it('Multiple clicks on the checkbox should like or dislike pokemon', () => {
    const { getByRole, queryByAltText } = mockRenderPokemon();

    const checkBox = getByRole('checkbox');

    fireEvent.click(checkBox);
    let starIcon = queryByAltText(/Pikachu is marked/);
    expect(starIcon).toBeInTheDocument();

    fireEvent.click(checkBox);
    starIcon = queryByAltText(/Pikachu is marked/);
    expect(starIcon).not.toBeInTheDocument();
  });
});
