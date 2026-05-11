import { Hono } from "hono";
import { generateText } from "ai";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { gateway } from "../lib/gateway";
import { s3 } from "../lib/s3";

const app = new Hono();

app.post("/generate-logo", async (c) => {
  try {
    const { sketchDataUrl, prompt } = await c.req.json<{
      sketchDataUrl: string;
      prompt: string;
    }>();

    if (!sketchDataUrl) {
      return c.json({ error: "No sketch provided" }, 400);
    }

    // Strip the data URL prefix to get raw base64
    const base64Match = sketchDataUrl.match(/^data:([^;]+);base64,(.+)$/);
    if (!base64Match) {
      return c.json({ error: "Invalid image data" }, 400);
    }
    const mimeType = base64Match[1]!;
    const base64Data = base64Match[2]!;

    const systemPrompt = `You are a professional logo designer. 
Convert the provided hand-drawn sketch into a sleek, modern, professional logo.
Instructions:
- Preserve the core shape, concept, and structure from the sketch
- Output a clean vector-style logo with minimal lines
- Use a clean dark background (#050505) with the logo in white or a single accent color
- Style: flat design, solid colors, professional, minimal
- The logo should look ready to use for a real brand
- Make it centered, well-proportioned, and visually balanced
${prompt ? `Additional style notes: ${prompt}` : ""}`;

    const result = await generateText({
      model: gateway("google/gemini-3-pro-image"),
      providerOptions: {
        google: { responseModalities: ["TEXT", "IMAGE"] },
      },
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: base64Data,
              mimeType: mimeType as "image/png" | "image/jpeg" | "image/webp",
            },
            {
              type: "text",
              text: systemPrompt,
            },
          ],
        },
      ],
    });

    const files = (result as any).files as Array<{
      uint8Array: Uint8Array;
      mediaType: string;
    }> | undefined;

    if (!files || files.length === 0) {
      return c.json({ error: "AI did not return an image" }, 500);
    }

    const file = files[0]!;
    const key = `logos/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: key,
        Body: Buffer.from(file.uint8Array),
        ContentType: file.mediaType,
      })
    );

    const logoUrl = await getSignedUrl(
      s3,
      new GetObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: key,
      }),
      { expiresIn: 3600 }
    );

    return c.json({ logoUrl }, 200);
  } catch (err: any) {
    console.error("Logo generation error:", err);
    return c.json({ error: err?.message ?? "Generation failed" }, 500);
  }
});

export default app;
