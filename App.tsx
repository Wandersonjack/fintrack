import React, { useState, useEffect, useCallback } from 'react';
import { Auth } from './pages/Auth';
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Sidebar } from './components/Layout/Sidebar';
import { User, AccountType, Transaction, GrowthPlan } from './types';
import { supabaseService } from './services/supabaseService';
import { supabase } from './lib/supabase';
import { Loader2 } from 'lucide-react';
import { APP_COPY } from './lib/copy';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  // Growth & Strategy State
  const [mrr, setMrr] = useState(0);
  const [strategy, setStrategy] = useState({
    mrrTarget: 0,
    plans: [] as GrowthPlan[]
  });

  const handleUserHydration = useCallback(async (sbUser: any) => {
    setIsLoading(true);
    try {
      const mappedUser: User = {
        id: sbUser.id,
        email: sbUser.email || '',
        name: sbUser.user_metadata?.full_name || sbUser.email?.split('@')[0] || APP_COPY.common.defaultOperator,
        accountTypes: ['personal', 'business'],
      };
      
      // Fetch user-specific data
      const [txs, profile, plans] = await Promise.all([
        supabaseService.getTransactions(sbUser.id),
        supabaseService.getProfile(sbUser.id),
        supabaseService.getGrowthPlans(sbUser.id)
      ]);

      setTransactions(txs);
      if (profile) {
        setMrr(profile.mrr);
        setStrategy({
          mrrTarget: profile.mrrTarget,
          plans: plans.length > 0 ? plans : []
        });
      }

      // Setting user last triggers the UI switch
      setUser(mappedUser);
    } catch (err) {
      console.error('Data hydration error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Auth & Data Hydration
  useEffect(() => {
    // 1. Check current session on mount
    const initSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await handleUserHydration(session.user);
      } else {
        setIsLoading(false);
      }
    };

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        handleUserHydration(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setTransactions([]);
        setIsLoading(false);
      }
    });

    initSession();
    return () => subscription.unsubscribe();
  }, [handleUserHydration]);

  const handleLogout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
  };

  const handleAddTransaction = async (newTx: Omit<Transaction, 'id' | 'status'>) => {
    if (!user) return;
    const created = await supabaseService.addTransaction(user.id, newTx);
    if (created) {
      setTransactions(prev => [created, ...prev]);
    }
  };

  const handleUpdateTransaction = async (id: string, updates: Partial<Transaction>) => {
    const success = await supabaseService.updateTransaction(id, updates);
    if (success) {
      setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    const success = await supabaseService.deleteTransaction(id);
    if (success) {
      setTransactions(prev => prev.filter(t => t.id !== id));
    }
  };

  const handleUpdateStrategy = async (newStrategy: any) => {
    if (!user) return;
    setStrategy(newStrategy);
    await supabaseService.syncGrowthPlans(user.id, newStrategy.plans);
    await supabaseService.updateProfile(user.id, mrr, newStrategy.mrrTarget);
  };

  const handleUpdateMrr = async (val: number) => {
    if (!user) return;
    setMrr(val);
    await supabaseService.updateProfile(user.id, val, strategy.mrrTarget);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-brand-400" />
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-400">{APP_COPY.common.syncingWorkspace}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Auth onLogin={() => {}} />;
  }

  return (
    <div className="flex min-h-screen bg-[#fafafa] font-sans selection:bg-brand-100">
      <Sidebar 
        user={user} 
        onLogout={handleLogout} 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />
      
      <main className="flex-1 w-full lg:pl-0">
         {activeTab === 'dashboard' && (
            <Dashboard 
              user={user} 
              transactions={transactions} 
              onAddTransaction={handleAddTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              mrr={mrr}
              setMrr={handleUpdateMrr}
              strategy={strategy}
              setStrategy={handleUpdateStrategy}
            />
         )}
         {activeTab !== 'dashboard' && ( activeTab === 'settings' ? (
             <Dashboard 
              user={user} 
              transactions={transactions} 
              onAddTransaction={handleAddTransaction}
              onUpdateTransaction={handleUpdateTransaction}
              onDeleteTransaction={handleDeleteTransaction}
              mrr={mrr}
              setMrr={handleUpdateMrr}
              strategy={strategy}
              setStrategy={handleUpdateStrategy}
              forceConfigOpen={true}
            />
         ) : (
             <div className="p-10 lg:ml-72 flex flex-col items-center justify-center h-screen text-zinc-400">
                 <p className="text-lg font-medium uppercase tracking-widest font-black">{APP_COPY.common.comingSoon}</p>
                 <p className="text-sm mt-2">{APP_COPY.common.underConstruction(activeTab)}</p>
                 <button onClick={() => setActiveTab('dashboard')} className="mt-6 text-brand-600 font-bold hover:underline font-black uppercase tracking-tighter">
                    {APP_COPY.common.backToDashboard}
                 </button>
             </div>
         ))}
      </main>
    </div>
  );
};

export default App;