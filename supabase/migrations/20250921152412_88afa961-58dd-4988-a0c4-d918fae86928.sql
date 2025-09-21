-- Create songs table for admin-managed catalogue
CREATE TABLE public.songs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  lyrics TEXT NOT NULL,
  audio_url TEXT,
  duration INTEGER, -- duration in seconds
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- Songs are publicly readable for all authenticated users
CREATE POLICY "Anyone can view songs" 
ON public.songs 
FOR SELECT 
TO authenticated
USING (true);

-- Only admins can insert songs
CREATE POLICY "Admins can create songs" 
ON public.songs 
FOR INSERT 
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Only admins can update songs
CREATE POLICY "Admins can update songs" 
ON public.songs 
FOR UPDATE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Only admins can delete songs
CREATE POLICY "Admins can delete songs" 
ON public.songs 
FOR DELETE 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Create storage bucket for audio files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('songs', 'songs', true);

-- Storage policies for song audio files
CREATE POLICY "Anyone can view song audio files" 
ON storage.objects 
FOR SELECT 
TO authenticated
USING (bucket_id = 'songs');

CREATE POLICY "Admins can upload song audio files" 
ON storage.objects 
FOR INSERT 
TO authenticated
WITH CHECK (
  bucket_id = 'songs' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins can update song audio files" 
ON storage.objects 
FOR UPDATE 
TO authenticated
USING (
  bucket_id = 'songs' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Admins can delete song audio files" 
ON storage.objects 
FOR DELETE 
TO authenticated
USING (
  bucket_id = 'songs' AND
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.user_id = auth.uid() 
    AND profiles.is_admin = true
  )
);

-- Add trigger for updating timestamps
CREATE TRIGGER update_songs_updated_at
BEFORE UPDATE ON public.songs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Update scores table to reference songs
ALTER TABLE public.scores 
ADD COLUMN song_id UUID REFERENCES public.songs(id);

-- Insert some sample songs
INSERT INTO public.songs (title, artist, lyrics) VALUES 
('Dancing Queen', 'ABBA', 'You can dance, you can jive, having the time of your life. Ooh, see that girl, watch that scene, digging the dancing queen'),
('Bohemian Rhapsody', 'Queen', 'Is this the real life? Is this just fantasy? Caught in a landslide, no escape from reality'),
('Hotel California', 'Eagles', 'Welcome to the Hotel California, such a lovely place, such a lovely face'),
('Imagine', 'John Lennon', 'Imagine all the people living life in peace. You may say I''m a dreamer, but I''m not the only one'),
('Sweet Child O'' Mine', 'Guns N'' Roses', 'She''s got eyes of the bluest skies, as if they thought of rain');