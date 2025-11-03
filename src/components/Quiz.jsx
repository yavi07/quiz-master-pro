import { useState, useEffect } from 'react';
import { quizCategories } from '../data/quizData';

const Quiz = ({ category, onComplete, onBackToDashboard }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const questions = quizCategories[category]?.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !isAnswered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isAnswered) {
      // Time's up, auto-submit with no answer
      handleAnswerSelect(null);
    }
  }, [timeLeft, isAnswered]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(30);
    setIsAnswered(false);
    setSelectedAnswer(null);
    setShowFeedback(false);
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (answerIndex) => {
    if (isAnswered) return;

    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    setShowFeedback(true);

    const newAnswer = {
      questionId: currentQuestion.id,
      question: currentQuestion.question,
      selectedAnswer: answerIndex,
      correctAnswer: currentQuestion.correct,
      isCorrect: answerIndex === currentQuestion.correct,
      timeSpent: 30 - timeLeft,
      options: currentQuestion.options
    };

    setUserAnswers([...userAnswers, newAnswer]);

    // Show feedback for 2 seconds, then move to next question
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Quiz completed
        const finalAnswers = [...userAnswers, newAnswer];
        const score = finalAnswers.filter(answer => answer.isCorrect).length;
        onComplete({
          score,
          total: questions.length,
          answers: finalAnswers,
          category: category,
          categoryName: quizCategories[category].name
        });
      }
    }, 2000);
  };

  const getTimerColor = () => {
    if (timeLeft > 20) return '#10b981'; // green
    if (timeLeft > 10) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const getOptionClass = (optionIndex) => {
    if (!showFeedback) {
      return selectedAnswer === optionIndex ? 'selected' : '';
    }

    if (optionIndex === currentQuestion.correct) {
      return 'correct';
    }
    
    if (selectedAnswer === optionIndex && optionIndex !== currentQuestion.correct) {
      return 'incorrect';
    }

    return '';
  };

  if (!currentQuestion) {
    return (
      <div className="quiz-error">
        <h2>Quiz not found</h2>
        <button onClick={onBackToDashboard}>Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="screen active">
      <div className="container">
        <div className="quiz-header">
          <button className="back-btn" onClick={onBackToDashboard}>
            ← Back to Dashboard
          </button>
          <div className="quiz-info">
            <h2>{quizCategories[category].name}</h2>
            <div className="progress-info">
              Question {currentQuestionIndex + 1} of {questions.length}
            </div>
          </div>
        </div>

        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>

        <div className="timer-section">
          <div 
            className="timer"
            style={{ color: getTimerColor() }}
          >
            <div className="timer-circle">
              <span className="timer-text">{timeLeft}s</span>
            </div>
          </div>
        </div>

        <div className="question-card card">
          <h3 className="question-text">
            {currentQuestion.question}
          </h3>

          <div className="options-container">
            {currentQuestion.options.map((option, index) => (
              <button
                key={index}
                className={`option ${getOptionClass(index)}`}
                onClick={() => handleAnswerSelect(index)}
                disabled={isAnswered}
              >
                <span className="option-letter">
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="option-text">{option}</span>
                {showFeedback && index === currentQuestion.correct && (
                  <span className="option-icon">✓</span>
                )}
                {showFeedback && selectedAnswer === index && index !== currentQuestion.correct && (
                  <span className="option-icon">✗</span>
                )}
              </button>
            ))}
          </div>

          {showFeedback && (
            <div className={`feedback ${selectedAnswer === currentQuestion.correct ? 'correct' : 'incorrect'}`}>
              {selectedAnswer === currentQuestion.correct ? (
                <div>
                  <strong>Correct!</strong> Well done!
                </div>
              ) : (
                <div>
                  <strong>Incorrect!</strong> The correct answer is: {currentQuestion.options[currentQuestion.correct]}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="quiz-stats">
          <div className="stat">
            <span className="stat-label">Progress</span>
            <span className="stat-value">
              {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Correct</span>
            <span className="stat-value">
              {userAnswers.filter(answer => answer.isCorrect).length}
            </span>
          </div>
          <div className="stat">
            <span className="stat-label">Remaining</span>
            <span className="stat-value">
              {questions.length - currentQuestionIndex - 1}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
