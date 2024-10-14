import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import ContentCopy from "@mui/icons-material/ContentCopy";
import { InputAdornment, IconButton, SxProps, TextField, Tooltip } from "@mui/material";
import { useState } from "preact/hooks"

export function PasswordInput({ password, setPassword, showCopyButton, sx, pCount, fullWidth, variant, label, readonly }: {
    password: string,
    setPassword?: (password: string) => void,
    showCopyButton?: boolean,
    sx?: SxProps,
    pCount?: number,
    fullWidth?: boolean,
    variant?: "standard" | "filled" | "outlined",
    label?: string,
    readonly?: boolean
}) {
    const [k] = useState(Math.random().toString(36).substring(7));
    const [showPassword, setShowPassword] = useState(false);

    return (
        <TextField
            readOnly={readonly}
            id={`password-input-${k}`}
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={e => {
                if (e.target && e.target instanceof HTMLInputElement)
                    setPassword?.(e.target.value);
            }}
            label={label ?? `Password${pCount ? ` #${pCount}` : ""}`}
            sx={sx}
            fullWidth={fullWidth}
            variant={variant}
            slotProps={{
                input: {
                    endAdornment: (
                        <InputAdornment position="end" sx={{ gap: 1.5 }}>
                            {showCopyButton && <Tooltip title="Copy"><IconButton
                                aria-label="copy password"
                                onClick={() => {
                                    navigator.clipboard.writeText(password);
                                }}
                                edge="end"
                            >
                                <ContentCopy />
                            </IconButton></Tooltip>}
                            <Tooltip title={showPassword ? "Hide password" : "Show password"}>
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    )
                }
            }}
        />
    )
}