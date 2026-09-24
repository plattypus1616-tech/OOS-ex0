export interface StorePreset {
  name: string;
  url: string;
  category: string;
  contactEmail?: string;
  notes?: string;
}

export const DEFAULT_STORES: StorePreset[] = [
  { name: "Beardbrand", url: "https://www.beardbrand.com", category: "Grooming & Men's Care", contactEmail: "support@beardbrand.com" },
  { name: "Taza Chocolate", url: "https://www.tazachocolate.com", category: "Food & Organic Cacao", contactEmail: "orders@tazachocolate.com" },
  { name: "Hiut Denim", url: "https://hiutdenim.co.uk", category: "Apparel & Artisan Denim" },
  { name: "United By Blue", url: "https://unitedbyblue.com", category: "Outdoor & Sustainable", contactEmail: "hello@unitedbyblue.com" },
  { name: "Conscious Clothing", url: "https://consciousclothing.net", category: "Eco Fashion & Linen" },
  { name: "Asket", url: "https://asket.com", category: "Minimalist Essentials", contactEmail: "care@asket.com" },
  { name: "Afends", url: "https://afends.com", category: "Streetwear & Hemp Wear" },
  { name: "UpCircle Beauty", url: "https://upcirclebeauty.com", category: "Circular Skincare", contactEmail: "hello@upcirclebeauty.com" },
  { name: "Tropic Skincare", url: "https://tropic.com", category: "Clean Skincare" },
];

export const TONE_LABELS: Record<string, { label: string; description: string; badge: string }> = {
  sharp_3_sentence: {
    label: "3-Sentence B2B Sharp",
    description: "Crisp, punchy, zero-fluff cold email highlighting revenue leak and low-friction audit offer.",
    badge: "Most Popular",
  },
  revenue_leak_executive: {
    label: "Executive Revenue Leak",
    description: "Financial ROI angle targeted at Founders, CMOs, and VPs of E-Commerce.",
    badge: "High ACV",
  },
  phantom_inventory_specialist: {
    label: "Phantom Inventory Specialist",
    description: "Technical operational audit angle focusing on ERP mismatch & backorder recovery.",
    badge: "Technical",
  },
  linkedin_inmail: {
    label: "LinkedIn InMail / DM",
    description: "Short, conversational founder-to-founder message under 70 words.",
    badge: "Direct DM",
  },
  loom_video_script: {
    label: "60-Second Loom Video Script",
    description: "Script for recording an async audit video walking through their live store catalog.",
    badge: "Video Pitch",
  },
};
