import { AuthGuard } from '@/lib/auth-guard';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="min-h-screen flex items-center justify-center bg-[hsl(var(--background-tertiary))] p-4">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[hsl(var(--brand)/0.15)] blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[hsl(199,89%,50%/0.1)] blur-[120px]" />
        </div>
        
        {/* Content container */}
        <div className="w-full max-w-md relative z-10 animate-fade-in">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
