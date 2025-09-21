import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface Song {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
}

interface ScoreScreenProps {
  username: string;
  score: number;
  userLyrics: string;
  song: Song;
  onPlayAgain: () => void;
  onShareScore: () => void;
}

const getScoreMessage = (score: number) => {
  if (score >= 90) {
    return {
      title: "Lyric Legend! 🎤",
      message: "Flawless! You absolutely nailed it!",
      color: "text-success"
    };
  } else if (score >= 60) {
    return {
      title: "Solid Jam Session! 🔊", 
      message: "You definitely know this one!",
      color: "text-primary"
    };
  } else if (score >= 1) {
    return {
      title: "Caught the Vibe! 🎧",
      message: "Hey, you got the feeling right!",
      color: "text-secondary"
    };
  } else {
    return {
      title: "Let's try another one! 😅",
      message: "Every masterpiece has its first draft!",
      color: "text-muted-foreground"
    };
  }
};

const ScoreScreen = ({ username, score, userLyrics, song, onPlayAgain, onShareScore }: ScoreScreenProps) => {
  const scoreData = getScoreMessage(score);

  return (
    <div className="min-h-screen bg-background p-4 flex items-center justify-center">
      <Card className="w-full max-w-lg mx-auto">
        <CardHeader className="text-center space-y-4">
          <CardTitle className="text-3xl font-bold">
            {username}'s Score!
          </CardTitle>
          <div className="space-y-4">
            <div className="text-6xl font-bold text-primary">
              {score}%!
            </div>
            <Progress value={score} className="w-full h-3" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className="mb-4 p-3 bg-card border rounded-lg">
              <h4 className="font-medium text-primary">You played:</h4>
              <p className="text-sm text-muted-foreground">
                "{song.title}" by {song.artist}
              </p>
            </div>
            
            <h3 className={`text-2xl font-bold ${scoreData.color}`}>
              {scoreData.title}
            </h3>
            <p className="text-muted-foreground text-lg">
              {scoreData.message}
            </p>
          </div>

          {userLyrics && (
            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Your lyrics:</h4>
              <p className="text-sm text-muted-foreground italic">
                "{userLyrics}"
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Button 
              onClick={onPlayAgain}
              className="w-full"
              size="lg"
            >
              Play Another Song!
            </Button>
            <Button 
              onClick={onShareScore}
              variant="outline"
              className="w-full"
              size="lg"
            >
              Share My Score
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScoreScreen;