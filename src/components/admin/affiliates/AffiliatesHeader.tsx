
interface AffiliatesHeaderProps {
  title: string;
  subtitle: string;
}

export function AffiliatesHeader({ title, subtitle }: AffiliatesHeaderProps) {
  return (
    <div className="mb-8">
      <h1 className="text-2xl font-semibold text-[#1A1F2C] mb-2">{title}</h1>
      <p className="text-[#8E9196]">{subtitle}</p>
    </div>
  );
}
