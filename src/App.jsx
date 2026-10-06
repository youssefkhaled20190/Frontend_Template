import './App.css';
import { useSelector } from 'react-redux';
import { useEffect, useLayoutEffect, useMemo, Suspense, lazy } from 'react';
import i18n from "./i18n";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Loader from './Components/UI/loader';

const Auth = lazy(() => import('./Pages/Authentication/Auth'));
const ResetPassword = lazy(() => import('./Pages/Authentication/ResetPassword'));
const Layout = lazy(() => import('./Components/Layout/Layout'));
const Blank = lazy(() => import('./Pages/Blank'));

function App() {
  const lang = useSelector((state) => state.language.lang);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const themeMode = useSelector((state) => state.theme.mode);


  const muiTheme = useMemo(() => createTheme({
    palette: {
      mode: themeMode,
    },
  }), [themeMode]);

  useLayoutEffect(() => {
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);


  useEffect(() => {
    i18n.changeLanguage(lang);
    document.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <Router>
        <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><Loader /></div>}>
          <Routes>
            {/* Login route — redirect to dashboard if already authenticated */}
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/Dashboard" replace /> : <Auth />}
            />
            {/* Change Password Route */}
            <Route
              path="/ChangePassword"
              element={isAuthenticated ? <ResetPassword /> : <Navigate to="/login" replace />}
            />
            {/* Protected routes with Sidebar */}
            <Route path="/*" element={
              isAuthenticated ? (
                <Layout>
                  <Routes>
                    <Route path="/" element={<Navigate to="/Dashboard" replace />} />
                    <Route path="/Dashboard" element={<Blank title="Dashboard" />} />
                    <Route path="/System/Users" element={<Blank title="System Users" />} />
                    <Route path="/System/Roles" element={<Blank title="System Roles" />} />
                    <Route path="/Profile" element={<Blank title="User Profile" />} />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" replace />
              )
            } />
          </Routes>
        </Suspense>
      </Router>
    </ThemeProvider>
  );
}

export default App;
