import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import Quiz from './components/Quiz';
import Results from './components/Results';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [quizResults, setQuizResults] = useState(null);
  const [userStats, setUserStats] = useState({});

  useEffect(() => {
    // Load user stats from localStorage
    const savedStats = localStorage.getItem('quiz-stats');
    if (savedStats) {
      try {
        setUserStats(JSON.parse(savedStats));
      } catch (error) {
        console.error('Error loading user stats:', error);
        setUserStats({});
      }
    }
  }, []);

  const handleStartQuiz = (category) => {
    setCurrentCategory(category);
    setCurrentScreen('quiz');
  };

  const handleQuizComplete = (results) => {
    // Update user stats
    const newStats = { ...userStats };
    if (!newStats[currentCategory]) {
      newStats[currentCategory] = { 
        bestScore: 0, 
        attempts: 0, 
        totalQuestions: 0,
        totalCorrect: 0 
      };
    }
    
    const score = Math.round((results.score / results.total) * 100);
    newStats[currentCategory].bestScore = Math.max(newStats[currentCategory].bestScore, score);
    newStats[currentCategory].attempts += 1;
    newStats[currentCategory].totalQuestions += results.total;
    newStats[currentCategory].totalCorrect += results.score;
    
    setUserStats(newStats);
    localStorage.setItem('quiz-stats', JSON.stringify(newStats));
    
    setQuizResults(results);
    setCurrentScreen('results');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
    setCurrentCategory(null);
    setQuizResults(null);
  };

  const handleRetryQuiz = () => {
    setCurrentScreen('quiz');
    setQuizResults(null);
  };

  return (
    <div className="app">
      {currentScreen === 'dashboard' && (
        <Dashboard 
          onStartQuiz={handleStartQuiz} 
          userStats={userStats} 
        />
      )}
      {currentScreen === 'quiz' && (
        <Quiz 
          category={currentCategory} 
          onComplete={handleQuizComplete}
          onBackToDashboard={handleBackToDashboard}
        />
      )}
      {currentScreen === 'results' && (
        <Results 
          results={quizResults}
          category={currentCategory}
          onBackToDashboard={handleBackToDashboard}
          onRetryQuiz={handleRetryQuiz}
        />
      )}
    </div>
  );
}

export default App;
