import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import MusicPlayer from "./MusicPlayer";

interface GameScreenProps {
  username: string;
  onScoreCalculated: (score: number, userLyrics: string, song: Song) => void;
}

interface Song {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
  audio_url?: string;
}

const GameScreen = ({ username, onScoreCalculated }: GameScreenProps) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [userLyrics, setUserLyrics] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from("songs")
        .select("*");

      if (error) throw error;
      
      if (data && data.length > 0) {
        setSongs(data);
        const randomSong = data[Math.floor(Math.random() * data.length)];
        setCurrentSong(randomSong);
      } else {
        toast({
          title: "No songs available",
          description: "Ask an admin to add some songs to the catalogue!",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching songs:", error);
      toast({
        title: "Error",
        description: "Failed to load songs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateScore = (userInput: string, correctLyrics: string): number => {
    // Simple scoring based on word matching
    const userWords = userInput.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    const correctWords = correctLyrics.toLowerCase().split(/\s+/).filter(word => word.length > 0);
    
    if (userWords.length === 0) return 0;
    
    let matches = 0;
    userWords.forEach(word => {
      if (correctWords.includes(word)) {
        matches++;
      }
    });
    
    return Math.min(Math.round((matches / correctWords.length) * 100), 100);
  };

  const handleSubmit = () => {
    if (!userLyrics.trim()) {
      toast({
        title: "Hold up! 🎤",
        description: "Please enter some lyrics first!",
        variant: "destructive",
      });
      return;
    }
    
    if (!currentSong) return;
    
    const score = calculateScore(userLyrics, currentSong.lyrics);
    onScoreCalculated(score, userLyrics, currentSong);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold">Loading songs... 🎵</h2>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentSong) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-lg font-semibold">No songs available</h2>
            <p className="text-muted-foreground mt-2">Ask an admin to add some songs!</p>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <CardTitle className="text-primary text-xl mb-4">
              Song: {currentSong.title} by {currentSong.artist}
            </CardTitle>
            {currentSong.audio_url && (
              <div className="max-w-md mx-auto">
                <MusicPlayer 
                  audioUrl={currentSong.audio_url}
                  title={currentSong.title}
                  artist={currentSong.artist}
                />
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Start typing the lyrics here... don't be shy! 🎤"
              value={userLyrics}
              onChange={(e) => setUserLyrics(e.target.value)}
              className="min-h-32 text-base"
            />
            <Button 
              onClick={handleSubmit}
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