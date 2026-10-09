import { Leaf, ShieldCheck, CheckCircle2, Award, Sparkles } from 'lucide-react';

export const TIERS = [
  { min: 0, max: 100, name: 'Eco Sprout', color: 'text-lime-500', bg: 'bg-lime-100', icon: Leaf },
  { min: 100, max: 250, name: 'Recycle Scout', color: 'text-emerald-500', bg: 'bg-emerald-100', icon: ShieldCheck },
  { min: 250, max: 500, name: 'Green Guardian', color: 'text-teal-600', bg: 'bg-teal-100', icon: CheckCircle2 },
  { min: 500, max: 1000, name: 'Eco Warrior', color: 'text-cyan-600', bg: 'bg-cyan-100', icon: Award },
  { min: 1000, max: Infinity, name: 'Planet Legend', color: 'text-amber-500', bg: 'bg-amber-100', icon: Sparkles }
];
