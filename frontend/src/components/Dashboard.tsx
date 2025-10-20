import { DashboardStats } from '../types';

interface DashboardProps {
  stats: DashboardStats | null;
}

function Dashboard({ stats }: DashboardProps) {
  if (!stats) {
    return <div className="loading">İstatistikler yükleniyor...</div>;
  }

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Toplam Çay</h3>
          <div className="value">{stats.totalTeas}</div>
        </div>
        <div className="stat-card">
          <h3>Toplam Müşteri</h3>
          <div className="value">{stats.totalCustomers}</div>
        </div>
        <div className="stat-card">
          <h3>Bugünkü Çaylar</h3>
          <div className="value">{stats.todayTeas}</div>
        </div>
      </div>

      <div className="card">
        <h2>En Çok Çay İçen Müşteriler</h2>
        {stats.topCustomers.length === 0 ? (
          <div className="empty-state">
            <h3>Henüz veri yok</h3>
            <p>Çay kayıtları eklendiğinde burada görünecek</p>
          </div>
        ) : (
          <div className="top-customers">
            {stats.topCustomers.map((customer, index) => (
              <div key={index} className="top-customer-item">
                <span className="customer-name">
                  {index + 1}. {customer.name}
                </span>
                <span className="tea-count">{customer.total_teas} çay</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
