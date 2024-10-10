import { render } from 'preact'
import { App } from './app.tsx'
import './index.css'
import { createTheme, ThemeProvider } from '@mui/material';

import "./sw/controller.ts";

render(
    <ThemeProvider theme={createTheme({ cssVariables: true, colorSchemes: { dark: true } })}>
        <App />
    </ThemeProvider>,
    document.getElementById('app')!
);
