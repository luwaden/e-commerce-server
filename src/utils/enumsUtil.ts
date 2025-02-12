export enum UserRole {
  Admin = "admin",
  Shopper = "shopper",
}

export enum OrderStatus {
  Processing = "processing",
  Pending = "pending",
  Shipped = "shipped",
  Delivered = "delivered",
  Cancelled = "cancelled",
  Refunded = "Refunded",
}

export enum PaymentStatus {
  Success = "success",
  Pending = "pending",
  Failed = "failed",
  Refunded = "Refunded",
}
