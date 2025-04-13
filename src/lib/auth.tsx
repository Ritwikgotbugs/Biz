
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isOnboarded: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string) => Promise<{ error: any, user: any }>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ error: any }>;
  signup: (name: string, email: string, password: string) => Promise<{ error: any, user: any }>;
  logout: () => Promise<void>;
  setUserOnboarded: (value: boolean) => void;
}

// Add a custom type that extends User to include name property
export interface ExtendedUser extends User {
  name?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);

  const checkIsOnboarded = async (userId: string) => {
    try {
      // Check localStorage first for faster response
      const localOnboarded = localStorage.getItem('isOnboarded');
      if (localOnboarded === 'true') {
        return true;
      }
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      const onboardedStatus = !!data;
      
      // Update localStorage if onboarded in DB
      if (onboardedStatus) {
        localStorage.setItem('isOnboarded', 'true');
      }
      
      return onboardedStatus;
    } catch (error) {
      console.error("Error checking onboarded status:", error);
      // Fall back to localStorage
      return localStorage.getItem('isOnboarded') === 'true';
    }
  };

  // Function to manually set the onboarded state
  const setUserOnboarded = (value: boolean) => {
    setIsOnboarded(value);
    localStorage.setItem('isOnboarded', value ? 'true' : 'false');
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        if (newSession?.user) {
          const extendedUser = { 
            ...newSession.user,
            name: newSession.user.user_metadata?.name || 'User'  // Add name from metadata
          };
          setUser(extendedUser as ExtendedUser);
          
          // Check onboarded status
          const onboarded = await checkIsOnboarded(newSession.user.id);
          setIsOnboarded(onboarded);
        } else {
          setUser(null);
          setIsOnboarded(false);
          localStorage.removeItem('isOnboarded');
        }
      }
    );

    // THEN check for existing session
    const initAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        setSession(currentSession);
        if (currentSession?.user) {
          const extendedUser = { 
            ...currentSession.user,
            name: currentSession.user.user_metadata?.name || 'User'
          };
          setUser(extendedUser as ExtendedUser);
          
          // Check onboarded status
          const onboarded = await checkIsOnboarded(currentSession.user.id);
          setIsOnboarded(onboarded);
        } else {
          setUser(null);
          setIsOnboarded(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    initAuth();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Check if the user is an admin (for demo purposes)
  const isAdmin = user?.email === 'admin@example.com';

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password
    });
    return { error, user: data?.user || null };
  };

  const signup = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          name
        }
      }
    });
    return { error, user: data?.user || null };
  };

  const login = signIn;

  const signOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('isOnboarded');
    localStorage.removeItem('userProfile');
  };

  const logout = signOut;

  const value = {
    user: user as User | null,
    session,
    isAuthenticated: !!user,
    isLoading,
    isAdmin,
    isOnboarded,
    signIn,
    signUp,
    signOut,
    login,
    signup,
    logout,
    setUserOnboarded
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
