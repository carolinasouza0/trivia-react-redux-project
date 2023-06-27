import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';

class Feedback extends Component {
  handleNewGame() {
    const { history } = this.props;
    history.push('/');
  }

  handleRanking() {
    const { history } = this.props;
    history.push('/ranking');
  }

  render() {
    const { score, assertions } = this.props;
    const minRightAnswers = 3;
    const feedbackText = assertions < minRightAnswers
      ? 'Could be better...'
      : 'Well Done!';
    return (
      <div>
        <Header />
        <h2 data-testid="feedback-text">
          {feedbackText}
        </h2>
        <h3 data-testid="feedback-total-score">
          {score}
        </h3>
        <h3 data-testid="feedback-total-question">
          {assertions}
        </h3>
        <button
          onClick={ () => this.handleNewGame() }
          data-testid="btn-play-again"
        >
          Jogar novamente
        </button>

        <button
          type="button"
          data-testid="btn-ranking"
          onClick={ () => this.handleRanking() }
        >
          Ranking
        </button>
      </div>
    );
  }
}

Feedback.propTypes = {
  score: PropTypes.number,
  assertions: PropTypes.number,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
}.isRequired;

const mapStateToProps = ({ player }) => ({
  score: player.score,
  assertions: player.assertions,
});

export default connect(mapStateToProps)(Feedback);
