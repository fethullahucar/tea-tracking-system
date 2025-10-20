# Çay Takip Sistemi

Müşteri bazlı çay tüketim takip ve yönetim sistemi.

## Özellikler

- **Müşteri Yönetimi**: Müşteri ekleme, düzenleme, silme ve arama
- **Çay Takibi**: Müşterilerin çay tüketimlerini kaydetme ve takip etme
- **İstatistikler**: Toplam çay sayısı, günlük çaylar ve en çok çay içen müşteriler
- **Modern UI**: React ile geliştirilmiş kullanıcı dostu arayüz
- **RESTful API**: Express.js ile geliştirilmiş backend API

## Teknolojiler

### Backend
- Node.js
- Express.js
- TypeScript
- SQLite (better-sqlite3)

### Frontend
- React
- TypeScript
- Vite
- Axios

## Kurulum

### Gereksinimler
- Node.js (v16 veya üzeri)
- npm veya yarn

### Backend Kurulumu

```bash
cd backend
npm install
npm run dev
```

Backend http://localhost:3001 adresinde çalışacaktır.

### Frontend Kurulumu

```bash
cd frontend
npm install
npm run dev
```

Frontend http://localhost:3000 adresinde çalışacaktır.

## API Endpoints

### Müşteriler
- `GET /api/customers` - Tüm müşterileri listele
- `GET /api/customers/:id` - Belirli bir müşteriyi getir
- `GET /api/customers/search?q=query` - Müşteri ara
- `POST /api/customers` - Yeni müşteri ekle
- `PUT /api/customers/:id` - Müşteri güncelle
- `DELETE /api/customers/:id` - Müşteri sil

### Çay Kayıtları
- `GET /api/tea-records` - Tüm çay kayıtlarını listele
- `GET /api/tea-records/customer/:customerId` - Müşteriye ait çay kayıtlarını listele
- `GET /api/tea-records/stats/dashboard` - İstatistikleri getir
- `POST /api/tea-records` - Yeni çay kaydı ekle
- `DELETE /api/tea-records/:id` - Çay kaydı sil

## Kullanım

1. Backend ve frontend'i yukarıdaki talimatlarla başlatın
2. Tarayıcınızda http://localhost:3000 adresine gidin
3. Ana sayfada istatistikleri görüntüleyin
4. "Müşteriler" sekmesinden müşteri ekleyin/düzenleyin
5. "Çay Takip" sekmesinden çay kayıtları ekleyin

## Proje Yapısı

```
tea-tracking-system/
├── backend/
│   ├── src/
│   │   ├── database.ts
│   │   ├── index.ts
│   │   ├── models/
│   │   │   ├── Customer.ts
│   │   │   └── TeaRecord.ts
│   │   └── routes/
│   │       ├── customers.ts
│   │       └── tea-records.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.tsx
│   │   │   ├── CustomerManagement.tsx
│   │   │   └── TeaTracking.tsx
│   │   ├── api.ts
│   │   ├── types.ts
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Lisans

MIT
