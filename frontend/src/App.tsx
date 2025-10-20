import { useState, useEffect } from 'react';
import './App.css';
import { customerAPI, teaRecordAPI } from './api';
import { Customer, TeaRecord, DashboardStats } from './types';
import CustomerManagement from './components/CustomerManagement';
import TeaTracking from './components/TeaTracking';
import Dashboard from './components/Dashboard';

type Tab = 'dashboard' | 'customers' | 'tracking';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [teaRecords, setTeaRecords] = useState<TeaRecord[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [customersRes, teaRecordsRes, statsRes] = await Promise.all([
        customerAPI.getAll(),
        teaRecordAPI.getAll(50),
        teaRecordAPI.getStats(),
      ]);
      setCustomers(customersRes.data);
      setTeaRecords(teaRecordsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerChange = () => {
    loadData();
  };

  const handleTeaRecordChange = () => {
    loadData();
  };

  if (loading) {
    return (
      <div className="app">
        <header className="header">
          <h1>Çay Takip Sistemi</h1>
          <p>Müşteri ve çay tüketim yönetimi</p>
        </header>
        <div className="container">
          <div className="loading">Yükleniyor...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="header">
        <h1>Çay Takip Sistemi</h1>
        <p>Müşteri ve çay tüketim yönetimi</p>
      </header>

      <div className="container">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Ana Sayfa
          </button>
          <button
            className={`tab ${activeTab === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveTab('customers')}
          >
            Müşteriler
          </button>
          <button
            className={`tab ${activeTab === 'tracking' ? 'active' : ''}`}
            onClick={() => setActiveTab('tracking')}
          >
            Çay Takip
          </button>
        </div>

        {activeTab === 'dashboard' && <Dashboard stats={stats} />}
        {activeTab === 'customers' && (
          <CustomerManagement
            customers={customers}
            onCustomerChange={handleCustomerChange}
          />
        )}
        {activeTab === 'tracking' && (
          <TeaTracking
            customers={customers}
            teaRecords={teaRecords}
            onTeaRecordChange={handleTeaRecordChange}
          />
        )}
      </div>
    </div>
  );
}

export default App;
