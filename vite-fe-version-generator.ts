import fs from "fs/promises";
import childProcess from "child_process";

function execPromise(cmd: string, cwd: string) {
    let grs: (arg0: [string, string]) => void, grj: (arg0: (string | childProcess.ExecException)[]) => void;
    let p = new Promise<[string, string]>((rs, rj) => {
        grs = rs; grj = rj;
    })
    childProcess.exec(cmd, {
        cwd
    }, (e, stdout, stderr) => {
        if (e) return grj([stdout, stderr, e]);
        return grs([stdout, stderr]);
    });

    return p;
}

const cwd = process.cwd();

export default function ViteFeVersionGenerator() {
    const virtualModuleId = 'virtual:fe-version'
    const resolvedVirtualModuleId = '\0' + virtualModuleId;

    return {
        name: "vite-fe-version-generator",
        resolveId(id: string) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },
        async load(id: string) {
            if (id === resolvedVirtualModuleId) {
                let commit = (await execPromise("git rev-parse --short HEAD", cwd).catch(() => ["", ""]))[0].replace(/\r/g, "").replace(/\n/g, "");
                let timestamp = (await execPromise("git show -s --format=%ct", cwd).catch(() => ["", ""]))[0].replace(/\r/g, "").replace(/\n/g, "");

                return `export default function ViteFEVersion() {
                    return {
                        version: "${JSON.parse(await fs.readFile("./package.json", "utf-8")).version}",
                        commit: "${commit || "0000000"}",
                        buildTimestamp: ${new Date().getTime()},
                        codeTimestamp: ${timestamp + "000" || new Date().getTime()}
                    };
                }`;
            }
        }
    }
}
