import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/products/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const { data: product, error: productError } = await supabaseAdmin.from("products").select("id, slug, brand, name, description, badge").eq("slug", params.slug).maybeSingle();
        if (productError) return Response.json({ error: productError.message }, { status: 500 });
        if (!product) return Response.json({ error: "Product not found" }, { status: 404 });
        const { data: variants, error: variantError } = await supabaseAdmin.from("product_variants").select("*").eq("product_id", product.id).order("price", { ascending: true });
        if (variantError) return Response.json({ error: variantError.message }, { status: 500 });
        const variantIds = (variants ?? []).map((variant) => variant.id);
        const { data: plans, error: planError } = await supabaseAdmin.from("emi_plans").select("*").in("variant_id", variantIds).order("tenure_months", { ascending: true });
        if (planError) return Response.json({ error: planError.message }, { status: 500 });
        return Response.json({ ...product, variants: (variants ?? []).map((variant) => ({ ...variant, emi_plans: (plans ?? []).filter((plan) => plan.variant_id === variant.id) })) });
      },
    },
  },
});