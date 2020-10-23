import React from 'react';
import { fireEvent } from '@testing-library/react';
import renderWithRouter from './services/renderWithRouter';
import Pokemon from '../components/Pokemon';
import pokemons from '../data';

const pokemonsDataIndex = pokemons.length - 1;
const randomNumber = Math.floor(Math.random() * pokemonsDataIndex) + 1;

const mockPokemon = pokemons[randomNumber];

describe('Test if a pokemonCard is properlly rendered', () => {
  it('SHOULD display pokemon full name on screen', () => {
    const { getByText } = renderWithRouter(<Pokemon
      pokemon={ mockPokemon }
      isFavorite={ false }
    />);

    expect(getByText(mockPokemon.name)).toBeInTheDocument();
  });

  it('SHOULD: Average weight: <value> <measurementUnit> ', () => {
    const { getByText } = renderWithRouter(<Pokemon
      pokemon={ mockPokemon }
      isFavorite={ false }
    />);

    const weightObj = mockPokemon.averageWeight;
    const weight = `Average weight: ${weightObj.value} ${weightObj.measurementUnit}`;

    expect(getByText(weight)).toBeInTheDocument();
  });

  it('pokemonImage SHOULD be displayed', () => {
    const { getByAltText } = renderWithRouter(<Pokemon
      pokemon={ mockPokemon }
      isFavorite={ false }
    />);

    const pokemonImage = getByAltText(`${mockPokemon.name} sprite`);

    expect(pokemonImage).toBeInTheDocument();
    expect(pokemonImage).toHaveAttribute('src', `${mockPokemon.image}`);
  });
});

describe('testing MORE DETAILS link', () => {
  it('display a MORE DETAILS link to the correct URL', () => {
    const { getByRole } = renderWithRouter(<Pokemon
      pokemon={ mockPokemon }
      isFavorite={ false }
    />);

    const moreDetailsLink = getByRole('link', { name: 'More details' });

    expect(moreDetailsLink).toBeInTheDocument();
    expect(moreDetailsLink).toHaveAttribute('href', `/pokemons/${mockPokemon.id}`);
  });

  // it('Cliking on MORE DETAILS you should be properlly redirected', () => {
  //   const { getByText, getByRole } = renderWithRouter(<Pokemon
  //     pokemon={ mockPokemon }
  //     isFavorite={ false }
  //   />);

  //   const moreDetailsLink = getByRole('link', { name: 'More details' });
  //   fireEvent.click(moreDetailsLink);

  //   const h2 = getByText(`${mockPokemon.name} Details`);

  //   expect(h2).toBeInTheDocument();
  // });

  it('Check if the URL is properlly changed after click on link', () => {
    const { getByRole, history } = renderWithRouter(<Pokemon
      pokemon={ mockPokemon }
      isFavorite={ false }
    />);

    const moreDetailsLink = getByRole('link', { name: 'More details' });

    fireEvent.click(moreDetailsLink);
    const { pathname } = history.location;

    expect(pathname).toBe(`/pokemons/${mockPokemon.id}`);
  });
});

test('There SHOULD BE a star icon displayed on favorite Pokemons', () => {
  const { getByAltText } = renderWithRouter(<Pokemon
    pokemon={ mockPokemon }
    isFavorite
  />);

  const starIcon = getByAltText(`${mockPokemon.name} is marked as favorite`);

  expect(starIcon).toBeInTheDocument();
  expect(starIcon).toHaveAttribute('src', '/star-icon.svg');
});
