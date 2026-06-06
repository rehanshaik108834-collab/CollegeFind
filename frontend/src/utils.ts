export function formatFees(fees: number): string {
  if (fees >= 100000) return `₹${(fees / 100000).toFixed(1)}L/yr`;
  if (fees >= 1000) return `₹${(fees / 1000).toFixed(0)}K/yr`;
  return `₹${fees}/yr`;
}

export function formatPackage(pkg: number): string {
  if (pkg >= 10000000) return `₹${(pkg / 10000000).toFixed(1)}Cr`;
  if (pkg >= 100000) return `₹${(pkg / 100000).toFixed(1)}L`;
  return `₹${(pkg / 1000).toFixed(0)}K`;
}

export function getTypeColor(type: string) {
  const map: Record<string, string> = {
    Engineering: 'bg-blue-50 text-blue-700 border-blue-200',
    Management: 'bg-purple-50 text-purple-700 border-purple-200',
    Medical: 'bg-red-50 text-red-700 border-red-200',
    'Arts & Science': 'bg-green-50 text-green-700 border-green-200',
  };
  return map[type] || 'bg-gray-50 text-gray-700 border-gray-200';
}

export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-emerald-600 bg-emerald-50';
  if (rating >= 4.0) return 'text-green-600 bg-green-50';
  if (rating >= 3.5) return 'text-yellow-600 bg-yellow-50';
  return 'text-orange-600 bg-orange-50';
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}
