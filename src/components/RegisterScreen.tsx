import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface RegisterScreenProps {
  onBack: () => void;
  onRegisterSuccess: (username: string) => void;
}

const RegisterScreen = ({ onBack, onRegisterSuccess }: RegisterScreenProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim() || !username.trim()) return;

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: password.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          username: username.trim(),
        }
      }
    });

    if (error) {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    } else if (data.user) {
      toast({
        title: "Welcome to Lic! 🎉",
        description: "Registration successful! You can now start testing your lyric knowledge.",
      });
      onRegisterSuccess(username.trim());
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-4xl font-bold text-primary">
            Join the Fun! 🎶
          </CardTitle>
          <CardDescription className="text-lg">
            Create your account and start testing your lyric knowledge.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <Input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div>
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
                required
                minLength={6}
              />
            </div>
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Creating Account..." : "Join Lic!"}
            </Button>
          </form>
          
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button 
                onClick={onBack}
                className="text-secondary hover:text-secondary/80 font-medium"
              >
                Login here
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterScreen;