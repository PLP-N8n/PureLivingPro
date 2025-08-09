Production Environment Notes
- Minimum required to boot in production:
  - NODE_ENV=production
  - SESSION_SECRET=32+ chars
  - PORT is honored if provided, defaults to 5000
- Optional in production (server will degrade gracefully without them):
  - DATABASE_URL (affects DB-backed features)
  - OPENAI_API_KEY, DEEPSEEK_API_KEY, GEMINI_API_KEY
  - STRIPE_SECRET_KEY, SENDGRID_API_KEY
  - Replit OIDC: REPLIT_AUTH_ENABLED=true, REPL_ID, REPLIT_DOMAINS, ISSUER_URL
- CORS in production is restricted to:
  - https://purelivingpro.com
  - https://www.purelivingpro.com

Local Production Smoke Test
1) Build and run:
   NODE_ENV=production SESSION_SECRET="your-32-char-secret" PORT=5000 npm run build && node dist/index.js
2) Verify endpoints:
   curl -s http://localhost:5000/robots.txt
   curl -s http://localhost:5000/sitemap.xml | head
   curl -i http://localhost:5000/healthz
   curl -i http://localhost:5000/r/123  # 404 if not found, 302 if configured

Docker Smoke Test
- Build:
  docker build -t purelivingpro:latest .
- Run:
  docker run -p 5000:5000 -e NODE_ENV=production -e SESSION_SECRET="your-32-char-secret" purelivingpro:latest
- Verify:
  curl -s http://localhost:5000/robots.txt


Pure Living Pro - Deployment Options

Overview
This repo builds an Express server that serves both the API and the built React client from a single Node process. The server prefers the PORT environment variable in production and defaults to 5000.

Build artifacts:
- Client: vite build outputs under dist/public
- Server: esbuild bundles server/index.ts to dist/index.js

Prerequisites
- Node 20+
- Production Postgres (Neon recommended) and DATABASE_URL set
- Any optional API keys (OpenAI/DeepSeek/Gemini/Stripe) as needed in production
- SESSION_SECRET set for Express session security

Environment
Copy .env.example to your production environment and set:
- NODE_ENV=production
- DATABASE_URL=postgres://...
- SESSION_SECRET=...
- Any AI/Stripe keys you intend to use in production

Option A: Docker (any VPS, Fly.io, etc.)
1) Build and run locally
   docker build -t purelivingpro:latest .
   docker run -p 5000:5000 --env-file .env purelivingpro:latest

2) Deploy to your provider
   - Push the image to a registry (GHCR, Docker Hub)
   - Create a service that runs `node dist/index.js` and exposes the mapped port (5000 or PORT provided by the platform)

Option B: Fly.io (recommended for simplicity)
1) Install flyctl and sign in
2) Initialize (will create fly.toml; you can choose the Dockerfile)
   fly launch --now
3) Set secrets
   fly secrets set SESSION_SECRET=... DATABASE_URL=...
   fly secrets set OPENAI_API_KEY=... (optional)
4) Deploy
   fly deploy

Option C: Render/Railway/Heroku-like platform
- Use the Dockerfile OR run a Node service with:
  - Build Command: npm run build
  - Start Command: npm run start
  - Ensure the platform provides PORT; our server will use it automatically
- Set environment variables/secrets in the dashboard

Manual Nginx reverse proxy (VPS)
- Run the container or Node process on PORT=5000
- Configure Nginx to proxy https://purelivingpro.com/ to 127.0.0.1:5000
- Ensure SSL (Let’s Encrypt/Certbot)

Health Check
- /robots.txt should return text including Sitemap and Disallow
- /sitemap.xml should return valid XML with absolute URLs
- /r/:id should return 302 to the affiliate target for a real ID
- Root URL should serve the React app

Troubleshooting
- Ensure DATABASE_URL is set in production; some features short-circuit in dev
- If your platform mandates a specific PORT, set it; otherwise the server uses 5000
- Re-check that vite assets exist under dist/public after build

CI/CD
- A minimal CI exists for build/test. Add deploy workflows once your hosting choice and secrets are set.
