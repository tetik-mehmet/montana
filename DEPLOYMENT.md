# Deployment Rehberi

Bu dokuman, Gym Management System'in production ortamına deploy edilmesi için gereken adımları içerir.

## Ön Hazırlık

### 1. MongoDB Atlas Kurulumu

1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) hesabı oluşturun
2. Yeni bir cluster oluşturun (Free tier yeterlidir)
3. Database Access bölümünden yeni bir database user oluşturun
4. Network Access bölümünden IP whitelist'e `0.0.0.0/0` ekleyin (tüm IP'lere izin)
5. Cluster'a bağlanmak için connection string'i kopyalayın

Connection string formatı:
```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/gym-management?retryWrites=true&w=majority
```

### 2. Vercel'e Deploy

#### Adım 1: GitHub Repository

1. Projeyi GitHub'a push edin:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/gym-management.git
git push -u origin main
```

#### Adım 2: Vercel'de Yeni Proje

1. [Vercel](https://vercel.com) hesabınıza giriş yapın
2. "New Project" butonuna tıklayın
3. GitHub repository'nizi seçin
4. Framework Preset olarak "Next.js" seçili olduğundan emin olun

#### Adım 3: Environment Variables

Vercel dashboard'da Environment Variables bölümüne şu değişkenleri ekleyin:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/gym-management?retryWrites=true&w=majority
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=<generate-a-random-secret-here>
```

**NEXTAUTH_SECRET** oluşturmak için:
```bash
openssl rand -base64 32
```

#### Adım 4: Deploy

1. "Deploy" butonuna tıklayın
2. Build tamamlanınca uygulamanız yayında olacak

### 3. İlk Admin Kullanıcı Oluşturma

Deploy sonrası seed işlemini çalıştırmanız gerekiyor. İki seçenek var:

#### Seçenek 1: Local'den Production DB'ye Seed

```bash
# .env.local dosyasındaki MONGODB_URI'yi production DB ile değiştirin
# Sadece seed için!
npm run seed
```

#### Seçenek 2: Vercel CLI ile

```bash
# Vercel CLI yükleyin
npm i -g vercel

# Login olun
vercel login

# Seed komutunu production'da çalıştırın
vercel env pull .env.production
npm run seed
```

#### Seçenek 3: Manuel Oluşturma

MongoDB Atlas dashboard'undan manuel olarak admin user ekleyin:

1. Atlas dashboard'da Collections'a gidin
2. `users` collection'ına gidin
3. "Insert Document" tıklayın
4. Şu formatı kullanın:

```json
{
  "email": "admin@gym.com",
  "password": "$2a$10$K9YGqLZqQxp6J0qCJZ4WFuqCH6qR9kJKB7xZ8xZ8xZ8xZ8xZ8xZ8x",
  "name": "Admin User",
  "role": "admin",
  "createdAt": {"$date": "2024-01-01T00:00:00.000Z"}
}
```

**Not**: Yukarıdaki password hash'i `admin123` şifresine karşılık gelir.

### 4. İlk Kullanıma Hazır

Deployment tamamlandı! Artık uygulamanızı kullanabilirsiniz.

## Production Kontrolü

### 1. Temel Testler

- [ ] Login sayfası çalışıyor
- [ ] Admin girişi yapılabiliyor
- [ ] Dashboard istatistikleri görüntüleniyor
- [ ] Üye ekleme/düzenleme/silme çalışıyor
- [ ] Paket ekleme/düzenleme/silme çalışıyor
- [ ] Üyelik oluşturma çalışıyor
- [ ] Otomatik bitiş tarihi hesaplanıyor
- [ ] Responsive design mobile'da düzgün çalışıyor

### 2. Performance Optimizasyonu

Vercel otomatik olarak şunları yapar:
- ✅ Edge caching
- ✅ Image optimization
- ✅ Code splitting
- ✅ Compression

### 3. Monitoring

Vercel Dashboard'da şunları izleyin:
- Build logs
- Function logs
- Analytics
- Performance metrics

## Güvenlik Kontrolleri

- [ ] Environment variables güvenli şekilde ayarlandı
- [ ] NEXTAUTH_SECRET production için yeniden oluşturuldu
- [ ] MongoDB IP whitelist ayarlandı
- [ ] `.env.local` dosyası `.gitignore`'a eklendi
- [ ] Admin şifresi değiştirildi

## Custom Domain (Opsiyonel)

1. Vercel Dashboard'da "Domains" sekmesine gidin
2. Custom domain ekleyin
3. DNS kayıtlarını güncelleyin
4. SSL sertifikası otomatik olarak oluşturulacak

## Backup Stratejisi

### MongoDB Atlas Backups

1. Atlas Dashboard'da "Backup" sekmesine gidin
2. Cloud Backups'ı etkinleştirin (M10+ cluster gerektirir)
3. Alternatif: Manual export yapın

```bash
# MongoDB export
mongoexport --uri="<connection-string>" --collection=users --out=users.json
mongoexport --uri="<connection-string>" --collection=members --out=members.json
mongoexport --uri="<connection-string>" --collection=packages --out=packages.json
mongoexport --uri="<connection-string>" --collection=memberships --out=memberships.json
```

## Sorun Giderme

### Build Hataları

```bash
# Local'de production build test et
npm run build
```

### Database Bağlantı Hataları

- MONGODB_URI connection string'inin doğru olduğundan emin olun
- MongoDB Atlas'ta IP whitelist'i kontrol edin
- Database user credentials'larını doğrulayın


## Güncellemeler

Yeni değişiklikleri deploy etmek için:

```bash
git add .
git commit -m "Update description"
git push origin main
```

Vercel otomatik olarak yeni deployment başlatacak.

## Yardım

Sorun yaşarsanız:
- Vercel logs'ları kontrol edin
- MongoDB Atlas logs'ları kontrol edin
- GitHub Issues'da sorun bildirin
