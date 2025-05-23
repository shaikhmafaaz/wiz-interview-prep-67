
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Network, 
  Server, 
  Database, 
  Shield, 
  Code, 
  Brain,
  Filter,
  BarChart3
} from 'lucide-react';

interface SidebarProps {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  selectedDifficulty: string;
  setSelectedDifficulty: (difficulty: string) => void;
}

export const Sidebar = ({ 
  selectedCategory, 
  setSelectedCategory, 
  selectedDifficulty, 
  setSelectedDifficulty 
}: SidebarProps) => {
  const categories = [
    { id: 'all', name: 'All Topics', icon: Brain, count: 150 },
    { id: 'Networking', name: 'Networking', icon: Network, count: 25 },
    { id: 'Operating Systems', name: 'Operating Systems', icon: Server, count: 30 },
    { id: 'DBMS', name: 'Database Systems', icon: Database, count: 28 },
    { id: 'Cybersecurity', name: 'Cybersecurity', icon: Shield, count: 22 },
    { id: 'Programming', name: 'Programming', icon: Code, count: 35 },
    { id: 'System Design', name: 'System Design', icon: BarChart3, count: 10 }
  ];

  const difficulties = [
    { id: 'all', name: 'All Levels' },
    { id: 'Easy', name: 'Easy' },
    { id: 'Medium', name: 'Medium' },
    { id: 'Hard', name: 'Hard' }
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg border-r border-gray-200 pt-20 overflow-y-auto">
      <div className="p-6">
        {/* Categories */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Filter className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Categories</h3>
          </div>
          <div className="space-y-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                  selectedCategory === category.id
                    ? 'bg-blue-50 border-blue-200 border text-blue-900'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <div className="flex items-center">
                  <category.icon className="h-4 w-4 mr-3" />
                  <span className="text-sm font-medium">{category.name}</span>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {category.count}
                </Badge>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <div className="flex items-center mb-4">
            <BarChart3 className="h-5 w-5 text-gray-600 mr-2" />
            <h3 className="font-semibold text-gray-900">Difficulty</h3>
          </div>
          <div className="space-y-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty.id}
                onClick={() => setSelectedDifficulty(difficulty.id)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  selectedDifficulty === difficulty.id
                    ? 'bg-green-50 border-green-200 border text-green-900'
                    : 'hover:bg-gray-50 text-gray-700'
                }`}
              >
                <span className="text-sm font-medium">{difficulty.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Progress Card */}
        <Card className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-blue-50">
          <h4 className="font-semibold text-gray-900 mb-2">Your Progress</h4>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Questions Answered</span>
              <span className="font-medium">12/150</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" style={{ width: '8%' }}></div>
            </div>
            <p className="text-xs text-gray-600 mt-2">Keep practicing to improve your skills!</p>
          </div>
        </Card>
      </div>
    </aside>
  );
};
