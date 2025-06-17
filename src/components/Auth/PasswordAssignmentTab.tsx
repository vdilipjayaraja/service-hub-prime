
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, RefreshCw, Copy, Check } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PasswordAssignmentTabProps {
  onPasswordChange: (password: string) => void;
  userType: 'client' | 'technician';
}

const PasswordAssignmentTab: React.FC<PasswordAssignmentTabProps> = ({ onPasswordChange, userType }) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(result);
    onPasswordChange(result);
    
    toast({
      title: "Password Generated",
      description: "A secure password has been generated"
    });
  };

  const copyPassword = async () => {
    if (password) {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Password Copied",
        description: "Password has been copied to clipboard"
      });
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    onPasswordChange(value);
  };

  const getPasswordStrength = (pwd: string) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd)) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    return strength;
  };

  const strengthLevel = getPasswordStrength(password);
  const strengthLabel = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'][strengthLevel];
  const strengthColor = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'][strengthLevel];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Password Assignment</CardTitle>
        <p className="text-sm text-gray-600">
          Set up login credentials for the new {userType}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              placeholder="Enter password or generate one"
              className="pr-20"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              {password && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={copyPassword}
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={generatePassword}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Generate Secure Password
          </Button>
        </div>

        {password && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Password Strength:</span>
              <Badge variant={strengthLevel >= 3 ? 'default' : 'secondary'}>
                {strengthLabel}
              </Badge>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${strengthColor}`}
                style={{ width: `${(strengthLevel / 5) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-500 space-y-1">
              <p>Password requirements:</p>
              <ul className="list-disc list-inside space-y-1">
                <li className={password.length >= 8 ? 'text-green-600' : 'text-gray-400'}>
                  At least 8 characters
                </li>
                <li className={/[a-z]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
                  Lowercase letters
                </li>
                <li className={/[A-Z]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
                  Uppercase letters
                </li>
                <li className={/[0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
                  Numbers
                </li>
                <li className={/[^A-Za-z0-9]/.test(password) ? 'text-green-600' : 'text-gray-400'}>
                  Special characters
                </li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PasswordAssignmentTab;
