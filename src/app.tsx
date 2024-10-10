import { AppBar, Box, IconButton, Toolbar, Typography, Link as MUILink } from '@mui/material'
import { useEffect, useState } from 'preact/hooks'
import { HashRouter, Link } from 'react-router-dom'

import MenuIcon from '@mui/icons-material/Menu'

import Version from "virtual:fe-version"
import { useRegisterSW } from "virtual:pwa-register/preact"
import { DrawerNavigator } from './component/Drawer'
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
            console.log('App is offline-ready')
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

        return () => {
            navigator.serviceWorker.removeEventListener('message', handleMessages);
        }
    }, []);

    const [drawerOpen, setDrawerOpen] = useState(false);

    return <Box sx={{ width: "100vw", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <HashRouter>
            <AppBar>
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
            <Box sx={{ flexGrow: 1 }}>

            </Box>
            <Box sx={{ position: "sticky", bottom: 8, textAlign: "center" }}>
                <Typography variant='caption' sx={{ overflowWrap: "anywhere" }}>
                    &copy;&nbsp;2024&nbsp;BadAimWeeb <Box sx={{ wordBreak: "keep-all", display: "inline-block" }}>-&nbsp;Toolkit&nbsp;version&nbsp;{version.version}+{version.commit}&nbsp;-</Box> Offline&nbsp;ready:&nbsp;{offlineReady ? "✅" : "❎"}{needRefresh ? <>&nbsp;<MUILink sx={{ cursor: "pointer" }} onClick={() => updateServiceWorker(true)}>(Update&nbsp;available)</MUILink></> : ""}
                </Typography>
            </Box>
        </HashRouter>
    </Box>
}
