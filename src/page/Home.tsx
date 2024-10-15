import { Box, Link, Paper, Typography } from "@mui/material";

export function Home() {
    return <Box sx={{ padding: 2 }}>
        <Paper elevation={2} sx={{ borderRadius: 2, padding: 2 }}>
            <Typography variant="h5" sx={{ lineHeight: 1.5, fontWeight: "bold" }}>Welcome!</Typography>
            <Typography sx={{ lineHeight: 1.5 }}>
                Ad-free offline-ready toolkit from BadAimWeeb with ❤️<br />Please select a tool from the drawer icon on the top left to get started.
            </Typography>
            <Typography sx={{ lineHeight: 1.5, mt: 1 }}>
                <Link target="_blank" rel="noreferrer noopener" href="https://github.com/BadAimWeeb/toolkit">Also did you know that this toolkit is open-source?</Link>
                {" Suggestion/improvement are also welcome by the way :)"}
            </Typography>
        </Paper>
    </Box>
}
