export interface Order {
  id?: string;
  orderNo: string;
  productId: string;
  quantity: number | null;
  salePrice: number | null;
  discount: number | null;
  totalAmount: number | null;
}
