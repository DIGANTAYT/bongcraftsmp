"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { useRouter, usePathname } from "next/navigation";

interface Profile {
  id: string;
  minecraft_username: string;
  created_at: string;
}

interface AuthContextType {
  user: any | null;
  profile: Profile | null;
  isLoading: boolean;
  isConfigured: boolean;
  needsProfileSetup: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, minecraftUsername: string) => Promise<{ error: any }>;
  signInWithDiscord: () => Promise<{ error: any }>;
  linkMinecraftUsername: (minecraftUsername: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const pathname = usePathname();

  // Redirect if profile setup is required
  useEffect(() => {
    if (needsProfileSetup && pathname !== "/profile-setup") {
      router.push("/profile-setup");
    }
  }, [needsProfileSetup, pathname, router]);

  // Load auth state
  useEffect(() => {
    if (!isSupabaseConfigured) {
      // Mock Fallback Auth mode
      const mockSession = localStorage.getItem("bongcraft_mock_session");
      if (mockSession) {
        try {
          const session = JSON.parse(mockSession);
          setUser(session.user);
          setProfile(session.profile);
          if (session.user && !session.profile) {
            setNeedsProfileSetup(true);
          }
        } catch (e) {
          console.error(e);
        }
      }
      setIsLoading(false);
      return;
    }

    // Load active session from Supabase
    supabase.auth.getSession().then((res: any) => {
      const session = res.data?.session;
      if (session) {
        setUser(session.user);
        loadProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: any, session: any) => {
        if (session) {
          setUser(session.user);
          await loadProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          setNeedsProfileSetup(false);
          setIsLoading(false);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // Profile row not found (Discord first login)
          setNeedsProfileSetup(true);
        }
        throw error;
      }
      setProfile(data);
      setNeedsProfileSetup(false);
    } catch (e) {
      console.error("Error loading profile:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!isSupabaseConfigured) {
      // Mock sign in fallback
      if (email && password.length >= 6) {
        const mockUser = { id: "mock-uid-123", email };
        const mockProfile = {
          id: "mock-uid-123",
          minecraft_username: localStorage.getItem("bongcraft_username") || "GuestPlayer",
          created_at: new Date().toISOString()
        };
        const session = { user: mockUser, profile: mockProfile };
        localStorage.setItem("bongcraft_mock_session", JSON.stringify(session));
        setUser(mockUser);
        setProfile(mockProfile);
        setNeedsProfileSetup(false);
        return { error: null };
      }
      return { error: { message: "Invalid credentials (use password >= 6 characters)." } };
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, minecraftUsername: string) => {
    if (!isSupabaseConfigured) {
      // Mock sign up fallback
      if (email && password.length >= 6 && minecraftUsername) {
        const mockUser = { id: "mock-uid-123", email };
        const mockProfile = {
          id: "mock-uid-123",
          minecraft_username: minecraftUsername,
          created_at: new Date().toISOString()
        };
        localStorage.setItem("bongcraft_username", minecraftUsername);
        const session = { user: mockUser, profile: mockProfile };
        localStorage.setItem("bongcraft_mock_session", JSON.stringify(session));
        setUser(mockUser);
        setProfile(mockProfile);
        setNeedsProfileSetup(false);
        return { error: null };
      }
      return { error: { message: "Invalid credentials or username." } };
    }

    // Step 1: Sign up user
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error };

    if (data.user) {
      // Step 2: Create profile entry
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([{ id: data.user.id, minecraft_username: minecraftUsername }]);
      
      if (profileError) {
        console.error("Profile insertion error:", profileError);
        return { error: profileError };
      }
    }

    return { error: null };
  };

  const signInWithDiscord = async () => {
    if (!isSupabaseConfigured) {
      // Mock social auth login
      const mockUser = { id: "mock-discord-uid-456", email: "discordplayer@example.com" };
      setUser(mockUser);
      setProfile(null);
      setNeedsProfileSetup(true);
      
      const tempSession = { user: mockUser, profile: null };
      localStorage.setItem("bongcraft_mock_session", JSON.stringify(tempSession));
      return { error: null };
    }

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "discord",
      options: {
        redirectTo: window.location.origin
      }
    });

    return { error };
  };

  const linkMinecraftUsername = async (minecraftUsername: string) => {
    if (!user) return { error: { message: "No active session." } };

    if (!isSupabaseConfigured) {
      const updatedProfile = {
        id: user.id,
        minecraft_username: minecraftUsername,
        created_at: new Date().toISOString()
      };
      setProfile(updatedProfile);
      setNeedsProfileSetup(false);
      localStorage.setItem("bongcraft_mock_session", JSON.stringify({ user, profile: updatedProfile }));
      return { error: null };
    }

    const { error } = await supabase
      .from("profiles")
      .insert([{ id: user.id, minecraft_username: minecraftUsername }]);
    
    if (!error) {
      setProfile({
        id: user.id,
        minecraft_username: minecraftUsername,
        created_at: new Date().toISOString()
      });
      setNeedsProfileSetup(false);
    }

    return { error };
  };

  const signOut = async () => {
    setNeedsProfileSetup(false);
    if (!isSupabaseConfigured) {
      localStorage.removeItem("bongcraft_mock_session");
      setUser(null);
      setProfile(null);
      return { error: null };
    }

    const { error } = await supabase.auth.signOut();
    return { error };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isConfigured: isSupabaseConfigured,
        needsProfileSetup,
        signIn,
        signUp,
        signInWithDiscord,
        linkMinecraftUsername,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
