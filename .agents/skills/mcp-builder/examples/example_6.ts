// ❌ Error inútil para el agente
return { content: [{ type: "text", text: "Error" }], isError: true };

// ✅ Error que el agente puede resolver
return {
  content: [{
    type: "text",
    text: [
      "Error creating user: email 'leo@test.com' already exists.",
      "Suggestions:",
      "1. Search for existing user with: search_users query='leo@test.com'",
      "2. Use a different email address",
      "3. Update the existing user with: update_user id='usr_123'"
    ].join("\n")
  }],
  isError: true,
};