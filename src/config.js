// ----------------------------------------------------------------------------
// SYSTEM CONFIGURATION PLUGIN
// ----------------------------------------------------------------------------
// Modify this file to easily re-brand and configure your template for a new system.
// Just swap out the texts, API endpoint, and images here!

// 1. Define your system's images here
// Replace these placeholder URLs with your actual local imports:
// e.g., import MainLogo from "./Assets/Images/logo.png";
const MainLogo = "https://placehold.co/400x150?text=Main+Logo";
const MainLogoDark = "https://placehold.co/400x150/1e1e1e/FFF?text=Main+Logo";
const SidebarIcon = "https://placehold.co/100x100?text=Icon";

// Auth Page decorative images (Optional)
const AuthHero1 = "https://placehold.co/400x300/3b82f6/FFF?text=Hero+Image+1";
const AuthHero2 = "https://placehold.co/400x300/6366f1/FFF?text=Hero+Image+2";
const AuthHero3 = "https://placehold.co/400x300/8b5cf6/FFF?text=Hero+Image+3";

export const APP_CONFIG = {
  // --- Branding & Text ---
  systemName: "Frontend Template",
  systemDescription: "Log in to manage your Frontend Template system settings and operations.",
  companyName: "Frontend Template",
  copyrightYear: new Date().getFullYear(),
  
  // --- Network ---
  apiBaseUrl: "https://localhost:7150/api",

  // --- Imagery ---
  logo: MainLogo,
  logoDark: MainLogoDark,
  sidebarLogo: SidebarIcon,

  // Decorative images displayed on the login page hero section
  authHeroImages: [AuthHero1, AuthHero2, AuthHero3]
};
