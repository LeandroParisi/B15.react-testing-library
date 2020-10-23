import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';
import App from '../App';
import renderWithRouter from './services/renderWithRouter';

test('renders a reading with the text `Pokédex`', () => {
  const { getByText } = render(
    <MemoryRouter>
      <App />
    </MemoryRouter>,
  );
  const heading = getByText(/Pokédex/i);
  expect(heading).toBeInTheDocument();
});

test('should render Home page if pathname is /', () => {
  const { getByText } = renderWithRouter(<App />);
  const encounteredPokemons = getByText('Encountered pokémons');
  expect(encounteredPokemons).toBeInTheDocument();
});

describe('testing navbar links', () => {
  it('First link SHOULD be Home', () => {
    const { getAllByRole, getByText } = renderWithRouter(<App />);

    const homeLink = getAllByRole('link')[0];
    const home = getByText('Home');

    expect(home).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });

  it('Second link SHOULD be About', () => {
    const { getAllByRole, getByText } = renderWithRouter(<App />);

    const homeLink = getAllByRole('link')[1];
    const home = getByText('About');

    expect(home).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/about');
  });

  it('Third link SHOULD be About', () => {
    const { getAllByRole, getByText } = renderWithRouter(<App />);

    const homeLink = getAllByRole('link')[2];
    const home = getByText('Favorite Pokémons');

    expect(home).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/favorites');
  });
});

describe('testing redirects upon click', () => {
  it('Test Home Link', () => {
    const { getByText, history } = renderWithRouter(<App />);
    fireEvent.click(getByText('Home'));
    const { pathname } = history.location;
    expect(pathname).toBe('/');
  });

  it('Test About Link', () => {
    const { getByText, history } = renderWithRouter(<App />);
    fireEvent.click(getByText('About'));
    const { pathname } = history.location;
    expect(pathname).toBe('/about');
  });

  it('Test Favorites Link', () => {
    const { getByText, history } = renderWithRouter(<App />);
    fireEvent.click(getByText('Favorite Pokémons'));
    const { pathname } = history.location;
    expect(pathname).toBe('/favorites');
  });

  it('Test anyOther Link - notFound', () => {
    const { getByText, history } = renderWithRouter(<App />);
    history.push('/unexistent-page');
    const pageNotFound = getByText('Page requested not found');
    expect(pageNotFound).toBeInTheDocument();
  });
});
