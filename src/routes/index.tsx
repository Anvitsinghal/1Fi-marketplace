import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowUpRight,
  Search,
  Sparkles,
  Check,
  ChevronDown,
  ShieldCheck,
  TrendingUp,
  Database,
  Calculator,
  X,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ShopTabId } from "@/types/marketplace";
import {
  fetchMarketplaceProducts,
  formatCurrency,
  calculateEligibility,
} from "@/services/productService";
import { ShopTabs } from "@/components/marketplace/ShopTabs";
import { ProductCard } from "@/components/marketplace/ProductCard";
import { ProductSkeleton } from "@/components/marketplace/ProductSkeleton";
import { EmptyState } from "@/components/marketplace/EmptyState";
import { ErrorState } from "@/components/marketplace/ErrorState";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "1Fi — Smartphones on flexible 0% EMI backed by mutual funds" },
      {
        name: "description",
        content:
          "Shop flagship smartphones with zero-cost EMI plans backed by your mutual funds on 1Fi. No credit score required.",
      },
      { property: "og:title", content: "1Fi — Smartphones on flexible EMI" },
      {
        property: "og:description",
        content:
          "Shop today, pay later using mutual funds. No credit score required.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const {
    data: products,
    isPending,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["marketplace_products"],
    queryFn: fetchMarketplaceProducts,
  });

  // Shop navigation & filtering state
  const [activeTab, setActiveTab] = useState<ShopTabId>("marketplace");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showEligibilityModal, setShowEligibilityModal] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Eligibility modal state
  const [mfValue, setMfValue] = useState<number>(250000);
  const [panPhone, setPanPhone] = useState<string>("");
  const [eligibilitySubmitted, setEligibilitySubmitted] = useState(false);

  // EMI Calculator state
  const [calcPhonePrice, setCalcPhonePrice] = useState<number>(129900);
  const [calcTenure, setCalcTenure] = useState<number>(6);

  // FAQs open state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Filter products by brand and search query
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    return products.filter((p) => {
      const matchesBrand =
        selectedBrand === "All" ||
        p.brand.toLowerCase() === selectedBrand.toLowerCase();
      const matchesSearch =
        searchQuery.trim() === "" ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesBrand && matchesSearch;
    });
  }, [products, selectedBrand, searchQuery]);

  const eligibility = calculateEligibility(mfValue);
  const estimatedCalcMonthly = Math.round(calcPhonePrice / calcTenure);
  const estimatedCardInterest = Math.round(
    calcPhonePrice * 0.16 * (calcTenure / 12)
  );

  return (
    <div className="min-h-screen bg-[#faf8fe] text-[#1c1730] selection:bg-[#6825db] selection:text-white font-sans antialiased">
      {/* 1. FLOATING HEADER (matches screenshot) */}
      <header className="sticky top-0 z-40 w-full px-4 pt-3 pb-2 sm:px-6 sm:pt-4">
        <div className="mx-auto flex max-w-6xl items-center justify-between rounded-2xl sm:rounded-full border border-[#eae2f8] bg-white/95 px-4 py-2.5 shadow-sm shadow-purple-950/5 backdrop-blur-md sm:px-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group" aria-label="1Fi Home">
            <div className="flex size-9 items-center justify-center rounded-xl bg-[#6825db] text-white shadow-sm shadow-purple-900/25 transition-transform group-hover:scale-105">
              <span className="text-base font-black tracking-tighter">1Fi</span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-600 lg:flex">
            <Link to="/" className="text-[#6825db] font-semibold transition-colors">
              Home
            </Link>
            <a href="#about" className="hover:text-[#6825db] transition-colors">
              About Us
            </a>
            <a href="#how-it-works" className="hover:text-[#6825db] transition-colors">
              How it Works
            </a>
            <a href="#catalog" className="hover:text-[#6825db] transition-colors">
              Shop
            </a>
            <a href="#calculator" className="hover:text-[#6825db] transition-colors">
              Calculator
            </a>
            <a href="#contact" className="hover:text-[#6825db] transition-colors">
              Contact Us
            </a>
            <a href="#partner" className="hover:text-[#6825db] transition-colors">
              Partner With Us
            </a>
            <a href="#faq" className="hover:text-[#6825db] transition-colors">
              FAQs
            </a>
          </nav>

          {/* Right CTA */}
          <div className="flex items-center gap-3">
            <a
              href="#catalog"
              className="inline-flex items-center gap-1.5 rounded-xl sm:rounded-full bg-[#6825db] px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-purple-900/20 transition-all hover:bg-[#581ec2] hover:shadow-md hover:shadow-purple-900/30 active:scale-[0.98]"
            >
              <span>Shop Now</span>
              <ArrowUpRight className="size-4 stroke-[2.5]" />
            </a>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="grid size-9 place-items-center rounded-xl border border-[#eae2f8] bg-white text-neutral-700 hover:bg-neutral-50 lg:hidden cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="mx-auto mt-2 max-w-6xl rounded-2xl border border-[#eae2f8] bg-white p-4 shadow-xl lg:hidden animate-in fade-in slide-in-from-top-2">
            <nav className="flex flex-col gap-3 text-sm font-medium text-neutral-700">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="text-[#6825db] font-semibold py-1"
              >
                Home
              </Link>
              <a
                href="#about"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#6825db] py-1"
              >
                About Us
              </a>
              <a
                href="#how-it-works"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#6825db] py-1"
              >
                How it Works
              </a>
              <a
                href="#catalog"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#6825db] py-1"
              >
                Shop
              </a>
              <a
                href="#calculator"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#6825db] py-1"
              >
                Calculator
              </a>
              <a
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#6825db] py-1"
              >
                Contact Us
              </a>
              <a
                href="#partner"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#6825db] py-1"
              >
                Partner With Us
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="hover:text-[#6825db] py-1"
              >
                FAQs
              </a>
            </nav>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION (matches screenshot exactly) */}
      <section className="relative px-5 pt-12 pb-16 sm:pt-20 sm:pb-24 lg:pt-24 lg:pb-32 overflow-hidden">
        {/* Soft background ambient gradient glow */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-96 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(104,37,219,0.12),transparent_70%)]" />

        <div className="relative mx-auto max-w-4xl text-center">
          {/* Badge Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-200/90 bg-white/90 px-3.5 py-1.5 shadow-xs backdrop-blur-sm">
            <span className="inline-flex items-center gap-1 rounded-full bg-purple-100/90 px-2.5 py-0.5 text-xs font-semibold text-[#6825db]">
              <Sparkles className="size-3 text-[#6825db]" />
              <span>New</span>
            </span>
            <span className="text-xs sm:text-sm font-medium text-neutral-700">
              No-cost EMIs backed by mutual funds
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="mt-8 text-balance text-5xl font-extrabold tracking-tight text-neutral-900 sm:text-7xl lg:text-7xl">
            <span className="block leading-[1.08]">Shop today</span>
            <span className="block mt-1 sm:mt-2 leading-[1.08]">
              <span className="font-serif italic font-normal text-neutral-400 mr-2 sm:mr-3">
                Pay later
              </span>
              <span>using</span>
            </span>
            <span className="block mt-1 sm:mt-2 text-[#6825db] leading-[1.08]">
              mutual funds.
            </span>
          </h1>

          {/* CTA Buttons */}
          <div className="mt-9 sm:mt-10 flex flex-wrap items-center justify-center gap-3.5 sm:gap-4">
            <button
              onClick={() => setShowEligibilityModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#6825db] bg-white px-7 py-3 text-base font-bold text-[#6825db] shadow-xs transition-all hover:bg-purple-50/80 active:scale-[0.99] cursor-pointer"
            >
              <span>Check Eligibility</span>
              <ArrowUpRight className="size-4 stroke-[2.5]" />
            </button>
            <a
              href="#catalog"
              className="inline-flex items-center gap-2 rounded-xl bg-[#6825db] px-7 py-3 text-base font-bold text-white shadow-md shadow-[#6825db]/25 transition-all hover:bg-[#581ec2] hover:shadow-lg hover:shadow-[#6825db]/35 active:scale-[0.99] cursor-pointer"
            >
              <span>Start Shopping</span>
              <Search className="size-4 stroke-[2.5]" />
            </a>
          </div>

          {/* Trust Subtext */}
          <p className="mt-8 sm:mt-9 text-center text-sm sm:text-base text-neutral-500 max-w-md mx-auto leading-relaxed">
            No <strong className="font-bold text-neutral-800">credit</strong> score required. No{" "}
            <strong className="font-bold text-neutral-800">interest</strong>.
            <br />
            Fully backed by your <strong className="font-bold text-neutral-800">investments</strong>.
          </p>
        </div>
      </section>

      {/* 3. SHOP PAGE WITH 3-TAB STRUCTURE (Mandatory Assignment Requirement) */}
      <section id="catalog" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-12 lg:px-8 lg:py-20">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-[#6825db]">
            1Fi Shopping Experience
          </p>
          <h2 className="mt-1 text-3xl font-black tracking-[-0.03em] text-neutral-900 sm:text-4xl">
            Choose How You Want to Shop
          </h2>
          <p className="mt-2 text-sm text-neutral-500">
            Switch between authorized brand flagships, nearby retail store pickup, and our digital 1Fi Marketplace.
          </p>
        </div>

        {/* 3 Mandatory Segments: Top Brands | Nearby Stores | 1Fi Marketplace */}
        <ShopTabs activeTab={activeTab} onTabChange={setActiveTab}>
          {/* Marketplace Catalog Header & Controls */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#eae2f8] pb-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#6825db]">
                  Live Smartphone Catalog
                </span>
                <h3 className="text-2xl font-black text-neutral-900">
                  Flagships Available on 0% EMI
                </h3>
              </div>

              {/* Search & Brand Filters */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Search input */}
                <div className="relative min-w-[220px]">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search phone model..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-full border border-[#eae2f8] bg-white text-xs font-medium focus:border-[#6825db] focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Brand Filter Pills */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
                  {["All", "Apple", "Samsung", "Google", "OnePlus", "Xiaomi", "Vivo", "iQOO"].map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        selectedBrand === brand
                          ? "bg-[#6825db] text-white shadow-sm shadow-[#6825db]/30"
                          : "bg-white border border-[#eae2f8] text-neutral-600 hover:bg-purple-50"
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isPending && (
              <div className="grid gap-6 pt-4 md:grid-cols-3">
                <ProductSkeleton />
                <ProductSkeleton />
                <ProductSkeleton />
              </div>
            )}

            {/* Error State */}
            {isError && (
              <ErrorState onRetry={() => refetch()} />
            )}

            {/* Empty State */}
            {!isPending && !isError && filteredProducts.length === 0 && (
              <EmptyState
                searchTerm={searchQuery || (selectedBrand !== "All" ? selectedBrand : undefined)}
                onReset={() => {
                  setSearchQuery("");
                  setSelectedBrand("All");
                }}
              />
            )}

            {/* Product Cards Grid */}
            {!isPending && !isError && filteredProducts.length > 0 && (
              <div className="grid gap-6 pt-4 md:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </ShopTabs>
      </section>

      {/* 4. EMI CALCULATOR SECTION */}
      <section id="calculator" className="scroll-mt-20 border-y border-[#eae2f8] bg-[#f5f0fc]/50 px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-5xl">
          <div className="text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-bold text-[#6825db]">
              <Calculator className="size-3.5" /> Mutual Fund EMI Calculator
            </span>
            <h2 className="mt-3 text-3xl font-black text-neutral-900 sm:text-4xl">
              Keep your money invested. Pay ₹0 interest.
            </h2>
            <p className="mt-3 text-sm text-neutral-600">
              When you use 1Fi, your mutual funds stay in your portfolio, continuing to earn compound interest while you enjoy your brand-new phone.
            </p>
          </div>

          <div className="mt-12 rounded-3xl border border-[#eae2f8] bg-white p-6 shadow-xl shadow-purple-950/5 sm:p-10 grid gap-8 lg:grid-cols-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div>
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-neutral-700">Smartphone Price</span>
                  <span className="text-xl font-black text-[#6825db]">{formatCurrency(calcPhonePrice)}</span>
                </div>
                <input
                  type="range"
                  min={50000}
                  max={200000}
                  step={5000}
                  value={calcPhonePrice}
                  onChange={(e) => setCalcPhonePrice(Number(e.target.value))}
                  className="w-full mt-3 accent-[#6825db] cursor-pointer"
                />
                <div className="flex justify-between text-xs text-neutral-400 mt-1">
                  <span>₹50,000</span>
                  <span>₹1,25,000</span>
                  <span>₹2,00,000</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-neutral-700 block mb-3">
                  Tenure Duration
                </label>
                <div className="grid grid-cols-4 gap-2.5">
                  {[3, 6, 9, 12].map((tenure) => (
                    <button
                      key={tenure}
                      onClick={() => setCalcTenure(tenure)}
                      className={`py-2.5 rounded-xl text-sm font-bold border transition-all cursor-pointer ${
                        calcTenure === tenure
                          ? "bg-[#6825db] text-white border-[#6825db] shadow-sm shadow-[#6825db]/30"
                          : "bg-[#faf8fe] border-[#eae2f8] text-neutral-700 hover:border-purple-300"
                      }`}
                    >
                      {tenure} Months
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-[#faf8fe] border border-[#eae2f8] p-4 flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-purple-100 text-[#6825db] shrink-0">
                  <TrendingUp className="size-5" />
                </div>
                <div className="text-xs text-neutral-600">
                  <strong>Estimated Investment Growth:</strong> Your mutual funds can generate an estimated{" "}
                  <span className="text-[#6825db] font-bold">~₹{Math.round(calcPhonePrice * 0.12 * (calcTenure / 12)).toLocaleString("en-IN")}</span> in returns during this tenure!
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl bg-gradient-to-br from-[#6825db] to-[#4e15b3] p-6 text-white text-center space-y-5 shadow-lg">
              <div>
                <span className="text-xs uppercase tracking-widest text-purple-200 font-bold">Your Monthly EMI</span>
                <div className="text-4xl font-black mt-1">
                  {formatCurrency(estimatedCalcMonthly)}
                  <span className="text-base font-normal text-purple-200">/mo</span>
                </div>
                <p className="text-xs text-purple-200 mt-1">0% No-Cost EMI for {calcTenure} months</p>
              </div>

              <div className="pt-4 border-t border-white/20 space-y-2 text-xs text-purple-100 text-left">
                <div className="flex justify-between">
                  <span>Interest Rate:</span>
                  <span className="font-bold text-white">0% APR</span>
                </div>
                <div className="flex justify-between">
                  <span>Credit Card Interest Saved:</span>
                  <span className="font-bold text-green-300">~₹{estimatedCardInterest.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Mutual Funds Sold:</span>
                  <span className="font-bold text-green-300">₹0 (100% Retained)</span>
                </div>
              </div>

              <button
                onClick={() => setShowEligibilityModal(true)}
                className="w-full bg-white hover:bg-neutral-100 text-[#6825db] font-bold py-3 rounded-xl transition-all shadow-md cursor-pointer"
              >
                Check My Portfolio Limit
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS SECTION */}
      <section id="how-it-works" className="mx-auto max-w-7xl scroll-mt-20 px-5 py-16 lg:px-8 lg:py-24">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.16em] text-[#6825db]">
            Simple by design
          </p>
          <h2 className="mt-2 text-3xl font-black text-neutral-900 sm:text-4xl">
            A smarter way to bring it home
          </h2>
          <p className="mt-3 text-sm text-neutral-600">
            Never liquidate your savings for consumer electronics. Three quick steps to zero-cost ownership.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Pick your smartphone",
              description:
                "Browse the live flagship catalog. Choose your favorite brand, color, storage capacity, and preferred monthly EMI plan.",
            },
            {
              step: "02",
              title: "Pledge via OTP",
              description:
                "Connect your existing mutual fund portfolio via secure CAMS / KFintech integration with zero paperwork and zero physical visits.",
            },
            {
              step: "03",
              title: "Enjoy 0% EMI & growth",
              description:
                "Your smartphone is shipped immediately. Your mutual funds remain in your account and keep compounding untouched.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="rounded-3xl border border-[#eae2f8] bg-white p-8 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
            >
              <div className="text-4xl font-black text-[#6825db]/20">{item.step}</div>
              <h3 className="mt-4 text-xl font-bold text-neutral-900">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. WHY 1FI / BENEFITS SECTION */}
      <section id="about" className="border-t border-[#eae2f8] bg-[#f5f0fc]/40 px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6825db]">Why 1Fi</span>
            <h2 className="mt-2 text-3xl font-black text-neutral-900 sm:text-4xl">
              Better than credit cards. Smarter than loans.
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "Zero Credit Score Barrier",
                copy: "No CIBIL or bureau history needed. Your verified mutual fund holdings guarantee your credit line.",
              },
              {
                icon: Database,
                title: "Mutual Funds Keep Compounding",
                copy: "You don't sell your units or pay capital gains taxes. Your investments stay 100% active in the market.",
              },
              {
                icon: Sparkles,
                title: "0% Interest & Instant Approvals",
                copy: "Enjoy genuine zero-cost EMIs on selected flagships, processed seamlessly in under two minutes.",
              },
            ].map(({ icon: Icon, title, copy }) => (
              <div
                key={title}
                className="rounded-2xl border border-[#eae2f8] bg-white p-7 shadow-xs hover:border-purple-300 transition-all"
              >
                <div className="grid size-12 place-items-center rounded-xl bg-purple-100 text-[#6825db]">
                  <Icon className="size-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-neutral-900">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-neutral-600">{copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FAQS SECTION */}
      <section id="faq" className="mx-auto max-w-4xl scroll-mt-20 px-5 py-16 lg:py-24">
        <div className="text-center mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-[#6825db]">Have questions?</span>
          <h2 className="mt-2 text-3xl font-black text-neutral-900 sm:text-4xl">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "Do I have to sell my mutual funds to buy a phone?",
              a: "Never! You are merely creating a lien on your mutual fund units via official RTAs (CAMS / KFintech). The units remain in your demat/folio and continue to gain market returns and dividends.",
            },
            {
              q: "Is a CIBIL score required for approval?",
              a: "No credit score is required. Because your credit line is backed by your actual mutual fund investments, approval is asset-backed and doesn't rely on traditional credit bureau scores.",
            },
            {
              q: "What happens once all EMI payments are completed?",
              a: "As soon as your last EMI is cleared, the lien on your mutual funds is automatically revoked within 24 business hours. Your funds remain entirely yours without ever being disturbed.",
            },
            {
              q: "Are the smartphones genuine and brand-new?",
              a: "Yes, 100% genuine sealed devices with full official manufacturer warranties (Apple, Samsung, Google) delivered through authorized brand distributors.",
            },
          ].map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={item.q}
                className="rounded-2xl border border-[#eae2f8] bg-white overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left font-bold text-neutral-900 hover:text-[#6825db] cursor-pointer"
                >
                  <span className="text-base sm:text-lg">{item.q}</span>
                  <ChevronDown
                    className={`size-5 text-neutral-400 transition-transform ${
                      isOpen ? "rotate-180 text-[#6825db]" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-neutral-600 leading-relaxed border-t border-[#eae2f8]/60 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. PARTNER & CONTACT SECTION */}
      <section id="partner" className="border-t border-[#eae2f8] bg-[#f5f0fc]/40 px-5 py-16 lg:px-8">
        <div className="mx-auto max-w-7xl grid gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-[#eae2f8] bg-white p-8 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6825db]">For Retailers & Brands</span>
            <h3 className="mt-2 text-2xl font-black text-neutral-900">Partner With 1Fi</h3>
            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
              Enable your consumers to purchase premium smartphones and electronics using their mutual funds. Boost basket size and conversion with zero-risk financing.
            </p>
            <div className="mt-6">
              <a
                href="mailto:partners@1fi.in"
                className="inline-flex items-center gap-2 rounded-xl bg-[#6825db] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#581ec2] transition-colors"
              >
                Become a Partner <ArrowRight className="size-4" />
              </a>
            </div>
          </div>

          <div id="contact" className="rounded-3xl border border-[#eae2f8] bg-white p-8 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6825db]">Support & Inquiries</span>
            <h3 className="mt-2 text-2xl font-black text-neutral-900">Get in Touch</h3>
            <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
              Have questions about your mutual fund eligibility or ongoing EMI schedule? Our financial support specialists are ready to assist you.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-sm font-semibold text-neutral-800">
              <a href="mailto:support@1fi.in" className="hover:text-[#6825db] flex items-center gap-1.5">
                support@1fi.in
              </a>
              <span className="text-neutral-300">•</span>
              <a href="tel:+918000101111" className="hover:text-[#6825db] flex items-center gap-1.5">
                +91 80001 01111
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 9. FOOTER */}
      <footer className="border-t border-[#eae2f8] bg-white px-5 py-10 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 text-sm text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-7 items-center justify-center rounded-lg bg-[#6825db] text-white font-bold text-xs">
              1Fi
            </div>
            <span className="font-bold text-neutral-900">1Fi Technologies</span>
            <span className="hidden sm:inline text-neutral-300">|</span>
            <span className="text-xs">Smartphones backed by mutual funds</span>
          </div>
          <div className="flex flex-wrap gap-6 text-xs text-neutral-600">
            <a href="#catalog" className="hover:text-[#6825db]">Shop</a>
            <a href="#calculator" className="hover:text-[#6825db]">Calculator</a>
            <a href="#faq" className="hover:text-[#6825db]">FAQs</a>
            <a href="#partner" className="hover:text-[#6825db]">Partner</a>
          </div>
          <span className="text-xs text-neutral-400">© 2026 1Fi Inc. All rights reserved.</span>
        </div>
      </footer>

      {/* 10. FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/918000101111?text=Hi%201Fi,%20I'd%20like%20to%20learn%20more%20about%20mutual%20fund%20backed%20EMIs"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-[#00d26a] text-white shadow-xl shadow-green-600/35 hover:scale-110 hover:bg-[#00be5f] active:scale-95 transition-all"
        aria-label="Chat with 1Fi support on WhatsApp"
      >
        <svg className="size-7 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </a>

      {/* 11. CHECK ELIGIBILITY MODAL */}
      {showEligibilityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl border border-[#eae2f8] bg-white p-6 shadow-2xl sm:p-8">
            <button
              onClick={() => {
                setShowEligibilityModal(false);
                setEligibilitySubmitted(false);
              }}
              className="absolute right-5 top-5 grid size-8 place-items-center rounded-full text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 transition-colors cursor-pointer"
            >
              <X className="size-5" />
            </button>

            {!eligibilitySubmitted ? (
              <div className="space-y-5">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-[#6825db]">
                    <Sparkles className="size-3" /> Instant Pre-Approval
                  </span>
                  <h3 className="mt-2 text-2xl font-black text-neutral-900">
                    Check Your 1Fi Credit Limit
                  </h3>
                  <p className="mt-1 text-xs text-neutral-500">
                    Calculated instantly based on your mutual fund portfolio. No credit impact.
                  </p>
                </div>

                <div className="rounded-2xl bg-[#faf8fe] border border-[#eae2f8] p-4 space-y-3">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-neutral-700">Estimated MF Value:</span>
                    <span className="text-xl font-black text-[#6825db]">{formatCurrency(mfValue)}</span>
                  </div>
                  <input
                    type="range"
                    min={50000}
                    max={1000000}
                    step={25000}
                    value={mfValue}
                    onChange={(e) => setMfValue(Number(e.target.value))}
                    className="w-full accent-[#6825db] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-neutral-400">
                    <span>₹50K</span>
                    <span>₹5 Lakhs</span>
                    <span>₹10 Lakhs+</span>
                  </div>
                </div>

                <div className="rounded-2xl bg-purple-50 border border-purple-200/80 p-4 text-center">
                  <span className="text-xs uppercase font-bold tracking-wider text-[#6825db]">
                    Eligible 0% EMI Purchasing Limit
                  </span>
                  <div className="text-3xl font-black text-neutral-900 mt-1">
                    {formatCurrency(eligibility.creditLimit)}
                  </div>
                  <p className="text-xs text-neutral-600 mt-1">
                    Sufficient for any flagship phone (iPhone 17 Pro, Galaxy S25 Ultra, Pixel 10 Pro)
                  </p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 block">
                    Enter Mobile Number or PAN
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210 or ABCDE1234F"
                    value={panPhone}
                    onChange={(e) => setPanPhone(e.target.value)}
                    className="w-full rounded-xl border border-[#eae2f8] px-4 py-3 text-sm focus:border-[#6825db] focus:outline-none focus:ring-2 focus:ring-[#6825db]/20 font-medium"
                  />
                  <Button
                    onClick={() => {
                      if (panPhone.trim().length >= 4) {
                        setEligibilitySubmitted(true);
                      } else {
                        alert("Please enter a valid mobile number or PAN to fetch eligibility");
                      }
                    }}
                    className="w-full rounded-xl bg-[#6825db] hover:bg-[#581ec2] text-white font-bold py-3 text-sm transition-all cursor-pointer"
                  >
                    View Pre-Approved Flagship Offers
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-6 text-center space-y-4">
                <div className="mx-auto grid size-16 place-items-center rounded-full bg-green-100 text-green-600">
                  <Check className="size-8 stroke-[3]" />
                </div>
                <h3 className="text-2xl font-black text-neutral-900">
                  Congratulations!
                </h3>
                <p className="text-sm text-neutral-600 max-w-sm mx-auto">
                  You are eligible for up to <strong className="text-neutral-900 font-black">{formatCurrency(eligibility.creditLimit)}</strong> in 0% interest EMI backed by your mutual funds.
                </p>
                <div className="pt-2">
                  <a
                    href="#catalog"
                    onClick={() => setShowEligibilityModal(false)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#6825db] px-6 py-3 font-bold text-white shadow-md hover:bg-[#581ec2] w-full cursor-pointer"
                  >
                    Choose Your Phone Now <ArrowRight className="size-4" />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}