import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

const server = new McpServer({
  name: "my-mcp-server",
  version: "3.6.0",
});

// ── Tool: Search Users ──────────────────────────
server.tool(
  "search_users",
  "Search users by name or email. Returns matching users with their profiles.",
  {
    query: z.string().describe("Search query (name or email)"),
    limit: z.number().min(1).max(100).default(10)
      .describe("Maximum number of results to return"),
    status: z.enum(["active", "inactive", "all"]).default("all")
      .describe("Filter by user status"),
  },
  async ({ query, limit, status }) => {
    try {
      const users = await db.users.search({ query, limit, status });
      
      return {
        content: [{
          type: "text",
          text: JSON.stringify(users, null, 2),
        }],
      };
    } catch (error) {
      return {
        content: [{
          type: "text",
          text: `Error searching users: ${error.message}`,
        }],
        isError: true,
      };
    }
  }
);

// ── Tool: Create User ──────────────────────────
server.tool(
  "create_user",
  "Create a new user account. Returns the created user object.",
  {
    name: z.string().min(2).describe("User's full name"),
    email: z.string().email().describe("User's email address"),
    role: z.enum(["admin", "user", "viewer"]).default("user")
      .describe("User's role in the system"),
  },
  async ({ name, email, role }) => {
    try {
      const user = await db.users.create({ name, email, role });
      
      return {
        content: [{
          type: "text",
          text: `User created successfully:\n${JSON.stringify(user, null, 2)}`,
        }],
      };
    } catch (error) {
      if (error.code === 'DUPLICATE_EMAIL') {
        return {
          content: [{
            type: "text",
            text: `Cannot create user: email "${email}" is already registered. Try a different email.`,
          }],
          isError: true,
        };
      }
      throw error;
    }
  }
);

// ── Resource: Database Schema ──────────────────
server.resource(
  "database-schema",
  "db://schema",
  async (uri) => ({
    contents: [{
      uri: uri.href,
      mimeType: "application/json",
      text: JSON.stringify(await db.getSchema(), null, 2),
    }],
  })
);

// ── Prompt: Code Review ────────────────────────
server.prompt(
  "code_review",
  "Generate a structured code review for the given code",
  [
    { name: "code", description: "The code to review", required: true },
    { name: "language", description: "Programming language", required: false },
  ],
  ({ code, language }) => ({
    messages: [{
      role: "user",
      content: {
        type: "text",
        text: `Review this ${language || ''} code:\n\n\`\`\`${language || ''}\n${code}\n\`\`\`\n\nProvide: 1) Security issues 2) Performance 3) Maintainability 4) Suggestions`,
      },
    }],
  })
);

// ── Start Server ───────────────────────────────
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("MCP Server running on stdio");
}

main().catch(console.error);