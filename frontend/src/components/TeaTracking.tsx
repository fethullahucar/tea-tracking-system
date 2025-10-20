import { useState } from 'react';
import { Customer, TeaRecord } from '../types';
import { teaRecordAPI } from '../api';

interface TeaTrackingProps {
  customers: Customer[];
  teaRecords: TeaRecord[];
  onTeaRecordChange: () => void;
}

function TeaTracking({ customers, teaRecords, onTeaRecordChange }: TeaTrackingProps) {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<TeaRecord>({
    customer_id: 0,
    tea_count: 1,
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.customer_id === 0) {
      alert('Lütfen bir müşteri seçin');
      return;
    }
    try {
      await teaRecordAPI.create(formData);
      setShowModal(false);
      setFormData({ customer_id: 0, tea_count: 1, notes: '' });
      onTeaRecordChange();
    } catch (error) {
      console.error('Error creating tea record:', error);
      alert('Çay kaydı eklenirken hata oluştu');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu çay kaydını silmek istediğinizden emin misiniz?')) {
      return;
    }
    try {
      await teaRecordAPI.delete(id);
      onTeaRecordChange();
    } catch (error) {
      console.error('Error deleting tea record:', error);
      alert('Çay kaydı silinirken hata oluştu');
    }
  };

  return (
    <div>
      <div className="card">
        <div className="quick-actions">
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            + Yeni Çay Kaydı Ekle
          </button>
        </div>

        {teaRecords.length === 0 ? (
          <div className="empty-state">
            <h3>Henüz çay kaydı yok</h3>
            <p>Yeni çay kaydı eklemek için yukarıdaki butona tıklayın</p>
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Tarih</th>
                <th>Müşteri</th>
                <th>Çay Sayısı</th>
                <th>Notlar</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {teaRecords.map((record) => (
                <tr key={record.id}>
                  <td>
                    {record.created_at
                      ? new Date(record.created_at).toLocaleString('tr-TR')
                      : '-'}
                  </td>
                  <td>{record.customer_name}</td>
                  <td>{record.tea_count}</td>
                  <td>{record.notes || '-'}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-small"
                      onClick={() => record.id && handleDelete(record.id)}
                    >
                      Sil
                    </button>
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
            <h2>Yeni Çay Kaydı Ekle</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Müşteri *</label>
                <select
                  value={formData.customer_id}
                  onChange={(e) =>
                    setFormData({ ...formData, customer_id: parseInt(e.target.value) })
                  }
                  required
                >
                  <option value={0}>Müşteri seçin</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Çay Sayısı *</label>
                <input
                  type="number"
                  min="1"
                  value={formData.tea_count}
                  onChange={(e) =>
                    setFormData({ ...formData, tea_count: parseInt(e.target.value) })
                  }
                  required
                />
              </div>
              <div className="form-group">
                <label>Notlar</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Opsiyonel notlar..."
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="btn btn-primary">
                  Ekle
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

export default TeaTracking;
