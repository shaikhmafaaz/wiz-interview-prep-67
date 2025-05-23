
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Edit3, 
  Save, 
  CheckCircle, 
  Clock,
  MessageSquare 
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: number;
  question: string;
  category: string;
  difficulty: string;
  description: string;
}

interface QuestionCardProps {
  question: Question;
}

export const QuestionCard = ({ question }: QuestionCardProps) => {
  const [answer, setAnswer] = useState('');
  const [isAnswering, setIsAnswering] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  const handleSaveAnswer = async () => {
    if (!answer.trim()) {
      toast({
        title: "No answer provided",
        description: "Please write an answer before saving.",
        variant: "destructive"
      });
      return;
    }

    // TODO: Replace with actual API call
    console.log('Saving answer:', { questionId: question.id, answer });
    
    // Simulate API call
    setTimeout(() => {
      setIsSaved(true);
      toast({
        title: "Answer saved!",
        description: "Your answer has been saved for review.",
      });
    }, 500);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3">
          <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="outline" className="text-xs">
                {question.category}
              </Badge>
              <Badge className={`text-xs ${getDifficultyColor(question.difficulty)}`}>
                {question.difficulty}
              </Badge>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {question.question}
            </h3>
            <p className="text-sm text-gray-600">
              {question.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {isSaved && (
            <CheckCircle className="h-5 w-5 text-green-600" />
          )}
          <Clock className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      {/* Answer Section */}
      <div className="mt-6">
        {!isAnswering ? (
          <Button 
            onClick={() => setIsAnswering(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Edit3 className="h-4 w-4 mr-2" />
            Write Your Answer
          </Button>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Answer
              </label>
              <Textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here... Be detailed and explain your reasoning."
                className="min-h-[150px]"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Button 
                variant="outline" 
                onClick={() => setIsAnswering(false)}
              >
                Cancel
              </Button>
              
              <div className="flex space-x-2">
                <Button variant="outline">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask AI
                </Button>
                <Button 
                  onClick={handleSaveAnswer}
                  disabled={!answer.trim()}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Answer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
