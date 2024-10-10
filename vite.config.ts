import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import { createTheme } from '@mui/material';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact()],
})
