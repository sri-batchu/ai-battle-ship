import { Toaster } from 'sonner';
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { WelcomeScreen } from "@/components/WelcomeScreen";
import Game from "./pages/Index";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-background text-foreground">
          <Toaster
            position="top-right"
            theme="light"
            closeButton
            visibleToasts={5}
            toastOptions={{
              style: {
                background: 'hsl(var(--background))',
                color: 'hsl(var(--foreground))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
                fontSize: '0.875rem',
                lineHeight: '1.5',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                maxWidth: '380px',
              },
              classNames: {
                toast: 'group relative [&:not(:last-child)]:scale-[0.98] hover:!scale-100 transition-all duration-300',
                title: 'font-medium pr-6',
                description: 'text-sm',
                actionButton: '!bg-primary !text-primary-foreground',
                cancelButton: '!bg-muted !text-muted-foreground',
                closeButton: '!absolute !top-2 !right-2 !h-5 !w-5 p-0.5 !text-foreground/50 hover:!text-foreground !bg-transparent hover:!bg-foreground/10 rounded',
                success: '!border-green-500/20',
                error: '!border-red-500/20',
                warning: '!border-yellow-500/20',
                info: '!border-blue-500/20',
              },
            }}
          />
          <style dangerouslySetInnerHTML={{
            __html: `
              .toast {
                --toast-foreground: hsl(var(--foreground));
              }
              .toast:not(:last-child) {
                --toast-foreground: hsl(var(--muted-foreground));
              }
              .toast:last-child {
                --toast-foreground: hsl(var(--foreground));
              }
              .toast .title {
                color: var(--toast-foreground) !important;
              }
              .toast .description {
                color: color-mix(in srgb, var(--toast-foreground) 80%, transparent) !important;
              }
            `
          }} />
          
          {/* Dark mode styles */}
          <style dangerouslySetInnerHTML={{
            __html: `
              .dark .toast {
                --toast-bg: hsl(var(--background));
                --toast-foreground: hsl(var(--foreground));
                --toast-border: hsl(var(--border));
                background: var(--toast-bg) !important;
                color: var(--toast-foreground) !important;
                border-color: var(--toast-border) !important;
              }
              .toast .close-button {
                color: currentColor !important;
                opacity: 0.5;
              }
              .toast:hover .close-button {
                opacity: 0.8;
              }
            `
          }} />
          <Routes>
            <Route path="/" element={<WelcomeScreen />} />
            <Route path="/game" element={<Game />} />
            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
