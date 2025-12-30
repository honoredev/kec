import { ReactNode } from 'react';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  // No authentication required - allow all access
  return <>{children}</>;
}
