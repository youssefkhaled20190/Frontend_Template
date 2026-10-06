import { createSlice } from '@reduxjs/toolkit';

const getInitialLanguage = () => {
  try {
    const savedLang = localStorage.getItem('language');
    return savedLang || 'en';
  } catch (err) {
    console.error('Error loading language from localStorage:', err);
    return 'en';
  }
};

const initialState = {
  lang: getInitialLanguage(),
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action) => {
      state.lang = action.payload;
      try {
        localStorage.setItem('language', action.payload);
      } catch (err) {
        console.error('Error saving language to localStorage:', err);
      }
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
