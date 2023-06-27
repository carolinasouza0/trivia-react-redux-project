import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { shuffleArray } from '../services/SortArrayQuestions';
import { scoreAction } from '../redux/actions/actionPlay';

class Question extends Component {
  countDown = 0;

  timeOut = 0;

  constructor() {
    super();
    this.state = {
      countdown: 30,
      areAnswersDisabled: false,
      isNextDisabled: true,
      btnAnswerClick: false,
      questionIndex: 0,
      redirectToFeedback: false,
    };
  }

  async componentDidMount() {
    this.countDown = this.createInterval();
    this.timeOut = this.createTimeout();
  }

  handleClasses = (correct) => {
    const { btnAnswerClick } = this.state;

    if (btnAnswerClick && correct) {
      return 'answer-correct';
    }

    if (btnAnswerClick && !correct) {
      return 'answer-wrong';
    }
  };

  handleSelectAnswer = (correct) => {
    clearInterval(this.countDown);
    this.setState({
      isNextDisabled: false,
      areAnswersDisabled: true,
      btnAnswerClick: true,
    });
    // requisito 9
    const TEN = 10;

    const { countdown } = this.state;
    const { dispatch } = this.props;
    if (correct) {
      const difficulty = this.verifyDifficulty();
      const score = TEN + (countdown * difficulty);
      console.log(score);
      console.log(countdown);
      dispatch(scoreAction(score));
    }
  };

  // requisito 9
  verifyDifficulty = () => {
    const { question } = this.props;
    const { difficulty } = question;
    const hard = 3;
    const medium = 2;
    const easy = 1;
    if (difficulty === 'hard') {
      return hard;
    } if (difficulty === 'medium') {
      return medium;
    }
    return easy;
  };

  getNextQuestion = () => {
    const { questionIndex } = this.state;
    const { updateIndex, player } = this.props;
    const MAX_QUESTIONS = 4;
    if (questionIndex < MAX_QUESTIONS) { // Verifica se não é a última pergunta
      clearInterval(this.countDown);
      clearTimeout(this.timeOut);
      updateIndex();
      this.setState({
        areAnswersDisabled: false,
        isNextDisabled: true,
        btnAnswerClick: false,
        countdown: 30,
        questionIndex: questionIndex + 1, // Avança para a próxima pergunta
      });
      this.countDown = this.createInterval();
      this.timeOut = this.createTimeout();
    } else {
      clearInterval(this.countDown);
      clearTimeout(this.timeOut);
      this.setState({
        redirectToFeedback: true,
      });
      const playerToSave = {
        name: player.name,
        score: player.score,
        gravatarImg: player.gravatarImg,
      };
      // dispatch(setRanking(playerToSave));
      const ranking = JSON.parse(localStorage.getItem('ranking')) || [];
      localStorage.setItem('ranking', JSON.stringify([...ranking, playerToSave]));
    }
  };

  handleNextQuestion = () => {
    clearInterval(this.countDown);
    clearTimeout(this.timeOut);

    this.getNextQuestion();
  };

  createInterval = () => {
    const millisToSecond = 1000;
    return setInterval(() => {
      this.setState((prevState) => {
        if (prevState.countdown === 1) {
          clearInterval(this.countDown);
        }
        return { countdown: prevState.countdown - 1 };
      });
    }, millisToSecond);
  };

  createTimeout = () => {
    const millisToThirtySeconds = 30000;
    return setTimeout(() => {
      console.log('CreateTimeout');
      clearInterval(this.countDown);
      this.setState({
        countdown: 0,
        areAnswersDisabled: true,
        isNextDisabled: false,
      });
    }, millisToThirtySeconds);
  };

  render() {
    const { question } = this.props;
    const { areAnswersDisabled, isNextDisabled,
      countdown, redirectToFeedback } = this.state;

    const correctAnswer = {
      answer: question.correct_answer,
      correct: true,
    };
    const incorrectAnswers = question.incorrect_answers.map((answer) => ({
      answer,
      correct: false,
    }));
    const arrayAnswers = shuffleArray([...incorrectAnswers, correctAnswer]);

    if (redirectToFeedback) {
      return <Redirect to="/feedback" />;
    }
    return (
      <div>
        <span
          data-testid="question-category"
        >
          {question.category}
        </span>
        <p className="time">
          Time:
          {' '}
          { countdown }
        </p>
        <span
          data-testid="question-text"
        >
          {question.question}
        </span>
        <div data-testid="answer-options">
          {arrayAnswers.map(({ answer, correct }, index) => (
            <button
              key={ index }
              type="button"
              disabled={ areAnswersDisabled }
              onClick={ () => this.handleSelectAnswer(correct) }
              className={ this.handleClasses(correct) }
              data-testid={ correct ? 'correct-answer'
                : `wrong-answer-${incorrectAnswers.indexOf}` }
            >

              {answer}
            </button>
          ))}
        </div>
        {
          !isNextDisabled && (
            <button
              type="button"
              data-testid="btn-next"
              onClick={ this.handleNextQuestion }
            >
              Next
            </button>
          )
        }
      </div>
    );
  }
}
Question.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func,
  }).isRequired,
  player: PropTypes.shape({
    gravatarImg: PropTypes.string,
    name: PropTypes.string,
    score: PropTypes.number,
  }).isRequired,
  question: PropTypes.shape({
    category: PropTypes.string,
    correct_answer: PropTypes.string,
    difficulty: PropTypes.string,
    incorrect_answers: PropTypes.arrayOf(PropTypes.string),
    question: PropTypes.string,
  }).isRequired,
  updateIndex: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  player: state.player,
});

export default connect(mapStateToProps)(Question);
