
import { NextResponse } from "next/server";

export async function POST() {
  const apiKey = process.env.DEEPGRAM_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "Deepgram API key is not configured" },
      { status: 500 }
    );
  }

  try {
    const response = await fetch(
      "https://api.deepgram.com/v1/auth/grant",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${apiKey}`,
        },
      }
    );

    const body = await response.text();

    console.log("Deepgram status:", response.status);
    console.log("Deepgram body:", body);

    if (!response.ok) {
      return Response.json(
        {
          error: "Deepgram rejected the request",
          status: response.status,
          body,
        },
        { status: 502 }
      );
    }

    const data = JSON.parse(body);
    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to obtain Deepgram token" },
        { status: 502 }
      );
    }

    return NextResponse.json({
      access_token: data.access_token,
      expires_in: data.expires_in,
    });
  } catch {
    return NextResponse.json(
      { error: "Unable to connect to Deepgram" },
      { status: 500 }
    );
  }
}
