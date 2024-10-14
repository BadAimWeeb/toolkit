import { render } from 'preact'
import { App } from './app.tsx'
import './index.css'
import { createTheme, ThemeProvider } from '@mui/material';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import "./sw/controller.ts";

render(
    <ThemeProvider theme={createTheme({ cssVariables: true, colorSchemes: { dark: true } })}>
        <App />
    </ThemeProvider>,
    document.getElementById('app')!
);
