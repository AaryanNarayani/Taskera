import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
    uuid: string;
    username: string;
    email: string;
    avatar: string;
    level: number;
    streak: number;
   
}

const initialState: UserState = {
    uuid: "",
    username: "",
    email: "",
    avatar: "",
    level: 1,
    streak: 0
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: { 
        setUser: (state, action: PayloadAction<UserState>) => {
            state.uuid = action.payload.uuid;
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.avatar = action.payload.avatar;
            state.level = action.payload.level;
            state.streak = action.payload.streak;
        }
    }
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;