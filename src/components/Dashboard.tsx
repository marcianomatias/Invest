import React, { useState, useEffect, useCallback } from 'react';
import { SearchAutocomplete } from './SearchAutocomplete';
import { AssetCard } from './AssetCard';
import { Asset, MOCK_ASSETS } from '../types';
import { Filter, TrendingUp, DollarSign, LayoutGrid, List, BarChart3, Search, RefreshCw, Clock, Sun, Moon, Sparkles } from 'lucide-react';
import { formatCurrency, formatPercent, cn } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchUpdatedPrices } from '../services/financeService';

export const Dashboard: React.FC = () => {
  const [assets, setAssets] = useState<Asset[]>(MOCK_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'high-dy' | 'cheap' | 'fii' | 'stock' | 'opportunities'>('all');
  const [serverStatus, setServerStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const refreshPrices = useCallback(async () => {
    if (isUpdating) return;
    setIsUpdating(true);
    try {
      const updated = await fetchUpdatedPrices(assets);
      setAssets(updated);
      setLastUpdate(new Date());
      
      // If an asset is selected, update it too
      if (selectedAsset) {
        const updatedSelected = updated.find(a => a.ticker === selectedAsset.ticker);
        if (updatedSelected) setSelectedAsset(updatedSelected);
      }
    } catch (error) {
      console.error("Failed to update prices:", error);
    } finally {
      setIsUpdating(false);
    }
  }, [assets, isUpdating, selectedAsset]);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.ok ? setServerStatus('online') : setServerStatus('offline'))
      .catch(() => setServerStatus('offline'));
  }, []);

  // Set up automatic update every 60 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      refreshPrices();
    }, 60000);
    return () => clearInterval(interval);
  }, [refreshPrices]);

  const filteredAssets = assets.filter(asset => {
    if (activeFilter === 'high-dy') return asset.dy > 10;
    if (activeFilter === 'cheap') return asset.pvp < 1;
    if (activeFilter === 'fii') return asset.type === 'FII';
    if (activeFilter === 'stock') return asset.type === 'Ação';
    if (activeFilter === 'opportunities') return asset.projectedReturn > 14 && asset.pvp < 1.2;
    return true;
  });

  if (activeFilter === 'opportunities') {
    filteredAssets.sort((a, b) => b.projectedReturn - a.projectedReturn);
  }

  return (
    <div className="min-h-screen bg-brand-bg p-4 md:p-8 selection:bg-brand-accent/30 transition-colors duration-300">
      <header className="max-w-7xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1"
        >
          <div className="flex flex-wrap items-center gap-4 mb-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter flex items-center gap-3">
              <span className="bg-brand-accent text-brand-bg px-2 py-0.5 rounded-lg">PRO</span>
              INVEST
            </h1>
            <div className="flex items-center gap-2">
              <div className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all duration-500",
                isUpdating 
                  ? "bg-brand-accent/20 text-brand-accent border border-brand-accent/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]" 
                  : "bg-brand-border text-brand-text-secondary border border-transparent"
              )}>
                {isUpdating ? (
                  <>
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    <span className="animate-pulse">Atualizando...</span>
                  </>
                ) : (
                  <>
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                    Última Atualização: {lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </>
                )}
              </div>
              <button 
                onClick={() => refreshPrices()}
                disabled={isUpdating}
                className="p-1.5 rounded-full bg-brand-card border border-brand-border text-brand-text-secondary hover:text-brand-accent hover:border-brand-accent/50 transition-all disabled:opacity-50"
                title="Atualizar agora"
              >
                <RefreshCw className={cn("w-3.5 h-3.5", isUpdating && "animate-spin")} />
              </button>
            </div>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-xl bg-brand-card border border-brand-border text-brand-text-secondary hover:text-brand-accent transition-all"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-brand-text-secondary font-medium">Dashboard de Inteligência Financeira</p>
        </motion.div>
        <div className="w-full md:w-auto">
          <SearchAutocomplete onSelect={setSelectedAsset} assets={assets} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        {/* Sidebar / Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-3 space-y-4 md:space-y-6"
        >
          <div className="glass-card p-4">
            <h3 className="text-xs font-bold text-brand-text-secondary uppercase tracking-widest mb-4 flex items-center gap-2">
              <Filter className="w-3 h-3" />
              Filtros Inteligentes
            </h3>
            {/* Responsive Filter Layout: Horizontal scroll on mobile, grid on tablet, vertical on desktop */}
            <div className="flex overflow-x-auto pb-2 lg:pb-0 lg:grid lg:grid-cols-1 gap-2 custom-scrollbar no-scrollbar sm:grid sm:grid-cols-2 md:grid-cols-3 lg:flex-none">
              {[
                { id: 'all', label: 'Todos Ativos', icon: LayoutGrid },
                { id: 'opportunities', label: 'Melhores Compras', icon: Sparkles },
                { id: 'high-dy', label: 'Top Pagadores', icon: DollarSign },
                { id: 'cheap', label: 'Mais Baratos', icon: TrendingUp },
                { id: 'fii', label: 'Apenas FIIs', icon: List },
                { id: 'stock', label: 'Apenas Ações', icon: List },
              ].map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => {
                    setActiveFilter(filter.id as any);
                    setSelectedAsset(null);
                  }}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 whitespace-nowrap lg:whitespace-normal",
                    activeFilter === filter.id 
                      ? "bg-brand-accent text-brand-bg shadow-lg shadow-brand-accent/20 scale-[1.02]" 
                      : "text-brand-text-secondary hover:bg-brand-border hover:text-brand-text-primary bg-brand-card/50"
                  )}
                >
                  <filter.icon className="w-4 h-4 shrink-0" />
                  <span className="truncate">{filter.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-4 bg-brand-accent/5 border-brand-accent/20 hidden lg:block">
            <h4 className="text-xs font-bold text-brand-accent uppercase mb-2">Dica Pro</h4>
            <p className="text-xs text-brand-text-secondary leading-relaxed">
              Utilize o filtro <strong>Mais Baratos</strong> para encontrar ativos negociados abaixo do seu valor patrimonial (P/VP &lt; 1).
            </p>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="lg:col-span-9 space-y-6 md:space-y-8">
          <AnimatePresence mode="wait">
            {selectedAsset ? (
              <motion.div 
                key="selected" 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-brand-accent" />
                    Análise Detalhada
                  </h2>
                  <button 
                    onClick={() => setSelectedAsset(null)}
                    className="text-xs font-bold text-brand-text-secondary hover:text-brand-accent transition-colors flex items-center gap-1"
                  >
                    Voltar para listagem
                  </button>
                </div>
                <AssetCard asset={selectedAsset} />
              </motion.div>
            ) : (
              <motion.div 
                key="grid" 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between px-1">
                  <h2 className="text-xl font-bold">
                    {activeFilter === 'all' ? 'Destaques do Mercado' : 'Resultados do Filtro'}
                  </h2>
                  <span className="text-xs text-brand-text-secondary font-medium">
                    {filteredAssets.length} ativos
                  </span>
                </div>
                
                {filteredAssets.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {filteredAssets.map((asset, index) => (
                      <motion.button 
                        key={asset.ticker} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedAsset(asset)}
                        className="text-left focus:outline-none group h-full"
                      >
                        <div className="glass-card p-5 group-hover:border-brand-accent/50 transition-all duration-300 group-hover:shadow-brand-accent/5 group-hover:translate-y-[-4px] h-full flex flex-col justify-between relative overflow-hidden">
                          {asset.projectedReturn > 16 && asset.pvp < 1.1 && (
                            <div className="absolute -right-8 top-4 rotate-45 bg-amber-400 text-brand-bg text-[8px] font-black px-10 py-1 shadow-lg z-10">
                              OPORTUNIDADE
                            </div>
                          )}
                          <div className="flex justify-between items-start mb-4">
                            <div className="min-w-0">
                              <div className="font-black text-xl group-hover:text-brand-accent transition-colors truncate">{asset.ticker}</div>
                              <div className="text-[10px] text-brand-text-secondary truncate uppercase font-bold">{asset.name}</div>
                            </div>
                            <div className={cn(
                              "text-xs font-bold px-2 py-1 rounded-lg shrink-0",
                              asset.change >= 0 ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10"
                            )}>
                              {asset.change >= 0 ? '+' : ''}{asset.change}%
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-2 mt-auto">
                            <div>
                              <div className="text-[9px] text-brand-text-secondary uppercase font-bold mb-1">DY</div>
                              <div className="font-bold text-brand-accent text-xs">{formatPercent(asset.dy)}</div>
                            </div>
                            <div>
                              <div className="text-[9px] text-brand-text-secondary uppercase font-bold mb-1">P/VP</div>
                              <div className="font-bold text-xs">{asset.pvp.toFixed(2)}</div>
                            </div>
                            <div>
                              <div className="text-[9px] text-brand-text-secondary uppercase font-bold mb-1">RENT.</div>
                              <div className="font-bold text-amber-400 text-xs">{formatPercent(asset.projectedReturn)}</div>
                            </div>
                          </div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <div className="glass-card p-12 text-center space-y-4">
                    <div className="w-16 h-16 bg-brand-border rounded-full flex items-center justify-center mx-auto">
                      <Search className="w-8 h-8 text-brand-text-secondary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Nenhum ativo encontrado</h3>
                      <p className="text-brand-text-secondary text-sm">Tente ajustar seus filtros ou buscar por outro ticker.</p>
                    </div>
                    <button 
                      onClick={() => setActiveFilter('all')}
                      className="text-brand-accent font-bold text-sm hover:underline"
                    >
                      Limpar todos os filtros
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <footer className="max-w-7xl mx-auto mt-12 pt-8 border-t border-brand-border flex flex-col gap-8">
        {/* Ticker Tape */}
        <div className="relative overflow-hidden py-3 bg-brand-card/30 rounded-xl border border-brand-border/50 group">
          <div className="animate-marquee gap-12 items-center">
            {assets.concat(assets).map((asset, idx) => (
              <div key={`${asset.ticker}-${idx}`} className="flex items-center gap-3 text-[11px] font-bold shrink-0">
                <span className="text-brand-text-primary bg-brand-border px-1.5 py-0.5 rounded">{asset.ticker}</span>
                <span className="text-brand-accent">{formatCurrency(asset.price)}</span>
                <span className={cn(
                  "flex items-center gap-0.5",
                  asset.change >= 0 ? "text-emerald-400" : "text-rose-400"
                )}>
                  {asset.change >= 0 ? '▲' : '▼'} {Math.abs(asset.change)}%
                </span>
              </div>
            ))}
          </div>
          {/* Gradient Overlays for smooth fade */}
          <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-brand-bg to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-brand-bg to-transparent z-10" />
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-brand-text-secondary uppercase tracking-widest font-bold">
          <div className="text-center md:text-left">Desenvolvido por Marciano Matias - 2026</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              Status: 
              <span className={cn(
                "w-2 h-2 rounded-full",
                serverStatus === 'online' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : 
                serverStatus === 'offline' ? "bg-rose-500" : "bg-amber-500"
              )} />
              {serverStatus}
            </div>
            <div className="hidden sm:block">© 2024 InvestPro Intelligence</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

