import { create } from "zustand";
import userSlice from './slices/user.slice.js';


// Combine all slices in the store:
const useStore = create((...args) => ({
  ...userSlice(...args),
}))


export default useStore;
