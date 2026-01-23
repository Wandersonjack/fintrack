import React, { useState, useMemo, useEffect } from 'react';
import { 
  Plus,
  Repeat,
  Briefcase,
  Zap,
  TrendingUp,
  Target,
  Settings,
  Trash2,
  Edit3,
  DollarSign,
  Wallet,
  BarChart3,
  PlusCircle,
  MinusCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { SlideOver } from '../components/ui/SlideOver';
import { Badge } from '../components/ui/Badge';
import { Transaction, User, TransactionCategory, GrowthPlan } from '../types';
import { cn, formatCurrency, formatDate } from '../lib/utils';
import { APP_COPY } from '../lib/copy';

interface DashboardProps {
  user: User;
  transactions: Transaction[];
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'status'>) => void;
  onUpdateTransaction: (id: string, updates: Partial<Transaction>) => void;
  onDeleteTransaction: (id: string) => void;
  mrr: number;
  setMrr: (val: number) => void;
  strategy: { mrrTarget: number; plans: GrowthPlan[] };
  setStrategy: (val: any) => void;
  forceConfigOpen?: boolean;
}

const INCOME_CATEGORIES = [
  { value: "Salary", label: APP_COPY.dashboard.categories.income.salary },
  { value: "Investment", label: APP_COPY.dashboard.categories.income.investment },
  { value: "Income", label: APP_COPY.dashboard.categories.income.general },
];

const EXPENSE_CATEGORIES = [
  { value: "Software", label: APP_COPY.dashboard.categories.expense.software },
  { value: "Housing", label: APP_COPY.dashboard.categories.expense.housing },
  { value: "Food", label: APP_COPY.dashboard.categories.expense.food },
  { value: "Transportation", label: APP_COPY.dashboard.categories.expense.transportation },
  { value: "Utilities", label: APP_COPY.dashboard.categories.expense.utilities },
  { value: "Marketing", label: APP_COPY.dashboard.categories.expense.marketing },
  { value: "Entertainment", label: APP_COPY.dashboard.categories.expense.entertainment },
  { value: "Business Operations", label: APP_COPY.dashboard.categories.expense.business },
];

export const Dashboard: React.FC<DashboardProps> = ({ 
  user, 
  transactions, 
  onAddTransaction, 
  onUpdateTransaction, 
  onDeleteTransaction,
  mrr,
  setMrr,
  strategy,
  setStrategy,
  forceConfigOpen = false
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'business' | 'personal'>('overview');
  const [isAddModalOpen, setIsAddModalOpen] = useState(forceConfigOpen);
  const [modalMode, setModalMode] = useState<'transaction' | 'config'>('transaction');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    if (forceConfigOpen) {
      setModalMode('config');
      setIsAddModalOpen(true);
    }
  }, [forceConfigOpen]);

  const totals = useMemo(() => {
    const extraRevenue = transactions.filter(t => t.type === 'income').reduce((acc, curr) => acc + curr.amount, 0);
    const totalRevenue = mrr + extraRevenue;
    const totalBurn = transactions.filter(t => t.type === 'expense').reduce((acc, curr) => acc + curr.amount, 0);
    const netProfit = totalRevenue - totalBurn;
    const margin = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : "0";
    return { totalRevenue, totalBurn, netProfit, margin, extraRevenue, annualRunRate: totalRevenue * 12 };
  }, [transactions, mrr]);

  const analytics = useMemo(() => {
    const mrrProgress = strategy.mrrTarget > 0 ? ((mrr / strategy.mrrTarget) * 100).toFixed(1) : "0";
    const gap = Math.max(0, strategy.mrrTarget - mrr);
    const planAnalysis = strategy.plans.map(p => ({
      ...p,
      customersNeeded: Math.ceil(gap / p.price)
    })).sort((a, b) => b.price - a.price);
    return { mrrProgress, planAnalysis, gap };
  }, [mrr, strategy]);

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Software' as TransactionCategory,
    date: new Date().toISOString().split('T')[0],
    accountType: 'personal' as 'personal' | 'business',
    isIncome: false,
    isRecurring: false
  });

  const handleEditClick = (t: Transaction) => {
    setEditingId(t.id);
    setFormData({
      description: t.description,
      amount: t.amount.toString(),
      category: t.category,
      date: t.date.split('T')[0],
      accountType: t.accountType,
      isIncome: t.type === 'income',
      isRecurring: t.isRecurring
    });
    setModalMode('transaction');
    setIsAddModalOpen(true);
  };

  const handleTypeChange = (isIncome: boolean) => {
    setFormData(prev => ({
      ...prev,
      isIncome,
      category: isIncome ? 'Salary' : 'Software'
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'config') return setIsAddModalOpen(false);
    if (!formData.description || !formData.amount) return;
    
    const entry = {
      amount: parseFloat(formData.amount),
      type: formData.isIncome ? 'income' as const : 'expense' as const,
      category: formData.category,
      description: formData.description,
      date: new Date(formData.date).toISOString(),
      accountType: formData.accountType,
      isRecurring: formData.isRecurring,
    };

    if (editingId) onUpdateTransaction(editingId, entry);
    else onAddTransaction(entry);
    
    setIsAddModalOpen(false);
    setEditingId(null);
  };

  const currentCategoryOptions = formData.isIncome ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="flex-1 min-h-screen bg-zinc-50/50 p-6 lg:p-14 pb-32 lg:ml-72 animate-fade-in overflow-x-hidden">
      <SlideOver 
        isOpen={isAddModalOpen} 
        onClose={() => { setIsAddModalOpen(false); setEditingId(null); }}
        title={modalMode === 'config' ? APP_COPY.dashboard.modals.configTitle : (editingId ? APP_COPY.dashboard.modals.editEntryTitle : APP_COPY.dashboard.modals.addEntryTitle)}
        description={modalMode === 'config' ? APP_COPY.dashboard.modals.configDesc : APP_COPY.dashboard.modals.entryDesc}
      >
        <form className="space-y-8 mt-6" onSubmit={handleSubmit}>
          {modalMode === 'config' ? (
            <div className="space-y-8">
               <div className="space-y-6">
                  <Input label={APP_COPY.dashboard.config.coreMrr} type="number" value={mrr} onChange={e => setMrr(parseFloat(e.target.value) || 0)} />
                  <Input label={APP_COPY.dashboard.config.targetMrr} type="number" value={strategy.mrrTarget} onChange={e => setStrategy({...strategy, mrrTarget: parseFloat(e.target.value) || 0})} />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-black uppercase text-zinc-500 tracking-[0.2em]">{APP_COPY.dashboard.config.pricingPlans}</label>
                      <Button type="button" variant="outline" size="sm" onClick={() => setStrategy({...strategy, plans: [...strategy.plans, {id: Math.random().toString(), price: 0}]})}>
                        {APP_COPY.dashboard.config.addTier}
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {strategy.plans.map((plan) => (
                        <div key={plan.id} className="relative group">
                          <Input 
                            type="number" 
                            value={plan.price} 
                            onChange={e => setStrategy({...strategy, plans: strategy.plans.map(p => p.id === plan.id ? {...p, price: parseFloat(e.target.value) || 0} : p)})}
                            className="pr-10 font-bold"
                          />
                          <button type="button" onClick={() => setStrategy({...strategy, plans: strategy.plans.filter(p => p.id !== plan.id)})} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100"><MinusCircle size={16}/></button>
                        </div>
                      ))}
                    </div>
                  </div>
               </div>
               <Button variant="brand" className="w-full" type="submit">{APP_COPY.dashboard.modals.saveStrategy}</Button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 rounded-2xl">
                <Button 
                  type="button"
                  variant={!formData.isIncome ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={(e) => { e.preventDefault(); handleTypeChange(false); }} 
                  className="rounded-xl uppercase tracking-widest font-black"
                >
                  {APP_COPY.dashboard.forms.expense}
                </Button>
                <Button 
                  type="button"
                  variant={formData.isIncome ? 'brand' : 'ghost'} 
                  size="sm" 
                  onClick={(e) => { e.preventDefault(); handleTypeChange(true); }} 
                  className="rounded-xl uppercase tracking-widest font-black"
                >
                  {APP_COPY.dashboard.forms.income}
                </Button>
              </div>

              <Input 
                label={APP_COPY.dashboard.forms.description} 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                placeholder={APP_COPY.dashboard.forms.descriptionPlaceholder} 
              />

              <div className="grid grid-cols-2 gap-6">
                 <Input 
                  label={APP_COPY.dashboard.forms.amount} 
                  type="number" 
                  value={formData.amount} 
                  onChange={e => setFormData({...formData, amount: e.target.value})} 
                 />
                 <Select 
                  label={APP_COPY.dashboard.forms.category} 
                  value={formData.category} 
                  options={currentCategoryOptions}
                  onChange={(val) => setFormData({...formData, category: val as any})}
                 />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <Input 
                  label={APP_COPY.dashboard.forms.date} 
                  type="date" 
                  value={formData.date} 
                  onChange={e => setFormData({...formData, date: e.target.value})} 
                />
                <div className="space-y-2">
                  <label className="text-sm font-medium leading-none text-zinc-700">{APP_COPY.dashboard.forms.account}</label>
                  <div className="grid grid-cols-2 gap-2 p-1 bg-zinc-100 rounded-xl">
                    <Button 
                      type="button" 
                      variant={formData.accountType === 'personal' ? 'outline' : 'ghost'} 
                      size="sm"
                      className={cn("text-[10px] h-9 rounded-lg px-2", formData.accountType === 'personal' && "bg-white shadow-sm border-zinc-200")}
                      onClick={(e) => { e.preventDefault(); setFormData({...formData, accountType: 'personal'}); }}
                    >
                      {APP_COPY.dashboard.forms.personal}
                    </Button>
                    <Button 
                      type="button" 
                      variant={formData.accountType === 'business' ? 'outline' : 'ghost'} 
                      size="sm"
                      className={cn("text-[10px] h-9 rounded-lg px-2", formData.accountType === 'business' && "bg-white shadow-sm border-zinc-200")}
                      onClick={(e) => { e.preventDefault(); setFormData({...formData, accountType: 'business'}); }}
                    >
                      {APP_COPY.dashboard.forms.business}
                    </Button>
                  </div>
                </div>
              </div>

              <Button variant="brand" className="w-full h-14 uppercase tracking-[0.1em] font-black" type="submit">
                {editingId ? APP_COPY.dashboard.modals.updateEntry : APP_COPY.dashboard.modals.confirmEntry}
              </Button>
            </div>
          )}
        </form>
      </SlideOver>

      <div className="max-w-7xl mx-auto space-y-12">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="cursor-pointer hover:border-brand-400/50" onClick={() => { setModalMode('config'); setIsAddModalOpen(true); }}>
            <CardHeader className="pb-2">
              <CardDescription>{APP_COPY.dashboard.cards.monthlyRevenue}</CardDescription>
              <CardTitle className="text-4xl">{formatCurrency(totals.totalRevenue)}</CardTitle>
            </CardHeader>
            <CardContent>
               <Badge variant="secondary">{APP_COPY.dashboard.cards.mrrLabel(formatCurrency(mrr))}</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{APP_COPY.dashboard.cards.monthlyBurn}</CardDescription>
              <CardTitle className="text-4xl">{formatCurrency(totals.totalBurn)}</CardTitle>
            </CardHeader>
            <CardContent>
               <Badge variant="outline" className="text-red-500 border-red-100 bg-red-50/30 font-black">{APP_COPY.dashboard.cards.totalOutflow}</Badge>
            </CardContent>
          </Card>

          <Card className="bg-zinc-950 border-0 shadow-2xl relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-400/10 blur-[80px] rounded-full" />
            <CardHeader className="pb-2">
              <CardDescription className="text-white/40">{APP_COPY.dashboard.cards.netProfit}</CardDescription>
              <CardTitle className="text-4xl text-white">{formatCurrency(totals.netProfit)}</CardTitle>
            </CardHeader>
            <CardContent>
               <Badge variant="brand">{APP_COPY.dashboard.cards.marginLabel(totals.margin)}</Badge>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-12 lg:grid-cols-[1fr_400px]">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase">{APP_COPY.dashboard.ledger.title}</h2>
                <p className="text-sm font-bold text-zinc-400 uppercase tracking-tight mt-1">{APP_COPY.dashboard.ledger.status(transactions.length)}</p>
              </div>
              <div className="flex gap-2">
                 <Button variant="brand" size="sm" onClick={() => { setModalMode('transaction'); handleTypeChange(true); setIsAddModalOpen(true); }}>{APP_COPY.dashboard.ledger.addIncome}</Button>
                 <Button variant="outline" size="sm" onClick={() => { setModalMode('transaction'); handleTypeChange(false); setIsAddModalOpen(true); }}>{APP_COPY.dashboard.ledger.addExpense}</Button>
              </div>
            </div>

            <div className="flex gap-1 p-1.5 bg-zinc-100 rounded-2xl w-fit">
              {(['overview', 'business', 'personal'] as const).map(tab => (
                <Button key={tab} variant={activeTab === tab ? 'default' : 'ghost'} size="sm" onClick={() => setActiveTab(tab)} className="rounded-xl px-6 capitalize">
                  {APP_COPY.dashboard.tabs[tab]}
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              {transactions
                .filter(t => activeTab === 'overview' ? true : t.accountType === activeTab)
                .sort((a, b) => b.amount - a.amount)
                .map((t) => (
                  <div key={t.id} className={cn(
                    "group relative flex items-center justify-between rounded-[2rem] border p-6 transition-all",
                    "border-zinc-50 bg-white hover:border-zinc-200"
                  )}>
                    {deletingId === t.id && (
                      <div className="absolute inset-0 z-20 flex items-center justify-between bg-zinc-950 px-8 rounded-[2rem] animate-fade-in">
                        <p className="text-xs font-black uppercase text-white tracking-widest">{APP_COPY.dashboard.ledger.deleteConfirm}</p>
                        <div className="flex gap-3">
                          <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" onClick={() => setDeletingId(null)}>{APP_COPY.dashboard.ledger.cancel}</Button>
                          <Button variant="destructive" size="sm" onClick={() => { onDeleteTransaction(t.id); setDeletingId(null); }}>{APP_COPY.dashboard.ledger.delete}</Button>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-6">
                      <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl border bg-zinc-50", t.type === 'income' ? 'text-brand-600 border-brand-100' : 'text-zinc-400 border-zinc-100')}>
                         {t.type === 'income' ? <TrendingUp size={20}/> : <Wallet size={20}/>}
                      </div>
                      <div>
                        <p className="text-base font-black text-zinc-900 tracking-tight leading-none">{t.description}</p>
                        <div className="mt-2.5 flex items-center gap-2">
                           <Badge variant="outline">{t.category}</Badge>
                           <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-tighter">{formatDate(t.date)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className={cn("text-xl font-black tracking-tighter", t.type === 'income' ? 'text-brand-600' : 'text-zinc-950')}>
                          {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount)}
                        </p>
                        <p className="text-[9px] font-black uppercase text-zinc-300 tracking-[0.1em] mt-1">{t.accountType}</p>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                        <Button variant="outline" size="icon" onClick={() => handleEditClick(t)} className="h-9 w-9 rounded-xl"><Edit3 size={14}/></Button>
                        <Button variant="outline" size="icon" onClick={() => setDeletingId(t.id)} className="h-9 w-9 rounded-xl text-zinc-300 hover:text-red-500"><Trash2 size={14}/></Button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="space-y-10">
             <Card className="rounded-[3rem] p-10 relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 h-64 w-64 bg-brand-400/5 blur-[100px] rounded-full" />
                <CardHeader className="p-0 mb-10">
                   <CardDescription className="text-brand-600">{APP_COPY.dashboard.growth.title}</CardDescription>
                   <CardTitle className="text-3xl">{APP_COPY.dashboard.growth.subtitle}</CardTitle>
                </CardHeader>
                <div className="space-y-10 relative">
                   <div className="space-y-4">
                      <div className="flex justify-between text-[11px] font-black uppercase tracking-[0.2em]">
                        <span className="text-zinc-400">{APP_COPY.dashboard.growth.progressLabel}</span>
                        <span className="text-brand-600">{analytics.mrrProgress}%</span>
                      </div>
                      <div className="h-3 w-full rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden">
                        <div className="h-full bg-brand-400 shadow-sm transition-all duration-1000" style={{ width: `${Math.min(100, parseFloat(analytics.mrrProgress))}%` }} />
                      </div>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-tighter">{APP_COPY.dashboard.growth.gapLabel(formatCurrency(analytics.gap))}</p>
                   </div>

                   <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.1em] text-zinc-400">{APP_COPY.dashboard.growth.scenariosTitle}</p>
                      <div className="grid gap-3">
                         {analytics.planAnalysis.map(plan => (
                           <div key={plan.id} className="flex items-center justify-between bg-zinc-50 border border-zinc-100 p-5 rounded-[1.75rem] hover:border-brand-200 transition-colors group/plan">
                              <div>
                                 <p className="text-[11px] font-black uppercase tracking-widest text-zinc-900">{APP_COPY.dashboard.growth.planLabel(formatCurrency(plan.price))}</p>
                                 <p className="text-[9px] text-zinc-400 font-bold uppercase mt-1">{APP_COPY.dashboard.growth.tierLabel}</p>
                              </div>
                              <div className="text-right">
                                 <p className="text-lg font-black text-brand-600 tracking-tighter group-hover/plan:scale-110 transition-transform">+{plan.customersNeeded}</p>
                                 <p className="text-[8px] font-black text-zinc-300 uppercase tracking-widest">{APP_COPY.dashboard.growth.targetUsers}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>

                   <Button variant="brand" className="w-full h-14" onClick={() => { setModalMode('config'); setIsAddModalOpen(true); }}>
                      {APP_COPY.dashboard.growth.updateButton} <Settings className="ml-2 h-4 w-4" />
                   </Button>
                </div>
             </Card>

             <Card className="bg-zinc-950 p-8 text-white rounded-[2.5rem]">
                <CardHeader className="p-0 mb-6">
                  <CardDescription className="text-white/30">{APP_COPY.dashboard.sustainability.title}</CardDescription>
                  <CardTitle className="text-2xl text-white">{APP_COPY.dashboard.sustainability.subtitle}</CardTitle>
                </CardHeader>
                <div className="space-y-4">
                   <div className="flex justify-between items-end border-b border-white/10 pb-4">
                      <span className="text-[10px] font-black uppercase text-white/40">{APP_COPY.dashboard.sustainability.dailyBurn}</span>
                      <span className="text-lg font-black text-white">{formatCurrency(totals.totalBurn / 30)}</span>
                   </div>
                   <div className="flex justify-between items-end border-b border-white/10 pb-4">
                      <span className="text-[10px] font-black uppercase text-white/40">{APP_COPY.dashboard.sustainability.runwaySurplus}</span>
                      <span className="text-lg font-black text-brand-400">{formatCurrency(totals.netProfit)}</span>
                   </div>
                   <p className="text-[11px] font-medium text-white/40 leading-relaxed italic mt-4 uppercase tracking-tighter">
                      {APP_COPY.dashboard.sustainability.marginNote(totals.margin)}
                   </p>
                </div>
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
};