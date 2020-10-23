import React from 'react';
import renderWithRouter from './services/renderWithRouter';
import NotFound from '../components/NotFound';

test('Teste se página contém um heading h2', () => {
  const { getByRole, getByText } = renderWithRouter(<NotFound />);
  const heading = getByRole('heading', { level: 2 });
  expect(heading).toBeInTheDocument();
  expect(getByText('Page requested not found')).toBeInTheDocument();
});

test('este se página mostra a imagem', () => {
  const { getByAltText } = renderWithRouter(<NotFound />);
  const image = getByAltText('Pikachu crying because the page requested was not found');
  expect(image.src).toBe('https://media.giphy.com/media/kNSeTs31XBZ3G/giphy.gif');
});
