import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date));
}

export function getDifficultyLabel(difficulty: number): string {
  if (difficulty <= 1.5) return 'Junior';
  if (difficulty <= 2.5) return 'Intermédiaire';
  if (difficulty <= 3.5) return 'Confirmé';
  if (difficulty <= 4.5) return 'Expert';
  return 'Senior';
}

export function getDifficultyColor(difficulty: number): string {
  if (difficulty <= 1.5) return 'bg-green-100 text-green-800';
  if (difficulty <= 2.5) return 'bg-blue-100 text-blue-800';
  if (difficulty <= 3.5) return 'bg-yellow-100 text-yellow-800';
  if (difficulty <= 4.5) return 'bg-orange-100 text-orange-800';
  return 'bg-red-100 text-red-800';
}
