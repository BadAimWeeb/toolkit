import { Box, CircularProgress, IconButton, Tooltip, Typography } from "@mui/material";
import { HOTP, TOTP } from "otpauth";
import { useCallback, useEffect, useState } from "preact/hooks";
import RefreshIcon from "@mui/icons-material/Refresh"

export function TwoFAItemDisplay({ inputKey, hotpPushCounter }: { inputKey: TOTP | HOTP, hotpPushCounter?: () => void }) {
    const [prev, setPrev] = useState<string>("000000");
    const [current, setCurrent] = useState<string>("000000");
    const [next, setNext] = useState<string>("000000");
    const [timeLeft, setTimeLeft] = useState<number>(0);

    useEffect(() => {
        if (inputKey instanceof TOTP) {
            const update = () => {
                const now = Date.now();
                const timeStep = inputKey.period * 1000;
                const timeLeft = timeStep - (now % timeStep);
                setTimeLeft(Math.floor(timeLeft / 1000));

                const prev = inputKey.generate({
                    timestamp: now - timeStep
                });
                const current = inputKey.generate({
                    timestamp: now
                });
                const next = inputKey.generate({
                    timestamp: now + timeStep
                });

                setPrev(prev);
                setCurrent(current);
                setNext(next);
            }

            update();

            const interval = setInterval(update, 250);
            return () => clearInterval(interval);
        } else {
            setPrev(inputKey.generate({ counter: inputKey.counter - 1 }));
            setCurrent(inputKey.generate({ counter: inputKey.counter }));
            setNext(inputKey.generate({ counter: inputKey.counter + 1 }));
            setTimeLeft(inputKey.counter);
        }
    }, [inputKey]);

    const updateHOTPCount = useCallback(() => {
        if (!(inputKey instanceof HOTP)) return;

        inputKey.counter++;
        setPrev(inputKey.generate({ counter: inputKey.counter - 1 }));
        setCurrent(inputKey.generate({ counter: inputKey.counter }));
        setNext(inputKey.generate({ counter: inputKey.counter + 1 }));
        setTimeLeft(inputKey.counter)

        hotpPushCounter?.();
    }, [hotpPushCounter, inputKey]);

    return <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", borderTop: "1px solid #777", borderBottom: "1px solid #777", p: 2, gap: 2 }}>
        <Box sx={{ flexBasis: 200, flexGrow: 99999, alignContent: "center" }}>
            <code>{(inputKey.secret.base32.match(/.{1,4}/g) ?? []).join(" ")}</code>
        </Box>
        <Box sx={{ alignContent: "center", width: 50 }}>
            {inputKey instanceof TOTP ? (
                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                        variant="determinate"
                        value={(timeLeft / inputKey.period) * 100}
                        color={timeLeft <= 5 ? "error" : "primary"}
                    />
                    <Box
                        sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: 'absolute',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        <Typography
                            variant="caption"
                            component="div"
                            sx={{ color: 'text.secondary' }}
                        >{timeLeft}</Typography>
                    </Box>
                </Box>
            ) : <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <Box
                    sx={{
                        top: 0,
                        left: 0,
                        bottom: -10,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'end',
                        justifyContent: 'center',
                    }}
                >
                    <Typography
                        variant="caption"
                        component="div"
                        sx={{ color: 'text.secondary' }}
                    >{timeLeft}</Typography>
                </Box>
                <IconButton onClick={updateHOTPCount}>
                    <RefreshIcon fontSize="large" />
                </IconButton>
            </Box>}
        </Box>
        <Box sx={{ flexBasis: 200, flexGrow: 1, alignContent: "center" }}>
            <Tooltip title="Previous code, click to copy">
                <Typography
                    sx={{ fontSize: 10, color: "gray", cursor: "pointer" }}
                    onClick={() => navigator.clipboard.writeText(prev)}
                >
                    <code>PREV {prev}</code>
                </Typography>
            </Tooltip>
            <Tooltip title="Current code, click to copy">
                <Typography
                    sx={{ fontSize: 20, cursor: "pointer" }}
                    onClick={() => navigator.clipboard.writeText(current)}
                >
                    <code>CURRENT {current}</code>
                </Typography>
            </Tooltip>
            <Tooltip title="Next code, click to copy">
                <Typography
                    sx={{ fontSize: 10, color: "gray", cursor: "pointer" }}
                    onClick={() => navigator.clipboard.writeText(next)}
                >
                    <code>NEXT {next}</code>
                </Typography>
            </Tooltip>
        </Box>
    </Box>
}
