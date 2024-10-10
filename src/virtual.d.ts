declare module "virtual:fe-version" {
    export default function ViteFEVersion(): {
        version: string;
        commit: string;
        buildTimestamp: number;
        codeTimestamp: number;
    };
}
