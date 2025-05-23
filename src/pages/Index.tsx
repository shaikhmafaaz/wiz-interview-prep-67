
import React, { useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { QuestionCard } from '@/components/QuestionCard';
import { ChatBot } from '@/components/ChatBot';
import { Header } from '@/components/Header';
import { Card } from '@/components/ui/card';
import { Brain, MessageSquare, BookOpen, Target } from 'lucide-react';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Mock data - will be replaced with API calls
  const mockQuestions = [
    {
      id: 1,
      question: "Explain the difference between TCP and UDP protocols.",
      category: "Networking",
      difficulty: "Medium",
      description: "Understanding fundamental network protocols"
    },
    {
      id: 2,
      question: "What is the difference between process and thread?",
      category: "Operating Systems",
      difficulty: "Easy",
      description: "Core OS concepts about process management"
    },
    {
      id: 3,
      question: "Explain ACID properties in database systems.",
      category: "DBMS",
      difficulty: "Medium",
      description: "Database transaction management principles"
    }
  ];

  const filteredQuestions = mockQuestions.filter(question => {
    const categoryMatch = selectedCategory === 'all' || question.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || question.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const stats = [
    { label: "Total Questions", value: "150+", icon: BookOpen, color: "text-blue-600" },
    { label: "Categories", value: "8", icon: Target, color: "text-green-600" },
    { label: "AI Powered", value: "100%", icon: Brain, color: "text-purple-600" },
    { label: "Local Setup", value: "✓", icon: MessageSquare, color: "text-orange-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />
      
      <div className="flex">
        <Sidebar 
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
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

          {/* Questions Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Interview Questions
            </h2>
            <p className="text-gray-600">
              Practice with curated questions and get AI-powered assistance
            </p>
          </div>

          <div className="grid gap-6">
            {filteredQuestions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <Card className="p-8 text-center">
              <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600">Try adjusting your filters or select a different category.</p>
            </Card>
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
