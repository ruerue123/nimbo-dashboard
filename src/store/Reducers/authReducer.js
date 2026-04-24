import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../api/api";

// Rehydrates session on app mount and after login. With HttpOnly cookies
// the dashboard can't read the token from JS, so we ask the server who we
// are. Role comes back on userInfo.role.
export const get_user_info = createAsyncThunk(
    'auth/get_user_info',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get('/get-user', { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Not authenticated' })
        }
    }
)

// Fetch session immediately after login so role/userInfo are populated
// before the login page reads successMessage and navigates away. Otherwise
// ProtectRoute sees role='' and bounces straight back to /login.
export const admin_login = createAsyncThunk(
    'auth/admin_login',
    async (info, { dispatch, rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/admin-login', info, { withCredentials: true });
            await dispatch(get_user_info()).unwrap();
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Network error' });
        }
    }
);


export const seller_login = createAsyncThunk(
    'auth/seller_login',
    async (info, { dispatch, rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/seller-login', info, { withCredentials: true })
            await dispatch(get_user_info()).unwrap();
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Network error' })
        }
    }
)


export const profile_image_upload = createAsyncThunk(
    'auth/profile_image_upload',
    async (image, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/profile-image-upload', image, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Upload failed' })
        }
    }
)

export const seller_register = createAsyncThunk(
    'auth/seller_register',
    async (info, { dispatch, rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/seller-register', info, { withCredentials: true })
            await dispatch(get_user_info()).unwrap();
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Network error' })
        }
    }
)

export const profile_info_add = createAsyncThunk(
    'auth/profile_info_add',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/profile-info-add', info, { withCredentials: true })
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Network error' })
        }
    }
)

export const logout = createAsyncThunk(
    'auth/logout',
    async ({ navigate, role }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.get('/logout', { withCredentials: true })
            if (role === 'admin') {
                navigate('/admin/login')
            } else {
                navigate('/login')
            }
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error.response?.data || { error: 'Logout failed' })
        }
    }
)

export const change_password = createAsyncThunk(
    'auth/change_password',
    async (info, { rejectWithValue, fulfillWithValue }) => {
        try {
            const { data } = await api.post('/change-password', info, { withCredentials: true })
            return fulfillWithValue(data.message)
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || error.response?.data?.message || 'Change password failed')
        }
    }
)


export const authReducer = createSlice({
    name: 'auth',
    initialState: {
        successMessage: '',
        errorMessage: '',
        loader: false,
        userInfo: '',
        role: '',
        authChecked: false
    },
    reducers: {
        messageClear: (state) => {
            state.errorMessage = ""
            state.successMessage = ""
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(admin_login.pending, (state) => {
                state.loader = true;
            })
            .addCase(admin_login.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.error || 'Login failed'
            })
            .addCase(admin_login.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message
            })

            .addCase(seller_login.pending, (state) => {
                state.loader = true;
            })
            .addCase(seller_login.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.error || 'Login failed'
            })
            .addCase(seller_login.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message
            })

            .addCase(seller_register.pending, (state) => {
                state.loader = true;
            })
            .addCase(seller_register.rejected, (state, { payload }) => {
                state.loader = false;
                state.errorMessage = payload?.error || 'Registration failed'
            })
            .addCase(seller_register.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.successMessage = payload.message
            })

            .addCase(get_user_info.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.userInfo = payload.userInfo
                state.role = payload.userInfo?.role || ''
                state.authChecked = true;
            })
            .addCase(get_user_info.rejected, (state) => {
                state.loader = false;
                state.userInfo = ''
                state.role = ''
                state.authChecked = true;
            })

            .addCase(logout.fulfilled, (state) => {
                state.userInfo = ''
                state.role = ''
            })

            .addCase(profile_image_upload.pending, (state) => {
                state.loader = true;
            })
            .addCase(profile_image_upload.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.userInfo = payload.userInfo
                state.successMessage = payload.message
            })

            .addCase(profile_info_add.pending, (state) => {
                state.loader = true;
            })
            .addCase(profile_info_add.fulfilled, (state, { payload }) => {
                state.loader = false;
                state.userInfo = payload.userInfo
                state.successMessage = payload.message
            })

            .addCase(change_password.pending, (state) => {
                state.loader = true;
                state.errorMessage = '';
            })
            .addCase(change_password.rejected, (state, action) => {
                state.loader = false;
                state.errorMessage = action.payload;
            })
            .addCase(change_password.fulfilled, (state, action) => {
                state.loader = false;
                state.successMessage = action.payload
            });
    }
})
export const { messageClear } = authReducer.actions
export default authReducer.reducer
