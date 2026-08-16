import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../services/prisma.js';
import { AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  phone: z.string().optional(),
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'HOD', 'DOCTOR', 'NURSE', 'STAFF', 'CITIZEN']).optional(),
  branchId: z.string().optional(),
  departmentId: z.string().optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export class AuthController {
  public static async register(req: Request, res: Response) {
    const parsed = registerSchema.parse(req.body);

    const existing = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (existing) {
      return res.status(400).json({ success: false, error: 'User already exists with this email.' });
    }

    const passwordHash = await bcrypt.hash(parsed.password, 10);
    const user = await prisma.user.create({
      data: {
        email: parsed.email,
        passwordHash,
        name: parsed.name,
        phone: parsed.phone,
        role: (parsed.role as any) || 'CITIZEN',
        branchId: parsed.branchId,
        departmentId: parsed.departmentId
      }
    });

    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_gov_hospital_2026_prod';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, branchId: user.branchId, departmentId: user.departmentId },
      secret,
      { expiresIn: '1d' }
    );

    return res.status(201).json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          branchId: user.branchId,
          departmentId: user.departmentId
        }
      }
    });
  }

  public static async login(req: Request, res: Response) {
    const parsed = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({ where: { email: parsed.email } });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(parsed.password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials.' });
    }

    const secret = process.env.JWT_SECRET || 'super_secret_jwt_key_gov_hospital_2026_prod';
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, branchId: user.branchId, departmentId: user.departmentId },
      secret,
      { expiresIn: '1d' }
    );

    return res.json({
      success: true,
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          branchId: user.branchId,
          departmentId: user.departmentId
        }
      }
    });
  }

  public static async me(req: AuthenticatedRequest, res: Response) {
    if (!req.user) return res.status(401).json({ success: false, error: 'Unauthorized' });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { department: true, branch: true }
    });

    if (!user) return res.status(404).json({ success: false, error: 'User not found' });

    return res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        branch: user.branch
      }
    });
  }
}
