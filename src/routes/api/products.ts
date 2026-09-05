import { createFileRoute } from "@tanstack/react-router";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY || "";

const supabase = createClient(supabaseUrl, supabaseKey);

export const Route = createFileRoute("/api/products")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const { data: products, error } = await supabase
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
            console.error("Supabase error:", error);
            return new Response(JSON.stringify({ error: error.message }), {
              status: 500,
              headers: { "Content-Type": "application/json" },
            });
          }

          return Response.json(products);
        } catch (err: any) {
          console.error("Unexpected error:", err);
          return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
      },
    },
  },
});