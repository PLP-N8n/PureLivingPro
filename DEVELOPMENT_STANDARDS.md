# Pure Living Pro - Development Standards
## 🎯 **Enhanced Replit Development Guidelines - Pure Living Pro Edition**

*Optimized for TanStack Query + Wouter + shadcn/ui Stack*

### **1. Coding Standards & Best Practices**

#### **Naming Conventions**
- **Files**: `kebab-case` (e.g., `wellness-dashboard.tsx`)
- **Variables**: `camelCase` (e.g., `userWellnessProfile`)
- **Components**: `PascalCase` (e.g., `WellnessDashboard`)
- **Constants**: `UPPER_SNAKE_CASE` (e.g., `API_BASE_URL`)

#### **Component Guidelines**
- Use functional components with hooks only
- Prefer arrow functions and named exports
- Make components reusable with proper TypeScript interfaces
- Follow mobile-first responsive design

### **2. Enhanced Folder Structure**

```
/client/src
  /components
    /ui           → shadcn/ui components
    /wellness     → Wellness-specific components
    /admin        → Admin dashboard components  
    /layout       → Layout components
  /pages          → Route-based pages (Wouter routing)
  /hooks          → Custom React hooks + TanStack Query hooks
  /services       → Query hooks and context providers (replaces /store)
  /lib            → API helpers, utilities, interceptors
  /types          → Global TypeScript interfaces
  /i18n           → Internationalization
  /theme          → Design system tokens and theme configuration
```

### **3. State Management with TanStack Query (Not Zustand)**

#### **Query Service Pattern**
```typescript
// /services/wellness-service.ts
export const WELLNESS_KEYS = {
  all: ['wellness'] as const,
  plans: () => [...WELLNESS_KEYS.all, 'plans'] as const,
  plan: (id: string) => [...WELLNESS_KEYS.plans(), id] as const,
};

export const useWellnessPlans = () => {
  return useQuery({
    queryKey: WELLNESS_KEYS.plans(),
    queryFn: () => apiRequest('/api/wellness/plans'),
  });
};
```

#### **State Management Layers**
- **TanStack Query**: Server state, caching, mutations
- **React Context**: Global UI state (modals, themes)
- **localStorage**: User preferences, settings
- **Component State**: Local form and UI state

### **4. Wouter Routing Best Practices**

#### **Route Organization**
```typescript
// App.tsx - Clean route structure
const { isAuthenticated, isLoading } = useAuth();

return (
  <Switch>
    {isLoading || !isAuthenticated ? (
      <Route path="/" component={Landing} />
    ) : (
      <>
        <Route path="/" component={Home} />
        <Route path="/wellness/:section" component={WellnessSection} />
        <Route path="/admin/:view?" component={AdminDashboard} />
      </>
    )}
  </Switch>
);
```

#### **Navigation Patterns**
- Use `Link` component for navigation
- Use `useLocation` hook for route-based logic
- Implement route guards with authentication checks
- Support nested parameters with TypeScript safety

### **5. Security & Performance Standards**

#### **API Security**
- ✅ Environment variables properly configured
- ✅ Input sanitization in all forms
- ✅ Rate limiting implemented
- ✅ Replit Auth with session management

#### **Performance Optimizations**
- ✅ TanStack Query caching (30s stale time, 5min GC)
- ✅ Lazy loading for admin components
- ✅ Image optimization with proper formats
- ✅ Database query optimization with pagination
- ✅ Component memoization for expensive renders

### **4. Component Standards**

#### **Reusable Component with Theme Integration**
```typescript
import { cardClasses, buttonClasses } from '@/theme';

interface WellnessCardProps {
  title: string;
  status: 'active' | 'inactive' | 'pending';
  description?: string;
  onClick: () => void;
}

const WellnessCard = ({ title, status, description, onClick }: WellnessCardProps) => (
  <div className={`${cardClasses} cursor-pointer`} onClick={onClick}>
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      <Badge variant={status === 'active' ? 'default' : 'secondary'}>
        {status}
      </Badge>
    </div>
    {description && (
      <p className="text-sm text-gray-600 mb-3">{description}</p>
    )}
  </div>
);

export default WellnessCard;
```

#### **shadcn/ui Component Wrapping**
```typescript
// /components/ui/custom-dialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CustomDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const CustomDialog = ({ isOpen, onClose, title, children }: CustomDialogProps) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      {children}
    </DialogContent>
  </Dialog>
);
```

### **5. Git Workflow Standards**

#### **Branch Strategy**
- `main` → Production-ready code
- `develop` → Development and testing
- `feature/*` → New features
- `hotfix/*` → Critical bug fixes

#### **Commit Conventions**
- `feat: added AI wellness coach interface`
- `fix: resolved authentication timeout issue`
- `perf: optimized admin dashboard loading time`
- `docs: updated API documentation`

### **6. Testing & Quality Assurance**

#### **Development Testing**
- ✅ Replit live preview for real-time testing
- ✅ React DevTools for component debugging
- ✅ API endpoint testing with curl/Postman
- ✅ Error boundary implementation

#### **Quality Checks**
- TypeScript strict mode enabled
- ESLint + Prettier configuration active
- Component prop validation
- API response type checking

### **7. UI/UX Consistency**

#### **Design System**
- **Primary Colors**: Tulsi leaf green, sage tones
- **Typography**: Clean, modern sans-serif
- **Spacing**: Consistent Tailwind classes (p-4, gap-4, etc.)
- **Components**: Fully accessible with proper ARIA labels

#### **Responsive Design**
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interface elements
- Progressive enhancement

### **8. Error Handling & API Health Management**

#### **Global Error Interceptors**
```typescript
// Enhanced Query Client with global error handling
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        if (error?.message?.includes('4') && !error?.message?.includes('429')) {
          return false;
        }
        return failureCount < 2;
      },
    },
    mutations: {
      onError: (error: any) => {
        if (error?.message?.includes('401')) {
          window.location.href = '/api/login';
        }
      },
    },
  },
});
```

#### **Fallback UI Components**
```typescript
// /components/error-boundary.tsx
const APIErrorFallback = ({ error, resetErrorBoundary }) => (
  <div className="p-6 text-center">
    <h3 className="text-lg font-semibold mb-2">Service Temporarily Unavailable</h3>
    <p className="text-gray-600 mb-4">We're experiencing connectivity issues.</p>
    <Button onClick={resetErrorBoundary}>Try Again</Button>
  </div>
);
```

### **9. AI Integration Best Practices**

#### **AI Service Management**
- OpenAI GPT-4o for complex wellness planning
- DeepSeek for cost-effective content generation
- Fallback mechanisms for service reliability
- Error handling with user-friendly messages

#### **Autonomous Features**
- 99% autonomy target maintained
- Intelligent scheduling and decision-making
- Real-time performance monitoring
- Self-optimization capabilities

### **9. Performance Metrics & Monitoring**

#### **Key Performance Indicators**
- Page load times < 2 seconds
- API response times < 500ms
- Database query optimization
- Memory usage monitoring

#### **User Experience Metrics**
- Time to first contentful paint
- Largest contentful paint
- First input delay
- Cumulative layout shift

### **10. Scalability Considerations**

#### **Architecture Decisions**
- Microservices-ready backend structure
- Database design for high-volume operations
- Caching strategies for frequently accessed data
- CDN integration for static assets

#### **Growth Planning**
- Modular component architecture
- API versioning strategy
- Database migration planning
- Infrastructure scaling roadmap

---

## ✅ **Implementation Status**

### **Completed Framework Enhancements**
- [x] **TanStack Query Service Layer**: Replaced Zustand with query-based state management
- [x] **Theme System Integration**: Centralized design tokens and component styling
- [x] **Enhanced Error Handling**: Global interceptors and fallback UI components
- [x] **Wouter Routing Optimization**: Type-safe route patterns and navigation
- [x] **shadcn/ui Component Wrapping**: Custom component abstractions for consistency
- [x] **TypeScript Strict Configuration**: Enhanced type safety across the stack
- [x] **Performance Caching Strategy**: 30s stale time, 5min garbage collection
- [x] **Security Framework**: Input validation, authentication, and rate limiting

### **New Development Capabilities**
- [x] **Modular Service Architecture**: Query keys, hooks, and mutation patterns
- [x] **Design System Foundation**: Consistent spacing, colors, and component tokens
- [x] **API Health Monitoring**: Retry logic, error boundaries, and fallback states
- [x] **Component Reusability**: Theme-integrated, TypeScript-safe component patterns

**Status**: Enhanced Replit Development Guidelines fully integrated and operational.

---

## 🚀 **Upgrade Summary**

**From**: Basic Replit setup with Zustand references
**To**: Production-ready TanStack Query + Wouter + shadcn/ui framework

**Key Improvements**:
1. **Better State Management**: TanStack Query replaces Zustand for API-heavy operations
2. **Enhanced Routing**: Wouter optimization with type-safe patterns
3. **Design System**: Centralized theme with reusable component patterns
4. **Robust Error Handling**: Global interceptors and user-friendly fallbacks
5. **Performance Focus**: Intelligent caching, retry logic, and optimization strategies

This framework now perfectly aligns with Pure Living Pro's architecture and provides a solid foundation for rapid, maintainable development.