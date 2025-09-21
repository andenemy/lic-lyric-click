import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ForgotPasswordScreenProps {
  onBack: () => void;
}

const ForgotPasswordScreen = ({ onBack }: ForgotPasswordScreenProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/`,
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setSent(true);
      toast({
        title: "Reset link sent! 📧",
        description: "Check your email for password reset instructions.",
      });
    }
    setLoading(false);
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-3xl font-bold text-primary">
              Check Your Email 📧
            </CardTitle>
            <CardDescription className="text-lg">
              We've sent you a password reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                Click the link in your email to reset your password and get back to testing your lyric knowledge!
              </p>
              <Button onClick={onBack} variant="outline" className="w-full">
                Back to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-3xl font-bold text-primary">
            Forgot Password? 🤔
          </CardTitle>
          <CardDescription className="text-lg">
            No worries! Enter your email and we'll send you a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleResetPassword} className="space-y-4">
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
            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <button 
              onClick={onBack}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              ← Back to Login
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ForgotPasswordScreen;