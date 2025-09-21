import { useState } from "react";
import LoginScreen from "@/components/LoginScreen";
import GameScreen from "@/components/GameScreen";
import ScoreScreen from "@/components/ScoreScreen";
import AdminPanel from "@/components/AdminPanel";
import ForgotPasswordScreen from "@/components/ForgotPasswordScreen";
import RegisterScreen from "@/components/RegisterScreen";
import { toast } from "@/hooks/use-toast";

type Screen = "login" | "game" | "score" | "admin" | "forgot-password" | "register";

const Index = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>("login");
  const [username, setUsername] = useState("");
  const [score, setScore] = useState(0);
  const [userLyrics, setUserLyrics] = useState("");

  const handleLogin = (user: string) => {
    setUsername(user);
    // Check if user is admin (in real app, this would come from backend)
    if (user.toLowerCase() === "admin") {
      setCurrentScreen("admin");
    } else {
      setCurrentScreen("game");
    }
  };

  const handleScoreCalculated = (newScore: number, lyrics: string) => {
    setScore(newScore);
    setUserLyrics(lyrics);
    setCurrentScreen("score");
  };

  const handlePlayAgain = () => {
    setCurrentScreen("game");
  };

  const handleShareScore = () => {
    toast({
      title: "Score shared! 🎉",
      description: `You scored ${score}% on that song!`,
    });
  };

  const handleBackToGame = () => {
    setCurrentScreen("game");
  };

  const handleGoToForgotPassword = () => {
    setCurrentScreen("forgot-password");
  };

  const handleGoToRegister = () => {
    setCurrentScreen("register");
  };

  const handleBackToLogin = () => {
    setCurrentScreen("login");
  };

  switch (currentScreen) {
    case "login":
      return (
        <LoginScreen 
          onLogin={handleLogin}
          onForgotPassword={handleGoToForgotPassword}
          onRegister={handleGoToRegister}
        />
      );
    case "game":
      return (
        <GameScreen 
          username={username} 
          onScoreCalculated={handleScoreCalculated}
        />
      );
    case "score":
      return (
        <ScoreScreen
          username={username}
          score={score}
          userLyrics={userLyrics}
          onPlayAgain={handlePlayAgain}
          onShareScore={handleShareScore}
        />
      );
    case "admin":
      return <AdminPanel onBack={handleBackToGame} />;
    case "forgot-password":
      return <ForgotPasswordScreen onBack={handleBackToLogin} />;
    case "register":
      return (
        <RegisterScreen 
          onBack={handleBackToLogin}
          onRegisterSuccess={handleLogin}
        />
      );
    default:
      return <LoginScreen onLogin={handleLogin} onForgotPassword={handleGoToForgotPassword} onRegister={handleGoToRegister} />;
  }
};

export default Index;
