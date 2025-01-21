import { useState } from 'react';
import { Sun, Moon, Heart, MessageCircle, Calendar, Activity, MapPin, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';
import AIHealthChat from './components/AIHealthChat';
import PeriodTracker from './components/PeriodTracker';
import SymptomManager from './components/SymptomManager';
import StoreLocator from './components/StoreLocator';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <div className={`${darkMode ? 'dark' : ''} min-h-screen`}>
      <div className={`${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-white text-gray-900'} min-h-screen transition-colors duration-200`}>
        {/* Navigation */}
        <nav className={`fixed w-full z-50 ${darkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="container mx-auto px-6">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-2">
                <Heart className="w-6 h-6 text-pink-500" />
                <span className="font-bold text-lg">HealthAssist</span>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <button onClick={() => scrollToSection('features')} className="hover:text-pink-500 transition-colors">Features</button>
                <button onClick={() => scrollToSection('ai-chat-demo')} className="hover:text-pink-500 transition-colors">AI Chat</button>
                <button onClick={() => scrollToSection('period-tracker-demo')} className="hover:text-pink-500 transition-colors">Period Tracker</button>
                <button onClick={() => scrollToSection('symptom-manager-demo')} className="hover:text-pink-500 transition-colors">Symptoms</button>
                <button onClick={() => scrollToSection('store-locator-demo')} className="hover:text-pink-500 transition-colors">Locations</button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className={`px-4 pt-2 pb-3 space-y-1 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
                <button onClick={() => scrollToSection('features')} className="block px-3 py-2 w-full text-left hover:text-pink-500">Features</button>
                <button onClick={() => scrollToSection('ai-chat-demo')} className="block px-3 py-2 w-full text-left hover:text-pink-500">AI Chat</button>
                <button onClick={() => scrollToSection('period-tracker-demo')} className="block px-3 py-2 w-full text-left hover:text-pink-500">Period Tracker</button>
                <button onClick={() => scrollToSection('symptom-manager-demo')} className="block px-3 py-2 w-full text-left hover:text-pink-500">Symptoms</button>
                <button onClick={() => scrollToSection('store-locator-demo')} className="block px-3 py-2 w-full text-left hover:text-pink-500">Locations</button>
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center px-3 py-2 w-full hover:text-pink-500"
                >
                  {darkMode ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}
                  {darkMode ? 'Light Mode' : 'Dark Mode'}
                </button>
              </div>
            </div>
          )}
        </nav>

        <main className="pt-16">
          {/* Hero Section */}
          <section className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-pink-50 to-purple-50'}`}>
            <div className="container mx-auto px-6">
              <div className="flex flex-col lg:flex-row items-center justify-between">
                <div className="lg:w-1/2 mb-10 lg:mb-0">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                    Empowering Women's Health with AI-Powered Assistance
                  </h1>
                  <p className="text-lg mb-8 text-gray-600 dark:text-gray-300">
                    Your personal health companion that combines AI technology with comprehensive health tracking tools to provide personalized care and support.
                  </p>
                  <button
                    onClick={() => scrollToSection('features')}
                    className="bg-pink-500 text-white px-8 py-3 rounded-lg font-semibold hover:bg-pink-600 transition-colors flex items-center"
                  >
                    Get Started
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
                <div className="lg:w-1/2">
                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80"
                    alt="Women's Health"
                    className="rounded-lg shadow-2xl"
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Features Overview */}
          <section id="features" className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-16">Comprehensive Health Features</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} hover:transform hover:-translate-y-1 transition-all duration-200`}>
                  <MessageCircle className="w-12 h-12 text-pink-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">AI Health Chat</h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>24/7 AI-powered health assistant for instant support and guidance.</p>
                </div>
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} hover:transform hover:-translate-y-1 transition-all duration-200`}>
                  <Calendar className="w-12 h-12 text-pink-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Period Tracking</h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Smart calendar for tracking your cycle with personalized insights.</p>
                </div>
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} hover:transform hover:-translate-y-1 transition-all duration-200`}>
                  <Activity className="w-12 h-12 text-pink-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Symptom Manager</h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Track and analyze your symptoms with visual insights.</p>
                </div>
                <div className={`p-6 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} hover:transform hover:-translate-y-1 transition-all duration-200`}>
                  <MapPin className="w-12 h-12 text-pink-500 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Store Locator</h3>
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Find nearby healthcare facilities and women's health centers.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Feature Demos */}
          <section id="ai-chat-demo" className="py-20">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-16">AI Health Assistant Demo</h2>
              <AIHealthChat darkMode={darkMode} />
            </div>
          </section>

          <section id="period-tracker-demo" className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-16">Period Tracking Demo</h2>
              <PeriodTracker darkMode={darkMode} />
            </div>
          </section>

          <section id="symptom-manager-demo" className="py-20">
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-16">Symptom Manager Demo</h2>
              <SymptomManager darkMode={darkMode} />
            </div>
          </section>

          <section id="store-locator-demo" className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="container mx-auto px-6">
              <h2 className="text-3xl font-bold text-center mb-16">Healthcare Facilities Locator</h2>
              <StoreLocator darkMode={darkMode} />
            </div>
          </section>

          {/* Footer */}
          <footer className={`py-12 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} border-t ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="flex items-center space-x-2 mb-4 md:mb-0">
                  <Heart className="w-6 h-6 text-pink-500" />
                  <span className="font-bold text-lg">HealthAssist</span>
                </div>
                <div className="flex space-x-6">
                  <a href="https://github.com/obsidianspecter" className="hover:text-pink-500 transition-colors">
                    <Github className="w-6 h-6" />
                  </a>
                  <a href="https://twitter.com" className="hover:text-pink-500 transition-colors">
                    <Twitter className="w-6 h-6" />
                  </a>
                  <a href="https://www.linkedin.com/in/anvin141/" className="hover:text-pink-500 transition-colors">
                    <Linkedin className="w-6 h-6" />
                  </a>
                </div>
              </div>
              <div className="mt-8 text-center text-sm text-gray-500">
                <p>&copy; 2024 HealthAssist. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}

export default App;