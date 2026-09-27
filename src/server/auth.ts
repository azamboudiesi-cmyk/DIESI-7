import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { db } from './db';
import { User } from '../types';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

// Simple in-memory session token store mapped to userId with 7-day expiration
interface SessionData {
  userId: string;
  createdAt: number;
  expiresAt: number;
}

const sessions = new Map<string, SessionData>();

export function createSessionToken(userId: string): string {
  const token = `tok_${crypto.randomBytes(32).toString('hex')}`;
  const now = Date.now();
  sessions.set(token, {
    userId,
    createdAt: now,
    expiresAt: now + 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return token;
}

export function revokeSessionToken(token: string): void {
  sessions.delete(token);
}

export function getUserFromToken(token: string): User | null {
  if (!token) return null;

  const session = sessions.get(token);
  if (!session) {
    // If it's a demo token or server restart, allow the default demo token
    if (token === 'demo_token_alex') {
      const demoUser = db.getUserByEmail('alex@techinterviews.io');
      return demoUser || null;
    }
    return null;
  }

  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }

  const user = db.getUserById(session.userId);
  return user || null;
}

// Authentication middleware
export function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentification requise. Veuillez vous connecter.' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const user = getUserFromToken(token);

  if (!user) {
    res.status(401).json({ error: 'Session invalide ou expirée. Veuillez vous reconnecter.' });
    return;
  }

  req.user = user;
  next();
}

// Optional authentication middleware (for guest users or optional features)
export function optionalAuth(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const user = getUserFromToken(token);
    if (user) {
      req.user = user;
    }
  }
  next();
}
