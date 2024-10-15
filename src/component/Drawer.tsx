import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder"
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
                    <ListItem disablePadding>
                        <ListItemButton component={Link} to="/2fagen">
                            <ListItemIcon>
                                <QueryBuilderIcon />
                            </ListItemIcon>
                            <ListItemText primary="2FA Generator" />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    )
} <List></List>