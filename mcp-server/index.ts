import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from 'axios';

import dotenv from 'dotenv';
dotenv.config();

// Create an MCP server
const server = new McpServer({
    name: "demo-server",
    version: "1.0.0"
});

// Add an addition tool
server.registerTool("get-greeting",
    {
        title: "get-greeting",
        description: "response to greeting",
    },
    async () => {
        return {
            content: [
                {
                    type: "text",
                    text: "Hello from MCP"
                },
                {
                    type: "text",
                    text: "TESTJKAJSDKJFJJDHFDJS"
                }
            ]
        };
    }
);

server.registerTool("fetch-listing",
    {
        title: "fetch-listing",
        description: "search listing form an endpoint",

    },
    async () => {

        const response = await axios.get("https://stay25.sandbox.airxpress.jp/json/v2/guest/home-listing-by-type?type=recent_place");

        return {
            content: [
                {
                    type: "text",
                    text: `${JSON.stringify(response.data)}`
                }
            ]
        };
    }
);

server.registerTool(
    "fetch-listing-detail",
    {
        title: "Fetch Listing Detail",
        description: "Fetch detailed information for a listing using its ID.",
        inputSchema: {
            id: z.string().describe("The ID of the listing to fetch.")
        }
    },
    async ({ id }) => {
        try {
            const response = await axios.get(`https://stay25.sandbox.airxpress.jp/json/v2/guest/listing_detail/${id}`);

            return {
                content: [
                    {
                        type: "text",
                        text: `${JSON.stringify(response.data)}`
                    }
                ]
            };
        } catch (e) {
            return {
                content: [{ type: "text", text: null }]
            }
        }
    }
);

server.registerTool(
    "fetch-listing-detail-memo-by-listing-id",
    {
        title: "Fetch Detail Memo by Listing ID",
        description: "Fetch detailed memo or notes for a given listing ID.",
        inputSchema: {
            listing_id: z.string().describe("The ID of the listing to fetch."),
        }
    },
    async ({ listing_id }) => {
        try {
            const payload = {
                listing_id: listing_id
            };

            const response = await axios.post(
                "https://sandbox-dot-airxpms.an.r.appspot.com/api/AI-Agent/memo",
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "x-api-key": process.env.X_API_KEY
                    }
                }
            );
            return {
                content: [
                    {
                        type: "text",
                        text: `${JSON.stringify(response.data)}`
                    }
                ]
            };
        } catch (e) {
            return {
                content: [{ type: "text", text: null }]
            }
        }
    }
);


async function runServer() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

runServer();