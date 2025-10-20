import axios from 'axios';
import { Customer, TeaRecord, DashboardStats } from './types';

const API_BASE = '/api';

export const customerAPI = {
  getAll: () => axios.get<Customer[]>(`${API_BASE}/customers`),
  getById: (id: number) => axios.get<Customer>(`${API_BASE}/customers/${id}`),
  search: (query: string) => axios.get<Customer[]>(`${API_BASE}/customers/search?q=${query}`),
  create: (customer: Customer) => axios.post<Customer>(`${API_BASE}/customers`, customer),
  update: (id: number, customer: Partial<Customer>) =>
    axios.put(`${API_BASE}/customers/${id}`, customer),
  delete: (id: number) => axios.delete(`${API_BASE}/customers/${id}`),
};

export const teaRecordAPI = {
  getAll: (limit?: number) =>
    axios.get<TeaRecord[]>(`${API_BASE}/tea-records${limit ? `?limit=${limit}` : ''}`),
  getByCustomerId: (customerId: number) =>
    axios.get<TeaRecord[]>(`${API_BASE}/tea-records/customer/${customerId}`),
  getStats: () => axios.get<DashboardStats>(`${API_BASE}/tea-records/stats/dashboard`),
  create: (record: TeaRecord) => axios.post<TeaRecord>(`${API_BASE}/tea-records`, record),
  delete: (id: number) => axios.delete(`${API_BASE}/tea-records/${id}`),
};
