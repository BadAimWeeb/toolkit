import { render } from 'preact'
import { App } from './app.tsx'
import './index.css'
import '@pigment-css/react/styles.css';
import { createTheme, ThemeProvider } from '@mui/material';

render(
    <ThemeProvider theme={createTheme({ cssVariables: true, colorSchemes: { dark: true } })}>
        <App />
    </ThemeProvider>,
    document.getElementById('app')!
);
