import { NextRequest, NextResponse } from "next/server";
import { ai } from "@/lib/gemini";
import { Type } from "@google/genai";
import { GeneratedColdEmail, SoldOutItem } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      storeName,
      storeUrl,
      soldOutProducts = [] as SoldOutItem[],
      totalVariants,
      soldOutRate,
      tone = "sharp_3_sentence",
      senderName = "Alex",
      senderCompany = "Inventory Automation Specialist",
      customAngle = "",
    } = body;

    if (!storeName || soldOutProducts.length === 0) {
      return NextResponse.json(
        { error: "storeName and at least one soldOutProduct are required." },
        { status: 400 }
      );
    }

    const totalSkus = totalVariants || Math.max(soldOutProducts.length, 60);
    const oosRate = soldOutRate !== undefined 
      ? soldOutRate 
      : Math.round((soldOutProducts.length / totalSkus) * 1000) / 10;

    const sampleItem = soldOutProducts[0]?.title
      ? `${soldOutProducts[0].title}${soldOutProducts[0].variantTitle ? ` (${soldOutProducts[0].variantTitle})` : ""}`
      : "Featured Product";

    const store = {
      name: storeName,
      totalProducts: totalSkus,
      outOfStockCount: soldOutProducts.length,
      sampleOosItemName: sampleItem,
    };

    const emailResponseSchema = {
      type: Type.OBJECT,
      properties: {
        subject: { 
          type: Type.STRING, 
          description: "Subjek email B2B yang menarik tapi tidak clickbait" 
        },
        body: { 
          type: Type.STRING, 
          description: "Isi email B2B. Jangan gunakan salam pembuka kaku. Langsung ke inti." 
        }
      },
      required: ["subject", "body"]
    };

    const systemInstruction = `Anda adalah spesialis B2B Outreach. Tugas Anda menulis draft email dingin (cold email) kepada pemilik toko e-commerce. 
Aturan Mutlak:
1. DILARANG memanipulasi, menebak, atau menyebutkan nominal uang, kerugian, atau 'revenue loss'.
2. Fokus pada FAKTA inventaris: sebutkan jumlah total SKU dan persentase yang Out of Stock (OOS).
3. Sebutkan satu nama produk spesifik yang sedang OOS sebagai bukti audit Anda.
4. Tawarkan nilai (value): Anda bisa membantu mereka mengotomatisasi pemantauan stok ini.
5. Gunakan bahasa Inggris profesional, santai, maksimum 4 kalimat pendek.${customAngle ? `\nCatatan tambahan: ${customAngle}` : ""}`;

    const prompt = `Data Audit Toko (Fakta Aktual):
- Nama Toko: ${store.name}
- Total Katalog: ${store.totalProducts} SKU
- Jumlah Item Out of Stock: ${store.outOfStockCount} SKU (${oosRate}% OOS)
- Contoh Produk Habis: "${store.sampleOosItemName}"

Tulis draft email dingin sesuai aturan mutlak di atas.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: emailResponseSchema,
      },
    });

    const text = response.text || "{}";
    const parsed = JSON.parse(text.trim());

    const generated: GeneratedColdEmail = {
      subject: parsed.subject || `Quick note on ${sampleItem} stock on ${storeName}`,
      body: parsed.body || `Hey ${storeName} team,\n\nWhile reviewing your catalog of ${totalSkus} SKUs, I noticed about ${oosRate}% are currently out of stock.\n\nFor example, "${sampleItem}" is currently listed as unavailable.\n\nWe help e-commerce stores automate live stock monitoring so you get notified right away when inventory runs low.\n\nWould you be open to seeing how automated tracking works for your inventory?`,
      hook: `Noticed that ${sampleItem} is currently out of stock in your ${totalSkus} SKU catalog.`,
      callToAction: "Would you be open to seeing how automated stock tracking works for your inventory?",
      tone: tone,
      keyLossHighlight: `Inventory Fact: ${soldOutProducts.length} of ${totalSkus} SKUs (${oosRate}%) OOS (including ${sampleItem})`,
      estimatedMonthlyBurn: `${oosRate}% OOS across ${totalSkus} SKUs`,
      alternativeSubjects: [
        `Automating stock monitoring for ${storeName}`,
        `Quick check on ${storeName}'s catalog`,
      ],
    };

    return NextResponse.json({ email: generated });
  } catch (err: unknown) {
    console.error("Failed to generate cold email:", err);
    const errorMsg = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json(
      { error: "Could not generate email.", details: errorMsg },
      { status: 500 }
    );
  }
}
