import { fetchUserProfile } from '@/apis/user.apis';
import { User } from '@/types/user.type';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

// Define a type for the slice state
interface AuthState {
    user: User | null;
}

// Define the initial state using that type
const initialState: AuthState = {
    user: null,
}

export const fetchProfile = createAsyncThunk('auth/loadProfile', async () => {
    const res = await fetchUserProfile();

    if (res.status == 200) {
        return res.data; 
    }
});

export const authSlice = createSlice({
    name: 'auth',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        login: (state)  =>{},
        logout: (state)  =>{},
    },
    extraReducers: builder => {
        builder
            // Fetch User Profile
            .addCase(fetchProfile.fulfilled, (state, action) => {
                state.user = {...action.payload};
            });
    }
})

export const {login, logout } = authSlice.actions

export default authSlice.reducer