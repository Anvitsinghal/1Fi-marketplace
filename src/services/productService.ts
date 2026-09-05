import type { Product, ProductVariant, EMIPlan, EligibilityResult } from "@/types/marketplace";
import mockCatalog from "@/mocks/products.json";

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function calculateEligibility(portfolioValue: number): EligibilityResult {
  const creditLimit = Math.round(portfolioValue * 0.5);
  // Average equity mutual fund historical CAGR ~13.5%
  const estimatedReturn = Math.round(portfolioValue * 0.135);
  // Compare against traditional personal loan / credit card 16% APR
  const monthlySavings = Math.round((creditLimit * 0.16) / 12);

  return {
    portfolioValue,
    creditLimit,
    estimatedReturn,
    monthlySavings,
  };
}

export function calculateMonthlyEMI(
  price: number,
  downpayment: number,
  tenureMonths: number
): number {
  if (tenureMonths <= 0) return 0;
  const principal = Math.max(0, price - downpayment);
  return Math.round(principal / tenureMonths);
}

/**
 * Fetches all marketplace products.
 * Self-contained service layer that returns the full normalized catalog of flagships.
 */
export async function fetchMarketplaceProducts(): Promise<Product[]> {
  // Simulate network tick for realistic React Query loading states
  await new Promise((resolve) => setTimeout(resolve, 50));
  return mockCatalog as Product[];
}

/**
 * Fetches a single product by slug with all variants and EMI plans.
 */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, 30));
  const product = (mockCatalog as Product[]).find((p) => p.slug === slug);
  return product || null;
}
