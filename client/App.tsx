import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";
import ArticleDetail from "./pages/ArticleDetail";
import Contact from "./pages/Contact";
import CodePlayground from "./pages/CodePlayground";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/articulo/:slug" element={<ArticleDetail />} />
          <Route path="/categoria/:category" element={<Placeholder title="Categoría" description="Artículos de esta categoría" />} />
          <Route path="/sobre-nosotros" element={<Placeholder title="Sobre Nosotros" description="Conoce más sobre nuestro blog de programación" />} />
          <Route path="/contacto" element={<Contact />} />
          <Route path="/espacio-codigo" element={<CodePlayground />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
