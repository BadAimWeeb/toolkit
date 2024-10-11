import { AppBar, Box, IconButton, Toolbar, Typography, Link as MUILink } from '@mui/material'
import { useEffect, useState } from 'preact/hooks'
import { HashRouter, Link } from 'react-router-dom'

import MenuIcon from '@mui/icons-material/Menu'

import Version from "virtual:fe-version"
import { useRegisterSW } from "virtual:pwa-register/preact"
import { DrawerNavigator } from './component/Drawer'
import { RoutesDefinition } from './routes'
// replaced dynamically
const reloadSW = '__RELOAD_SW__'

export function App() {
    const version = Version();

    const [offlineReady, setOfflineReady] = useState(false);
    const {
        needRefresh: [needRefresh],
        updateServiceWorker
    } = useRegisterSW({
        onRegisteredSW(swUrl, r) {
            console.log(`Service Worker at: ${swUrl}`)
            // @ts-expect-error just ignore
            if (reloadSW === 'true') {
                r && setInterval(() => {
                    r.update()
                }, 20000 /* 20s for testing purposes */)
            }
        },
        onRegisterError(error) {
            console.log('SW registration error', error)
        },
        onOfflineReady() {
            setOfflineReady(true);
        }
    });

    useEffect(() => {
        function handleMessages(ev: MessageEvent) {
            if (ev.data && typeof ev.data === 'object') {
                switch (ev.data.type) {
                    case "OFFLINE_READY_STATUS":
                        setOfflineReady(ev.data.offlineReady);
                        break;
                }
            }
        }

        navigator.serviceWorker.addEventListener('message', handleMessages);
        navigator.serviceWorker.controller?.postMessage({ type: 'ASK_OFFLINE_READY_STATUS' });
        // Do a query again after 10s to make sure
        setTimeout(() => {
            navigator.serviceWorker.controller?.postMessage({ type: 'ASK_OFFLINE_READY_STATUS' });
        }, 10000);

        return () => {
            navigator.serviceWorker.removeEventListener('message', handleMessages);
        }
    }, []);

    const [drawerOpen, setDrawerOpen] = useState(false);

    return <Box sx={{ width: "100vw", height: "100vh", display: "flex", flexDirection: "column" }}>
        <HashRouter>
            <AppBar position='relative'>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        onClick={() => setDrawerOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        BAW Toolkit
                    </Typography>
                    <Typography
                        variant="h6"
                        noWrap
                        component={Link}
                        to="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.1rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        BAWTK
                    </Typography>
                </Toolbar>
            </AppBar>
            <DrawerNavigator open={drawerOpen} onClose={() => setDrawerOpen(false)} />
            <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                <RoutesDefinition />
                <Box sx={{ position: "absolute", bottom: 8, textAlign: "center", width: "100%" }}>
                    <Typography variant='caption' sx={{ overflowWrap: "anywhere" }}>
                        &copy;&nbsp;2024&nbsp;BadAimWeeb <Box sx={{ wordBreak: "keep-all", display: "inline-block" }}>-&nbsp;Toolkit&nbsp;version&nbsp;{version.version}+{version.commit}&nbsp;-</Box> Offline&nbsp;ready:&nbsp;{offlineReady ? "✅" : "❎"}{needRefresh ? <>&nbsp;<MUILink sx={{ cursor: "pointer" }} onClick={() => updateServiceWorker(true)}>(Update&nbsp;available)</MUILink></> : ""}
                    </Typography>
                </Box>
            </Box>
        </HashRouter>
    </Box>
}
