import { FormControl, InputLabel, Select, MenuItem, FormControlLabel, Checkbox, type SelectChangeEvent } from "@mui/material";
import { useCallback, useEffect, useState } from "preact/compat";
import { PasswordInput } from "../PasswordInput";
import Generator from "./LegacyV1Generator";

type HASH_ALGO = "MD5" | "RIPEMD160" | "SHA1" | "SHA224" | "SHA256" | "SHA384" | "SHA512";
type OUTPUT_TYPE = "HEX" | "BASE64" | "BINARY" | "ECOJI" | "BASE65536";

export function V1Component({ updateResult, setCUR }: {
    updateResult: (value: string) => void,
    setCUR: (f: () => void) => void
}) {
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("");

    const [hashAlgo, setHashAlgo] = useState<HASH_ALGO>("MD5");
    const [outputType, setOutputType] = useState<OUTPUT_TYPE>("HEX");
    const [x2Pass, setX2Pass] = useState(false);

    const callUpdateResult = useCallback(() => {
        Generator({ hashAlgo, outputType, x2Pass }, [pass1, pass2]).then(updateResult);
    }, [hashAlgo, outputType, x2Pass]);

    useEffect(() => {
        setCUR(callUpdateResult);
    }, [callUpdateResult, hashAlgo, outputType, x2Pass]);

    return <>
        <PasswordInput password={pass1} setPassword={setPass1} showCopyButton={false} sx={{ mt: 1.5 }} pCount={1} fullWidth />
        <PasswordInput password={pass2} setPassword={setPass2} showCopyButton={false} sx={{ mt: 1.5, mb: 2 }} pCount={2} fullWidth />
        <FormControl sx={{ mt: 1.5 }} fullWidth>
            <InputLabel id="legacyopt-hashalgo">Hash Algorithm</InputLabel>
            <Select
                labelId="legacyopt-hashalgo"
                value={hashAlgo}
                label="Hash Algorithm"
                onChange={(e: SelectChangeEvent<HASH_ALGO>) => {
                    if (e.target && "value" in e.target)
                        setHashAlgo(e.target.value);
                }}
            >
                <MenuItem value="MD5">1 - MD5 (16 bytes)</MenuItem>
                <MenuItem value="RIPEMD160">2 - RIPEMD160 (20 bytes)</MenuItem>
                <MenuItem value="SHA1">3 - SHA-1 (20 bytes)</MenuItem>
                <MenuItem value="SHA224">4 - SHA-224 (28 bytes)</MenuItem>
                <MenuItem value="SHA256">5 - SHA-256 (32 bytes)</MenuItem>
                <MenuItem value="SHA384">6 - SHA-384 (48 bytes)</MenuItem>
                <MenuItem value="SHA512">7 - SHA-512 (64 bytes)</MenuItem>
            </Select>
        </FormControl>
        <FormControl sx={{ mt: 1.5 }} fullWidth>
            <InputLabel id="legacyopt-output">Output types</InputLabel>
            <Select
                labelId="legacyopt-output"
                value={outputType}
                label="Output type"
                onChange={(e: SelectChangeEvent<OUTPUT_TYPE>) => {
                    if (e.target && "value" in e.target)
                        setOutputType(e.target.value);
                }}
            >
                <MenuItem value="HEX">Hexadecimal (0-9 + a-f)</MenuItem>
                <MenuItem value="BASE64">Base64 (0-9, A-Z, a-z, =)</MenuItem>
                <MenuItem value="BINARY">Binary (0,1)</MenuItem>
                <MenuItem value="ECOJI">Ecoji (🤔😊😂...)</MenuItem>
                <MenuItem value="BASE65536">Base65536 (printable Unicode characters)</MenuItem>
            </Select>
        </FormControl>
        <FormControlLabel
            control={
                <Checkbox
                    checked={x2Pass}
                    onChange={e => {
                        if (e.target && e.target instanceof HTMLInputElement)
                            setX2Pass(e.target.checked);
                    }}
                    name="legacyopt-x2pass"
                />
            }
            label="Get x2 password length"
            sx={{ mt: 1 }}
        />
    </>;
};
