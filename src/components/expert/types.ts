
export interface Service {
  service_uuid: string;
  name: string;
  description: string;
  price: number;
  features: string[];
  type: string;
  monthly_recurring_revenue: number;
  revenue_amount: number;
  active_subscriptions_count: number;
  created_at: string;
}
