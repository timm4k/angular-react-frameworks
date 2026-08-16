import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getForecast, getWeather } from "../services/openWeather.js";

export const fetchWeather = createAsyncThunk(
  "weather/fetch",
  async (payload, { rejectWithValue }) => {
    try {
      const [current, forecast] = await Promise.all([
        getWeather(payload),
        getForecast(payload),
      ]);
      return { current, forecast };
    } catch (error) {
      return rejectWithValue({
        message:
          error instanceof Error ? error.message : "Something went wrong",
        code: error?.code ?? "request-failed",
      });
    }
  },
);

const initialState = {
  current: null,
  forecast: null,
  status: "idle",
  error: null,
};

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeather.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWeather.fulfilled, (state, action) => {
        state.status = "success";
        state.current = action.payload.current;
        state.forecast = action.payload.forecast;
      })
      .addCase(fetchWeather.rejected, (state, action) => {
        state.status = "error";
        state.error = action.payload ?? {
          message: "Something went wrong",
          code: "request-failed",
        };
      });
  },
});

export default weatherSlice.reducer;
