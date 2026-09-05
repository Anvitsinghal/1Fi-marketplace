import React from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import type { Product } from "@/types/marketplace";
import { PriceDisplay } from "@/components/marketplace/PriceDisplay";

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const variant = product.variants?.[0];
  if (!variant) return null;

  const currentPrice = Number(variant.price);
  const originalPrice = Number(
    variant.original_price || variant.mrp || Math.round(variant.price * 1.08)
  );
  const monthlyEmi = Math.round(currentPrice / 6);

  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-[#eae2f8] bg-white transition-all hover:-translate-y-1.5 hover:border-[#6825db]/40 hover:shadow-xl hover:shadow-purple-950/5 relative"
    >
      {/* Image Area */}
      <div className="relative flex h-72 sm:h-80 items-center justify-center overflow-hidden bg-gradient-to-b from-[#f9f7fd] to-[#f4effc] p-6">
        {product.badge && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#6825db] shadow-xs border border-purple-200/60 backdrop-blur-xs">
            {product.badge}
          </span>
        )}

        <span className="absolute right-4 top-4 z-10 inline-flex items-center gap-1 rounded-full bg-purple-100/90 px-2.5 py-0.5 text-[10px] font-bold text-[#6825db]">
          <Sparkles className="size-2.5" /> 0% EMI
        </span>

        <img
          src={variant.image_url}
          alt={`${product.name} ${variant.color}`}
          width={912}
          height={1104}
          loading="lazy"
          className="h-full w-auto max-w-[75%] object-contain transition-transform duration-500 group-hover:scale-105 drop-shadow-md"
        />
      </div>

      {/* Content Area */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#6825db]">
              {product.brand}
            </span>
            {/* Color preview dots */}
            <div className="flex items-center gap-1">
              {product.variants.slice(0, 3).map((v) => (
                <span
                  key={v.id}
                  className="size-2.5 rounded-full border border-neutral-300"
                  style={{ backgroundColor: v.color_hex || "#888" }}
                  title={v.color}
                />
              ))}
              {product.variants.length > 3 && (
                <span className="text-[10px] text-neutral-400 font-medium">
                  +{product.variants.length - 3}
                </span>
              )}
            </div>
          </div>

          <h3 className="mt-1 text-xl font-black tracking-tight text-neutral-900 group-hover:text-[#6825db] transition-colors">
            {product.name}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-neutral-500">
            {product.description}
          </p>
        </div>

        {/* Pricing & CTA */}
        <div className="mt-6 pt-4 border-t border-[#eae2f8]/70 flex items-end justify-between gap-3">
          <PriceDisplay
            currentPrice={currentPrice}
            originalPrice={originalPrice}
            monthlyEmi={monthlyEmi}
            size="sm"
          />

          <span className="grid size-10 place-items-center rounded-full bg-[#6825db] text-white shadow-sm shadow-[#6825db]/20 transition-transform group-hover:translate-x-1 group-hover:bg-[#581ec2]">
            <ArrowRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
};
