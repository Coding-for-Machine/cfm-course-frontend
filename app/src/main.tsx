import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // <- domdan
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import './index.css';
import App from "./App";
import { AuthProvider } from "./context/AuthContex";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 min fresh
      gcTime: 30 * 60 * 1000,   // 30 min memory
      retry: 1,
    },
  },
});



const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
  <BrowserRouter>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
    </AuthProvider>
  </BrowserRouter>
);
