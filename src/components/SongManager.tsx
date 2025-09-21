import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Trash2, Upload } from "lucide-react";

interface Song {
  id: string;
  title: string;
  artist: string;
  lyrics: string;
  audio_url?: string;
  duration?: number;
}

const SongManager = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [newSong, setNewSong] = useState({
    title: "",
    artist: "",
    lyrics: ""
  });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const { data, error } = await supabase
        .from("songs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSongs(data || []);
    } catch (error) {
      console.error("Error fetching songs:", error);
      toast({
        title: "Error",
        description: "Failed to fetch songs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadAudioFile = async (file: File, songId: string) => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${songId}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('songs')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;
    
    const { data: { publicUrl } } = supabase.storage
      .from('songs')
      .getPublicUrl(fileName);
    
    return publicUrl;
  };

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSong.title || !newSong.artist || !newSong.lyrics) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const { data, error } = await supabase
        .from("songs")
        .insert([newSong])
        .select()
        .single();

      if (error) throw error;

      let audioUrl = null;
      if (audioFile && data) {
        audioUrl = await uploadAudioFile(audioFile, data.id);
        
        await supabase
          .from("songs")
          .update({ audio_url: audioUrl })
          .eq("id", data.id);
      }

      toast({
        title: "Success! 🎵",
        description: "Song added successfully",
      });

      setNewSong({ title: "", artist: "", lyrics: "" });
      setAudioFile(null);
      fetchSongs();
    } catch (error) {
      console.error("Error adding song:", error);
      toast({
        title: "Error",
        description: "Failed to add song",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteSong = async (songId: string) => {
    try {
      const { error } = await supabase
        .from("songs")
        .delete()
        .eq("id", songId);

      if (error) throw error;

      toast({
        title: "Song deleted",
        description: "Song removed from catalogue",
      });
      
      fetchSongs();
    } catch (error) {
      console.error("Error deleting song:", error);
      toast({
        title: "Error",
        description: "Failed to delete song",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="p-6">Loading songs...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Add New Song</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSong} className="space-y-4">
            <Input
              placeholder="Song Title"
              value={newSong.title}
              onChange={(e) => setNewSong(prev => ({ ...prev, title: e.target.value }))}
            />
            <Input
              placeholder="Artist Name"
              value={newSong.artist}
              onChange={(e) => setNewSong(prev => ({ ...prev, artist: e.target.value }))}
            />
            <Textarea
              placeholder="Song Lyrics"
              value={newSong.lyrics}
              onChange={(e) => setNewSong(prev => ({ ...prev, lyrics: e.target.value }))}
              className="min-h-[100px]"
            />
            <div className="space-y-2">
              <label className="text-sm font-medium">Audio File (optional)</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                  className="flex-1"
                />
                <Upload className="w-4 h-4 text-muted-foreground" />
              </div>
            </div>
            <Button 
              type="submit" 
              disabled={isUploading}
              className="w-full"
            >
              {isUploading ? "Adding Song..." : "Add Song"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Song Catalogue ({songs.length} songs)</CardTitle>
        </CardHeader>
        <CardContent>
          {songs.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No songs yet. Add your first song above!</p>
          ) : (
            <div className="space-y-4">
              {songs.map((song) => (
                <div
                  key={song.id}
                  className="flex items-center justify-between p-4 border rounded-lg bg-card"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{song.title}</h3>
                    <p className="text-sm text-muted-foreground">by {song.artist}</p>
                    {song.audio_url && (
                      <span className="text-xs text-accent bg-accent/10 px-2 py-1 rounded mt-1 inline-block">
                        Has Audio
                      </span>
                    )}
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteSong(song.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SongManager;