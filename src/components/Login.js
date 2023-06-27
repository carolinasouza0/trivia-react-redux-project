import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userInfo } from '../redux/actions';
import { fetchToken } from '../services/API';
import { resetScore } from '../redux/actions/login';
import '../styles/Login.css';
import configBtn from '../assets/configuração.png';
import logo from '../assets/logo trivia.png';
import iconeTrybe from '../assets/ícone trybe.png';

class Login extends Component {
  state = {
    name: '',
    gravatarEmail: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(resetScore());
  }

  validaInput = () => {
    const { gravatarEmail, name } = this.state;
    return name && gravatarEmail;
  };

  inputChange = (event) => {
    const { target: { name, value } } = event;
    this.setState(
      {
        [name]: value,
      },
    );
  };

  handleClick = async (event) => {
    event.preventDefault();
    const { history, dispatch } = this.props;
    dispatch(userInfo(this.state));
    const token = await fetchToken();
    localStorage.setItem('token', token);
    history.push('/game');
  };

  cfgBtn = () => {
    const { history } = this.props;
    history.push('/Settings');
  };

  render() {
    const { name, gravatarEmail } = this.state;
    return (
      <div
        className="wrapper-container"
      >
        <img src={ logo } alt="logo" className="logo" />
        <div
          className="login-container"
        >
          <form
            action=""
            className="login-form"
          >
            <label htmlFor="gravatarEmail">
              <input
                name="gravatarEmail"
                placeholder="Qual é o seu e-mail do gravatar?"
                type="email"
                data-testid="input-gravatar-email"
                value={ gravatarEmail }
                onChange={ this.inputChange }
                className="input-login"
              />
            </label>
            <label htmlFor="name">
              <input
                name="name"
                placeholder="Qual é o seu nome?"
                type="text"
                data-testid="input-player-name"
                value={ name }
                onChange={ this.inputChange }
                className="input-login"
              />
            </label>
            <button
              data-testid="btn-play"
              onClick={ this.handleClick }
              disabled={ !this.validaInput() }
              className="btn-play"
            >
              Jogar
            </button>
            <button
              data-testid="btn-settings"
              type="button"
              onClick={ this.cfgBtn }
              className="btn-settings"
            >
              <img src={ configBtn } alt="configurações" className="config-btn" />
              Configurações
            </button>
          </form>
        </div>
        <footer>
          <img src={ iconeTrybe } alt="logo trybe" className="logo-trybe" />
        </footer>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect()(Login);
