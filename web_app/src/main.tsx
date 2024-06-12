import React from "react"
import ReactDOM from "react-dom/client"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter } from "react-router-dom"
import "inter-ui/inter.css"
import App from "./App.tsx"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "./components/ui/tooltip.tsx"
import I18nInitializer from './i18n'; 

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <I18nInitializer />
        <ThemeProvider defaultTheme="dark" disableTransitionOnChange>
          <TooltipProvider>
            <App />
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
)
