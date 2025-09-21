import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LoginScreenProps {
  onLogin: (username: string) => void;
  onForgotPassword: () => void;
  onRegister: () => void;
}

const LoginScreen = ({ onLogin, onForgotPassword, onRegister }: LoginScreenProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-4xl font-bold text-primary">
            Welcome to Lic! 🎶
          </CardTitle>
          <CardDescription className="text-lg">
            The place to test your lyric knowledge and have fun.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              Login
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            <button 
              onClick={onForgotPassword}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              Forgot Password?
            </button>
            <p className="text-sm text-muted-foreground">
              New here?{" "}
              <button 
                onClick={onRegister}
                className="text-secondary hover:text-secondary/80 font-medium"
              >
                Join the fun!
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginScreen;