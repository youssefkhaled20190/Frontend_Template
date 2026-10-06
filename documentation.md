# Frontend Template Architecture Documentation

This document provides a comprehensive technical overview of the React Frontend Template. It is intended for developers who will be extending, modifying, or rebranding this boilerplate for production systems.

---

## 1. System Configuration Plugin (`config.js`)
The template uses a centralized configuration file located at `src/config.js`. This acts as the single source of truth for the application's identity.

**Properties Managed:**
- **Branding:** `systemName`, `systemDescription`, `companyName`, `copyrightYear`.
- **Imagery:** Primary logos (`logo`, `logoDark`), Sidebar icons, and Hero background arrays.
- **Network:** `apiBaseUrl` sets the global endpoint prefix.

*By modifying this single file, a developer can completely rebrand the application without searching through individual React components.*

---

## 2. Routing and Layout (`App.jsx`)
The application uses `react-router-dom` (v7) for client-side routing, wrapped in a `Suspense` boundary to support lazy loading of heavy components.

### Protected vs. Public Routes
- **Public Routes:** `/login` and `/ChangePassword` are accessible when `isAuthenticated` is false. If a logged-in user hits `/login`, they are instantly redirected to `/Dashboard`.
- **Protected Routes:** All routes nested under `/*` (e.g., `/Dashboard`, `/System/Users`) require `isAuthenticated` to be true. Unauthenticated attempts are redirected to `/login`.

### Dynamic Layout
Protected routes are rendered inside the `<Layout />` component. This layout aggregates the `<Sidebar />` and `<Navbar />`, providing a cohesive shell for the inner page components.

---

## 3. State Management (Redux Toolkit)
The global state is managed using Redux Toolkit, providing a modern, boilerplate-free Redux implementation. The store is configured in `src/Redux/store.jsx` and integrates three primary slices:

### A. `authSlice.jsx`
Manages the user's session and identity.
- **State:** `token`, `tokenExpiration`, `role`, `name`, `defaultPage`, `isAuthenticated`, `loading`, `error`.
- **Thunks:**
  - `loginUser`: Dispatches login POST request, decodes the JWT to extract roles and name, and stores tokens in `localStorage`.
  - `refreshTokenAction`: Automatically called to rotate expiring JWTs using the saved `refreshToken`.
  - `logout`: Clears tokens from state and `localStorage`.

### B. `themeSlice.jsx`
Manages the application's visual appearance.
- **State:** `mode` (either `'light'` or `'dark'`).
- **Behavior:** Reads initial state from `localStorage` (`themeMode`). Actions like `toggleTheme` instantly update Redux state and sync back to `localStorage`.

### C. `languageSlice.jsx`
Manages the application's localization.
- **State:** `lang` (e.g., `'en'` or `'ar'`).
- **Behavior:** Persists the user's language choice to `localStorage` to ensure persistence across sessions.

---

## 4. Networking and API (`Requests.jsx` & Axios)
All HTTP communications are centralized to ensure consistent token injection, error handling, and response formatting.

### Axios Interceptors (`AxiosInstance.jsx`)
Though not fully detailed here, the system uses an Axios instance that intercepts outgoing requests to attach the `Authorization: Bearer <token>` header, and intercepts incoming responses to trigger the `refreshTokenAction` if a `401 Unauthorized` is encountered.

### Generalized CRUD Hooks (`Requests.jsx`)
The system provides abstraction functions for all REST verbs:
- `createGetRequest(endPoint, params)`: Automatically cleans null/undefined params and injects path variables (e.g., `/User/{userId}`).
- `createPostRequest`, `createUpdateRequest`, `createDeleteRequest`: Standardized mutations that pass through a common response formatter.

### Advanced Error Extraction
`extractErrorMessage(error)` in `Requests.jsx` parses 5 distinct backend error formats (including RFC 7807 Problem Details, ASP.NET Core Validation Errors, and custom middleware exceptions) to guarantee the frontend always displays a human-readable string.

---

## 5. Theming & Styling Engine
The template uses a hybrid styling approach, blending utility classes with component libraries.

- **TailwindCSS:** Used for layout, spacing, and granular UI control.
- **Material UI (MUI):** Used for complex components. The `App.jsx` wraps the application in MUI's `<ThemeProvider theme={muiTheme}>`, binding MUI's internal mode directly to our Redux `themeSlice`.
- **DOM Injection:** A `useLayoutEffect` in `App.jsx` dynamically adds or removes the `dark` class from the `<html>` root node, triggering Tailwind's `dark:` pseudo-classes instantly alongside MUI's native dark mode.

---

## 6. Internationalization (i18n)
The application supports multi-language configurations powered by `i18next`.

- **Dynamic DOM Direction:** In `App.jsx`, a `useEffect` listens to the `lang` state from Redux. If the language is Arabic (`'ar'`), it immediately sets `document.dir = "rtl"`, flawlessly flipping the entire Tailwind UI.
- **Translation Hook:** Components consume the `useTranslate` hook, giving them access to the `t()` function to localize hardcoded strings based on the JSON files in `src/Locals/`.

---

## 7. Authentication Flow Breakdown
1. **User Submits Form:** The `Auth.jsx` component uses **Formik** and **Yup** to validate the username/password before firing the `loginUser` Redux thunk.
2. **API Call & Token Extraction:** The backend returns a JWT. The thunk decodes this JWT using `jwt-decode` to extract claims like `name`, `role`, and `exp` (expiration).
3. **State Hydration:** These claims, along with the raw token, are dumped into the Redux `authSlice`.
4. **Router Reacts:** The `<App />` component observes `isAuthenticated` becoming `true` and forces a redirect from `/login` to `/Dashboard` (or a dynamic `defaultPage`).
5. **Persistence:** Because the token is in `localStorage`, on hard reloads, the initial state of the `authSlice` reads the token, ensuring the user stays logged in without a flicker.
