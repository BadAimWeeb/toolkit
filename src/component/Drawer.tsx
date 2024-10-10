import { Box, Drawer, List } from "@mui/material";

export function DrawerNavigator({ open, onClose }: { open: boolean, onClose: () => void }) {
    return (
        <Drawer open={open} onClose={onClose}>
            <Box sx={{ width: 250 }} role="presentation" onClick={onClose}>
                <List>
                </List>
            </Box>
        </Drawer>
    )
}<List></List>