export interface OrderPayment {
  amount: number;
}

export interface OrderCustomer {
  email: string;
}

export interface Order {
  id: string;
  createdAt: string;
  status?: string;
  payment: OrderPayment;
  customer: OrderCustomer;
  [key: string]: unknown;
}

export declare function generateMockOrders(count: number): Order[];
