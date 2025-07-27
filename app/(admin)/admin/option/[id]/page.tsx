// serverComponent.tsx
"use server";

import { NullableProduct } from "@/types/type";
import { getCachedProduct } from "./actions";
import AddOptionDetailpage from "./components/AddOptionDetailpage";

export default async function OptionDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = await getCachedProduct(+params.id);
  return (
    <AddOptionDetailpage params={params} product={product as NullableProduct} />
  );
}
