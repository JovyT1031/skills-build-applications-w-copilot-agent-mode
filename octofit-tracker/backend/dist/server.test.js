"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const node_test_1 = __importDefault(require("node:test"));
const strict_1 = __importDefault(require("node:assert/strict"));
const node_http_1 = require("node:http");
const server_1 = require("./server");
async function withTestServer(handler) {
    const app = (0, server_1.createApp)();
    const server = (0, node_http_1.createServer)(app);
    await new Promise((resolve, reject) => {
        server.once('error', reject);
        server.listen(0, '127.0.0.1', () => resolve(undefined));
    });
    const address = server.address();
    if (!address || typeof address === 'string') {
        throw new Error('Server address is unavailable');
    }
    const baseUrl = `http://127.0.0.1:${address.port}`;
    try {
        await handler(baseUrl);
    }
    finally {
        await new Promise((resolve, reject) => {
            server.close((error) => (error ? reject(error) : resolve(undefined)));
        });
    }
}
(0, node_test_1.default)('health endpoint responds with service metadata', async () => {
    await withTestServer(async (baseUrl) => {
        const response = await fetch(`${baseUrl}/api/health`);
        strict_1.default.equal(response.status, 200);
        const body = await response.json();
        strict_1.default.equal(body.service, 'octofit-backend');
        strict_1.default.equal(body.status, 'ok');
    });
});
(0, node_test_1.default)('users endpoint returns a populated payload', async () => {
    await withTestServer(async (baseUrl) => {
        const response = await fetch(`${baseUrl}/api/users/`);
        strict_1.default.equal(response.status, 200);
        const body = await response.json();
        strict_1.default.equal(body.count, 2);
        strict_1.default.ok(Array.isArray(body.users));
    });
});
