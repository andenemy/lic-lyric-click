-- Create security definer function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_current_user_admin()
RETURNS BOOLEAN AS $$
  SELECT COALESCE((SELECT is_admin FROM public.profiles WHERE user_id = auth.uid()), false);
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Admins can create songs" ON public.songs;
DROP POLICY IF EXISTS "Admins can update songs" ON public.songs;
DROP POLICY IF EXISTS "Admins can delete songs" ON public.songs;

-- Recreate policies using the security definer function
CREATE POLICY "Admins can create songs" 
ON public.songs 
FOR INSERT 
WITH CHECK (public.is_current_user_admin());

CREATE POLICY "Admins can update songs" 
ON public.songs 
FOR UPDATE 
USING (public.is_current_user_admin());

CREATE POLICY "Admins can delete songs" 
ON public.songs 
FOR DELETE 
USING (public.is_current_user_admin());