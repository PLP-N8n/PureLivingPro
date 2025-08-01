import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ModularAdminDashboard } from "@/components/admin/ModularAdminDashboard";

export default function Admin() {
  const { user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [user, authLoading, toast]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-sage-25 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-sage-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <ModularAdminDashboard />;
}