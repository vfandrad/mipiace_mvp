/**
 * App principal — configura rotas e providers globais
 */

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Loja from "./pages/loja";
import Produtos from "./pages/produtos";
import NotFound from "./pages/not-found";
import Admin from "./pages/admin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider delayDuration={0}>
      <Toaster />
      <Sonner position="top-center" richColors />
      <BrowserRouter>
        <Routes>
          {/* Redireciona "/" para "/loja" */}
          <Route path="/" element={<Navigate to="/loja" replace />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/loja" element={<Loja />} />
          <Route path="/produtos" element={<Produtos />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
