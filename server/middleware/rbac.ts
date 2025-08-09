import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { storage } from '../storage';

export enum UserRole {
  USER = 'user',
  EDITOR = 'editor',
  ADMIN = 'admin'
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  claims: any;
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

declare global {
  namespace Express {
    interface User extends AuthenticatedUser {}
  }
}

export const requireRole = (requiredRole: UserRole) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.isAuthenticated() || !req.user) {
        throw new AppError('Authentication required', 401);
      }

      const user = await storage.getUser(req.user.claims.sub);
      if (!user) {
        throw new AppError('User not found', 404);
      }

      const userRole = (user.role as UserRole) || UserRole.USER;
      
      const roleHierarchy: Record<UserRole, number> = {
        [UserRole.USER]: 0,
        [UserRole.EDITOR]: 1,
        [UserRole.ADMIN]: 2
      };

      const userRoleLevel = roleHierarchy[userRole];
      const requiredRoleLevel = roleHierarchy[requiredRole];

      if (userRoleLevel < requiredRoleLevel) {
        throw new AppError(`Insufficient permissions. Required: ${requiredRole}`, 403);
      }

      req.user.role = userRole as UserRole;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const requireAdmin = requireRole(UserRole.ADMIN);
export const requireEditor = requireRole(UserRole.EDITOR);
export const requireUser = requireRole(UserRole.USER);
