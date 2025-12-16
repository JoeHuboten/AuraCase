import { getCsrfTokenResponse } from '@/lib/csrf';

export async function GET() {
  return getCsrfTokenResponse();
}
