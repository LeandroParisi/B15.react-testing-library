import React from 'react';
import About from '../components/About';
import renderWithRouter from './services/renderWithRouter';

test('Teste se a página contém as informações sobre a Pokédex.', () => {
  const { getByText } = renderWithRouter(<About />);
  const aboutPokedex = getByText('About Pokédex');
  expect(aboutPokedex).toBeInTheDocument();
});

test('Teste se a página contém um heading h2 com o texto About Pokédex', () => {
  const { getByRole } = renderWithRouter(<About />);
  const aboutTitle = getByRole('heading', { level: 2 });
  expect(aboutTitle).toBeInTheDocument();
});

test('Teste se a página contém dois parágrafos com texto sobre a Pokédex', () => {
  const { container } = renderWithRouter(<About />);
  const aboutParagraphs = container.querySelectorAll('p');
  const numberOfParagraphs = 2;
  expect(aboutParagraphs.length).toBe(numberOfParagraphs);
});

test('este se a página contém a seguinte imagem de uma Pokédex', () => {
  const { getByRole } = renderWithRouter(<About />);
  const pokemonImg = getByRole('img');
  expect(pokemonImg).toBeInTheDocument();
  expect(pokemonImg.src).toBe('https://cdn.bulbagarden.net/upload/thumb/8/86/Gen_I_Pok%C3%A9dex.png/800px-Gen_I_Pok%C3%A9dex.png');
});
