# Vehicle Operations System - Frontend Template

A modern, fast, and robust React frontend boilerplate built with Vite. It features a scalable directory structure, robust state management, and beautiful UI components.

## 🚀 Technologies

This template is pre-configured with industry-standard libraries:
- **[React 19](https://react.dev/)**: The library for web and native user interfaces.
- **[Vite](https://vitejs.dev/)**: Next Generation Frontend Tooling for instant server start and lightning fast HMR.
- **[Tailwind CSS v4](https://tailwindcss.com/)**: A utility-first CSS framework for rapid UI development.
- **[Material-UI (MUI)](https://mui.com/)**: A comprehensive suite of UI tools and components.
- **[Redux](https://redux.js.org/)**: Predictable state container for JavaScript apps.
- **[React Router v7](https://reactrouter.com/)**: Declarative routing for React.
- **[Axios](https://axios-http.com/)**: Promise based HTTP client for the browser.
- **[ApexCharts & Recharts]**: Modern charting libraries for interactive data visualizations.

## 📦 Getting Started

### Prerequisites
Make sure you have Node.js (v18 or newer recommended) installed.

### Installation

1. Install the dependencies using npm:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run start
   ```
   The application will be available at `http://localhost:3000`.

## 📜 Available Scripts

In the project directory, you can run:

- `npm run start` - Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in your browser.
- `npm run build` - Builds the app for production to the `build` folder. It correctly bundles React in production mode and optimizes the build for the best performance.
- `npm run preview` - Locally preview the production build after running the build script.

## 📁 Folder Structure

```
├── public/              # Static assets (favicon, manifest, etc.)
├── src/                 # Source files
│   ├── Assets/          # Images, fonts, and global CSS
│   ├── Axios/           # Axios interceptors and global configurations
│   ├── Components/      # Reusable UI components
│   ├── Data/            # Mock data and enums
│   ├── Hooks/           # Custom React hooks (including API requests)
│   ├── Locals/          # i18n localization files
│   ├── Pages/           # Page-level components
│   ├── Redux/           # Redux store, actions, and reducers
│   ├── App.jsx          # Root application component
│   └── index.jsx        # Entry point for the application
├── index.html           # Main HTML template
├── postcss.config.cjs   # PostCSS configuration for Tailwind
├── tailwind.config.js   # Tailwind CSS configuration
└── vite.config.js       # Vite configuration
```

## 💅 Styling and Theming
This project combines the power of Tailwind CSS for utility-based styling and Material-UI for complex interactive components.
- **Tailwind**: Configure colors, fonts, and spacing in `tailwind.config.js`. Global base styles are in `src/index.css`.
- **Theme**: The application supports Dark Mode. The theme state is managed and can be toggled using `document.documentElement.classList.add('dark')`.

## 🌐 Localization (i18n)
Localization is handled by `i18next` and `react-i18next`. Translation files can be managed inside the `src/Locals/` directory.

---
Enjoy building your next great application!
