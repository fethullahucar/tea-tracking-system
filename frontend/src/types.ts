export interface Customer {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  created_at?: string;
  total_teas?: number;
  last_tea_date?: string;
}

export interface TeaRecord {
  id?: number;
  customer_id: number;
  tea_count: number;
  notes?: string;
  created_at?: string;
  customer_name?: string;
}

export interface DashboardStats {
  totalTeas: number;
  totalCustomers: number;
  todayTeas: number;
  topCustomers: Array<{
    name: string;
    total_teas: number;
  }>;
}
