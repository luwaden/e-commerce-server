export enum UserRole {
  Admin = "admin",
  Shopper = "shopper",
}

export enum OrderStatus {
  Processing = "processing",
  Shipped = "shipped",
  Delivered = "delivered",
  Cancelled = "cancelled",
}

export enum PaymentStatus {
  Success = "success",
  Pending = "pending",
  Failed = "failed",
}
