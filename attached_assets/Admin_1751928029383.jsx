import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";

import AdminHeader from "../components/admin/AdminHeader";
import BlogPostManager from "../components/admin/BlogPostManager";
import WellnessPickManager from "../components/admin/WellnessPickManager";
import AdminDashboard from "../components/admin/AdminDashboard";
import CommentManager from "../components/admin/CommentManager";
import AIToolsHub from "../components/admin/AIToolsHub";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'admin')) {
      navigate(createPageUrl("Home"));
    }
  }, [user, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return null; // Will redirect via useEffect
  }

  return (
    <div className="wellness-gradient min-h-screen">
      <AdminHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="ai-tools">🤖 AI Tools</TabsTrigger>
            <TabsTrigger value="blog">Blog Posts</TabsTrigger>
            <TabsTrigger value="products">Wellness Picks</TabsTrigger>
            <TabsTrigger value="comments">Comments</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard onTabChange={setActiveTab} />
          </TabsContent>
          <TabsContent value="ai-tools">
            <AIToolsHub />
          </TabsContent>
          <TabsContent value="blog">
            <BlogPostManager />
          </TabsContent>
          <TabsContent value="products">
            <WellnessPickManager />
          </TabsContent>
          <TabsContent value="comments">
            <CommentManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}