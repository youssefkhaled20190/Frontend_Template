import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from "jwt-decode";
import { createPostRequest } from "../../Hooks/Services/Requests";

var token = localStorage.getItem('token');

const getPayload = () => {
    const t = localStorage.getItem('token');
    if (!t) return null;
    try {
        return JSON.parse(atob(t.split('.')[1]));
    } catch (e) { return null; }
};
const payload = getPayload();
const initialState = {
    token: token || null,
    tokenExpiration: payload ? payload.exp : null,
    role: payload
        ? payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || payload.role
        : null,

    name: payload
        ? (payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || payload.name || payload.sub)
        : null,
    defaultPage: null,
    isAuthenticated: !!token,
    loading: false,
    error: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        setAuth: (state, action) => {
            state.token = action.payload.token;
            state.tokenExpiration = action.payload.tokenExpiration;
            state.role = action.payload.role;
            state.name = action.payload.name;
            state.defaultPage = action.payload.defaultPage;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
        },
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logoutState: (state) => {
            state.token = null;
            state.tokenExpiration = null;
            state.role = null;
            state.name = null;
            state.defaultPage = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        }
    }
});

export const { loginRequest, setAuth, loginFailure, logoutState } = authSlice.actions;
export default authSlice.reducer;

// ----------------------------------------------------------------------
// THUNKS
// ----------------------------------------------------------------------

export const logout = () => (dispatch) => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    dispatch(logoutState());
};

export const logoutAndSave = () => (dispatch, getState) => {
    const currentState = getState();
    console.warn("💾 Saving session work before logout...", currentState);
    dispatch(logout());
};

export const refreshTokenAction = () => async (dispatch) => {
    try {
        const oldToken = localStorage.getItem("token");
        const oldRefreshToken = localStorage.getItem("refreshToken");

        if (!oldToken || !oldRefreshToken) return;
        console.log(oldToken + '\n' + oldRefreshToken);
        
        const response = await createPostRequest("/Auth/RefreshToken", {
            expiredToken: oldToken,
            refreshToken: oldRefreshToken
        });

        const data = response.data || response;

        if (data && data.token) {
            const decoded = jwtDecode(data.token);
            const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
            const name = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded["name"];
            const tokenExpiration = decoded.exp;

            localStorage.setItem("token", data.token);
            localStorage.setItem("refreshToken", data.refreshToken);

            dispatch(setAuth({ token: data.token, role, name, tokenExpiration }));
            console.log("🔄 Token Refreshed Successfully");
        }
    } catch (error) {
        console.error("Refresh failed", error);
        dispatch(logout());
    }
};

export const loginUser = (userName, password) => async (dispatch) => {
    console.log("loginUser action payload:", { userName, password });
    try {
        dispatch(loginRequest());

        const response = await createPostRequest("/Auth/Login", { userName, password });
        const data = response.data || response;

        if (!data?.token) throw new Error("Invalid response from server");

        const { token, refreshToken, defaultPage } = data;
        const decoded = jwtDecode(token);
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const name = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded["name"] || decoded["sub"];
        const tokenExpiration = decoded.exp;

        localStorage.setItem("token", token);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);

        dispatch(setAuth({ token, role, name, defaultPage, tokenExpiration }));

        return { success: true, defaultPage };
    } catch (error) {
        console.error("❌ Login error:", error);
        dispatch(loginFailure(error.message));
        return { success: false };
    }
};

export const checkLogin = () => async (dispatch) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const decoded = jwtDecode(token);
        const role = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
        const name = decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || decoded["name"] || decoded["sub"];
        const tokenExpiration = decoded.exp;

        dispatch(setAuth({ token, role, name, tokenExpiration }));
    } catch {
        dispatch(logout());
    }
};

export const checkRole = (role) => async () => {
    try {
        const res = await createPostRequest("/api/auth/check-role", { role });
        return res === true;
    } catch {
        return false;
    }
};
