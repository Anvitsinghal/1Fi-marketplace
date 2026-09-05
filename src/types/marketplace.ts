export interface ProductVariant {
  id: string;
  variant_name?: string;
  color: string;
  color_hex?: string;
  storage: string;
  price: number;
  original_price?: number;
  mrp?: number;
  downpayment?: number;
  ram?: string;
  image_url: string;
  emi_plans?: EMIPlan[];
}

export interface Product {
  id: string;
  slug: string;
  brand: string;
  name: string;
  description: string;
  badge: string | null;
  variants: ProductVariant[];
}

export interface EMIPlan {
  id: string;
  variant_id?: string;
  tenure_months: number;
  monthly_amount: number;
  interest_rate: number;
  cashback_amount: number;
  is_zero_cost?: boolean;
}

export type ShopTabId = "brands" | "stores" | "marketplace";

export interface ShopTab {
  id: ShopTabId;
  label: string;
  badge?: string;
}

export interface EligibilityResult {
  portfolioValue: number;
  creditLimit: number;
  estimatedReturn: number;
  monthlySavings: number;
}
