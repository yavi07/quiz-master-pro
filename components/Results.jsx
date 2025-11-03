import { useState } from 'react';

const Results = ({ results, category, onBackToDashboard, onRetryQuiz }) => {
  const [showReview, setShowReview] = useState(false);

  if (!results) {
    return (
      <div className="results-error">
        <h2>No results available</h2>
        <button onClick={onBackToDashboard}>Back to Dashboard</button>
      </div>
    );
  }

  const { score, total, answers, categoryName } = results;
  const percentage = Math.round((score / total) * 100);
  const avgTimePerQuestion = answers.reduce((sum, answer) => sum + answer.timeSpent, 0) / answers.length;

  const getGrade = (percentage) => {
    if (percentage >= 90) return { grade: 'A+', color: '#10b981', message: 'Outstanding!' };
    if (percentage >= 80) return { grade: 'A', color: '#059669', message: 'Excellent!' };
    if (percentage >= 70) return { grade: 'B', color: '#d97706', message: 'Good Job!' };
    if (percentage >= 60) return { grade: 'C', color: '#dc2626', message: 'Keep Practicing!' };
    return { grade: 'F', color: '#991b1b', message: 'Try Again!' };
  };

  const gradeInfo = getGrade(percentage);

  const getPerformanceMessage = () => {
    if (percentage >= 90) return "You're a quiz master! 🏆";
    if (percentage >= 80) return "Great performance! 🌟";
    if (percentage >= 70) return "Well done! 👏";
    if (percentage >= 60) return "Good effort! 💪";
    return "Don't give up! 📚";
  };

  return (
    <div className="screen active">
      <div className="container">
        <div className="results-header">
          <button className="back-btn" onClick={onBackToDashboard}>
            ← Back to Dashboard
          </button>
          <h2>Quiz Results</h2>
        </div>

        <div className="results-summary card">
          <div className="score-display">
            <div 
              className="score-circle"
              style={{ borderColor: gradeInfo.color }}
            >
              <span className="score-percentage">{percentage}%</span>
              <span className="score-grade" style={{ color: gradeInfo.color }}>
                {gradeInfo.grade}
              </span>
            </div>
          </div>

          <div className="results-info">
            <h3>{categoryName} Quiz</h3>
            <p className="performance-message">{getPerformanceMessage()}</p>
            <div className="results-stats">
              <div className="result-stat">
                <span className="stat-number">{score}</span>
                <span className="stat-label">Correct</span>
              </div>
              <div className="result-stat">
                <span className="stat-number">{total - score}</span>
                <span className="stat-label">Incorrect</span>
              </div>
              <div className="result-stat">
                <span className="stat-number">{Math.round(avgTimePerQuestion)}s</span>
                <span className="stat-label">Avg Time</span>
              </div>
            </div>
          </div>
        </div>

        <div className="performance-breakdown card">
          <h3>Performance Breakdown</h3>
          <div className="breakdown-stats">
            <div className="breakdown-item">
              <span className="breakdown-label">Questions Answered</span>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill"
                  style={{ 
                    width: '100%', 
                    backgroundColor: '#e5e7eb' 
                  }}
                ></div>
              </div>
              <span className="breakdown-value">{total}/{total}</span>
            </div>
            
            <div className="breakdown-item">
              <span className="breakdown-label">Correct Answers</span>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill"
                  style={{ 
                    width: `${percentage}%`, 
                    backgroundColor: '#10b981' 
                  }}
                ></div>
              </div>
              <span className="breakdown-value">{score}/{total}</span>
            </div>
            
            <div className="breakdown-item">
              <span className="breakdown-label">Time Efficiency</span>
              <div className="breakdown-bar">
                <div 
                  className="breakdown-fill"
                  style={{ 
                    width: `${Math.min((30 - avgTimePerQuestion) / 30 * 100, 100)}%`, 
                    backgroundColor: '#f59e0b' 
                  }}
                ></div>
              </div>
              <span className="breakdown-value">
                {avgTimePerQuestion.toFixed(1)}s avg
              </span>
            </div>
          </div>
        </div>

        <div className="results-actions">
          <button 
            className="review-btn"
            onClick={() => setShowReview(!showReview)}
          >
            {showReview ? 'Hide' : 'Review'} Answers
          </button>
          <button className="retry-btn" onClick={onRetryQuiz}>
            Retry Quiz
          </button>
          <button className="dashboard-btn" onClick={onBackToDashboard}>
            Dashboard
          </button>
        </div>

        {showReview && (
          <div className="answer-review card">
            <h3>Answer Review</h3>
            <div className="review-list">
              {answers.map((answer, index) => (
                <div 
                  key={answer.questionId} 
                  className={`review-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}
                >
                  <div className="review-header">
                    <span className="question-number">Q{index + 1}</span>
                    <span className={`result-icon ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                      {answer.isCorrect ? '✓' : '✗'}
                    </span>
                    <span className="time-spent">{answer.timeSpent}s</span>
                  </div>
                  
                  <div className="review-question">
                    {answer.question}
                  </div>
                  
                  <div className="review-answers">
                    {answer.selectedAnswer !== null && (
                      <div className="user-answer">
                        <span className="answer-label">Your answer:</span>
                        <span className={`answer-text ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                          {String.fromCharCode(65 + answer.selectedAnswer)} - {answer.options[answer.selectedAnswer]}
                        </span>
                      </div>
                    )}
                    
                    {!answer.isCorrect && (
                      <div className="correct-answer">
                        <span className="answer-label">Correct answer:</span>
                        <span className="answer-text correct">
                          {String.fromCharCode(65 + answer.correctAnswer)} - {answer.options[answer.correctAnswer]}
                        </span>
                      </div>
                    )}
                    
                    {answer.selectedAnswer === null && (
                      <div className="no-answer">
                        <span className="answer-text timeout">No answer (Time's up!)</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="motivational-section card">
          <h3>Keep Learning! 📈</h3>
          <div className="tips">
            {percentage >= 90 ? (
              <div className="tip">
                <strong>Amazing work!</strong> You've mastered this category. Try the other categories to expand your knowledge!
              </div>
            ) : percentage >= 70 ? (
              <div className="tip">
                <strong>Great job!</strong> Review the questions you missed and try again to improve your score.
              </div>
            ) : (
              <div className="tip">
                <strong>Keep practicing!</strong> Every attempt helps you learn. Review your answers and try again!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;
