import { env } from "cloudflare:workers";

const DADATA_URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party";

export async function POST(request: Request) {
  const apiKey = env.DADATA_API_KEY;
  if (!apiKey) return Response.json({ code: "DADATA_NOT_CONFIGURED" }, { status: 503 });

  let query = "";
  try {
    const body = await request.json() as { query?: unknown };
    query = typeof body.query === "string" ? body.query.trim() : "";
  } catch {
    return Response.json({ code: "INVALID_REQUEST" }, { status: 400 });
  }
  if (!query || query.length > 300) return Response.json({ code: "INVALID_QUERY" }, { status: 400 });

  try {
    const response = await fetch(DADATA_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, count: 10, status: ["ACTIVE"] }),
      signal: AbortSignal.timeout(6000),
    });
    if (!response.ok) {
      return Response.json({ code: "DADATA_UNAVAILABLE" }, { status: response.status === 429 ? 429 : 502 });
    }

    const payload = await response.json() as { suggestions?: Array<Record<string, any>> };
    const suggestions = (Array.isArray(payload.suggestions) ? payload.suggestions : [])
      .filter(item => item?.data?.state?.status === "ACTIVE" && typeof item?.data?.inn === "string")
      .slice(0, 10)
      .map(item => ({
        value: String(item.value || item.data?.name?.short_with_opf || "").trim(),
        inn: item.data.inn,
        region: String(item.data?.address?.data?.region_with_type || item.data?.address?.data?.region || item.data?.address?.value || "Регион не указан"),
        type: item.data?.type === "INDIVIDUAL" ? "INDIVIDUAL" : "LEGAL",
      }))
      .filter(item => item.value);
    return Response.json({ suggestions }, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json({ code: "DADATA_UNAVAILABLE" }, { status: 502 });
  }
}
