import { createSlice } from '@reduxjs/toolkit';
import { loginUser, registerUser, logoutUser, fetchMe, forgotPassword } from './authThunk';


const initialState = {
    user: null,
    token: localStorage.getItem('token') || null,
    isLoading: !!localStorage.getItem('token'),
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // ── Register ──────────────────────────────────────
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // ── Login ─────────────────────────────────────────
        builder
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });

        // ── Logout ────────────────────────────────────────
        builder.addCase(logoutUser.fulfilled, (state) => {
            state.user = null;
            state.token = null;
        });

        // ── Fetch current user ────────────────────────────
        builder
            .addCase(fetchMe.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchMe.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload;
            })
            .addCase(fetchMe.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.token = null;
            });

        // ── Forgot Password ──────────────────────────────
        builder
            .addCase(forgotPassword.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(forgotPassword.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(forgotPassword.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
