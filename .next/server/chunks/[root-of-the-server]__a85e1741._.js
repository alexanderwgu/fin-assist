module.exports = [
"[project]/.next-internal/server/app/api/voice/turn/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[project]/src/lib/agent.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "runAgent",
    ()=>runAgent
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$google$40$2$2e$0$2e$23_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$google$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@ai-sdk+google@2.0.23_zod@4.1.12/node_modules/@ai-sdk/google/dist/index.mjs [app-route] (ecmascript)");
;
const defaultSystem = "You are a helpful, concise voice assistant for financial guidance. Keep responses short and speak-friendly.";
async function runAgent(req) {
    const model = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$google$40$2$2e$0$2e$23_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$google$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["google"])("gemini-2.5-flash");
    const result = await model.generate({
        system: req.systemPrompt ?? defaultSystem,
        prompt: req.userText
    });
    return {
        text: result.text
    };
}
}),
"[project]/src/lib/transcription.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "transcribeAudio",
    ()=>transcribeAudio
]);
async function transcribeAudio(audioArrayBuffer, mimeType) {
    // For now, return a placeholder since we don't have Google Cloud Speech API configured
    // In a real implementation, this would use Google Cloud Speech-to-Text
    return {
        text: "Audio transcription not yet implemented"
    };
}
}),
"[project]/src/lib/tts.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "synthesizeSpeech",
    ()=>synthesizeSpeech
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$elevenlabs$40$1$2e$0$2e$14_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$elevenlabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@ai-sdk+elevenlabs@1.0.14_zod@4.1.12/node_modules/@ai-sdk/elevenlabs/dist/index.mjs [app-route] (ecmascript)");
;
async function synthesizeSpeech({ text, voiceId, modelId = "eleven_multilingual_v2", format = "mp3" }) {
    const audioModel = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$ai$2d$sdk$2b$elevenlabs$40$1$2e$0$2e$14_zod$40$4$2e$1$2e$12$2f$node_modules$2f40$ai$2d$sdk$2f$elevenlabs$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["elevenlabs"].audio("text-to-speech");
    const result = await audioModel.generate({
        voice: voiceId,
        format,
        model: modelId,
        text
    });
    return {
        audio: result.audio,
        contentType: result.mimeType
    };
}
}),
"[project]/src/app/api/voice/turn/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST,
    "runtime",
    ()=>runtime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/agent.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transcription$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/transcription.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/tts.ts [app-route] (ecmascript)");
;
;
;
const runtime = "nodejs";
async function POST(req) {
    try {
        const contentType = req.headers.get("content-type") || "";
        if (!contentType.includes("multipart/form-data")) {
            return new Response("Expected multipart/form-data", {
                status: 400
            });
        }
        const form = await req.formData();
        const audioFile = form.get("audio");
        const voiceId = form.get("voiceId") || process.env.ELEVENLABS_VOICE_ID || "";
        const systemPrompt = form.get("system") || undefined;
        if (!audioFile) {
            return new Response("Missing audio file in 'audio' field", {
                status: 400
            });
        }
        const audioArrayBuffer = await audioFile.arrayBuffer();
        const mimeType = audioFile.type || "audio/webm";
        // 1) STT
        const { text: userText } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$transcription$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["transcribeAudio"])(audioArrayBuffer, mimeType);
        // 2) Agent
        const { text: replyText } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$agent$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["runAgent"])({
            userText,
            systemPrompt
        });
        // 3) TTS
        const { audio, contentType: audioContentType } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$tts$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["synthesizeSpeech"])({
            text: replyText,
            voiceId
        });
        return new Response(audio, {
            headers: {
                "content-type": audioContentType,
                "x-transcript": encodeURIComponent(userText),
                "x-text": encodeURIComponent(replyText)
            }
        });
    } catch (err) {
        console.error(err);
        return new Response("Internal Server Error", {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a85e1741._.js.map