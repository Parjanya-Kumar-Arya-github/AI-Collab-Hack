/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for changes on auth state (logged in, signed out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          fetchProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 means zero rows returned
        console.error('Error fetching profile:', error);
      }
      setProfile(data || {});
    } catch (error) {
      console.error('Error in fetchProfile:', error);
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    return supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/login`,
      }
    });
  };

  const signInWithGithub = async () => {
    return supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/login`,
      }
    });
  };

  const signInWithEmail = async (emailOrUsername, password) => {
    let loginEmail = emailOrUsername;

    // Check if what they typed is NOT an email
    if (!loginEmail.includes('@')) {
        // Try to look up the email tied to this username
        const { data, error } = await supabase
            .from('profiles')
            .select('id, username')
            .eq('username', emailOrUsername.toLowerCase())
            .single();

        if (error || !data) {
             throw new Error("Username not found.");
        }
        
        // Unfortunately standard Supabase Auth requires an email to sign in via password.
        // We can't directly use signInWithPassword with a username unless we know the email, 
        // OR if you setup a custom Edge Function. 
        // For a hackathon workaround without exposing raw emails in the frontend profiles table, 
        // the easiest way is checking email. 
        // WAIT: to make email resolution secure, we shouldn't fetch email from public 'profiles'.
        // Let's assume if it's not an email, we show an error asking for an email, or build a specific login edge function.
        // Let's implement the standard approach: we MUST know the email to login directly from the frontend securely.
        
        throw new Error("Please use your registered email address to log in.");
    }

    return supabase.auth.signInWithPassword({
        email: loginEmail,
        password
    });
  };

  const signUpWithEmail = async (email, password, username, fullName) => {
    // 1. Check if username is already taken BEFORE creating the user
    if (username) {
        const { data: existingUser } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', username.toLowerCase())
            .single();
            
        if (existingUser) {
            return { error: new Error('Username is already taken.') };
        }
    }

    // 2. Sign up the user
    const response = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
                username: username?.toLowerCase()
            }
        }
    });

    return response;
  };

  const signOut = () => {
    return supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ 
        user, 
        profile, 
        loading, 
        signInWithGoogle, 
        signInWithGithub, 
        signInWithEmail,
        signUpWithEmail,
        signOut, 
        fetchProfile 
    }}>
        {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
