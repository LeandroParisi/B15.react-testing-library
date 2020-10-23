import React from 'react';
import { fireEvent, cleanup } from '@testing-library/react';
import renderWithRouter from './services/renderWithRouter';
import App from '../App';

afterEach(cleanup);

test('Teste se é exibido na tela a mensagem No favorite pokemon found', () => {
  const { getByText } = renderWithRouter(<App />);
  fireEvent.click(getByText('Favorite Pokémons'));
  const noFavFound = getByText('No favorite pokemon found');
  expect(noFavFound).toBeInTheDocument();
});

test('Teste se é exibido todos os cards de pokémons favoritados', () => {
  const { getByText } = renderWithRouter(<App />);
  fireEvent.click(getByText('More details'));
  const favCheckBox = getByText('Pokémon favoritado?');
  fireEvent.click(favCheckBox);
  fireEvent.click(getByText('Favorite Pokémons'));
  const favPikachu = getByText('Pikachu');
  expect(favPikachu).toBeInTheDocument();
});

test('Teste se Não é exibido nenhum card de pokémon não favoritado', () => {
  const { getByText, getAllByTestId } = renderWithRouter(<App />);
  fireEvent.click(getByText('Poison'));
  fireEvent.click(getByText('More details'));
  const favCheckBox = getByText('Pokémon favoritado?');
  fireEvent.click(favCheckBox);
  fireEvent.click(getByText('Favorite Pokémons'));
  const favPokemons = getAllByTestId('pokemon-name');
  const numberOfFavPokemons = 2;
  expect(favPokemons.length).toBe(numberOfFavPokemons);
});
