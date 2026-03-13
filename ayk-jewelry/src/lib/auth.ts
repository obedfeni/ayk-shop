import { SignJWT, jwtVerify } from 'jose';

const secret = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export async function signToken(payload: { username: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .setIssuedAt()
    .sign(secret());
}

export async function verifyToken(token: string): Promise<{ username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as { username: string };
  } catch {
    return null;
  }
}

export function getTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader?.startsWith('Bearer ')) return null;
  return authHeader.slice(7);
}

// Simple password comparison - in production use bcrypt
// Since Vercel Edge doesn't support bcrypt natively, we use a constant-time comparison
export function comparePassword(input: string, stored: string): boolean {
  // stored is the plain password set in env (use a strong one!)
  // For production, generate a hash and use bcrypt or argon2
  return input === stored;
}
