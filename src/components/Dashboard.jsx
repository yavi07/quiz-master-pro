import React from 'react';
import { quizCategories } from '../data/quizData';
import ServerInfo from './ServerInfo';

const Dashboard = ({ onStartQuiz, userStats }) => {
  const getCategoryIcon = (categoryKey) => {
    const icons = {
      general: '🌍',
      technology: '💻',
      science: '🔬'
    };
    return icons[categoryKey] || '📚';
  };

  const getCategoryDescription = (categoryKey) => {
    const descriptions = {
      general: 'Test your knowledge of world facts, history, and culture',
      technology: 'Challenge yourself with programming, web dev, and tech concepts',
      science: 'Explore physics, chemistry, biology, and scientific discoveries'
    };
    return descriptions[categoryKey] || 'Test your knowledge';
  };

  return (
    <div className="screen active">
      <div className="container">
        <header className="header">
          <h1 className="app-title">QuizMaster Pro</h1>
          <p className="app-subtitle">Test your knowledge across multiple categories</p>
        </header>

        <ServerInfo />

        <div className="categories-section card">
          <h3>Choose a Quiz Category</h3>
          <div className="categories-grid">
            {Object.entries(quizCategories).map(([key, category]) => {
              const stats = userStats[key] || { bestScore: 0, attempts: 0 };
              return (
                <div 
                  key={key} 
                  className="category-card" 
                  onClick={() => onStartQuiz(key)}
                >
                  <div className="category-icon">
                    {getCategoryIcon(key)}
                  </div>
                  <h4>{category.name}</h4>
                  <p className="category-description">
                    {getCategoryDescription(key)}
                  </p>
                  <div className="category-info">
                    <span className="question-count">
                      {category.questions.length} Questions
                    </span>
                    <span className="time-estimate">
                      ~{Math.ceil(category.questions.length * 0.5)} min
                    </span>
                  </div>
                  <div className="category-stats">
                    <div className="stat-item">
                      <span className="stat-label">Best Score</span>
                      <span className="stat-value">{stats.bestScore}%</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Attempts</span>
                      <span className="stat-value">{stats.attempts}</span>
                    </div>
                  </div>
                  <button className="start-quiz-btn">
                    Start Quiz
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="overall-stats card">
          <h3>Overall Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">
                {Object.values(userStats).reduce((total, stat) => total + (stat.attempts || 0), 0)}
              </span>
              <span className="stat-label">Total Attempts</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {Object.values(userStats).reduce((total, stat) => total + (stat.totalQuestions || 0), 0)}
              </span>
              <span className="stat-label">Questions Answered</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {Object.values(userStats).length > 0 
                  ? Math.round(
                      Object.values(userStats).reduce((total, stat) => {
                        return total + (stat.totalCorrect || 0);
                      }, 0) / 
                      Math.max(Object.values(userStats).reduce((total, stat) => {
                        return total + (stat.totalQuestions || 0);
                      }, 0), 1) * 100
                    )
                  : 0
                }%
              </span>
              <span className="stat-label">Overall Accuracy</span>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {Math.max(...Object.values(userStats).map(stat => stat.bestScore || 0), 0)}%
              </span>
              <span className="stat-label">Best Score</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
