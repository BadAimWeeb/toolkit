import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import TagIcon from '@mui/icons-material/Tag';
import { Link } from "react-router-dom";

export function DrawerNavigator({ open, onClose }: { open: boolean, onClose: () => void }) {
    return (
        <Drawer open={open} onClose={onClose}>
            <Box sx={{ width: 250 }} role="presentation" onClick={onClose}>
                <List>
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/hashpass">
                            <ListItemIcon>
                                <TagIcon />
                            </ListItemIcon>
                            <ListItemText primary="HashPass" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    )
} <List></List>