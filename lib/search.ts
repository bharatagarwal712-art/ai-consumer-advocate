
export async function findTwitterHandle(
  conversation: string
): Promise<string | null> {
  try {
    const response = await fetch(
      "https://google.serper.dev/search",
      {
        method: "POST",

        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY!,
          "Content-Type": "application/json",
        },
body: JSON.stringify({
  q: `
${conversation}

official company twitter/x handle site:x.com`
`,
}),
      }
    );

    const data = await response.json();
    
console.log("[SERPER RESPONSE]", JSON.stringify(data));
    
    const results = data.organic || [];

    for (const result of results) {
      const link = result.link || "";

      if (
        link.includes("x.com") ||
        link.includes("twitter.com")
      ) {
        const clean = link
          .replace("https://x.com/", "")
          .replace("https://twitter.com/", "")
          .split("/")[0];

        if (clean) {
          return `@${clean}`;
        }
      }
    }

    return null;
  } catch (error) {
    console.error("[SERPER ERROR]", error);

    return null;
  }
}
