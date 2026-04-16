import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ query: '' });
    }

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              {
                inline_data: {
                  mime_type: mimeType || 'image/jpeg',
                  data: imageBase64
                }
              },
              {
                text: 'What product is shown in this image? Reply with ONLY the product name or type (e.g. "iPhone", "laptop", "headphones", "TV"). Maximum 3 words. No explanation.'
              }
            ]
          }]
        })
      }
    );

    const data = await res.json();
    if (!res.ok) {
      console.error('Vision API error:', data);
      return NextResponse.json({ query: '' });
    }

    const query = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
    return NextResponse.json({ query });

  } catch (error) {
    console.error('Visual search error:', error);
    return NextResponse.json({ query: '' });
  }
}
