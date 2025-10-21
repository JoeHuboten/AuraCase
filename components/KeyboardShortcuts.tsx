'use client';

import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function KeyboardShortcuts() {
  useKeyboardShortcuts();
  return null; // This component only handles keyboard shortcuts
}
