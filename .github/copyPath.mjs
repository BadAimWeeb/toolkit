import fs from "fs/promises";
import path from "path";

const source = path.join(process.cwd(), "dist", "index.html");

// Catch-all
await fs.copyFile(source, path.join(process.cwd(), "dist", "404.html"));
