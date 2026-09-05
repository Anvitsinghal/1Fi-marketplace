import { useState, useEffect } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ShieldCheck, ArrowLeft, Star, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";

export const Route = createFileRoute("/products/$slug")({
  component: ProductPage,
});

const supabase = createClient(
  "https://cxkzjkkeiasdzdryawzw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4a3pqa2tlaWFzZHpkcnlhd3p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MjE4NDksImV4cCI6MjEwMzk5Nzg0OX0.gH3XY6IWfk2kWYvISgKQ3Zo8c9p8H2I374UfoI5KPRM"
);

function ProductPage() {
  const { slug } = Route.useParams();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [phone, setPhone] = useState("");
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    async function loadProductData() {
      setLoading(true);
      
      // 1. Fetch Product with Variants
      const { data: prodData, error: prodError } = await supabase
        .from("products")
        .select(`
          id,
          slug,
          brand,
          name,
          description,
          badge,
          product_variants (
            id,
            storage,
            color,
            color_hex,
            price,
            original_price,
            downpayment,
            ram,
            image_url
          )
        `)
        .eq("slug", slug)
        .single();

      if (prodError || !prodData) {
        console.error("Product load error:", prodError);
        setLoading(false);
        return;
      }

      // 2. Fetch EMI plans for all variants of this product
      const variantIds = prodData.product_variants?.map((v: any) => v.id) || [];
      let plansByVariant: Record<string, any[]> = {};

      if (variantIds.length > 0) {
        const { data: plansData } = await supabase
          .from("emi_plans")
          .select("*")
          .in("variant_id", variantIds)
          .order("tenure_months", { ascending: true });

        if (plansData) {
          plansData.forEach((p: any) => {
            if (!plansByVariant[p.variant_id]) plansByVariant[p.variant_id] = [];
            plansByVariant[p.variant_id].push(p);
          });
        }
      }

      // Combine variants with their EMI plans
      const enrichedVariants = (prodData.product_variants || []).map((v: any) => ({
        ...v,
        emi_plans: plansByVariant[v.id] || []
      }));

      setProduct({ ...prodData, product_variants: enrichedVariants });
      setLoading(false);
    }

    if (slug) {
      loadProductData();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center font-medium text-neutral-500 animate-pulse">Loading product details...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-4">
        <div className="text-xl font-bold text-neutral-700">Product not found</div>
        <Link to="/" className="text-sm text-red-500 font-semibold underline">Back to catalog</Link>
      </div>
    );
  }

  const variants = product.product_variants || [];
  const currentVariant = variants[selectedVariantIdx] || variants[0] || {};
  const currentPrice = Number(currentVariant.price || 0);
  const originalPrice = Number(currentVariant.original_price || Math.round(currentPrice * 1.05));
  const downpayment = Number(currentVariant.downpayment || Math.round(currentPrice * 0.15));
  const discount = originalPrice > currentPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 5;

  // Live EMI plans from database or fallback calculation
  const dbPlans = currentVariant.emi_plans || [];
  const plans = dbPlans.length > 0 ? dbPlans : [
    { id: "p-6m", tenure_months: 6, monthly_amount: Math.round((currentPrice - downpayment) / 6), interest_rate: 0, cashback_amount: 1500 },
    { id: "p-9m", tenure_months: 9, monthly_amount: Math.round((currentPrice - downpayment) / 9), interest_rate: 0, cashback_amount: 1000 },
    { id: "p-12m", tenure_months: 12, monthly_amount: Math.round((currentPrice - downpayment) / 12), interest_rate: 0, cashback_amount: 0 },
  ];

  const activePlan = plans.find((p: any) => p.id === selectedPlanId) || plans[0];

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 pb-20">
      {/* Header */}
      <header className="bg-white border-b px-8 py-3.5 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-black font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to catalog
        </Link>
        <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">
          Mutual Fund Backed 0% EMI
        </span>
      </header>

      <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Side: Gallery */}
        <div className="md:col-span-6 flex flex-col items-center">
          <div className="w-full bg-white rounded-3xl border border-neutral-200/80 p-8 flex items-center justify-center min-h-[460px] shadow-sm relative overflow-hidden">
            {product.badge && (
              <span className="absolute top-4 left-4 text-xs font-black uppercase tracking-wider bg-neutral-900 text-white px-3 py-1 rounded-full">
                {product.badge}
              </span>
            )}
            <img
              src={currentVariant.image_url || "/images/iphone-17-pro.jpg"}
              alt={`${product.name} ${currentVariant.color}`}
              className="max-h-[420px] w-auto object-contain transition-all duration-500 hover:scale-105 drop-shadow-xl"
            />
          </div>
        </div>

        {/* Right Side: Product Details & Live EMI selection */}
        <div className="md:col-span-6 space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-neutral-500">{product.brand}</p>
            <h1 className="text-3xl font-black tracking-tight text-neutral-900 mt-1">
              {product.name}
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              Color: <span className="font-semibold text-neutral-800">{currentVariant.color || "Standard"}</span> | Storage: <span className="font-semibold text-neutral-800">{currentVariant.storage || "256 GB"}</span>
            </p>

            <div className="flex items-center gap-3 mt-3">
              <span className="text-3xl font-black text-neutral-900">₹{currentPrice.toLocaleString("en-IN")}</span>
              <span className="text-sm line-through text-neutral-400">₹{originalPrice.toLocaleString("en-IN")}</span>
              <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded">{discount}% OFF</span>
            </div>
          </div>

          {/* Color & Variant Selection */}
          <div className="space-y-4 pt-4 border-t border-neutral-200">
            <div>
              <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider block mb-2">Select Color & Storage Variant</label>
              <div className="flex flex-wrap gap-2.5">
                {variants.map((variant: any, idx: number) => (
                  <button
                    key={variant.id || idx}
                    onClick={() => {
                      setSelectedVariantIdx(idx);
                      setSelectedPlanId(null);
                    }}
                    className={`px-3.5 py-2 rounded-xl border text-sm font-semibold flex items-center gap-2.5 transition-all ${
                      selectedVariantIdx === idx
                        ? "border-neutral-900 bg-neutral-900 text-white shadow"
                        : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400"
                    }`}
                  >
                    {variant.color_hex && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-sm"
                        style={{ backgroundColor: variant.color_hex }}
                      />
                    )}
                    <span>{variant.color} ({variant.storage})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* EMI Tenure Box */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-neutral-800">
                Pay only <span className="font-black text-neutral-900 text-base">₹{downpayment.toLocaleString("en-IN")}</span> now
              </div>
              <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-1 rounded-md font-medium">
                No credit card needed
              </span>
            </div>

            <div className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Choose EMI Plan</div>

            <div className="space-y-2.5">
              {plans.map((plan: any) => {
                const isSelected = (activePlan?.id === plan.id);
                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? "border-neutral-900 bg-neutral-50 ring-1 ring-neutral-900"
                        : "border-neutral-200 hover:border-neutral-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="emi"
                        checked={isSelected}
                        onChange={() => setSelectedPlanId(plan.id)}
                        className="accent-neutral-900 w-4 h-4 cursor-pointer"
                      />
                      <div>
                        <div className="font-bold text-sm text-neutral-900">
                          ₹{Number(plan.monthly_amount).toLocaleString("en-IN")} × {plan.tenure_months} months
                        </div>
                        <div className="text-xs text-neutral-500">
                          Interest: {plan.interest_rate}% {plan.cashback_amount > 0 && `• ₹${plan.cashback_amount} Cashback`}
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold px-2 py-1 rounded bg-green-100 text-green-800">
                      {plan.interest_rate === 0 ? "0% Interest" : `${plan.interest_rate}% Interest`}
                    </span>
                  </div>
                );
              })}
            </div>

            <Button
              onClick={() => setShowOtpModal(true)}
              className="w-full bg-neutral-900 hover:bg-black text-white font-bold py-6 text-base rounded-xl mt-2 transition-transform active:scale-[0.99]"
            >
              Proceed with {activePlan?.tenure_months || 6} Months Plan
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-2 border-t pt-4 text-center text-xs text-neutral-600">
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck className="w-5 h-5 text-neutral-700" />
              <span>MF-Backed EMI</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Star className="w-5 h-5 text-neutral-700" />
              <span>Zero Foreclosure</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Sparkles className="w-5 h-5 text-neutral-700" />
              <span>Instant Approval</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout / OTP Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 relative shadow-2xl animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowOtpModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black text-lg font-bold"
            >
              ✕
            </button>

            {!orderSuccess ? (
              <>
                <div className="text-center space-y-1">
                  <h3 className="font-black text-xl text-neutral-900">Confirm Your Plan</h3>
                  <p className="text-xs text-neutral-500">
                    {product.name} ({currentVariant.color}) • {activePlan?.tenure_months}M @ ₹{Number(activePlan?.monthly_amount).toLocaleString("en-IN")}/mo
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-neutral-600 uppercase tracking-wider">Mobile Number</label>
                  <div className="flex gap-2">
                    <span className="px-3 py-2.5 bg-neutral-100 border rounded-xl text-sm font-semibold text-neutral-600">+91</span>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="flex-1 border rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-800"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      if (phone.length >= 10) setOrderSuccess(true);
                      else alert("Please enter a valid 10-digit mobile number");
                    }}
                    className="w-full bg-neutral-900 hover:bg-black text-white font-bold py-3 rounded-xl mt-2"
                  >
                    Verify & Apply for 0% EMI
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto" />
                <h3 className="text-xl font-bold text-neutral-900">Application Received!</h3>
                <p className="text-xs text-neutral-600">
                  Your 1Fi EMI application for <strong>{product.name}</strong> has been logged.
                </p>
                <Button
                  onClick={() => {
                    setShowOtpModal(false);
                    setOrderSuccess(false);
                  }}
                  className="w-full bg-neutral-900 hover:bg-black text-white font-bold rounded-xl mt-2"
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}