export interface ShopifyVariant {
  id: number;
  title: string;
  price: string;
  sku?: string;
  position?: number;
  inventory_policy?: string;
  compare_at_price?: string | null;
  fulfillment_service?: string;
  inventory_management?: string;
  option1?: string;
  option2?: string;
  option3?: string;
  created_at?: string;
  updated_at?: string;
  taxable?: boolean;
  barcode?: string;
  grams?: number;
  available?: boolean;
  weight?: number;
  weight_unit?: string;
  requires_shipping?: boolean;
}

export interface ShopifyImage {
  id?: number;
  src: string;
  width?: number;
  height?: number;
  alt?: string | null;
}

export interface ShopifyProduct {
  id: number;
  title: string;
  handle: string;
  body_html?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
  vendor?: string;
  product_type?: string;
  tags?: string[] | string;
  variants: ShopifyVariant[];
  images: ShopifyImage[];
  image?: ShopifyImage;
}

export interface SoldOutItem {
  id: string;
  title: string;
  variantTitle: string;
  price: number;
  priceFormatted: string;
  currency: string;
  handle: string;
  productUrl: string;
  imageUrl?: string;
  productType?: string;
  vendor?: string;
}

export interface GeneratedColdEmail {
  subject: string;
  alternativeSubjects: string[];
  body: string;
  hook: string;
  callToAction: string;
  tone: string;
  keyLossHighlight: string;
  estimatedMonthlyBurn: string;
}

export interface StoreAuditResult {
  id: string;
  storeUrl: string;
  cleanDomain: string;
  storeName: string;
  status: 'idle' | 'scanning' | 'success' | 'no_oos' | 'error' | 'protected';
  totalProductsScanned: number;
  totalVariantsScanned: number;
  soldOutCount: number;
  soldOutRate: number; // percentage e.g. 18.5
  soldOutProducts: SoldOutItem[];
  availableProductsCount: number;
  estDailyLoss: number;
  estMonthlyLoss: number;
  topOOSProducts: SoldOutItem[];
  currency: string;
  contactEmail?: string;
  errorMessage?: string;
  diagnosticNote?: string;
  generatedEmail?: GeneratedColdEmail;
  auditTimestamp: string;
  latencyMs?: number;
  isSimulated?: boolean;
}

export type EmailTone =
  | 'sharp_3_sentence'
  | 'revenue_leak_executive'
  | 'phantom_inventory_specialist'
  | 'linkedin_inmail'
  | 'loom_video_script';
