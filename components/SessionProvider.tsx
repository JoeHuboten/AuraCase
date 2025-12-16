'use client';

export function SessionProvider({ children }: { children: React.ReactNode }) {
  // This component is no longer needed since we use custom JWT auth
  // Kept for backward compatibility
  return <>{children}</>;
}
