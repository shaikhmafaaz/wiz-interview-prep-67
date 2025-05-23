
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthDialog = ({ isOpen, onClose }: AuthDialogProps) => {
  const [activeView, setActiveView] = useState<'login' | 'register'>('login');

  const handleSuccess = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 border-none bg-transparent shadow-none">
        {activeView === 'login' ? (
          <LoginForm 
            onSuccess={handleSuccess} 
            onSwitchToRegister={() => setActiveView('register')} 
          />
        ) : (
          <RegisterForm 
            onSuccess={handleSuccess} 
            onSwitchToLogin={() => setActiveView('login')} 
          />
        )}
      </DialogContent>
    </Dialog>
  );
};
