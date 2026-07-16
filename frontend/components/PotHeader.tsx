interface PotHeaderProps {
  title: string;
  description: string;
}

export function PotHeader({ title, description }: PotHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-semibold text-neutral-900">{title}</h1>
      {description && <p className="text-neutral-500">{description}</p>}
    </div>
  );
}
