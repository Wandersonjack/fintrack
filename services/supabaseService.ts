import { supabase } from '../lib/supabase';
import { Transaction, GrowthPlan, User } from '../types';

export const supabaseService = {
  async getTransactions(userId: string): Promise<Transaction[]> {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching transactions:', error.message);
        return [];
      }

      return (data || []).map(item => ({
        id: item.id,
        amount: item.amount,
        type: item.type as 'income' | 'expense',
        category: item.category as any,
        description: item.description,
        date: item.date,
        accountType: item.account_type as any,
        isRecurring: item.is_recurring,
        status: item.status as any
      }));
    } catch (e) {
      console.error('Unexpected error fetching transactions:', e);
      return [];
    }
  },

  async addTransaction(userId: string, tx: Omit<Transaction, 'id' | 'status'>): Promise<Transaction | null> {
    const { data, error } = await supabase
      .from('transactions')
      .insert([{
        amount: tx.amount,
        type: tx.type,
        category: tx.category,
        description: tx.description,
        date: tx.date,
        account_type: tx.accountType,
        is_recurring: tx.isRecurring,
        status: 'completed',
        user_id: userId
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding transaction:', error.message);
      return null;
    }

    return {
      id: data.id,
      amount: data.amount,
      type: data.type,
      category: data.category,
      description: data.description,
      date: data.date,
      accountType: data.account_type,
      isRecurring: data.is_recurring,
      status: data.status
    };
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<boolean> {
    const mappedUpdates: any = { ...updates };
    if (updates.accountType) mappedUpdates.account_type = updates.accountType;
    if (updates.isRecurring !== undefined) mappedUpdates.is_recurring = updates.isRecurring;
    
    delete mappedUpdates.id;
    delete mappedUpdates.accountType;
    delete mappedUpdates.isRecurring;

    const { error } = await supabase
      .from('transactions')
      .update(mappedUpdates)
      .eq('id', id);

    return !error;
  },

  async deleteTransaction(id: string): Promise<boolean> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    return !error;
  },

  async getProfile(userId: string): Promise<{ mrr: number, mrrTarget: number } | null> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('mrr, mrr_target')
        .eq('id', userId)
        .maybeSingle();

      if (error) return null;
      // If profile doesn't exist, the trigger might not have run for an old user, return defaults
      if (!data) return { mrr: 0, mrrTarget: 0 };

      return {
        mrr: data.mrr || 0,
        mrrTarget: data.mrr_target || 0
      };
    } catch (e) {
      return { mrr: 0, mrrTarget: 0 };
    }
  },

  async updateProfile(userId: string, mrr: number, mrrTarget: number): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: userId, mrr, mrr_target: mrrTarget }, { onConflict: 'id' });
    return !error;
  },

  async getGrowthPlans(userId: string): Promise<GrowthPlan[]> {
    const { data, error } = await supabase
      .from('growth_plans')
      .select('*')
      .eq('user_id', userId);

    if (error) return [];
    return data || [];
  },

  async syncGrowthPlans(userId: string, plans: GrowthPlan[]): Promise<boolean> {
    // Clean up existing plans for this user and replace
    await supabase.from('growth_plans').delete().eq('user_id', userId);
    if (plans.length === 0) return true;

    const { error } = await supabase
      .from('growth_plans')
      .insert(plans.map(p => ({
        price: p.price,
        user_id: userId
      })));

    return !error;
  }
};