import { Box, Button, FormControl, FormControlLabel, FormLabel, Paper, Radio, RadioGroup, Typography } from "@mui/material";
import { useRef, useState } from "preact/hooks";
import { V1Component } from "./v1/component";
import { PasswordInput } from "./PasswordInput";

export function HashPass() {
    const [version, setVersion] = useState(1);
    const [result, setResult] = useState("");
    const [callUpdateResult, setCallUpdateResult] = useState<() => void>(() => { });

    return <Box sx={{ padding: 2 }}>
        <Paper elevation={2} sx={{ borderRadius: 2, p: 2 }}>
            <Typography variant="h6" sx={{ lineHeight: 1.5, fontWeight: "bold" }}>HashPass <Typography component="span" sx={{ fontStyle: "italic", fontSize: 10 }}>
                (formerly called UBPass)
            </Typography></Typography>
            <Typography sx={{ lineHeight: 1.5, fontStyle: "italic" }}>
                Stronger password without headache remembering it.
            </Typography>
            <Typography sx={{ lineHeight: 1.5 }}>
                This tool uses 2 or more passwords and pass them through a hashing algorithm to generate a single strong password.
            </Typography>
        </Paper>

        <Paper elevation={2} sx={{ borderRadius: 2, p: 2, mt: 2 }}>
            <form onSubmit={e => {
                e.preventDefault();
                callUpdateResult();
            }}>
                <FormControl>
                    <FormLabel id="hp-version-selector">Select generator version</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="hp-version-selector"
                        name="hp-version-selector-group"
                        value={version}
                        onChange={e => {
                            if (e.target && e.target instanceof HTMLInputElement)
                                setVersion(parseInt(e.target.value));
                        }}
                    >
                        <FormControlLabel value="1" control={<Radio />} label="Version 1 (Legacy)" />
                        <FormControlLabel value="2" control={<Radio />} label="Version 2 (WIP)" />
                    </RadioGroup>
                </FormControl>
                {version === 1 && <V1Component updateResult={setResult} setCUR={f => setCallUpdateResult(() => f)} />}
                {version === 2 && <Typography>Version 2 is still in development.</Typography>}
                <Box sx={{ display: "flex", mt: 2, gap: 1 }}>
                    <PasswordInput password={result} readonly fullWidth showCopyButton label="Result" />
                    <Button type="submit" variant="contained">Generate</Button>
                </Box>

            </form>
        </Paper>
    </Box>
}
