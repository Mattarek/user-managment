import type {AuthState} from "./auth.types.ts";

const initialState: AuthState = {
    email: null,
    login: null,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials(state, action: PayloadAction<{
            email: string,
            login: string
        }>) {
            state.email = action.email;
            state.login = action.login;
        },

        logout(state) {
            state.email = null;
            state.login = null;
        }
    }
});

export const {setCredentials, logout} = authSlice.actions;
export default authSlice.reducer;