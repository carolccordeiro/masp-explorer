import { useLanguage } from '@/contexts/LanguageContext';

export function StatsStrip() {
  const { lang } = useLanguage();
  const stats = [
    { value: '11K+', label: lang === 'en' ? 'Artworks' : 'Obras' },
    { value: '1947', label: lang === 'en' ? 'Founded' : 'Fundação' },
    { value: '74m', label: lang === 'en' ? 'Free span' : 'Vão livre' },
    { value: '2', label: lang === 'en' ? 'Buildings' : 'Edifícios' },
  ];
  return (
    <div className="mx-6 mb-2 grid grid-cols-4 border border-border divide-x divide-border">
      {stats.map((s) => (
        <div key={s.label} className="px-2 py-3 text-center">
          <div className="text-base md:text-lg font-black text-primary leading-none">{s.value}</div>
          <div className="text-[9px] uppercase tracking-wider text-muted-foreground mt-1">{s.label}</div>
        </div>
      ))}
    </div>
  );
}
