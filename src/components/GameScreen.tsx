import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface GameScreenProps {
  username: string;
  onScoreCalculated: (score: number, userLyrics: string) => void;
}

// Sample songs with correct lyrics for demo
const SAMPLE_SONGS = [
  {
    title: "Dancing Queen",
    artist: "ABBA",
    correctLyrics: "You can dance, you can jive, having the time of your life. See that girl, watch that scene, digging the dancing queen."
  },
  {
    title: "Don't Stop Believin'",
    artist: "Journey", 
    correctLyrics: "Just a small town girl, living in a lonely world. She took the midnight train going anywhere."
  },
  {
    title: "Sweet Caroline",
    artist: "Neil Diamond",
    correctLyrics: "Sweet Caroline, good times never seemed so good. I've been inclined to believe they never would."
  }
];

const GameScreen = ({ username, onScoreCalculated }: GameScreenProps) => {
  const [currentSong] = useState(SAMPLE_SONGS[Math.floor(Math.random() * SAMPLE_SONGS.length)]);
  const [userLyrics, setUserLyrics] = useState("");

  const calculateScore = () => {
    if (!userLyrics.trim()) {
      onScoreCalculated(0, userLyrics);
      return;
    }

    // Simple scoring algorithm - calculate similarity between user input and correct lyrics
    const userWords = userLyrics.toLowerCase().split(/\s+/);
    const correctWords = currentSong.correctLyrics.toLowerCase().split(/\s+/);
    
    let matches = 0;
    userWords.forEach(word => {
      if (correctWords.includes(word)) {
        matches++;
      }
    });

    const score = Math.min(100, Math.round((matches / correctWords.length) * 100));
    onScoreCalculated(score, userLyrics);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Think you know the words?
          </h1>
          <p className="text-muted-foreground">
            We've picked a song for you! Type the lyrics you remember in the box below.
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-primary text-xl">
              Song: {currentSong.title} by {currentSong.artist}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Start typing the lyrics here... don't be shy! 🎤"
              value={userLyrics}
              onChange={(e) => setUserLyrics(e.target.value)}
              className="min-h-32 text-base"
            />
            <Button 
              onClick={calculateScore}
              variant="secondary"
              size="lg"
              className="w-full"
            >
              Check My Score!
            </Button>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Hey {username}! 👋 Good luck with this one!
          </p>
        </div>
      </div>
    </div>
  );
};

export default GameScreen;