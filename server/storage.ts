import { SimpleStorage } from "./storage-simple";
import { db } from "./db";
import { blogPosts, products } from "@shared/schema";
import { ilike, or, desc, eq } from "drizzle-orm";

export class DatabaseStorage {
  private impl: SimpleStorage;

  constructor() {
    this.impl = new SimpleStorage();
  }

  async getUser(id: string) {
    return this.impl.getUser(id);
  }

  async upsertUser(userData: any) {
    return this.impl.upsertUser(userData);
  }

  async getBlogPosts(limit: number, offset: number) {
    return await db
      .select()
      .from(blogPosts)
      .limit(limit)
      .offset(offset);
  }

  async createBlogPost(post: any) {
    return this.impl.createBlogPost(post);
  }

  async searchProducts(query: string) {
    const whereClause = or(
      ilike(products.name, `%${query}%`),
      ilike(products.description, `%${query}%`)
    );
    return await db
      .select()
      .from(products)
      .where(whereClause as any);
  }
}

export const storage = new SimpleStorage();
