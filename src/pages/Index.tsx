
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { QuestionCard } from '@/components/QuestionCard';
import { ChatBot } from '@/components/ChatBot';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Brain, MessageSquare, BookOpen, Target } from 'lucide-react';
import { QuestionGenerator } from '@/components/QuestionGenerator';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showGenerator, setShowGenerator] = useState(true);
  const [showQuestions, setShowQuestions] = useState(false);
  const [questions, setQuestions] = useState([]);

  // Stats section
  const stats = [
    { label: "Total Questions", value: "150+", icon: BookOpen, color: "text-blue-600" },
    { label: "Categories", value: "8", icon: Target, color: "text-green-600" },
    { label: "AI Powered", value: "100%", icon: Brain, color: "text-purple-600" },
    { label: "Local Setup", value: "✓", icon: MessageSquare, color: "text-orange-600" }
  ];

  const handleQuestionsGenerated = (generatedQuestions) => {
    setQuestions(generatedQuestions);
    setShowQuestions(true);
    setShowGenerator(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="flex">
        <Sidebar 
          selectedDifficulty={selectedDifficulty}
          setSelectedDifficulty={setSelectedDifficulty}
        />
        
        <main className="flex-1 p-6 ml-64">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </Card>
            ))}
          </div>

          {/* Question Generator */}
          {showGenerator && (
            <div className="mb-10 bg-gradient-to-br from-slate-100 to-blue-100 rounded-xl p-8">
              <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
                Interview Question Generator
              </h1>
              <p className="text-center text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
                Prepare for your next interview with customized questions based on your role and experience level
              </p>
              <QuestionGenerator onQuestionsGenerated={handleQuestionsGenerated} />
            </div>
          )}

          {/* Questions Section */}
          {showQuestions && (
            <>
              <div className="mb-6 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Interview Questions
                  </h2>
                  <p className="text-gray-600">
                    Practice with curated questions and get AI-powered assistance
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setShowGenerator(true);
                    setShowQuestions(false);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Generate New Questions
                </button>
              </div>

              <div className="grid gap-6">
                {questions.map((question, index) => (
                  <QuestionCard key={index} question={question} />
                ))}
              </div>

              {questions.length === 0 && (
                <Card className="p-8 text-center">
                  <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No questions generated yet</h3>
                  <p className="text-gray-600">Please return to the generator and create some questions.</p>
                </Card>
              )}
            </>
          )}
        </main>
      </div>

      {/* Floating Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* Chat Bot */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default Index;
