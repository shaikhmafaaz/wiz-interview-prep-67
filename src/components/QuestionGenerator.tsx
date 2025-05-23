
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const QuestionGenerator = () => {
  const [role, setRole] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('fresher');

  const handleGenerate = () => {
    console.log('Generating questions for:', { role, experienceLevel });
    // This would connect to your backend API in the future
  };

  const jobRoles = [
    { id: 'frontend', name: 'Frontend Developer' },
    { id: 'backend', name: 'Backend Developer' },
    { id: 'fullstack', name: 'Full Stack Developer' },
    { id: 'devops', name: 'DevOps Engineer' },
    { id: 'qa', name: 'QA Engineer' },
    { id: 'sre', name: 'Site Reliability Engineer' },
  ];

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
            disabled={!role}
          >
            Generate Questions
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
