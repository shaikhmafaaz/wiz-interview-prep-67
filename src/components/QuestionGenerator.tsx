
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

interface QuestionGeneratorProps {
  onQuestionsGenerated: (questions: any[]) => void;
}

export const QuestionGenerator = ({ onQuestionsGenerated }: QuestionGeneratorProps) => {
  const [role, setRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('fresher');
  const [isLoading, setIsLoading] = useState(false);

  const jobRoles = [
    { id: 'frontend', name: 'Frontend Developer' },
    { id: 'backend', name: 'Backend Developer' },
    { id: 'fullstack', name: 'Full Stack Developer' },
    { id: 'devops', name: 'DevOps Engineer' },
    { id: 'qa', name: 'QA Engineer' },
    { id: 'sre', name: 'Site Reliability Engineer' },
  ];

  // Mock questions by role and experience level
  const mockQuestions = {
    frontend: {
      fresher: [
        {
          id: 1,
          question: "Explain the difference between localStorage and sessionStorage.",
          category: "Frontend",
          difficulty: "Easy",
          description: "Understanding web storage options"
        },
        {
          id: 2,
          question: "What is the box model in CSS?",
          category: "Frontend",
          difficulty: "Easy",
          description: "CSS fundamentals"
        },
        {
          id: 3,
          question: "Explain the concept of event bubbling in JavaScript.",
          category: "Frontend",
          difficulty: "Medium",
          description: "JavaScript event handling"
        }
      ],
      experienced: [
        {
          id: 4,
          question: "Explain how React's Virtual DOM works and its advantages.",
          category: "Frontend",
          difficulty: "Medium",
          description: "React internals"
        },
        {
          id: 5,
          question: "What are React hooks and how do they improve component development?",
          category: "Frontend",
          difficulty: "Medium",
          description: "React hooks"
        },
        {
          id: 6,
          question: "Describe the advantages and challenges of server-side rendering in React applications.",
          category: "Frontend",
          difficulty: "Hard",
          description: "Advanced React concepts"
        }
      ]
    },
    backend: {
      fresher: [
        {
          id: 7,
          question: "Explain what RESTful APIs are and their core principles.",
          category: "Backend",
          difficulty: "Easy",
          description: "API fundamentals"
        },
        {
          id: 8,
          question: "What is the difference between GET and POST HTTP methods?",
          category: "Backend",
          difficulty: "Easy",
          description: "HTTP basics"
        },
        {
          id: 9,
          question: "What are environment variables and why are they important in applications?",
          category: "Backend",
          difficulty: "Easy",
          description: "Application configuration"
        }
      ],
      experienced: [
        {
          id: 10,
          question: "Explain the concept of database normalization and when you might want to denormalize.",
          category: "Backend",
          difficulty: "Medium",
          description: "Database design principles"
        },
        {
          id: 11,
          question: "What are microservices? Describe their advantages and challenges compared to monolithic architectures.",
          category: "Backend",
          difficulty: "Hard",
          description: "System architecture"
        },
        {
          id: 12,
          question: "Explain different strategies for handling authentication in distributed systems.",
          category: "Backend",
          difficulty: "Hard",
          description: "Security and auth"
        }
      ]
    },
    fullstack: {
      fresher: [
        {
          id: 13,
          question: "What does the acronym MERN or MEAN stand for in web development?",
          category: "Full Stack",
          difficulty: "Easy",
          description: "Web development stacks"
        },
        {
          id: 14,
          question: "Explain the concept of responsive design and how you would implement it.",
          category: "Full Stack",
          difficulty: "Easy", 
          description: "UI/UX fundamentals"
        },
        {
          id: 15,
          question: "What is CORS and why is it important?",
          category: "Full Stack",
          difficulty: "Medium",
          description: "Web security concepts"
        }
      ],
      experienced: [
        {
          id: 16,
          question: "Describe your approach to ensuring data consistency across front-end and back-end in a complex application.",
          category: "Full Stack",
          difficulty: "Hard",
          description: "System design"
        },
        {
          id: 17,
          question: "What strategies would you use to optimize performance in a full-stack web application?",
          category: "Full Stack",
          difficulty: "Hard",
          description: "Performance optimization"
        },
        {
          id: 18,
          question: "How would you implement real-time features in a web application?",
          category: "Full Stack", 
          difficulty: "Hard",
          description: "Advanced web techniques"
        }
      ]
    },
    devops: {
      fresher: [
        {
          id: 19,
          question: "What is CI/CD and why is it important?",
          category: "DevOps",
          difficulty: "Easy",
          description: "Development workflow"
        },
        {
          id: 20,
          question: "Explain the difference between Docker and virtual machines.",
          category: "DevOps",
          difficulty: "Medium",
          description: "Containerization concepts"
        },
        {
          id: 21,
          question: "What is version control and why is it important in software development?",
          category: "DevOps",
          difficulty: "Easy",
          description: "Development tools"
        }
      ],
      experienced: [
        {
          id: 22,
          question: "Describe how you would set up a highly available and fault-tolerant infrastructure on AWS.",
          category: "DevOps",
          difficulty: "Hard",
          description: "Cloud architecture"
        },
        {
          id: 23,
          question: "Explain the concept of Infrastructure as Code and its benefits.",
          category: "DevOps",
          difficulty: "Medium",
          description: "Modern infrastructure practices"
        },
        {
          id: 24,
          question: "How would you handle secrets management in a Kubernetes environment?",
          category: "DevOps",
          difficulty: "Hard",
          description: "Security practices"
        }
      ]
    },
    qa: {
      fresher: [
        {
          id: 25,
          question: "What is the difference between black-box and white-box testing?",
          category: "QA",
          difficulty: "Easy",
          description: "Testing fundamentals"
        },
        {
          id: 26,
          question: "Explain the testing pyramid concept.",
          category: "QA",
          difficulty: "Medium",
          description: "Testing strategy"
        },
        {
          id: 27,
          question: "What are the key components of a good bug report?",
          category: "QA",
          difficulty: "Easy",
          description: "QA processes"
        }
      ],
      experienced: [
        {
          id: 28,
          question: "How would you design an automated testing strategy for a complex web application?",
          category: "QA",
          difficulty: "Hard",
          description: "Test automation"
        },
        {
          id: 29,
          question: "Explain how you would implement performance testing for a high-traffic web application.",
          category: "QA",
          difficulty: "Hard",
          description: "Performance testing"
        },
        {
          id: 30,
          question: "What are some effective strategies for testing microservices architecture?",
          category: "QA",
          difficulty: "Hard",
          description: "Advanced testing concepts"
        }
      ]
    },
    sre: {
      fresher: [
        {
          id: 31,
          question: "What is the difference between SRE and DevOps?",
          category: "SRE",
          difficulty: "Easy",
          description: "Role definitions"
        },
        {
          id: 32,
          question: "Explain what SLIs, SLOs, and SLAs are.",
          category: "SRE",
          difficulty: "Medium",
          description: "Reliability metrics"
        },
        {
          id: 33,
          question: "What is the purpose of monitoring in an SRE context?",
          category: "SRE",
          difficulty: "Easy",
          description: "Operational visibility"
        }
      ],
      experienced: [
        {
          id: 34,
          question: "How would you implement and manage error budgets?",
          category: "SRE",
          difficulty: "Hard",
          description: "Reliability engineering"
        },
        {
          id: 35,
          question: "Explain how you would design an alerting system that minimizes alert fatigue.",
          category: "SRE",
          difficulty: "Hard",
          description: "Operational excellence"
        },
        {
          id: 36,
          question: "Describe your approach to managing and mitigating cascading failures in distributed systems.",
          category: "SRE",
          difficulty: "Hard",
          description: "System resilience"
        }
      ]
    }
  };

  const handleGenerate = () => {
    if (!role) return;
    
    setIsLoading(true);
    
    // Simulate API call with a timeout
    setTimeout(() => {
      const questions = mockQuestions[role][experienceLevel] || [];
      onQuestionsGenerated(questions);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Generate Interview Questions</h2>
        <p className="text-gray-600 text-lg mx-auto max-w-md">
          Select a role and experience level to generate relevant interview questions
        </p>
      </div>

      <Card className="bg-white shadow-lg">
        <CardContent className="pt-6 space-y-8">
          <div className="space-y-2">
            <Label htmlFor="role" className="text-lg font-medium">Job Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full h-12 text-base">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                {jobRoles.map((jobRole) => (
                  <SelectItem key={jobRole.id} value={jobRole.id}>
                    {jobRole.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-lg font-medium">Experience Level</Label>
            <RadioGroup 
              value={experienceLevel} 
              onValueChange={setExperienceLevel}
              className="flex gap-6 pt-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fresher" id="fresher" />
                <Label htmlFor="fresher" className="text-base">Fresher</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="experienced" id="experienced" />
                <Label htmlFor="experienced" className="text-base">Experienced</Label>
              </div>
            </RadioGroup>
          </div>

          <Button 
            onClick={handleGenerate} 
            className="w-full py-6 text-lg bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600"
            disabled={!role || isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Questions'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
