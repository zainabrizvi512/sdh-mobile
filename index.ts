import { Buffer } from "buffer";
import { registerRootComponent } from 'expo';

if (typeof global.Buffer === "undefined") {
    global.Buffer = Buffer;
}

function _ensureArrayBuffer(input: ArrayBuffer | SharedArrayBuffer | ArrayBufferView): ArrayBuffer | SharedArrayBuffer {
    if (input instanceof ArrayBuffer || input instanceof SharedArrayBuffer) return input;
    const view = input as ArrayBufferView;
    return view.buffer.slice(view.byteOffset, view.byteOffset + view.byteLength);
}

function _base64FromArrayBuffer(
    input: ArrayBuffer | ArrayBufferView,
    urlSafe = false
): string {
    const ab = _ensureArrayBuffer(input);
    const b64 = Buffer.from(new Uint8Array(ab)).toString("base64");
    if (!urlSafe) return b64;
    // URL-safe variant: +/ -> -_ and strip =
    return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

// ---- Define globals if missing (don’t clobber if someone else sets them)
if (typeof (global as any).base64FromArrayBuffer !== "function") {
    (global as any).base64FromArrayBuffer = _base64FromArrayBuffer;
}

import App from './App';

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App);
