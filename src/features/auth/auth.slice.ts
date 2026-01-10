import type {AuthState} from "./auth.types.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {getMeThunk} from "../../hooks/useAuth.ts";

const initialState: AuthState = {
    email: null,
    name: null,
    surname: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<{
            email: string,
            name: string,
            surname: string,
        }>) {
            state.email = action.payload.email;
            state.name = action.payload.name;
            state.surname = action.payload.surname;
        },

        logout(state) {
            state.email = null;
            state.name = null;
            state.surname = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getMeThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getMeThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
            })
            .addCase(getMeThunk.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.error = action.payload ?? 'Failed';
            });
    }
});

export const {setCredentials, logout} = authSlice.actions;
export default authSlice.reducer;