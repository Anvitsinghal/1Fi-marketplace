CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  brand TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Smartphones',
  badge TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon;
GRANT SELECT ON public.products TO authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_name TEXT NOT NULL,
  color TEXT NOT NULL,
  storage TEXT NOT NULL,
  mrp NUMERIC(12,2) NOT NULL,
  price NUMERIC(12,2) NOT NULL,
  image_url TEXT NOT NULL,
  color_hex TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(product_id, variant_name)
);
GRANT SELECT ON public.product_variants TO anon;
GRANT SELECT ON public.product_variants TO authenticated;
GRANT ALL ON public.product_variants TO service_role;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view product variants" ON public.product_variants FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.emi_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
  tenure_months INTEGER NOT NULL,
  monthly_amount NUMERIC(12,2) NOT NULL,
  interest_rate NUMERIC(5,2) NOT NULL,
  cashback NUMERIC(12,2) NOT NULL DEFAULT 0,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(variant_id, tenure_months)
);
GRANT SELECT ON public.emi_plans TO anon;
GRANT SELECT ON public.emi_plans TO authenticated;
GRANT ALL ON public.emi_plans TO service_role;
ALTER TABLE public.emi_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view EMI plans" ON public.emi_plans FOR SELECT TO anon, authenticated USING (true);

CREATE INDEX product_variants_product_id_idx ON public.product_variants(product_id);
CREATE INDEX emi_plans_variant_id_idx ON public.emi_plans(variant_id);

CREATE OR REPLACE FUNCTION public.update_catalog_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_catalog_updated_at();
CREATE TRIGGER product_variants_updated_at BEFORE UPDATE ON public.product_variants FOR EACH ROW EXECUTE FUNCTION public.update_catalog_updated_at();
CREATE TRIGGER emi_plans_updated_at BEFORE UPDATE ON public.emi_plans FOR EACH ROW EXECUTE FUNCTION public.update_catalog_updated_at();

INSERT INTO public.products (id, slug, brand, name, description, category, badge) VALUES
  ('10000000-0000-4000-8000-000000000001', 'iphone-17-pro', 'Apple', 'iPhone 17 Pro', 'A pro camera system, aerospace-grade design and next-generation performance.', 'Smartphones', 'New launch'),
  ('10000000-0000-4000-8000-000000000002', 'galaxy-s25-ultra', 'Samsung', 'Galaxy S25 Ultra', 'A titanium-crafted flagship with an immersive display and intelligent camera.', 'Smartphones', 'Bestseller'),
  ('10000000-0000-4000-8000-000000000003', 'pixel-10-pro', 'Google', 'Pixel 10 Pro', 'Pure Android with a pro-grade camera and helpful AI built in.', 'Smartphones', 'AI flagship');

INSERT INTO public.product_variants (id, product_id, variant_name, color, storage, mrp, price, image_url, color_hex) VALUES
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Deep Blue · 256 GB', 'Deep Blue', '256 GB', 134900, 119999, '/images/iphone-17-pro.jpg', '#25344A'),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'Silver · 512 GB', 'Silver', '512 GB', 154900, 139999, '/images/iphone-17-pro-silver.jpg', '#D7D8DA'),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000002', 'Titanium Black · 256 GB', 'Titanium Black', '256 GB', 129999, 109999, '/images/galaxy-s25-ultra.jpg', '#252629'),
  ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 'Titanium Silver · 512 GB', 'Titanium Silver', '512 GB', 149999, 129999, '/images/galaxy-s25-ultra-silver.jpg', '#BFC3C7'),
  ('20000000-0000-4000-8000-000000000005', '10000000-0000-4000-8000-000000000003', 'Obsidian · 256 GB', 'Obsidian', '256 GB', 109999, 94999, '/images/pixel-10-pro.jpg', '#24211F'),
  ('20000000-0000-4000-8000-000000000006', '10000000-0000-4000-8000-000000000003', 'Porcelain · 512 GB', 'Porcelain', '512 GB', 129999, 114999, '/images/pixel-10-pro-porcelain.jpg', '#E7E0D5');

INSERT INTO public.emi_plans (variant_id, tenure_months, monthly_amount, interest_rate, cashback, featured) VALUES
  ('20000000-0000-4000-8000-000000000001', 3, 40000, 0, 2000, false),
  ('20000000-0000-4000-8000-000000000001', 6, 20000, 0, 3000, true),
  ('20000000-0000-4000-8000-000000000001', 9, 13750, 10.5, 3500, false),
  ('20000000-0000-4000-8000-000000000002', 3, 46667, 0, 2500, false),
  ('20000000-0000-4000-8000-000000000002', 6, 23333, 0, 4000, true),
  ('20000000-0000-4000-8000-000000000002', 12, 11667, 10.5, 5000, false),
  ('20000000-0000-4000-8000-000000000003', 3, 36667, 0, 2000, false),
  ('20000000-0000-4000-8000-000000000003', 6, 18333, 0, 3000, true),
  ('20000000-0000-4000-8000-000000000003', 12, 9167, 10.5, 4000, false),
  ('20000000-0000-4000-8000-000000000004', 3, 43333, 0, 2500, false),
  ('20000000-0000-4000-8000-000000000004', 6, 21667, 0, 3500, true),
  ('20000000-0000-4000-8000-000000000004', 12, 10833, 10.5, 4500, false),
  ('20000000-0000-4000-8000-000000000005', 3, 31667, 0, 1500, false),
  ('20000000-0000-4000-8000-000000000005', 6, 15833, 0, 2500, true),
  ('20000000-0000-4000-8000-000000000005', 12, 7917, 10.5, 3500, false),
  ('20000000-0000-4000-8000-000000000006', 3, 38333, 0, 1800, false),
  ('20000000-0000-4000-8000-000000000006', 6, 19167, 0, 3000, true),
  ('20000000-0000-4000-8000-000000000006', 12, 9583, 10.5, 4000, false);