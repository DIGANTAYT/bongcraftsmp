import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { username, cart, publicToken, privateKey, packageMappings } = await req.json();

    if (!username) {
      return NextResponse.json({ error: "Minecraft username is required" }, { status: 400 });
    }
    if (!publicToken) {
      return NextResponse.json({ error: "Tebex Public Token is not configured" }, { status: 400 });
    }
    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Determine authorization header using HTTP Basic Auth (PublicToken:PrivateKey)
    // If privateKey is not set, we authorize using PublicToken with an empty password
    const authString = `${publicToken}:${privateKey || ""}`;
    const authHeader = `Basic ${Buffer.from(authString).toString("base64")}`;

    // Get origin of request or fallback to local/production URL
    const origin = req.headers.get("origin") || "https://play.bongcraftsmp.in";

    // 1. Create a Tebex basket for the user
    const createBasketUrl = `https://headless.tebex.io/api/accounts/${publicToken}/baskets`;
    const createBasketRes = await fetch(createBasketUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authHeader,
      },
      body: JSON.stringify({
        username: username,
        complete_url: `${origin}/profile`,
        cancel_url: `${origin}/`,
        complete_auto_redirect: true,
      }),
    });

    if (!createBasketRes.ok) {
      const errorText = await createBasketRes.text();
      console.error("Failed to create Tebex basket:", errorText);
      try {
        const errorJson = JSON.parse(errorText);
        return NextResponse.json(
          { error: errorJson.message || "Failed to create checkout session on Tebex" },
          { status: createBasketRes.status }
        );
      } catch {
        return NextResponse.json(
          { error: `Tebex Basket Error (${createBasketRes.status}): ${errorText.substring(0, 100)}` },
          { status: createBasketRes.status }
        );
      }
    }

    const basketData = await createBasketRes.json();
    const basketIdent = basketData.data?.ident || basketData.ident;

    if (!basketIdent) {
      return NextResponse.json(
        { error: "Tebex API returned an invalid basket session" },
        { status: 500 }
      );
    }

    // 2. Add each package to the basket
    let checkoutUrl = basketData.data?.links?.checkout || basketData.links?.checkout;

    for (const item of cart) {
      // Find package ID in mappings
      const mappedId = packageMappings?.[item.id];
      if (!mappedId) {
        console.warn(`No Tebex package mapping found for item: ${item.id}`);
        continue; // Skip items without package ID configuration
      }

      const packageIdInt = parseInt(mappedId, 10);
      if (isNaN(packageIdInt)) {
        console.error(`Invalid Tebex Package ID configuration for ${item.id}: ${mappedId}`);
        continue;
      }

      const addPackageUrl = `https://headless.tebex.io/api/accounts/${publicToken}/baskets/${basketIdent}/packages`;
      const addPackageRes = await fetch(addPackageUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": authHeader,
        },
        body: JSON.stringify({
          package_id: packageIdInt,
          quantity: item.quantity || 1,
        }),
      });

      if (!addPackageRes.ok) {
        const errorText = await addPackageRes.text();
        console.error(`Failed to add package ${packageIdInt} to Tebex basket:`, errorText);
        try {
          const errorJson = JSON.parse(errorText);
          return NextResponse.json(
            { error: `Tebex Package Error: ${errorJson.message || "Failed to add product to Tebex checkout"}` },
            { status: addPackageRes.status }
          );
        } catch {
          return NextResponse.json(
            { error: `Tebex Package Error (${addPackageRes.status})` },
            { status: addPackageRes.status }
          );
        }
      }

      const addPackageData = await addPackageRes.json();
      checkoutUrl = addPackageData.data?.links?.checkout || addPackageData.links?.checkout || checkoutUrl;
    }

    if (!checkoutUrl) {
      return NextResponse.json({ error: "Could not retrieve checkout link from Tebex" }, { status: 500 });
    }

    return NextResponse.json({ checkoutUrl });
  } catch (err: any) {
    console.error("Tebex checkout server route error:", err);
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}
