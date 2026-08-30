export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatPriceWithDecimals(price: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export function getStockStatus(stockQuantity: number): {
  label: string;
  color: string;
} {
  if (stockQuantity === 0) {
    return { label: "Out of Stock", color: "red" };
  }
  if (stockQuantity <= 5) {
    return { label: "Low Stock", color: "amber" };
  }
  return { label: "In Stock", color: "emerald" };
}