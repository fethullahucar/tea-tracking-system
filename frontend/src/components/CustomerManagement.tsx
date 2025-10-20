import { useState } from 'react';
import { Customer } from '../types';
import { customerAPI } from '../api';

interface CustomerManagementProps {
  customers: Customer[];
  onCustomerChange: () => void;
}

function CustomerManagement({ customers, onCustomerChange }: CustomerManagementProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<Customer>({
    name: '',
    email: '',
    phone: '',
  });

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.includes(searchQuery)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCustomer && editingCustomer.id) {
        await customerAPI.update(editingCustomer.id, formData);
      } else {
        await customerAPI.create(formData);
      }
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '' });
      setEditingCustomer(null);
      onCustomerChange();
    } catch (error) {
      console.error('Error saving customer:', error);
      alert('Müşteri kaydedilirken hata oluştu');
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email || '',
      phone: customer.phone || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu müşteriyi silmek istediğinizden emin misiniz?')) {
      return;
    }
    try {
      await customerAPI.delete(id);
      onCustomerChange();
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Müşteri silinirken hata oluştu');
    }
  };

  const openAddModal = () => {
    setEditingCustomer(null);
    setFormData({ name: '', email: '', phone: '' });
    setShowModal(true);
  };

  return (
    <div>
      <div className="card">
        <div className="quick-actions">
          <button className="btn btn-primary" onClick={openAddModal}>
            + Yeni Müşteri Ekle
          </button>
        </div>

        <div className="search-box">
          <input
            type="text"
            placeholder="Müşteri ara (isim, email, telefon)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="empty-state">
            <h3>Müşteri bulunamadı</h3>
            <p>Yeni müşteri eklemek için yukarıdaki butona tıklayın</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>İsim</th>
                <th>Email</th>
                <th>Telefon</th>
                <th>Toplam Çay</th>
                <th>Son Çay</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer) => (
                <tr key={customer.id}>
                  <td>{customer.name}</td>
                  <td>{customer.email || '-'}</td>
                  <td>{customer.phone || '-'}</td>
                  <td>{customer.total_teas || 0}</td>
                  <td>
                    {customer.last_tea_date
                      ? new Date(customer.last_tea_date).toLocaleDateString('tr-TR')
                      : '-'}
                  </td>
                  <td>
                    <div className="actions">
                      <button
                        className="btn btn-secondary btn-small"
                        onClick={() => handleEdit(customer)}
                      >
                        Düzenle
                      </button>
                      <button
                        className="btn btn-danger btn-small"
                        onClick={() => customer.id && handleDelete(customer.id)}
                      >
                        Sil
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editingCustomer ? 'Müşteri Düzenle' : 'Yeni Müşteri Ekle'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>İsim *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Telefon</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  {editingCustomer ? 'Güncelle' : 'Ekle'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomerManagement;
