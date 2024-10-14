import * as HashWASM from "hash-wasm";
import Ecoji from "ecoji-js";
import * as Base65536 from "base65536";
import bufferImpl from "buffer";

const Buffer = bufferImpl.Buffer;

export default async function Generator(config: {
    hashAlgo: string,
    outputType: string,
    x2Pass: boolean
}, input: string[]): Promise<string> {
    if (input.length !== 2) {
        throw "Legacy v1 mode cannot be used with more than 2 input passwords";
    }

    // hash is already a hex string
    let hash: string;
    let hmac;
    switch (config.hashAlgo) {
        case "MD5":
            hmac = await HashWASM.createHMAC(HashWASM.createMD5(), input[1]);
            hash = hmac.update(input[0]).digest();
            if (config.x2Pass) {
                hmac = await HashWASM.createHMAC(HashWASM.createMD5(), input[0]);
                hash += hmac.update(input[1]).digest();
            }
            break;
        case "RIPEMD160":
            hmac = await HashWASM.createHMAC(HashWASM.createRIPEMD160(), input[1]);
            hash = hmac.update(input[0]).digest();
            if (config.x2Pass) {
                hmac = await HashWASM.createHMAC(HashWASM.createRIPEMD160(), input[0]);
                hash += hmac.update(input[1]).digest();
            }
            break;
        case "SHA1":
            hmac = await HashWASM.createHMAC(HashWASM.createSHA1(), input[1]);
            hash = hmac.update(input[0]).digest();
            if (config.x2Pass) {
                hmac = await HashWASM.createHMAC(HashWASM.createSHA1(), input[0]);
                hash += hmac.update(input[1]).digest();
            }
            break;
        case "SHA224":
            hmac = await HashWASM.createHMAC(HashWASM.createSHA224(), input[1]);
            hash = hmac.update(input[0]).digest();
            if (config.x2Pass) {
                hmac = await HashWASM.createHMAC(HashWASM.createSHA224(), input[0]);
                hash += hmac.update(input[1]).digest();
            }
            break;
        case "SHA256":
            hmac = await HashWASM.createHMAC(HashWASM.createSHA256(), input[1]);
            hash = hmac.update(input[0]).digest();
            if (config.x2Pass) {
                hmac = await HashWASM.createHMAC(HashWASM.createSHA256(), input[0]);
                hash += hmac.update(input[1]).digest();
            }
            break;
        case "SHA384":
            hmac = await HashWASM.createHMAC(HashWASM.createSHA384(), input[1]);
            hash = hmac.update(input[0]).digest();
            if (config.x2Pass) {
                hmac = await HashWASM.createHMAC(HashWASM.createSHA384(), input[0]);
                hash += hmac.update(input[1]).digest();
            }
            break;
        case "SHA512":
            hmac = await HashWASM.createHMAC(HashWASM.createSHA512(), input[1]);
            hash = hmac.update(input[0]).digest();
            if (config.x2Pass) {
                hmac = await HashWASM.createHMAC(HashWASM.createSHA512(), input[0]);
                hash += hmac.update(input[1]).digest();
            }
            break;
        default:
            throw "Unsupported hash algorithm";
    }

    switch (config.outputType) {
        case "HEX":
            return hash;
        case "BASE64":
            // For base64, if x2Pass is true, we need to split hex string into two parts,
            // convert them separately, and concatenate them
            if (config.x2Pass) {
                return Buffer.from(hash.substring(0, hash.length / 2), "hex").toString("base64") +
                    Buffer.from(hash.substring(hash.length / 2), "hex").toString("base64");
            } else {
                return Buffer.from(hash, "hex").toString("base64");
            }
        case "BINARY":
            return [...Buffer.from(hash, "hex")].map(x => x.toString(2).padStart(8, "0")).join("");
        case "ECOJI":
            // Doing the same thing as base64, but with ecoji encoding instead.
            let baseArray = (hash.match(/.{1,2}/g) || []).map(x => String.fromCharCode(parseInt(x, 16)))
            if (config.x2Pass) {
                return Ecoji.encode(baseArray.slice(0, baseArray.length / 2).join("")) +
                    Ecoji.encode(baseArray.slice(baseArray.length / 2).join(""));
            } else {
                return Ecoji.encode(baseArray.join(""));
            }
        case "BASE65536":
            // Also doing the same thing as base64, but with base65536 encoding instead.
            let baseArray2 = (hash.match(/.{1,2}/g) || []).map(x => parseInt(x, 16))
            if (config.x2Pass) {
                return Base65536.encode(Uint8Array.from(baseArray2.slice(0, baseArray2.length / 2))) +
                    Base65536.encode(Uint8Array.from(baseArray2.slice(baseArray2.length / 2)));
            } else {
                return Base65536.encode(Uint8Array.from(baseArray2));
            }
        default:
            throw "Unsupported output type";
    }
}