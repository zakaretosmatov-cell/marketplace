import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ text: "AI yordamchi hozircha mavjud emas." });
    }

    const { messages, products } = await req.json();

    const productList = (products || [])
      .map((p: { name: string; price: number; category: string; brand: string; stock: number }) =>
        `- ${p.name} ($${p.price}) — ${p.category} [${p.brand}, stock: ${p.stock}]`
      ).join('\n');

    const systemPrompt = `Siz TechNova onlayn do'konining ZAZADO AI yordamchisisiz.
Foydalanuvchiga mahsulot tanlashda yordam bering (telefon, noutbuk, TV, gadjetlar).
Hozirgi mahsulotlar ro'yxati:
${productList || "Mahsulotlar yuklanmadi."}

Qoidalar:
- Faqat ro'yxatdagi mahsulotlardan tavsiya qiling.
- Har bir so'rovga 2-3 ta variant bering (arzon, o'rtacha, qimmat).
- Byudjet so'ralsa — avval byudjetni aniqlang.
- O'zbek tilida, qisqa va aniq javob bering.`;

    const groqMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map((m: { sender: string; text: string }) => ({
        role: m.sender === 'user' ? 'user' : 'assistant',
        content: m.text
      }))
    ];

    // Try Groq first
    if (process.env.GROQ_API_KEY) {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: groqMessages,
          max_tokens: 500,
          temperature: 0.7
        })
      });

      const data = await res.json();
      if (res.ok) {
        const reply = data.choices?.[0]?.message?.content || "Kechirasiz, javob bera olmadim.";
        return NextResponse.json({ text: reply });
      }
      console.error("Groq error:", data);
    }

    // Fallback to Gemini
    if (process.env.GEMINI_API_KEY) {
      const geminiMessages = messages.map((m: { sender: string; text: string }) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemPrompt }] },
            contents: geminiMessages,
            generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
          })
        }
      );

      const data = await res.json();
      if (res.ok) {
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Kechirasiz, javob bera olmadim.";
        return NextResponse.json({ text: reply });
      }
    }

    return NextResponse.json({ text: "Kechirasiz, xatolik yuz berdi. Qayta urinib ko'ring." });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ text: "Aloqa uzildi. Iltimos qayta urinib ko'ring." });
  }
}
