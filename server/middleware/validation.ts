import { z } from 'zod';

const common = {
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  ISSUER_URL: z.string().url().optional(),
  PGHOST: z.string().optional(),
  PGPORT: z.string().optional(),
  PGUSER: z.string().optional(),
  PGPASSWORD: z.string().optional(),
  PGDATABASE: z.string().optional(),
};

const devTestSchema = z.object({
  ...common,
  DATABASE_URL: z.string().url().optional(),
  SESSION_SECRET: z.string().min(1).optional(),
  OPENAI_API_KEY: z.string().optional(),
  DEEPSEEK_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),
  REPLIT_DOMAINS: z.string().optional(),
  REPL_ID: z.string().optional(),
});

const prodSchema = z.object({
  ...common,
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters long'),
  DATABASE_URL: z.string().url().optional(),
  OPENAI_API_KEY: z.string().optional(),
  DEEPSEEK_API_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  SENDGRID_API_KEY: z.string().optional(),
  REPLIT_DOMAINS: z.string().optional(),
  REPL_ID: z.string().optional(),
});

export type EnvConfig =
  | z.infer<typeof prodSchema>
  | z.infer<typeof devTestSchema>;

export function validateEnvironment(): EnvConfig {
  const isProd = process.env.NODE_ENV === 'production';
  const schema = isProd ? prodSchema : devTestSchema;
  try {
    const config = schema.parse(process.env);
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
