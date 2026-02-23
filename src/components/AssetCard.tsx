import React, { useState, useEffect } from 'react';
import { Asset } from '../types';
import { formatCurrency, formatPercent, cn, formatCompactNumber } from '../utils';
import { TrendingUp, TrendingDown, Calendar, Info, BarChart3, Sparkles, PieChart, Zap } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, YAxis, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import { getAssetInsight } from '../services/geminiService';
import Markdown from 'react-markdown';

interface AssetCardProps {
  asset: Asset;
}

export const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const isPositive = asset.change >= 0;
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function fetchInsight() {
      setLoadingInsight(true);
      try {
        const text = await getAssetInsight(asset);
        if (isMounted) {
          setInsight(text || null);
        }
      } catch (error) {
        if (isMounted) {
          setInsight("Erro ao carregar insight.");
        }
      } finally {
        if (isMounted) {
          setLoadingInsight(false);
        }
      }
    }
    fetchInsight();
    return () => {
      isMounted = false;
    };
  }, [asset.ticker]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 flex flex-col gap-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 relative">
        {asset.projectedReturn > 16 && asset.pvp < 1.1 && (
          <div className="absolute -top-4 -left-4 bg-amber-400 text-brand-bg text-[10px] font-black px-3 py-1 rounded-lg shadow-lg flex items-center gap-1 animate-bounce">
            <Sparkles className="w-3 h-3" />
            MELHOR OPORTUNIDADE DE COMPRA
          </div>
        )}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-3xl font-black tracking-tighter">{asset.ticker}</h2>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-border text-brand-text-secondary font-bold uppercase tracking-wider">
              {asset.type}
            </span>
          </div>
          <p className="text-brand-text-secondary text-sm font-medium">{asset.name}</p>
        </div>
        <div className="text-left sm:text-right w-full sm:w-auto">
          <div className="text-4xl font-black tracking-tighter text-brand-accent">{formatCurrency(asset.price)}</div>
          <div className={cn(
            "flex items-center sm:justify-end gap-1 text-sm font-bold",
            isPositive ? "text-emerald-400" : "text-rose-400"
          )}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {isPositive ? '+' : ''}{asset.change}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-brand-bg/50 p-4 rounded-xl border border-brand-border">
          <div className="flex items-center gap-2 text-brand-text-secondary text-[10px] mb-1 font-bold uppercase">
            <BarChart3 className="w-3 h-3" />
            DY (12M)
          </div>
          <div className="text-lg font-bold text-brand-accent">{formatPercent(asset.dy)}</div>
        </div>
        <div className="bg-brand-bg/50 p-4 rounded-xl border border-brand-border">
          <div className="flex items-center gap-2 text-brand-text-secondary text-[10px] mb-1 font-bold uppercase">
            <Info className="w-3 h-3" />
            P/VP
          </div>
          <div className={cn(
            "text-lg font-bold",
            asset.pvp < 1 ? "text-emerald-400" : "text-brand-text-primary"
          )}>
            {asset.pvp.toFixed(2)}
          </div>
        </div>
        <div className="bg-brand-bg/50 p-4 rounded-xl border border-brand-border">
          <div className="flex items-center gap-2 text-brand-text-secondary text-[10px] mb-1 font-bold uppercase">
            <PieChart className="w-3 h-3" />
            V. MERCADO
          </div>
          <div className="text-lg font-bold">{formatCompactNumber(asset.marketCap)}</div>
        </div>
        <div className="bg-brand-bg/50 p-4 rounded-xl border border-brand-border">
          <div className="flex items-center gap-2 text-brand-text-secondary text-[10px] mb-1 font-bold uppercase">
            <Zap className="w-3 h-3" />
            RENT. PROJ.
          </div>
          <div className="text-lg font-bold text-amber-400">{formatPercent(asset.projectedReturn)}</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className="flex-1 bg-brand-accent hover:bg-brand-accent-hover text-brand-bg font-bold py-3 px-6 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-brand-accent/20">
          COMPRAR
        </button>
        <button className="flex-1 bg-transparent border border-rose-500/50 text-rose-500 hover:bg-rose-500/10 font-bold py-3 px-6 rounded-xl transition-all active:scale-[0.98]">
          VENDER
        </button>
      </div>

      {/* Gemini Insight Section */}
      <div className="bg-brand-card border border-brand-border p-4 rounded-xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
          <Sparkles className="w-12 h-12 text-brand-accent" />
        </div>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-brand-accent text-xs font-bold">
            <Sparkles className="w-3 h-3" />
            INSIGHT IA (GEMINI)
          </div>
          <button 
            onClick={() => {
              setInsight(null);
              setLoadingInsight(true);
              getAssetInsight(asset).then(text => {
                setInsight(text || null);
                setLoadingInsight(false);
              });
            }}
            disabled={loadingInsight}
            className="text-[10px] font-bold text-brand-text-secondary hover:text-brand-accent transition-colors disabled:opacity-50"
          >
            ATUALIZAR
          </button>
        </div>
        {loadingInsight ? (
          <div className="space-y-2 animate-pulse">
            <div className="h-3 bg-brand-border rounded w-3/4"></div>
            <div className="h-3 bg-brand-border rounded w-1/2"></div>
          </div>
        ) : (
          <div className="text-sm text-brand-text-secondary leading-relaxed markdown-body">
            <Markdown>{insight || ''}</Markdown>
          </div>
        )}
      </div>

      {asset.nextDividend && (
        <div className="bg-brand-accent/10 border border-brand-accent/20 p-4 rounded-xl">
          <div className="flex items-center gap-2 text-brand-accent text-xs font-bold mb-2">
            <Calendar className="w-3 h-3" />
            PRÓXIMO PROVENTO
          </div>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-xs text-brand-text-secondary">Data Com</div>
              <div className="font-medium">{new Date(asset.nextDividend.date).toLocaleDateString('pt-BR')}</div>
            </div>
            <div className="text-right">
              <div className="text-xs text-brand-text-secondary">Valor</div>
              <div className="text-lg font-bold text-brand-accent">{formatCurrency(asset.nextDividend.value)}</div>
            </div>
          </div>
        </div>
      )}

      <div className="h-32 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={asset.history}>
            <YAxis hide domain={['auto', 'auto']} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#141416', border: '1px solid #232326', borderRadius: '8px' }}
              itemStyle={{ color: '#10B981' }}
              labelStyle={{ display: 'none' }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#10B981" 
              strokeWidth={2} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};
