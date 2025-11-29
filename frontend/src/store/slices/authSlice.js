import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Support mock mode for prototype: if no backend URL OR explicit flag
const BASE_URL = process.env.REACT_APP_API_BASE_URL || process.env.NEXT_PUBLIC_API_URL || "";
const MOCK_MODE = (process.env.REACT_APP_USE_MOCK === 'true') || BASE_URL === "";

if (MOCK_MODE) {
    console.warn('[AUTH SLICE] MOCK MODE active: using dummy auth data');
} else {
    console.log("🌐 [AUTH SLICE] Base URL initialized:", BASE_URL);
}

const api = !MOCK_MODE ? axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
}) : null;

const initialState = {
    user: null,
    baseURL: BASE_URL,
    microPage: "unset",
    homepage: "unset",
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: "",
};

// Thunk untuk mendapatkan data pengguna
export const getMe = createAsyncThunk("user/getMe", async (_, thunkAPI) => {
    if (MOCK_MODE) {
        await new Promise(r => setTimeout(r, 200));
        return { id: 'mock-user', name: 'Koordinator Prodi', email: 'koordinator@example.ac.id', role: 'KAPRODI' };
    }
    try {
        const endpoint = "/api/shared/me";
        const fullUrl = `${BASE_URL}${endpoint}`;
        console.log("🔗 [GET ME] Request URL:", fullUrl);
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        const message = error?.response?.data?.msg || "Something went wrong!";
        return thunkAPI.rejectWithValue(message);
    }
});

// Thunk untuk logout pengguna
export const logoutUser = createAsyncThunk("user/logoutUser", async (_, thunkAPI) => {
    if (MOCK_MODE) {
        await new Promise(r => setTimeout(r, 100));
        return null;
    }
    try {
        const endpoint = "/api/shared/logout";
        const fullUrl = `${BASE_URL}${endpoint}`;
        console.log("🔗 [LOGOUT] Request URL:", fullUrl);
        await api.delete(endpoint);
        return null;
    } catch (error) {
        const message = error?.response?.data?.msg || "Something went wrong!";
        return thunkAPI.rejectWithValue(message);
    }
});

// Thunk untuk login pengguna
export const loginUser = createAsyncThunk("user/loginUser", async (user, thunkAPI) => {
    if (MOCK_MODE) {
        await new Promise(r => setTimeout(r, 250));
                const map = { kaprodi: 'koordinator', pimpinan: 'pimpinan', ppmpp: 'ppmpp' };
                return {
                    id: 'mock-login',
                    name: user?.username || 'Mock User',
                        email: (user?.username || 'mock') + '@example.ac.id',
                    role: map[user?.username?.toLowerCase()] || 'koordinator'
                };
    }
    try {
        const endpoint = "/api/shared/login";
        const fullUrl = `${BASE_URL}${endpoint}`;
        console.log("🔗 [LOGIN] Request URL:", fullUrl);
        const response = await api.post(endpoint, user);
        return response.data;
    } catch (error) {
        const message = error?.response?.data?.msg || "Something went wrong!";
        return thunkAPI.rejectWithValue(message);
    }
});

// Thunk untuk register pengguna
export const registerUser = createAsyncThunk("user/register", async (userData, thunkAPI) => {
    if (MOCK_MODE) {
        await new Promise(r => setTimeout(r, 250));
        return {
          id: 'mock-registered',
          name: userData?.name || 'User Baru',
          email: userData?.email || 'userbaru@example.ac.id',
          role: userData?.role || 'KAPRODI'
        };
    }
    try {
        const endpoint = "/api/shared/register";
        const fullUrl = `${BASE_URL}${endpoint}`;
        console.log("🔗 [REGISTER] Request URL:", fullUrl);
        const response = await api.post(endpoint, userData);
        return response.data;
    } catch (error) {
        const message = error?.response?.data?.msg || "Something went wrong!";
        return thunkAPI.rejectWithValue(message);
    }
});

// Slice Redux untuk otentikasi
export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        reset: (state) => initialState,
        setMicroPage: (state, action) => {
            state.microPage = action.payload; // Update microPage value
        },
    },
    extraReducers: (builder) => {
        builder
            // Login User
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.isError = false;
                let payloadUser = action.payload?.user ? action.payload.user : action.payload;
                if (payloadUser && payloadUser.role) {
                    let r = String(payloadUser.role).toLowerCase();
                    if (r === 'unit') r = 'ppmpp';
                    payloadUser.role = r;
                }
                state.user = payloadUser;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Register User
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                let payloadUser = action.payload?.user ? action.payload.user : action.payload;
                if (payloadUser && payloadUser.role) {
                    let r = String(payloadUser.role).toLowerCase();
                    if (r === 'unit') r = 'ppmpp';
                    payloadUser.role = r;
                }
                state.user = payloadUser;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Get Me
            .addCase(getMe.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getMe.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                let payloadUser = action.payload?.user ? action.payload.user : action.payload;
                if (payloadUser && payloadUser.role) {
                    let r = String(payloadUser.role).toLowerCase();
                    if (r === 'unit') r = 'ppmpp';
                    payloadUser.role = r;
                }
                state.user = payloadUser;
            })
            .addCase(getMe.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            // Logout User
            .addCase(logoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = null; // Clear user data on logout
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset, setMicroPage } = authSlice.actions;

export default authSlice.reducer;