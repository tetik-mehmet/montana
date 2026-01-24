# Gym Membership & Package Management System

Modern bir spor salonu üyelik ve paket yönetim sistemi. Next.js App Router, MongoDB, NextAuth ve Tailwind CSS kullanılarak geliştirilmiştir.

## Özellikler

### ✅ Tamamlanan Özellikler

- **Authentication**: NextAuth.js ile güvenli admin girişi
- **Dashboard**: İstatistikler, aktif üye sayısı, gelir raporları
- **Üye Yönetimi**: CRUD işlemleri, arama, filtreleme, pagination
- **Paket Yönetimi**: Üyelik paketleri oluşturma, düzenleme, aktif/pasif yapma
- **Üyelik Yönetimi**: Yeni üyelik oluşturma, otomatik bitiş tarihi hesaplama
- **Responsive Design**: Mobile-first yaklaşım, tüm cihazlarda uyumlu

## Teknoloji Stack

- **Frontend/Backend**: Next.js 15 (App Router), React 19, TypeScript
- **Database**: MongoDB + Mongoose
- **Authentication**: NextAuth.js (Credentials)
- **Styling**: Tailwind CSS
- **Validation**: Native HTML5 + Mongoose

## Kurulum

### 1. Proje Bağımlılıklarını Yükle

```bash
npm install
```

### 2. Environment Variables

`.env.local` dosyasını kontrol edin ve gerekli ayarları yapın:

```env
MONGODB_URI=mongodb://localhost:27017/gym-management
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=gym-secret-key-change-this-in-production-2024
```

### 3. MongoDB Kurulumu

- MongoDB'nin local veya cloud (MongoDB Atlas) üzerinde çalıştığından emin olun
- Connection string'i `.env.local` dosyasına ekleyin

### 4. Database Seed (İlk Admin Kullanıcı)

```bash
npm run seed
```

Bu komut şunları oluşturur:
- Admin kullanıcı (email: admin@gym.com, şifre: admin123)
- Örnek paketler (Aylık, 3 Aylık, Yıllık)

### 5. Development Server'ı Başlat

```bash
npm run dev
```

Uygulama [http://localhost:3000](http://localhost:3000) adresinde çalışacaktır.

## Varsayılan Giriş Bilgileri

- **Email**: admin@gym.com
- **Şifre**: admin123

## Proje Yapısı

```
montana/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── api/                  # API Routes
│   │   │   ├── auth/             # NextAuth endpoints
│   │   │   ├── members/          # Members CRUD
│   │   │   ├── packages/         # Packages CRUD
│   │   │   ├── memberships/      # Memberships CRUD
│   │   │   ├── stats/            # Dashboard statistics
│   │   ├── dashboard/            # Dashboard page
│   │   ├── members/              # Members management
│   │   ├── packages/             # Packages management
│   │   ├── memberships/          # Memberships management
│   │   └── login/                # Login page
│   ├── components/
│   │   ├── ui/                   # Reusable UI components
│   │   ├── layout/               # Layout components
│   │   └── forms/                # Form components
│   ├── lib/
│   │   ├── db.ts                 # MongoDB connection
│   │   ├── auth.ts               # NextAuth configuration
│   │   └── utils.ts              # Helper functions
│   ├── models/                   # Mongoose models
│   │   ├── User.ts
│   │   ├── Member.ts
│   │   ├── Package.ts
│   │   └── Membership.ts
│   └── types/                    # TypeScript type definitions
├── scripts/
│   └── seed.ts                   # Database seeding script
└── public/                       # Static files
```

## API Endpoints

### Authentication
- `POST /api/auth/signin` - Admin girişi
- `POST /api/auth/signout` - Çıkış

### Members
- `GET /api/members` - Üyeleri listele (search, pagination)
- `POST /api/members` - Yeni üye ekle
- `GET /api/members/[id]` - Tek üye getir
- `PUT /api/members/[id]` - Üye güncelle
- `DELETE /api/members/[id]` - Üye sil

### Packages
- `GET /api/packages` - Paketleri listele
- `POST /api/packages` - Yeni paket ekle
- `GET /api/packages/[id]` - Tek paket getir
- `PUT /api/packages/[id]` - Paket güncelle
- `DELETE /api/packages/[id]` - Paket sil

### Memberships
- `GET /api/memberships` - Üyelikleri listele (filters, pagination)
- `POST /api/memberships` - Yeni üyelik oluştur
- `GET /api/memberships/[id]` - Tek üyelik getir
- `PUT /api/memberships/[id]` - Üyelik güncelle
- `DELETE /api/memberships/[id]` - Üyelik iptal et

### Stats
- `GET /api/stats` - Dashboard istatistikleri


## Database Models

### User (Admin)
- email, password (hashed), name, role

### Member (Gym Üyeleri)
- firstName, lastName, email, phone
- dateOfBirth, gender, address
- emergencyContact (name, phone)
- status (active, inactive, expired)

### Package (Üyelik Paketleri)
- name, description
- duration (günler), price
- features (array), isActive

### Membership (Aktif Üyelikler)
- member (ref), package (ref)
- startDate, endDate (otomatik hesaplanan)
- status (active, expired, cancelled)
- price, paymentMethod, notes

## Üyelik Durum Yönetimi

Süresi dolan üyeliklerin durumunu manuel olarak kontrol edebilir ve güncelleyebilirsiniz. Dashboard üzerinden aktif üyelikleri görüntüleyebilir ve gerektiğinde manuel güncelleme yapabilirsiniz.

## Deployment

### Vercel'e Deploy

1. Projeyi GitHub'a push edin
2. Vercel Dashboard'da "New Project" oluşturun
3. Environment variables'ı ekleyin:
   - `MONGODB_URI`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
4. Deploy edin

### MongoDB Atlas Setup

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hesabı oluşturun
2. Yeni cluster oluşturun
3. Database user ve network access ayarlarını yapın
4. Connection string'i alın ve `MONGODB_URI`'ye ekleyin

## Geliştirme Notları

### Responsive Design
- Mobile-first yaklaşım
- Sidebar: Desktop'ta sabit, mobile'da hamburger menu
- Tables: Mobile'da card görünümüne dönüşür
- Forms: Tek sütun (mobile), çift sütun (desktop)

### Güvenlik
- Bcrypt ile password hashing
- NextAuth session yönetimi
- Protected routes (middleware)
- Input validation

## Gelecek İyileştirmeler

- [ ] Excel/PDF export özelliği
- [ ] Email bildirimleri (üyelik sona erme uyarıları)
- [ ] Devamsızlık takip sistemi
- [ ] Ödeme geçmişi ve fatura oluşturma
- [ ] Grafik ve raporlama araçları
- [ ] Multi-language desteği
- [ ] Dark mode

## Lisans

Bu proje öğrenme amaçlı geliştirilmiştir.

## İletişim

Sorularınız için: admin@gym.com
