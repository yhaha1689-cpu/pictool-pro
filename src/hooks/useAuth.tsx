import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '@/lib/supabase';
import type { User, SubscriptionPlan } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  updatePlan: (plan: SubscriptionPlan) => void;
  refreshUsage: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 从 Supabase 用户创建本地 User 对象
const createUserFromSupabase = (supabaseUser: any, name?: string): User => ({
  id: supabaseUser.id,
  email: supabaseUser.email!,
  name: name || supabaseUser.user_metadata?.name || supabaseUser.email!.split('@')[0],
  plan: 'free',
  subscriptionStatus: null,
  subscriptionEndDate: null,
  usage: {
    imagesProcessed: 0,
    imagesLimit: 50,
    storageUsed: 0,
    storageLimit: 100,
    apiCalls: 0,
    apiCallsLimit: 100,
  },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 检查当前会话
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const savedUser = localStorage.getItem('pictool_user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        } else {
          const newUser = createUserFromSupabase(session.user);
          setUser(newUser);
          localStorage.setItem('pictool_user', JSON.stringify(newUser));
        }
      }
      setIsLoading(false);
    };

    checkSession();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const savedUser = localStorage.getItem('pictool_user');
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          } else {
            const newUser = createUserFromSupabase(session.user);
            setUser(newUser);
            localStorage.setItem('pictool_user', JSON.stringify(newUser));
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem('pictool_user');
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 真实登录
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) {
      setIsLoading(false);
      throw new Error(error.message);
    }
    
    if (data.user) {
      const savedUser = localStorage.getItem('pictool_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        const newUser = createUserFromSupabase(data.user);
        setUser(newUser);
        localStorage.setItem('pictool_user', JSON.stringify(newUser));
      }
    }
    
    setIsLoading(false);
  };

  // 真实注册
  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    
    if (error) {
      setIsLoading(false);
      throw new Error(error.message);
    }
    
    if (data.user) {
      const newUser = createUserFromSupabase(data.user, name);
      setUser(newUser);
      localStorage.setItem('pictool_user', JSON.stringify(newUser));
    }
    
    setIsLoading(false);
  };

  // 真实登出
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('pictool_user');
  };

  const updatePlan = (plan: SubscriptionPlan) => {
    if (user) {
      const updatedUser = {
        ...user,
        plan,
        subscriptionStatus: plan === 'free' ? null : 'active',
        subscriptionEndDate: plan === 'free' ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        usage: {
          ...user.usage,
          imagesLimit: plan === 'free' ? 50 : plan === 'pro' ? 500 : 999999,
          storageLimit: plan === 'free' ? 100 : plan === 'pro' ? 1024 : 10240,
          apiCallsLimit: plan === 'free' ? 100 : plan === 'pro' ? 1000 : 10000,
        },
      };
      setUser(updatedUser);
      localStorage.setItem('pictool_user', JSON.stringify(updatedUser));
    }
  };

  const refreshUsage = () => {
    if (user) {
      const updatedUser = { ...user };
      setUser(updatedUser);
      localStorage.setItem('pictool_user', JSON.stringify(updatedUser));
    }
  };

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updatePlan,
    refreshUsage,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}