import { getIronSession, IronSession, SessionOptions } from 'iron-session';
import { cookies } from 'next/headers';

export type SessionData = {
  isAdmin?: boolean;
};

export const sessionOptions: SessionOptions = {
  password: process.env.ADMIN_COOKIE_SECRET || 'change-me-to-a-random-32-char-string-here',
  cookieName: 'whatyoumissed_admin_session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'lax',
  },
};

export async function getSession(): Promise<IronSession<SessionData>> {
  const cookieStore = await cookies();
  return getIronSession<SessionData>(cookieStore, sessionOptions);
}

export async function requireAdmin(): Promise<void> {
  const session = await getSession();
  if (!session.isAdmin) {
    throw new Error('Unauthorized');
  }
}
