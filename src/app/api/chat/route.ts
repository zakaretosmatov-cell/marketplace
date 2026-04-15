import { NextResponse } from 'next/server';
import { api } from '@/lib/api';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    
    // Fetch products
    const products = await api.getProducts();
    const productList = products.map(p => `- ${p.name} ($${p.price}) - ${p.category}. [Brand: ${p.brand}, Stock: ${p.stock}]`).join('\n');

    const systemPrompt = `Siz onlayn marketplace yordamchisisiz.
Sizning vazifangiz foydalanuvchiga mahsulot tanlashda yordam berish (telefon, noutbuk, TV va gadjetlar).
Sizning omboringizda Hozirda mavjud bo'lgan tovarlar ro'yxati (Faqat shulardan tavsiya qiling! Boshqa tovar yo'q demang, ushbu ro'yxatdan kelib chiqib javob bering):
${productList}

Qoidalaringiz:
- Agar mijoz qaysidir turdagi tovar so'rasa, eng yaxshi 3 ta variant bering (arzon, o'rtacha, qimmat). Faqat bizda bor tovarlardan.
- Juda sodda va kundalik so'zlashuvda yozing. Juda uzun yozmang, qisqa.
- Foydalanuvchi aniq byudjet aytmagan bo'lsa, qancha byudjeti borligini yoki o'rtacha qanday narx qidirayotganini so'rang.
- O'zbek tilida gaplashasiz. Eng zo'r 3 ta tavsiya qilishni unutmang (agar tovar yetsa).`;

    const geminiMessages = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
        console.error("Gemini Error:", data);
        return NextResponse.json({ error: data.error?.message || "Error from Gemini API" }, { status: 500 });
    }

    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Kechirasiz, men hozir javob bera olmayman.";
    return NextResponse.json({ text: reply });

  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
