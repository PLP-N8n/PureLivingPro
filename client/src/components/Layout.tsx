import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Home, 
  BookOpen, 
  Heart, 
  Crown, 
  Trophy, 
  UtensilsCrossed, 
  Timer, 
  User, 
  Mail, 
  Settings, 
  BarChart3,
  Activity
} from 'lucide-react';

const navigationItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Blog", path: "/blog", icon: BookOpen },
  { name: "Wellness Picks", path: "/wellness-picks", icon: Heart },
  { name: "Premium", path: "/premium", icon: Crown },
  { name: "Challenges", path: "/challenges", icon: Trophy },
  { name: "Meal Planner", path: "/meal-planner", icon: UtensilsCrossed },
  { name: "Meditation", path: "/meditation-timer", icon: Timer },
  { name: "Dashboard", path: "/dashboard", icon: BarChart3 },
  { name: "Advanced Analytics", path: "/advanced-analytics", icon: Activity }
];

const adminNavigationItems = [
  { name: "Admin Panel", path: "/admin", icon: Settings },
  { name: "Analytics", path: "/analytics", icon: BarChart3 },
  { name: "Automation", path: "/automation", icon: Settings }
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = (user as any)?.email?.includes('admin') || (user as any)?.role === 'admin';

  const allNavigationItems = [
    ...navigationItems,
    ...(isAuthenticated && isAdmin ? adminNavigationItems : [])
  ];

  const NavigationMenu = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={`${mobile ? 'flex flex-col space-y-2' : 'hidden md:flex md:space-x-8'}`}>
      {allNavigationItems.map((item) => {
        const Icon = item.icon;
        const isActive = location === item.path;
        
        return (
          <Link key={item.path} href={item.path}>
            <a className={`
              flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
              ${isActive 
                ? 'bg-primary text-primary-foreground' 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent'
              }
              ${mobile ? 'w-full justify-start' : ''}
            `}
            onClick={() => mobile && setIsMobileMenuOpen(false)}
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </a>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          {/* Logo */}
          <div className="mr-4 hidden md:flex">
            <Link href="/">
              <a className="mr-6 flex items-center space-x-2">
                <Heart className="h-6 w-6 text-primary" />
                <span className="hidden font-bold sm:inline-block">
                  Pure Living Pro
                </span>
              </a>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <NavigationMenu />

          {/* Right side items */}
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            {/* Mobile menu trigger */}
            <div className="flex items-center md:hidden">
              <Link href="/">
                <a className="mr-2 flex items-center space-x-2">
                  <Heart className="h-6 w-6 text-primary" />
                  <span className="font-bold">Pure Living Pro</span>
                </a>
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              {isAuthenticated ? (
                <div className="flex items-center space-x-2">
                  <span className="hidden text-sm text-muted-foreground md:inline">
                    Welcome, {(user as any)?.firstName || (user as any)?.email?.split('@')[0]}
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/api/logout">Logout</a>
                  </Button>
                </div>
              ) : (
                <Button size="sm" asChild>
                  <a href="/api/login">Login</a>
                </Button>
              )}

              {/* Mobile menu */}
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center space-x-2 border-b pb-4">
                      <Heart className="h-6 w-6 text-primary" />
                      <span className="font-bold">Pure Living Pro</span>
                    </div>
                    <NavigationMenu mobile />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container mx-auto py-6">
          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t bg-muted/50">
        <div className="container py-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Heart className="h-5 w-5 text-primary" />
                <span className="font-semibold">Pure Living Pro</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your complete wellness journey starts here.
              </p>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/dashboard"><a className="hover:text-foreground">Dashboard</a></Link></li>
                <li><Link href="/challenges"><a className="hover:text-foreground">Challenges</a></Link></li>
                <li><Link href="/premium"><a className="hover:text-foreground">Premium</a></Link></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/blog"><a className="hover:text-foreground">Blog</a></Link></li>
                <li><Link href="/wellness-picks"><a className="hover:text-foreground">Wellness Picks</a></Link></li>
                <li><Link href="/meditation-timer"><a className="hover:text-foreground">Meditation</a></Link></li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-semibold">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/contact"><a className="hover:text-foreground">Contact</a></Link></li>
                <li><Link href="/about"><a className="hover:text-foreground">About</a></Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 Pure Living Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}