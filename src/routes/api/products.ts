import { createFileRoute } from "@tanstack/react-router";
import products from "@/mocks/products.json";

export const Route = createFileRoute("/api/products")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(products);
      },
    },
  },
});