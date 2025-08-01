#!/usr/bin/env node

/**
 * Pure Living Pro - System Health Check
 * Comprehensive validation of TypeScript config, dependencies, database, and API endpoints
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';

console.log('🔍 Pure Living Pro - System Health Check\n');

const checks = [];
let allPassed = true;

function addCheck(name, passed, details = '') {
  checks.push({ name, passed, details });
  if (!passed) allPassed = false;
  console.log(`${passed ? '✅' : '❌'} ${name}${details ? ` - ${details}` : ''}`);
}

// 1. TypeScript Configuration
try {
  const tsconfig = JSON.parse(readFileSync('tsconfig.json', 'utf8'));
  addCheck('TypeScript Config', 
    tsconfig.compilerOptions?.strict === true && 
    tsconfig.compilerOptions?.jsx === 'react-jsx' &&
    tsconfig.compilerOptions?.types?.includes('node'),
    'Strict mode, React JSX, Node types configured'
  );
} catch (e) {
  addCheck('TypeScript Config', false, 'Failed to read tsconfig.json');
}

// 2. Critical Dependencies
try {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  const criticalDeps = [
    'express', 'drizzle-orm', '@neondatabase/serverless', 
    'stripe', 'openai', 'zod', '@types/express', '@types/node'
  ];
  
  const missingDeps = criticalDeps.filter(dep => 
    !pkg.dependencies?.[dep] && !pkg.devDependencies?.[dep]
  );
  
  addCheck('Critical Dependencies', 
    missingDeps.length === 0,
    missingDeps.length ? `Missing: ${missingDeps.join(', ')}` : 'All present'
  );
} catch (e) {
  addCheck('Critical Dependencies', false, 'Failed to read package.json');
}

// 3. Environment Variables
const requiredEnvVars = [
  'DATABASE_URL', 'SESSION_SECRET', 'OPENAI_API_KEY', 
  'STRIPE_SECRET_KEY', 'VITE_STRIPE_PUBLIC_KEY'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
addCheck('Environment Variables', 
  missingEnvVars.length === 0,
  missingEnvVars.length ? `Missing: ${missingEnvVars.join(', ')}` : 'All configured'
);

// 4. Database Connectivity
try {
  execSync('node -e "import(\'@neondatabase/serverless\').then(({ Pool }) => { const pool = new Pool({ connectionString: process.env.DATABASE_URL }); pool.query(\'SELECT 1\').then(() => { console.log(\'DB OK\'); process.exit(0); }).catch(() => process.exit(1)); })"', 
    { stdio: 'pipe', timeout: 5000 });
  addCheck('Database Connection', true, 'Connected successfully');
} catch (e) {
  addCheck('Database Connection', false, 'Connection failed');
}

// 5. TypeScript Compilation (Quick Check)
try {
  execSync('npx tsc --noEmit --skipLibCheck', { stdio: 'pipe', timeout: 30000 });
  addCheck('TypeScript Compilation', true, 'No compilation errors');
} catch (e) {
  addCheck('TypeScript Compilation', false, 'Compilation errors detected');
}

// 6. Critical Files Exist
const criticalFiles = [
  'server/storage-simple.ts',
  'client/src/components/admin/OptimizedBlogManagement.tsx',
  'client/src/components/admin/OptimizedProductManagement.tsx',
  'shared/schema.ts',
  '.env.example'
];

const missingFiles = criticalFiles.filter(file => !existsSync(file));
addCheck('Critical Files', 
  missingFiles.length === 0,
  missingFiles.length ? `Missing: ${missingFiles.join(', ')}` : 'All present'
);

// 7. API Endpoints (if server is running)
try {
  const response = execSync('curl -s -m 2 http://localhost:5000/api/products', { encoding: 'utf8' });
  const isValidJson = response.startsWith('[') || response.startsWith('{');
  addCheck('API Endpoints', isValidJson, 'Server responding');
} catch (e) {
  addCheck('API Endpoints', false, 'Server not responding (may need to start)');
}

console.log('\n📊 Health Check Summary:');
console.log(`✅ Passed: ${checks.filter(c => c.passed).length}`);
console.log(`❌ Failed: ${checks.filter(c => !c.passed).length}`);

if (allPassed) {
  console.log('\n🎉 All systems healthy! Pure Living Pro is ready for production.');
} else {
  console.log('\n⚠️  Some issues detected. Review failed checks above.');
  
  console.log('\n🔧 Quick Fixes:');
  console.log('• Install missing dependencies: npm install');
  console.log('• Fix TypeScript: Check tsconfig.json configuration');
  console.log('• Set environment variables: Copy from .env.example');
  console.log('• Start server: npm run dev');
}

process.exit(allPassed ? 0 : 1);