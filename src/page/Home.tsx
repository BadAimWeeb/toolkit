import { Box, Paper, Typography } from "@mui/material";

export function Home() {
    return <Box sx={{ padding: 2 }}>
        <Paper elevation={2} sx={{ borderRadius: 2, padding: 2 }}>
            <Typography variant="h5" sx={{ lineHeight: 1.5, fontWeight: "bold" }}>Welcome!</Typography>
            <Typography sx={{ lineHeight: 1.5 }}>
                Please select a tool from the drawer icon on the top left to get started.
            </Typography>
        </Paper>
    </Box>
}
