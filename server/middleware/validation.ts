import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters long'),
  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  DEEPSEEK_API_KEY: z.string().min(1, 'DEEPSEEK_API_KEY is required'),
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  SENDGRID_API_KEY: z.string().min(1, 'SENDGRID_API_KEY is required'),
  REPLIT_DOMAINS: z.string().min(1, 'REPLIT_DOMAINS is required'),
  REPL_ID: z.string().min(1, 'REPL_ID is required'),
  ISSUER_URL: z.string().url().optional(),
  PGHOST: z.string().optional(),
  PGPORT: z.string().optional(),
  PGUSER: z.string().optional(),
  PGPASSWORD: z.string().optional(),
  PGDATABASE: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnvironment(): EnvConfig {
  try {
    const config = envSchema.parse(process.env);
    console.log('✅ Environment variables validated successfully');
    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Environment validation failed:');
      error.errors.forEach((err) => {
        console.error(`  - ${err.path.join('.')}: ${err.message}`);
      });
      process.exit(1);
    }
    throw error;
  }
}