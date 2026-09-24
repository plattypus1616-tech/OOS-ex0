#!/usr/bin/env python3
"""
Shopify Out-of-Stock (OOS) Inventory Auditor & B2B Outreach Specialist
Powered by google-genai and Gemini 2.5 Flash

Automates Shopify catalog scraping with paginated product extraction,
calculates total SKUs and OOS percentage, and drafts professional B2B cold emails.
"""

import os
import sys
import time
import requests
from google import genai
from google.genai import types

# Menyamar sebagai peramban Chrome asli untuk menghindari Error 403 / Bot Protection
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json'
}

def extract_shopify_inventory(store_domain):
    """
    Menyedot seluruh inventaris katalog produk Shopify menggunakan loop paginasi
    (250 produk per halaman) sampai seluruh katalog selesai disedot atau akses ditolak.
    """
    all_products = []
    page = 1
    clean_domain = store_domain.strip().replace("https://", "").replace("http://", "").rstrip("/")

    while True:
        # Paginasi paksa: batas maksimum Shopify adalah 250 per halaman
        target_url = f"https://{clean_domain}/products.json?limit=250&page={page}"
        print(f"Scraping halaman {page}: {target_url}")
        
        try:
            response = requests.get(target_url, headers=headers, timeout=15)
            if response.status_code != 200:
                print(f"Server menolak akses (Kode: {response.status_code}). Hentikan loop.")
                break
                
            data = response.json()
            products = data.get('products', [])
            
            if not products: # Array kosong berarti seluruh katalog sudah disedot
                break
                
            all_products.extend(products)
            page += 1
            time.sleep(1.5) # Jeda deterministik (Rate limiting)
            
        except Exception as e:
            print(f"Gagal koneksi: {e}")
            break
            
    return all_products

def analyze_and_draft_outreach(store_domain, client=None):
    clean_domain = store_domain.strip().replace("https://", "").replace("http://", "").rstrip("/")
    print(f"\n==================================================")
    print(f"🔍 [AUDIT] Memeriksa inventaris: {clean_domain}")
    print(f"==================================================")

    products = extract_shopify_inventory(clean_domain)
    if not products:
        print(f"⚠️ [{clean_domain}] Tidak ada produk yang berhasil diambil (mungkin protected atau katalog privat).")
        return

    total_skus = 0
    sold_out_items = []

    for p in products:
        product_title = p.get("title", "Unknown Product")
        for v in p.get("variants", []):
            total_skus += 1
            # Shopify variant availability check
            if not v.get("available", True):
                variant_title = f" ({v.get('title')})" if v.get('title') and v.get('title') != "Default Title" else ""
                sold_out_items.append(f"{product_title}{variant_title}")

    oos_count = len(sold_out_items)
    oos_percentage = round((oos_count / total_skus * 100), 1) if total_skus > 0 else 0

    print(f"📊 FAKTA INVENTARIS: Total SKU = {total_skus} | Out of Stock (OOS) = {oos_count} ({oos_percentage}%)")

    if oos_count == 0:
        print(f"✅ Stok sempurna: 0 SKU Out of Stock dari {total_skus} total SKU.")
        return

    sample_oos_product = sold_out_items[0]
    print(f"🚨 Bukti Audit Produk OOS: \"{sample_oos_product}\"")

    if not client:
        print("ℹ️ Gemini client tidak tersedia. Melewati pembuatan draft email.")
        return

    # A. Injeksi Skema JSON (Logit Masking / response_schema)
    email_response_schema = {
        "type": "object",
        "properties": {
            "subject": {
                "type": "string",
                "description": "Subjek email B2B yang menarik tapi tidak clickbait"
            },
            "body": {
                "type": "string",
                "description": "Isi email B2B. Jangan gunakan salam pembuka kaku. Langsung ke inti."
            }
        },
        "required": ["subject", "body"]
    }

    # B. Modifikasi Konteks Prompt (Tanpa Angka Rekaan)
    system_instruction = """Anda adalah spesialis B2B Outreach. Tugas Anda menulis draft email dingin (cold email) kepada pemilik toko e-commerce. 
Aturan Mutlak:
1. DILARANG memanipulasi, menebak, atau menyebutkan nominal uang, kerugian, atau 'revenue loss'.
2. Fokus pada FAKTA inventaris: sebutkan jumlah total SKU dan persentase yang Out of Stock (OOS).
3. Sebutkan satu nama produk spesifik yang sedang OOS sebagai bukti audit Anda.
4. Tawarkan nilai (value): Anda bisa membantu mereka mengotomatisasi peringatan stok ini.
5. Gunakan bahasa Inggris profesional, santai, maksimum 4 kalimat pendek."""

    prompt = f"""
Data Audit Toko (Fakta Aktual):
- Nama Toko: {clean_domain}
- Total Katalog: {total_skus} item
- Jumlah Item Out of Stock: {oos_count} item
- Contoh Produk Habis: "{sample_oos_product}"

Buat draft email berdasarkan data di atas."""

    try:
        response = client.models.generate_content(
            model="gemini-3.8-flash",
            contents=prompt,
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                response_mime_type="application/json",
                response_schema=email_response_schema,
            ),
        )
        print(f"\n📧 --- DRAFT COLD EMAIL UNTUK {clean_domain} ---")
        print(response.text.strip())
        print("--------------------------------------------------\n")
    except Exception as e:
        print(f"❌ Gagal generate AI outreach: {e}")

if __name__ == "__main__":
    api_key = os.getenv("GEMINI_API_KEY")
    client = None
    if api_key:
        client = genai.Client(api_key=api_key)
    else:
        print("⚠️ Catatan: GEMINI_API_KEY belum diset. Jalankan 'export GEMINI_API_KEY=your_key' untuk mengaktifkan AI draft.")

    # Target toko e-commerce contoh
    target_stores = [
        "beardbrand.com",
        "hiutdenim.co.uk",
    ]

    for store in target_stores:
        analyze_and_draft_outreach(store, client)
