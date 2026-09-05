import { useState, useEffect } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ShieldCheck, Star, Sparkles, AlertCircle } from "lucide-react";
import type { Product, ProductVariant, EMIPlan } from "@/types/marketplace";
import { fetchProductBySlug, formatCurrency } from "@/services/productService";
import { VariantPicker } from "@/components/marketplace/VariantPicker";
import { EMIPlanSelector } from "@/components/marketplace/EMIPlanSelector";
import { PriceDisplay } from "@/components/marketplace/PriceDisplay";
import { StickyCheckoutBar } from "@/components/marketplace/StickyCheckoutBar";
import { ProceedModal } from "@/components/marketplace/ProceedModal";

export const Route = createFileRoute("/products/$slug")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { slug } = Route.useParams();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showProceedModal, setShowProceedModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const prod = await fetchProductBySlug(slug);
        if (!prod) {
          setError("Product not found");
        } else {
          setProduct(prod);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    }

    if (slug) {
      loadData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8fe] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="size-10 border-4 border-[#6825db] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-bold text-sm text-[#6825db]">Loading phone specifications & EMI plans...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-[#faf8fe] flex flex-col items-center justify-center gap-4 p-4 text-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-red-100 text-red-600">
          <AlertCircle className="size-7" />
        </div>
        <h2 className="text-2xl font-black text-neutral-900">Product Not Found</h2>
        <p className="text-xs text-neutral-500 max-w-sm">
          We couldn't locate this device in our live catalog. It may be temporarily out of stock.
        </p>
        <Link
          to="/"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-[#6825db] px-5 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#581ec2]"
        >
          <ArrowLeft className="size-4" /> Back to 1Fi Marketplace
        </Link>
      </div>
    );
  }

  const variants = product.variants || [];
  const currentVariant: ProductVariant = variants[selectedVariantIdx] || variants[0];
  const plans = currentVariant.emi_plans || [];
  const activePlan: EMIPlan = plans.find((p) => p.id === selectedPlanId) || plans[0] || {
    id: "default-6m",
    tenure_months: 6,
    monthly_amount: Math.round(currentVariant.price / 6),
    interest_rate: 0,
    cashback_amount: 2500,
    is_zero_cost: true,
  };

  const currentPrice = Number(currentVariant.price);
  const originalPrice = Number(
    currentVariant.original_price || currentVariant.mrp || Math.round(currentPrice * 1.08)
  );
  const downpayment = Number(
    currentVariant.downpayment || Math.round(currentPrice * 0.15)
  );

  return (
    <div className="min-h-screen bg-[#faf8fe] text-[#1c1730] pb-28 sm:pb-32">
      {/* Top App Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#eae2f8] bg-white/95 px-5 sm:px-8 py-3.5 shadow-xs backdrop-blur-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-600 hover:text-[#6825db] transition-colors"
        >
          <ArrowLeft className="size-4" /> Back to Marketplace
        </Link>

        <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-200 bg-purple-100 px-3 py-1 text-xs font-bold text-[#6825db]">
          <Sparkles className="size-3" /> Mutual Fund Backed 0% EMI
        </span>
      </header>

      {/* Main Content Layout */}
      <main className="max-w-6xl mx-auto px-4 mt-6 sm:mt-10 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Gallery & Device Highlights */}
        <div className="md:col-span-6 flex flex-col items-center">
          <div className="w-full bg-white rounded-3xl border border-[#eae2f8] p-8 flex items-center justify-center min-h-[420px] sm:min-h-[480px] shadow-sm relative overflow-hidden group">
            {product.badge && (
              <span className="absolute top-4 left-4 text-xs font-bold uppercase tracking-wider bg-[#6825db] text-white px-3 py-1 rounded-full shadow-xs">
                {product.badge}
              </span>
            )}

            <img
              src={currentVariant.image_url}
              alt={`${product.name} ${currentVariant.color}`}
              className="max-h-[380px] sm:max-h-[420px] w-auto object-contain transition-all duration-500 group-hover:scale-105 drop-shadow-xl"
            />
          </div>

          {/* Quick specs pill */}
          <div className="w-full mt-4 flex flex-wrap gap-2 justify-center text-xs text-neutral-500">
            {currentVariant.ram && (
              <span className="rounded-xl border border-[#eae2f8] bg-white px-3 py-1.5 font-semibold">
                RAM: {currentVariant.ram}
              </span>
            )}
            <span className="rounded-xl border border-[#eae2f8] bg-white px-3 py-1.5 font-semibold">
              Storage: {currentVariant.storage}
            </span>
            <span className="rounded-xl border border-[#eae2f8] bg-white px-3 py-1.5 font-semibold">
              Brand: {product.brand}
            </span>
          </div>
        </div>

        {/* Right Column: Details, Variant Picker & EMI Selector */}
        <div className="md:col-span-6 space-y-6">
          {/* Title & Brand */}
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#6825db]">
              {product.brand}
            </span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 mt-1">
              {product.name}
            </h1>
            <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Pricing Component */}
          <div className="rounded-2xl border border-[#eae2f8] bg-white p-5 shadow-xs">
            <PriceDisplay
              currentPrice={currentPrice}
              originalPrice={originalPrice}
              size="lg"
            />
          </div>

          {/* Color & Storage Variants */}
          <div className="rounded-2xl border border-[#eae2f8] bg-white p-5 shadow-xs">
            <VariantPicker
              variants={variants}
              selectedIndex={selectedVariantIdx}
              onSelectVariant={(idx) => {
                setSelectedVariantIdx(idx);
                setSelectedPlanId(null);
              }}
            />
          </div>

          {/* EMI Tenure Selector */}
          <EMIPlanSelector
            plans={plans}
            selectedPlanId={activePlan.id}
            onSelectPlan={setSelectedPlanId}
            downpayment={downpayment}
          />

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 border-t border-[#eae2f8] pt-4 text-center text-xs text-neutral-600">
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck className="size-5 text-[#6825db]" />
              <span className="font-semibold text-neutral-800">MF-Backed EMI</span>
              <span className="text-[10px] text-neutral-400">Zero CIBIL Impact</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Star className="size-5 text-[#6825db]" />
              <span className="font-semibold text-neutral-800">0% Foreclosure</span>
              <span className="text-[10px] text-neutral-400">No Penalty</span>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <Sparkles className="size-5 text-[#6825db]" />
              <span className="font-semibold text-neutral-800">Instant Digital</span>
              <span className="text-[10px] text-neutral-400">Under 2 Mins</span>
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Bottom Checkout Bar */}
      <StickyCheckoutBar
        productName={product.name}
        selectedPlan={activePlan}
        onProceed={() => setShowProceedModal(true)}
      />

      {/* Confirmation & Pledge Modal */}
      <ProceedModal
        isOpen={showProceedModal}
        onClose={() => setShowProceedModal(false)}
        product={product}
        variant={currentVariant}
        plan={activePlan}
      />
    </div>
  );
}