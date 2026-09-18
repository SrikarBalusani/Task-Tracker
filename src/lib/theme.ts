export interface TaskStyle {
  emoji: string;
  accent: string;      // for the left bar + toggle color
  iconBg: string;       // small chip behind the emoji
  glow: string;
}

const themeMap: Record<string, TaskStyle> = {
  'dsa': { emoji: '🧠', accent: 'bg-purple-500', iconBg: 'bg-purple-500/20', glow: 'shadow-purple-500/20' },
  'os': { emoji: '⚙️', accent: 'bg-slate-400', iconBg: 'bg-slate-400/20', glow: 'shadow-slate-400/20' },
  'js project': { emoji: '💻', accent: 'bg-blue-500', iconBg: 'bg-blue-500/20', glow: 'shadow-blue-500/20' },
  'learning german': { emoji: '🇩🇪', accent: 'bg-orange-500', iconBg: 'bg-orange-500/20', glow: 'shadow-orange-500/20' },
  'niat masterclass': { emoji: '🎓', accent: 'bg-indigo-500', iconBg: 'bg-indigo-500/20', glow: 'shadow-indigo-500/20' },
  'e-myth book': { emoji: '📖', accent: 'bg-emerald-500', iconBg: 'bg-emerald-500/20', glow: 'shadow-emerald-500/20' },
  'gate preparation': { emoji: '📘', accent: 'bg-rose-500', iconBg: 'bg-rose-500/20', glow: 'shadow-rose-500/20' },
}

const fallbackThemes: TaskStyle[] = [
  { emoji: '✨', accent: 'bg-pink-500', iconBg: 'bg-pink-500/20', glow: 'shadow-pink-500/20' },
  { emoji: '🚀', accent: 'bg-sky-500', iconBg: 'bg-sky-500/20', glow: 'shadow-sky-500/20' },
  { emoji: '🎯', accent: 'bg-fuchsia-500', iconBg: 'bg-fuchsia-500/20', glow: 'shadow-fuchsia-500/20' },
  { emoji: '💡', accent: 'bg-teal-500', iconBg: 'bg-teal-500/20', glow: 'shadow-teal-500/20' },
]

export function getTaskStyle(name: string): TaskStyle {
  const key = name.toLowerCase().trim()
  if (themeMap[key]) return themeMap[key]
  const hash = (name.length + (name.charCodeAt(0) || 0)) % fallbackThemes.length
  return fallbackThemes[hash]
}