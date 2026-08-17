import { createSlice, createEntityAdapter, nanoid } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
}

const usersAdapter = createEntityAdapter<User>();

const SEED_USERS: User[] = [
  { id: nanoid(), name: "Liam Gallagher", avatarUrl: "" },
  { id: nanoid(), name: "Mandy Milkovich", avatarUrl: "" },
  { id: nanoid(), name: "Mickey Milkovich", avatarUrl: "" },
  { id: nanoid(), name: "Debbie Gallagher", avatarUrl: "" },
];

const seededState = usersAdapter.setAll(
  usersAdapter.getInitialState(),
  SEED_USERS,
);

export const usersSlice = createSlice({
  name: "users",
  initialState: seededState,
  reducers: {},
});

export const usersReducer = usersSlice.reducer;

const usersSelector = usersAdapter.getSelectors(
  (state: { users: ReturnType<typeof usersReducer> }) => state.users,
);

export const { selectAll: selectAllUsers, selectById: selectUserById } =
  usersSelector;
