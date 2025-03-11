import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface certificateState {
  id: string;
  certificateName: string;
  issuerName: string;
  file: File | null;
}

const initialState: certificateState[] = [];

const certificateSlice = createSlice({
  name: "certificate",
  initialState,
  reducers: {
    addCertificate: (state, action: PayloadAction<certificateState>) => {
      state.push(action.payload);
    },
    removeCertificate: (state, action: PayloadAction<string>) => {
      return state.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addCertificate, removeCertificate } = certificateSlice.actions;

export default certificateSlice;
