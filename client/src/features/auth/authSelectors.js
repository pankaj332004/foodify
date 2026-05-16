export const selectCurrentUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;
export const selectIsAuthenticated = (state) => !!state.auth.token;
export const selectUserRole = (state) => state.auth.user?.role;
