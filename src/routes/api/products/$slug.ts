import { createFileRoute } from "@tanstack/react-router";
import products from "@/mocks/products.json";

export const Route = createFileRoute("/api/products/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const product = products.find((p: any) => p.slug === params.slug);
        if (!product) {
          return Response.json({ error: "Product not found" }, { status: 404 });
        }
        return Response.json(product);
      },
    },
  },
});