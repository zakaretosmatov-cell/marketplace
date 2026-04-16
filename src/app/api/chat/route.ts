import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ text: "AI yordamchi hozircha mavjud emas." });
    }

    const { messages, products } = await req.json();

    const productList = (products || [])
      .map((p: { name: string; price: number; category: string; brand: string; stock: number }) =>
        `- ${p.name} ($${p.price}) — ${p.category} [${p.brand}, stock: ${p.stock}]`
      ).join('\n');

    const systemPrompt = `Siz TechNova onlayn do'konining yordamchisisiz.
Foydalanuvchiga mahsulot tanlashda yordam bering (telefon, noutbuk, TV, gadjetlar).
Hozirgi mahsulotlar ro'yxati:
${productList || "Mahsulotlar yuklanmadi."}

Qoidalar:
- Faqat ro'yxatdagi mahsulotlardan tavsiya qiling.
- Har bir so'rovga 2-3 ta variant bering (arzon, o'rtacha, qimmat).
- Byudjet so'ralsa — avval byudjetni aniqlang.
- O'zbek tilida, qisqa va aniq javob bering.`;

    const geminiMessages = messages.map((m: { sender: string; text: string }) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await fetch(
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

    const data = await response.json();
    if (!response.ok) {
      console.error("Gemini Error:", data);
      return NextResponse.json({ text: "Kechirasiz, xatolik yuz berdi. Qayta urinib ko'ring." });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Kechirasiz, javob bera olmadim.";
    return NextResponse.json({ text: reply });

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ text: "Aloqa uzildi. Iltimos qayta urinib ko'ring." });
  }
}
