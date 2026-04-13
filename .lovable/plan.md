

# Přepnutí na přímé Anthropic Claude API

## Co se změní

Jediný soubor: `supabase/functions/analyze-vop/index.ts`

### 1. Použít ANTHROPIC_API_KEY místo LOVABLE_API_KEY
- Řádek 26: `Deno.env.get("ANTHROPIC_API_KEY")` (s fallbackem na LOVABLE_API_KEY)

### 2. Přepsat funkci `callAI` na Anthropic Messages API
- Endpoint: `https://api.anthropic.com/v1/messages`
- Header: `x-api-key` + `anthropic-version: 2023-06-01`
- Model: `claude-sonnet-4-20250514`
- System prompt v `system` poli (ne v messages)
- Response parsing: `data.content?.[0]?.text`

### 3. Deploy a test
- Deploynu Edge Function
- Otestuji voláním s reálnou URL

## Technické detaily

```typescript
// Nový callAI
async function callAI(apiKey: string, systemPrompt: string, userPrompt: string, retryCount = 0) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 8192,
      temperature: 0,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });
  // ... retry logic, response: data.content?.[0]?.text
}
```

Dříve to nefungovalo kvůli špatnému formátu volání (system prompt byl v messages místo v `system` poli). Tentokrát bude formát správný.

