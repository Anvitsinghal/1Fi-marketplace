import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, ChevronDown, Database, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@supabase/supabase-js";
type Variant = {
  id: string;
  variant_name?: string;
  color: string;
  storage: string;
  price: number;
  mrp?: number;
  original_price?: number;
  image_url: string;
};

type Product = {
  id: string;
  slug: string;
  brand: string;
  name: string;
  description: string;
  badge: string | null;
  variants: Variant[];
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "1Fi — Smartphones on flexible EMI" },
      { name: "description", content: "Shop flagship smartphones with flexible EMI plans backed by mutual funds on 1Fi." },
      { property: "og:title", content: "1Fi — Smartphones on flexible EMI" },
      { property: "og:description", content: "Compare flagship smartphones and choose a flexible EMI plan with 1Fi." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const supabase = createClient(
  "https://cxkzjkkeiasdzdryawzw.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4a3pqa2tlaWFzZHpkcnlhd3p3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0MjE4NDksImV4cCI6MjEwMzk5Nzg0OX0.gH3XY6IWfk2kWYvISgKQ3Zo8c9p8H2I374UfoI5KPRM"
);

async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select(`
      id,
      slug,
      brand,
      name,
      description,
      badge,
      variants:product_variants (
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
    `);

  if (error) {
    console.error("Direct Supabase Error:", error);
    throw error;
  }

  return (data as any) || [];
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

function HomePage() {
  const { data: products, isPending, isError } = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border/70 bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5" aria-label="1Fi home">
            <span className="grid size-9 place-items-center rounded-xl bg-brand text-brand-foreground shadow-sm">
              <span className="text-lg font-black tracking-tight">1</span>
            </span>
            <span className="text-xl font-black tracking-[-0.04em] text-foreground">1Fi</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm font-medium text-muted-foreground md:flex">
            <a href="#catalog" className="transition-colors hover:text-foreground">Shop phones</a>
            <a href="#how-it-works" className="transition-colors hover:text-foreground">How it works</a>
            <a href="#benefits" className="transition-colors hover:text-foreground">Why 1Fi</a>
          </nav>
          <Button variant="outline" className="hidden border-brand/30 text-brand hover:bg-brand/5 sm:inline-flex">Get started <ArrowRight /></Button>
          <Button variant="ghost" size="icon" className="sm:hidden" aria-label="Open menu"><ChevronDown /></Button>
        </div>
      </header>

      <section className="border-b border-border/70 bg-soft px-5 py-16 lg:px-8 lg:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-background px-3.5 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand">
              <Sparkles className="size-3.5" /> Own more. Pay smarter.
            </div>
            <h1 className="text-balance text-5xl font-black leading-[0.98] tracking-[-0.06em] text-foreground sm:text-7xl">
              Your next phone, <span className="text-brand">made possible.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground sm:text-xl">
              Bring home the latest flagship phones with simple monthly plans and rewards that keep your money working.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-xl bg-brand px-6 text-brand-foreground shadow-lg shadow-brand/15 hover:bg-brand/90">
                <a href="#catalog">Explore phones <ArrowRight /></a>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-xl border-border bg-background px-6">
                <a href="#how-it-works">See how it works</a>
              </Button>
            </div>
            <div className="mt-12 flex flex-wrap gap-x-7 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Check className="size-4 text-brand" /> Zero-cost plans available</span>
              <span className="flex items-center gap-2"><Check className="size-4 text-brand" /> No hidden charges</span>
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-lg lg:justify-self-end">
            <div className="absolute inset-x-8 bottom-2 h-10 rounded-[50%] bg-brand/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-background p-6 shadow-xl shadow-foreground/5 sm:p-10">
              <div className="mb-8 flex items-center justify-between text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
                <span>Featured this week</span><span className="text-brand">1Fi pick</span>
              </div>
              <div className="grid grid-cols-[0.78fr_1.22fr] items-center gap-5">
                <img src="/images/iphone-17-pro.jpg" alt="iPhone 17 Pro in deep blue" width={912} height={1104} className="h-72 w-full object-cover object-center sm:h-96" />
                <div>
                  <p className="text-sm font-semibold text-muted-foreground">Apple</p>
                  <h2 className="mt-1 text-2xl font-black tracking-tight text-foreground">iPhone 17 Pro</h2>
                  <p className="mt-5 text-sm text-muted-foreground">Starting from</p>
                  <p className="mt-1 text-3xl font-black tracking-tight text-brand">₹20,000<span className="text-base font-semibold text-muted-foreground">/mo</span></p>
                  <p className="mt-1 text-xs text-muted-foreground">on a 6 month plan</p>
                  <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-brand/10 px-3 py-2 text-xs font-bold text-brand"><Sparkles className="size-3.5" /> ₹3,000 cashback</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" className="mx-auto max-w-7xl scroll-mt-8 px-5 py-16 lg:px-8 lg:py-24">
        <div className="flex flex-col justify-between gap-4 border-b border-border pb-7 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-brand">The 1Fi collection</p>
            <h2 className="mt-2 text-3xl font-black tracking-[-0.04em] text-foreground sm:text-4xl">Flagships. Flexible plans.</h2>
          </div>
          <p className="max-w-sm text-sm leading-6 text-muted-foreground">All prices, images and plans are loaded live from the product catalog API.</p>
        </div>
        {isPending && <div className="grid gap-6 pt-8 md:grid-cols-3"><ProductSkeleton /><ProductSkeleton /><ProductSkeleton /></div>}
        {isError && <div className="py-16 text-center text-muted-foreground">We couldn’t load the catalog right now. Please refresh and try again.</div>}
        {products && <div className="grid gap-6 pt-8 md:grid-cols-3">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
      </section>

      <section id="how-it-works" className="border-y border-border/70 bg-foreground px-5 py-16 text-background lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-xl"><p className="text-sm font-bold uppercase tracking-[0.16em] text-brand-light">Simple by design</p><h2 className="mt-3 text-3xl font-black tracking-[-0.04em] sm:text-4xl">A smarter way to bring it home.</h2></div>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {[{ n: "01", title: "Pick your phone", copy: "Choose your model, colour and storage from our live catalog." }, { n: "02", title: "Choose a plan", copy: "Compare monthly payments, tenure, interest and cashback in one view." }, { n: "03", title: "Get moving", copy: "Proceed with the plan that fits your life and keep your savings invested." }].map((step) => <div key={step.n} className="border-t border-background/20 pt-5"><p className="text-sm font-bold text-brand-light">{step.n}</p><h3 className="mt-8 text-xl font-bold">{step.title}</h3><p className="mt-3 max-w-xs text-sm leading-6 text-background/65">{step.copy}</p></div>)}
          </div>
        </div>
      </section>

      <section id="benefits" className="mx-auto grid max-w-7xl gap-10 px-5 py-16 sm:grid-cols-3 lg:px-8 lg:py-20">
        {[{ icon: ShieldCheck, title: "Clear, upfront plans", copy: "See your monthly amount and total cost before you choose." }, { icon: Database, title: "Built around your money", copy: "Plans are designed to help you keep your investments working." }, { icon: Sparkles, title: "Rewards on the way", copy: "Selected plans come with cashback to make the deal even better." }].map(({ icon: Icon, title, copy }) => <div key={title} className="flex gap-4"><div className="grid size-11 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand"><Icon className="size-5" /></div><div><h3 className="font-bold text-foreground">{title}</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p></div></div>)}
      </section>

      <footer className="border-t border-border bg-soft px-5 py-8 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"><span className="font-bold text-foreground">1Fi</span><span>Flexible finance for things you love.</span><span>© 2026 1Fi Technologies</span></div></footer>
    </main>
  );
}

function ProductCard({ product }: { product: Product }) {
  const variant = product.variants?.[0];
  if (!variant) return null;

  const originalPrice = Number((variant as any).original_price || variant.mrp || Math.round(variant.price * 1.05));
  const currentPrice = Number(variant.price);
  const discount = originalPrice > currentPrice ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 5;

  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      className="group overflow-hidden rounded-2xl border border-border bg-background transition-all hover:-translate-y-1 hover:border-brand/35 hover:shadow-xl hover:shadow-foreground/5"
    >
      <div className="relative flex h-80 items-center justify-center overflow-hidden bg-soft p-6">
        {product.badge && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-background px-3 py-1.5 text-xs font-bold text-brand shadow-sm">
            {product.badge}
          </span>
        )}
        <img
          src={variant.image_url}
          alt={`${product.name} ${variant.color}`}
          width={912}
          height={1104}
          loading="lazy"
          className="h-full w-auto max-w-[72%] object-contain transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <p className="text-sm font-semibold text-muted-foreground">{product.brand}</p>
        <h3 className="mt-1 text-xl font-black tracking-tight text-foreground">{product.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">{product.description}</p>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <span className="text-xl font-black text-foreground">{formatCurrency(currentPrice)}</span>
            <span className="ml-2 text-sm text-muted-foreground line-through">{formatCurrency(originalPrice)}</span>
            <p className="mt-1 text-xs font-bold text-brand">Up to {discount}% off</p>
          </div>
          <span className="grid size-9 place-items-center rounded-full bg-brand text-brand-foreground transition-transform group-hover:translate-x-1">
            <ArrowRight className="size-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ProductSkeleton() { return <div className="h-[500px] animate-pulse rounded-2xl border border-border bg-muted" />; }