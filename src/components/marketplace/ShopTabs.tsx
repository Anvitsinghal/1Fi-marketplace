import React from "react";
import type { ShopTabId } from "@/types/marketplace";
import { Sparkles, Store, Building2, MapPin, CheckCircle2, ArrowRight } from "lucide-react";

interface ShopTabsProps {
  activeTab: ShopTabId;
  onTabChange: (tab: ShopTabId) => void;
  children: React.ReactNode;
}

export const ShopTabs: React.FC<ShopTabsProps> = ({
  activeTab,
  onTabChange,
  children,
}) => {
  return (
    <div className="w-full">
      {/* 3-Tab Segmented Switcher */}
      <div className="mx-auto max-w-xl p-1.5 rounded-2xl bg-white border border-[#eae2f8] shadow-xs flex items-center gap-1.5 mb-10">
        <button
          onClick={() => onTabChange("brands")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "brands"
              ? "bg-[#6825db] text-white shadow-sm shadow-[#6825db]/25"
              : "text-neutral-600 hover:text-[#6825db] hover:bg-purple-50/50"
          }`}
        >
          <Building2 className="size-4 shrink-0" />
          <span>Top Brands</span>
        </button>

        <button
          onClick={() => onTabChange("stores")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "stores"
              ? "bg-[#6825db] text-white shadow-sm shadow-[#6825db]/25"
              : "text-neutral-600 hover:text-[#6825db] hover:bg-purple-50/50"
          }`}
        >
          <Store className="size-4 shrink-0" />
          <span>Nearby Stores</span>
        </button>

        <button
          onClick={() => onTabChange("marketplace")}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            activeTab === "marketplace"
              ? "bg-[#6825db] text-white shadow-sm shadow-[#6825db]/25"
              : "text-neutral-600 hover:text-[#6825db] hover:bg-purple-50/50"
          }`}
        >
          <Sparkles className="size-4 shrink-0" />
          <span>1Fi Marketplace</span>
          <span className="hidden sm:inline-block size-2 rounded-full bg-green-400 animate-pulse" />
        </button>
      </div>

      {/* Tab 1: Top Brands Placeholder / Explore */}
      {activeTab === "brands" && (
        <div className="rounded-3xl border border-[#eae2f8] bg-white p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6 shadow-xs animate-in fade-in zoom-in duration-200">
          <div className="grid size-14 place-items-center rounded-2xl bg-purple-100 text-[#6825db] mx-auto">
            <Building2 className="size-7" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6825db]">
              Official OEM Partnerships
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-neutral-900">
              Top Smartphone Brands on 1Fi
            </h3>
            <p className="text-sm text-neutral-500 max-w-lg mx-auto">
              We partner directly with leading smartphone manufacturers to offer zero-cost EMIs backed by your mutual funds with full manufacturer warranty.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
            {[
              { name: "Apple", desc: "iPhone 17 Pro, 16 Series", flag: "Official Partner" },
              { name: "Samsung", desc: "Galaxy S25 Ultra, Fold6", flag: "Official Partner" },
              { name: "Google", desc: "Pixel 10 Pro, 9 Series", flag: "Official Partner" },
              { name: "OnePlus", desc: "13 & Open Series", flag: "Coming Soon" },
            ].map((b) => (
              <div
                key={b.name}
                onClick={() => onTabChange("marketplace")}
                className="rounded-2xl border border-[#eae2f8] bg-[#faf8fe] p-4 text-center hover:border-[#6825db] transition-all cursor-pointer group"
              >
                <div className="font-black text-lg text-neutral-900 group-hover:text-[#6825db]">
                  {b.name}
                </div>
                <div className="text-[11px] text-neutral-500 mt-1">{b.desc}</div>
                <div className="mt-3 inline-block text-[10px] font-bold text-[#6825db] bg-purple-100 px-2 py-0.5 rounded-full">
                  {b.flag}
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={() => onTabChange("marketplace")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#6825db] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#581ec2] transition-colors cursor-pointer"
            >
              Explore Products in 1Fi Marketplace <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 2: Nearby Stores Placeholder / Explore */}
      {activeTab === "stores" && (
        <div className="rounded-3xl border border-[#eae2f8] bg-white p-8 sm:p-12 text-center max-w-3xl mx-auto space-y-6 shadow-xs animate-in fade-in zoom-in duration-200">
          <div className="grid size-14 place-items-center rounded-2xl bg-purple-100 text-[#6825db] mx-auto">
            <Store className="size-7" />
          </div>
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#6825db]">
              Offline Store Pickup
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-neutral-900">
              500+ Partner Retail Stores
            </h3>
            <p className="text-sm text-neutral-500 max-w-lg mx-auto">
              Scan & pay with 1Fi Mutual Fund EMI at retail outlets across Mumbai, Bengaluru, Delhi NCR, and 20+ major cities.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 pt-2">
            {[
              {
                partner: "Croma Retail",
                city: "All Metros",
                benefit: "Instant In-Store QR Pledge",
              },
              {
                partner: "Reliance Digital",
                city: "120+ Outlets",
                benefit: "0% Interest on Flagships",
              },
              {
                partner: "Apple Authorized Resellers",
                city: "Imagine / Aptronix",
                benefit: "Same-Day Device Pickup",
              },
            ].map((store) => (
              <div
                key={store.partner}
                className="rounded-2xl border border-[#eae2f8] bg-[#faf8fe] p-5 text-left space-y-2"
              >
                <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-medium">
                  <MapPin className="size-3.5 text-[#6825db]" />
                  <span>{store.city}</span>
                </div>
                <h4 className="font-bold text-neutral-900">{store.partner}</h4>
                <div className="flex items-center gap-1.5 text-xs text-[#6825db] font-semibold">
                  <CheckCircle2 className="size-3.5" />
                  <span>{store.benefit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4">
            <button
              onClick={() => onTabChange("marketplace")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#6825db] px-6 py-3 text-sm font-bold text-white shadow-md hover:bg-[#581ec2] transition-colors cursor-pointer"
            >
              Order Online with Free Delivery <ArrowRight className="size-4" />
            </button>
          </div>
        </div>
      )}

      {/* Tab 3: 1Fi Marketplace (Full Live Implementation) */}
      {activeTab === "marketplace" && (
        <div className="animate-in fade-in duration-200">
          {children}
        </div>
      )}
    </div>
  );
};
