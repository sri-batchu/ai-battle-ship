import { Toaster } from "sonner";
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
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-auto max-w-[400px]">
        <Toaster
          position="top-right"
          toastOptions={{
            unstyled: false,
            classNames: {
              toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg w-full',
              description: 'group-[.toast]:text-muted-foreground',
              actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
              cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
            },
            style: {
              minWidth: '280px',
              maxWidth: '380px',
              padding: '12px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              lineHeight: '1.5',
              margin: 0,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
          }}
          closeButton
          visibleToasts={5}
          richColors
          theme="light"
        />
      </div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WelcomeScreen />} />
          <Route path="/game" element={<Game />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
