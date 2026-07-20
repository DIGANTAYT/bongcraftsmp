import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { title, excerpt, category, date, webhookUrl, siteUrl } = await req.json();

    const targetWebhook = webhookUrl || "https://discord.com/api/webhooks/1528861150572318871/IL8MdBNfi-n9O_I8qQ8in4ZZ6Z4h4UkVgWIuUpheZm53PX3h59UmvR3cWWEvKvd_ManX";

    if (!targetWebhook || !targetWebhook.startsWith("https://discord.com/api/webhooks/")) {
      return NextResponse.json({ error: "No valid Discord webhook URL configured" }, { status: 400 });
    }

    // Dynamically detect website domain from request headers or passed siteUrl
    const requestOrigin = req.headers.get("origin") || req.headers.get("referer") || "";
    let baseUrl = siteUrl || process.env.NEXT_PUBLIC_SITE_URL || "";
    
    if (!baseUrl && requestOrigin) {
      try {
        const parsed = new URL(requestOrigin);
        baseUrl = `${parsed.protocol}//${parsed.host}`;
      } catch (e) {
        console.error("Failed to parse request origin:", e);
      }
    }

    if (!baseUrl) {
      baseUrl = "https://store.bongcraftsmp.in";
    }

    // Strip trailing slash
    baseUrl = baseUrl.replace(/\/$/, "");
    const newsLink = `${baseUrl}/news`;

    const categoryColor = 
      category === "event" ? 3884790 : // Blue
      category === "update" ? 15990878 : // Red/Rose
      category === "patch" ? 1684862 : // Emerald/Green
      16498468; // Gold/Amber

    const payload = {
      username: "BongCraft SMP News",
      avatar_url: `${baseUrl}/icon.png`,
      embeds: [
        {
          title: `📰 ${title}`,
          description: `${excerpt}\n\n[👉 Read Full Announcement on Website](${newsLink})`,
          url: newsLink,
          color: categoryColor,
          fields: [
            {
              name: "📅 Date",
              value: date || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
              inline: true
            },
            {
              name: "🏷️ Category",
              value: category ? category.toUpperCase() : "ANNOUNCEMENT",
              inline: true
            }
          ],
          footer: {
            text: "BongCraft SMP • Official Webstore News"
          },
          timestamp: new Date().toISOString()
        }
      ]
    };

    const res = await fetch(targetWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Discord Webhook Error:", errText);
      return NextResponse.json({ error: "Failed to post webhook to Discord" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Announcement pushed to Discord successfully!" });
  } catch (error: any) {
    console.error("News webhook handler error:", error);
    return NextResponse.json({ error: error.message || "Failed to broadcast news" }, { status: 500 });
  }
}
