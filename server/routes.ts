import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { generateWellnessPlan, generatePersonalizedContent, analyzeMoodAndSuggestActivities } from "./openai";
import { insertBlogPostSchema, insertProductSchema, insertChallengeSchema, insertUserChallengeSchema, insertDailyLogSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Blog Posts API
  app.get('/api/blog-posts', async (req, res) => {
    try {
      const { limit, offset, category } = req.query;
      const posts = await storage.getBlogPosts(
        parseInt(limit as string) || 10,
        parseInt(offset as string) || 0,
        category as string
      );
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get('/api/blog-posts/:slug', async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Blog post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  // Products API
  app.get('/api/products', async (req, res) => {
    try {
      const { limit, offset, category } = req.query;
      const products = await storage.getProducts(
        parseInt(limit as string) || 10,
        parseInt(offset as string) || 0,
        category as string
      );
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/search', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q) {
        return res.status(400).json({ message: "Search query required" });
      }
      const products = await storage.searchProducts(q as string);
      res.json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  // Challenges API
  app.get('/api/challenges', async (req, res) => {
    try {
      const { limit, offset } = req.query;
      const challenges = await storage.getChallenges(
        parseInt(limit as string) || 10,
        parseInt(offset as string) || 0
      );
      res.json(challenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  // Admin API - Protected routes
  app.get('/api/admin/stats', isAuthenticated, async (req, res) => {
    try {
      // Get basic statistics
      const [posts, products, challenges] = await Promise.all([
        storage.getBlogPosts(1000), // Get all posts for count
        storage.getProducts(1000), // Get all products for count
        storage.getChallenges(1000) // Get all challenges for count
      ]);

      const stats = {
        totalPosts: posts.length,
        totalProducts: products.length,
        activeChallenges: challenges.filter(c => c.isActive).length,
        totalUsers: 1, // Placeholder - implement user counting later
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  app.get('/api/admin/blog-posts', isAuthenticated, async (req, res) => {
    try {
      const posts = await storage.getBlogPosts(1000); // Get all posts for admin
      res.json(posts);
    } catch (error) {
      console.error("Error fetching admin blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.post('/api/admin/blog-posts', isAuthenticated, async (req, res) => {
    try {
      const userId = (req.user as any)?.claims?.sub;
      const postData = {
        ...req.body,
        authorId: userId,
      };
      const post = await storage.createBlogPost(postData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  app.put('/api/admin/blog-posts/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const post = await storage.updateBlogPost(id, req.body);
      res.json(post);
    } catch (error) {
      console.error("Error updating blog post:", error);
      res.status(500).json({ message: "Failed to update blog post" });
    }
  });

  app.delete('/api/admin/blog-posts/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBlogPost(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting blog post:", error);
      res.status(500).json({ message: "Failed to delete blog post" });
    }
  });

  app.get('/api/admin/products', isAuthenticated, async (req, res) => {
    try {
      const products = await storage.getProducts(1000); // Get all products for admin
      res.json(products);
    } catch (error) {
      console.error("Error fetching admin products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post('/api/admin/products', isAuthenticated, async (req, res) => {
    try {
      const product = await storage.createProduct(req.body);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  app.put('/api/admin/products/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.updateProduct(id, req.body);
      res.json(product);
    } catch (error) {
      console.error("Error updating product:", error);
      res.status(500).json({ message: "Failed to update product" });
    }
  });

  app.delete('/api/admin/products/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting product:", error);
      res.status(500).json({ message: "Failed to delete product" });
    }
  });

  app.get('/api/admin/challenges', isAuthenticated, async (req, res) => {
    try {
      const challenges = await storage.getChallenges(1000); // Get all challenges for admin
      res.json(challenges);
    } catch (error) {
      console.error("Error fetching admin challenges:", error);
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  app.post('/api/admin/challenges', isAuthenticated, async (req, res) => {
    try {
      const challenge = await storage.createChallenge(req.body);
      res.status(201).json(challenge);
    } catch (error) {
      console.error("Error creating challenge:", error);
      res.status(500).json({ message: "Failed to create challenge" });
    }
  });

  app.put('/api/admin/challenges/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const challenge = await storage.updateChallenge(id, req.body);
      res.json(challenge);
    } catch (error) {
      console.error("Error updating challenge:", error);
      res.status(500).json({ message: "Failed to update challenge" });
    }
  });

  app.delete('/api/admin/challenges/:id', isAuthenticated, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteChallenge(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting challenge:", error);
      res.status(500).json({ message: "Failed to delete challenge" });
    }
  });

  // AI Content Generation Routes
  app.post('/api/admin/generate-content', isAuthenticated, async (req, res) => {
    try {
      const { prompt, category, type } = req.body;
      
      if (!prompt) {
        return res.status(400).json({ message: "Prompt is required" });
      }

      const { generateWellnessBlogPost } = await import("./openai");
      const content = await generateWellnessBlogPost(prompt, category || "wellness");
      
      res.json(content);
    } catch (error: any) {
      console.error("Error generating content:", error);
      
      if (error.status === 429 || error.message?.includes('quota')) {
        res.status(429).json({ 
          message: "OpenAI quota exceeded. Please check your billing and add credits.",
          type: "quota_exceeded"
        });
      } else {
        res.status(500).json({ message: "Failed to generate content" });
      }
    }
  });

  app.post('/api/admin/optimize-seo', isAuthenticated, async (req, res) => {
    try {
      const { title, content, category } = req.body;
      
      if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
      }

      const { optimizeContentForSEO } = await import("./openai");
      const optimizedContent = await optimizeContentForSEO(title, content, category || "wellness");
      
      res.json(optimizedContent);
    } catch (error: any) {
      console.error("Error optimizing content:", error);
      
      if (error.status === 429 || error.message?.includes('quota')) {
        res.status(429).json({ 
          message: "OpenAI quota exceeded. Please add credits to continue.",
          type: "quota_exceeded"
        });
      } else {
        res.status(500).json({ message: "Failed to optimize content" });
      }
    }
  });

  app.post('/api/admin/generate-product-description', isAuthenticated, async (req, res) => {
    try {
      const { productName, category, features } = req.body;
      
      if (!productName) {
        return res.status(400).json({ message: "Product name is required" });
      }

      const { generateProductDescription } = await import("./openai");
      const description = await generateProductDescription(productName, category, features);
      
      res.json({ description });
    } catch (error: any) {
      console.error("Error generating product description:", error);
      
      if (error.status === 429 || error.message?.includes('quota')) {
        res.status(429).json({ 
          message: "OpenAI quota exceeded. Please add credits to continue.",
          type: "quota_exceeded"
        });
      } else {
        res.status(500).json({ message: "Failed to generate product description" });
      }
    }
  });

  // Blog routes
  app.get('/api/blog/posts', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const category = req.query.category as string;
      
      const posts = await storage.getBlogPosts(limit, offset, category);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching blog posts:", error);
      res.status(500).json({ message: "Failed to fetch blog posts" });
    }
  });

  app.get('/api/blog/posts/:slug', async (req, res) => {
    try {
      const post = await storage.getBlogPost(req.params.slug);
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Error fetching blog post:", error);
      res.status(500).json({ message: "Failed to fetch blog post" });
    }
  });

  app.post('/api/blog/posts', isAuthenticated, async (req: any, res) => {
    try {
      const postData = insertBlogPostSchema.parse({
        ...req.body,
        authorId: req.user.claims.sub,
      });
      
      const post = await storage.createBlogPost(postData);
      res.status(201).json(post);
    } catch (error) {
      console.error("Error creating blog post:", error);
      res.status(500).json({ message: "Failed to create blog post" });
    }
  });

  // Product routes
  app.get('/api/products', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      const category = req.query.category as string;
      
      const products = await storage.getProducts(limit, offset, category);
      res.json(products);
    } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get('/api/products/search', async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const products = await storage.searchProducts(query);
      res.json(products);
    } catch (error) {
      console.error("Error searching products:", error);
      res.status(500).json({ message: "Failed to search products" });
    }
  });

  app.get('/api/products/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  app.post('/api/products', isAuthenticated, async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Failed to create product" });
    }
  });

  // Challenge routes
  app.get('/api/challenges', async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const challenges = await storage.getChallenges(limit, offset);
      res.json(challenges);
    } catch (error) {
      console.error("Error fetching challenges:", error);
      res.status(500).json({ message: "Failed to fetch challenges" });
    }
  });

  app.get('/api/challenges/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const challenge = await storage.getChallenge(id);
      if (!challenge) {
        return res.status(404).json({ message: "Challenge not found" });
      }
      res.json(challenge);
    } catch (error) {
      console.error("Error fetching challenge:", error);
      res.status(500).json({ message: "Failed to fetch challenge" });
    }
  });

  app.post('/api/challenges', isAuthenticated, async (req, res) => {
    try {
      const challengeData = insertChallengeSchema.parse(req.body);
      const challenge = await storage.createChallenge(challengeData);
      res.status(201).json(challenge);
    } catch (error) {
      console.error("Error creating challenge:", error);
      res.status(500).json({ message: "Failed to create challenge" });
    }
  });

  // User challenge routes
  app.get('/api/user/challenges', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const userChallenges = await storage.getUserChallenges(userId);
      res.json(userChallenges);
    } catch (error) {
      console.error("Error fetching user challenges:", error);
      res.status(500).json({ message: "Failed to fetch user challenges" });
    }
  });

  app.post('/api/user/challenges', isAuthenticated, async (req: any, res) => {
    try {
      const userChallengeData = insertUserChallengeSchema.parse({
        ...req.body,
        userId: req.user.claims.sub,
      });
      
      const userChallenge = await storage.createUserChallenge(userChallengeData);
      res.status(201).json(userChallenge);
    } catch (error) {
      console.error("Error creating user challenge:", error);
      res.status(500).json({ message: "Failed to create user challenge" });
    }
  });

  // Daily log routes
  app.get('/api/user/logs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      const logs = await storage.getDailyLogs(userId, startDate, endDate);
      res.json(logs);
    } catch (error) {
      console.error("Error fetching daily logs:", error);
      res.status(500).json({ message: "Failed to fetch daily logs" });
    }
  });

  app.post('/api/user/logs', isAuthenticated, async (req: any, res) => {
    try {
      const dailyLogData = insertDailyLogSchema.parse({
        ...req.body,
        userId: req.user.claims.sub,
      });
      
      const dailyLog = await storage.createDailyLog(dailyLogData);
      res.status(201).json(dailyLog);
    } catch (error) {
      console.error("Error creating daily log:", error);
      res.status(500).json({ message: "Failed to create daily log" });
    }
  });

  // AI-powered wellness routes
  app.post('/api/wellness/generate-plan', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user || !user.wellnessProfile) {
        return res.status(400).json({ message: "User wellness profile not found" });
      }

      const plan = await generateWellnessPlan(user.wellnessProfile);
      res.json(plan);
    } catch (error) {
      console.error("Error generating wellness plan:", error);
      res.status(500).json({ message: "Failed to generate wellness plan" });
    }
  });

  app.post('/api/wellness/personalized-content', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (!user || !user.wellnessProfile) {
        return res.status(400).json({ message: "User wellness profile not found" });
      }

      const { contentType } = req.body;
      if (!["article", "tip", "recommendation"].includes(contentType)) {
        return res.status(400).json({ message: "Invalid content type" });
      }

      const content = await generatePersonalizedContent(user.wellnessProfile, contentType);
      res.json(content);
    } catch (error) {
      console.error("Error generating personalized content:", error);
      res.status(500).json({ message: "Failed to generate personalized content" });
    }
  });

  app.post('/api/wellness/analyze-mood', isAuthenticated, async (req: any, res) => {
    try {
      const { mood, energy, recentActivities } = req.body;
      
      const analysis = await analyzeMoodAndSuggestActivities(mood, energy, recentActivities || []);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing mood:", error);
      res.status(500).json({ message: "Failed to analyze mood" });
    }
  });

  // Wellness profile routes
  app.put('/api/user/wellness-profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { wellnessProfile } = req.body;
      
      await storage.upsertUser({
        id: userId,
        wellnessProfile,
      });
      
      res.json({ message: "Wellness profile updated successfully" });
    } catch (error) {
      console.error("Error updating wellness profile:", error);
      res.status(500).json({ message: "Failed to update wellness profile" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
