"use server";
import { notFound } from "next/navigation";
import ProductDetailClient from "./components/ProductDetailClient";
import { grapeProducts } from "@/static/data";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = grapeProducts.find((p) => p.id === Number(params.id));
  return { title: product?.title ?? "상품 상세" };
}

export async function generateStaticParams() {
  return grapeProducts.map((p) => ({ id: String(p.id) }));
}

// 기존 캐시 함수들은 productlist 등 다른 곳에서 사용 중이므로 유지
import db from "@/lib/db";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";

export const getCachedProduct = nextCache(getProduct, ["product-detail"], {
  tags: ["product-detail"],
});
export const getCachedProducts = nextCache(getProducts, ["products"], {
  tags: ["products"],
});

export async function getProduct(id: number) {
  return db.product.findUnique({
    where: { id },
    include: {
      user: true,
      productPicture: { include: { slideimages: true } },
      productoption: true,
    },
  });
}

export async function getProducts() {
  return db.product.findMany({
    include: {
      productPicture: { include: { slideimages: true } },
      _count: { select: { productoption: true, cart: true } },
    },
  });
}

export default async function ProductDetail({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (isNaN(id)) return notFound();

  const product = grapeProducts.find((p) => p.id === id);
  if (!product) return notFound();

  revalidateTag("products");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ProductDetailClient product={product as any} />;
}
