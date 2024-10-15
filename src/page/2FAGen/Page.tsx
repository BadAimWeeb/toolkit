import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useCallback, useState } from "preact/hooks";
import { type HOTP, TOTP, URI } from "otpauth";
import { TwoFAItemDisplay } from "./2FAItemDisplay";

export function TwoFAGen() {
    const [secretKey, setSecretKey] = useState("");
    const [itemDisplay, setItemDisplay] = useState<JSX.Element[]>([]);

    const handleParseKey = useCallback(() => {
        const keys = secretKey.split("\n").map(k => k.trim()).filter(k => k.length > 0);

        const items = keys
            .map((key, i) => {
                // Parsing step
                const isOTPAuth = key.startsWith("otpauth://");
                const isValidTOTPBase32 = /^[A-Z2-7]+=*$/i.test(key.replace(/\s/g, ""));

                const totpObject = isOTPAuth ? URI.parse(key) :
                    isValidTOTPBase32 ? new TOTP({ secret: key.replace(/\s/g, "") }) : null;

                return [totpObject, i] as const;
            })
            .filter((item): item is [TOTP | HOTP, number] => item[0] !== null)
            // Deduplicate 
            .filter((item, index, a) => a.findIndex(i => 
                i[0].secret === item[0].secret && 
                i[0].algorithm === item[0].algorithm && 
                i[0].digits === item[0].digits
            ) === index)
            .map(item => <TwoFAItemDisplay 
                inputKey={item[0]} 
                key={item[0].secret.base32}
                hotpPushCounter={() => {
                    const newKeys = [...keys];
                    newKeys[item[1]] = item[0].toString();
                    setSecretKey(newKeys.join("\n"));
                }}
            />);

        setItemDisplay(items);
    }, [secretKey]);

    return <Box sx={{ padding: 2 }}>
        <Paper elevation={2} sx={{ borderRadius: 2, p: 2 }}>
            <Typography variant="h6" sx={{ lineHeight: 1.5, fontWeight: "bold" }}>2FA Generator</Typography>
            <Typography sx={{ lineHeight: 1.5, fontStyle: "italic" }}>
                Offline(!) 2FA code generator with NO installation required and NO server involved.
            </Typography>
            <Typography sx={{ lineHeight: 1.5 }}>
                This tool uses requires a secret key and a correct browser time to generate 2FA code.
            </Typography>
            <Alert severity="warning" sx={{ mt: 1 }}>Make sure you already set the correct time in your operating system before proceeding.</Alert>
        </Paper>

        <Paper elevation={2} sx={{ borderRadius: 2, p: 2, mt: 2 }}>
            <form onSubmit={e => {
                e.preventDefault();
                handleParseKey();
            }}>
                <Typography sx={{ lineHeight: 1.5 }}>Enter your 2FA secret key. Multiple keys are supported (one key per line), both <code>otpauth://</code> format and raw Base32 key (<code>SECR ETKE Y234 567X</code>) are supported.</Typography>
                <TextField
                    multiline fullWidth label="Secret Key"
                    variant="outlined" sx={{ mt: 2 }}
                    minRows={3} maxRows={8}
                    value={secretKey}
                    onChange={e => {
                        if (e.target && (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement))
                            setSecretKey(e.target.value);
                    }}
                />
                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
                    <Button type="submit" variant="contained">Import</Button>
                </Box>
            </form>
        </Paper>
        {!!itemDisplay.length &&
            <Paper elevation={2} sx={{ borderRadius: 2, p: 2, mt: 2 }}>
                {itemDisplay}
            </Paper>
        }
    </Box>
}
