import { act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import renderWithRouterAndRedux from './helpers/renderWithRouterAndRedux';

describe('Testes da página de feedback', () => {
  it('Testa um valor de assertion baixo', () => {
    const initialState = {
      player: {
        name: 'Carol',
        assertions: 1,
        score: 90,
        gravatarEmail: 'teste@teste.com',
      },
    };
    const { history } = renderWithRouterAndRedux(<App />, initialState);
    act(() => history.push('/feedback'));
    const score = screen.get('heading', { name: /90/i });
    expect(score).toBeInTheDocument();
    const assertions = screen.getByRole('heading', { name: /1/i });
    expect(assertions).toBeInTheDocument();
    const message = screen.getByRole('heading', { name: /could be better\.\.\./i });
    expect(message).toBeInTheDocument();
    const buttonPlayAgain = screen.getByRole('button', { name: /Jogar novamente/i });
    expect(buttonPlayAgain).toBeInTheDocument();
    const ranking = screen.getByRole('button', { name: /Ranking/i });
    expect(ranking).toBeInTheDocument();
    userEvent.click(ranking);
  });
  it('Testa um valor de assertion alto', () => {
    const initialState = {
      player: {
        name: 'Carol',
        assertions: 5,
        score: 200,
        gravatarEmail: 'teste@teste.com',
      },
    };
    const { history } = renderWithRouterAndRedux(<App />, initialState);
    act(() => history.push('/feedback'));
    const score = screen.getByRole('heading', { name: /200/i });
    expect(score).toBeInTheDocument();
    const assertions = screen.getByRole('heading', { name: /5/i });
    expect(assertions).toBeInTheDocument();
    const message = screen.getByRole('heading', { name: /well done!/i });
    expect(message).toBeInTheDocument();
    const buttonPlayAgain = screen.getByRole('button', { name: /Jogar novamente/i });
    expect(buttonPlayAgain).toBeInTheDocument();
    const ranking = screen.getByRole('button', { name: /Ranking/i });
    expect(ranking).toBeInTheDocument();
    userEvent.click(buttonPlayAgain);
  });

  it('Testa se é redirecionado para a página de ranking', () => {
    const initialState = {
      player: {
        name: 'Carol',
        assertions: 5,
        score: 200,
        gravatarEmail: 'teste@teste.com',
        },
        };
    const { history } = renderWithRouterAndRedux(<App />, initialState);
    act(() => history.push('/feedback'));
    const ranking = screen.getByRole('button', { name: /Ranking/i });
    expect(ranking).toBeInTheDocument();
    userEvent.click(ranking);
    const rankingTitle = screen.getByRole('heading', { name: /Ranking/i });
    expect(rankingTitle).toBeInTheDocument();
  });

  it('Testa se é redirecionado para a página de login', () => {
    const initialState = {
      player: {
        name: 'Carol',
        assertions: 5,
        score: 200,
        gravatarEmail: 'teste@teste.com',
        },
        };
    const { history } = renderWithRouterAndRedux(<App />, initialState);
    act(() => history.push('/feedback'));
    const buttonPlayAgain = screen.getByRole('button', { name: /Jogar novamente/i });
    expect(buttonPlayAgain).toBeInTheDocument();
    userEvent.click(buttonPlayAgain);
    const nameInput = screen.getByTestId('input-player-name');
    expect(nameInput).toBeInTheDocument();
  });
});