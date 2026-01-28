# Katkıda Bulunma Rehberi

Gym Management System projesine katkıda bulunmak istediğiniz için teşekkürler! Bu dokuman, projeye nasıl katkıda bulunabileceğinizi açıklar.

## Geliştirme Ortamı Kurulumu

1. Repository'yi fork edin
2. Fork'unuzu klonlayın:
```bash
git clone https://github.com/yourusername/gym-management.git
cd gym-management
```

3. Dependencies'leri yükleyin:
```bash
npm install
```

4. `.env.local` dosyasını oluşturun:
```env
MONGODB_URI=mongodb://localhost:27017/gym-management
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key
```

5. MongoDB'yi başlatın ve seed verilerini yükleyin:
```bash
npm run seed
```

6. Development server'ı başlatın:
```bash
npm run dev
```

## Kod Standartları

### TypeScript

- Tüm yeni dosyalar TypeScript ile yazılmalıdır
- `any` kullanımından kaçının, uygun type tanımları yapın
- Interface ve type'lar açıklayıcı olmalı

### React Components

- Functional components kullanın
- Prop types için interface tanımlayın
- Custom hooks mantıklı şekilde ayırın
- Component'ler tek sorumluluk prensibine uymalı

### Styling

- Tailwind CSS utility classes kullanın
- Custom CSS'den kaçının
- Responsive design mobile-first olmalı
- Dark mode desteği eklerken consistent olun

### API Routes

- RESTful principles'lara uyun
- Proper HTTP status codes kullanın
- Error handling ekleyin
- Input validation yapın

## Commit Mesajları

Anlamlı commit mesajları yazın:

```
feat: Add member export functionality
fix: Fix date calculation in memberships
docs: Update README with new features
style: Format code with prettier
refactor: Simplify dashboard stats query
test: Add tests for member API
chore: Update dependencies
```

Prefix'ler:
- `feat`: Yeni özellik
- `fix`: Bug fix
- `docs`: Dokümantasyon
- `style`: Kod formatı
- `refactor`: Kod iyileştirme
- `test`: Test ekleme
- `chore`: Bakım işleri

## Pull Request Süreci

1. Yeni bir branch oluşturun:
```bash
git checkout -b feature/amazing-feature
```

2. Değişikliklerinizi commit edin:
```bash
git commit -m "feat: Add amazing feature"
```

3. Branch'inizi push edin:
```bash
git push origin feature/amazing-feature
```

4. GitHub'da Pull Request oluşturun

5. PR açıklamasında:
   - Ne yaptığınızı açıklayın
   - Neden yaptığınızı açıklayın
   - Test edilmesi gereken şeyleri listeleyin
   - Ekran görüntüleri ekleyin (UI değişiklikleri için)

## Test Etme

Değişikliklerinizi test edin:

```bash
# Build test
npm run build

# Lint check
npm run lint

# Manual testing
npm run dev
```

Test edilmesi gerekenler:
- [ ] Yeni özellik çalışıyor
- [ ] Mevcut özellikler bozulmadı
- [ ] Responsive design düzgün
- [ ] Error handling var
- [ ] Loading states eklendi

## Özellik Önerileri

Yeni özellik önermek için:

1. GitHub Issues'da yeni bir issue açın
2. "Feature Request" template'ini kullanın
3. Özelliği detaylı açıklayın
4. Use case'leri ekleyin
5. Mockup/wireframe varsa ekleyin

## Bug Raporlama

Bug buldunuz mu?

1. GitHub Issues'da yeni bir issue açın
2. "Bug Report" template'ini kullanın
3. Problemi detaylı açıklayın
4. Reproduce etme adımlarını ekleyin
5. Ekran görüntüleri ekleyin
6. Console error'ları paylaşın

## Öncelikli Geliştirme Alanları

Katkıda bulunmak istiyorsanız şu alanlara odaklanabilirsiniz:

### Yüksek Öncelik
- [ ] Unit ve integration testleri
- [ ] Email bildirimleri
- [ ] Excel/PDF export
- [ ] Multi-language support
- [ ] Dark mode

### Orta Öncelik
- [ ] Dashboard grafikleri iyileştirme
- [ ] Devamsızlık takip sistemi
- [ ] Ödeme geçmişi
- [ ] QR kod ile check-in
- [ ] Mobile app (React Native)

### Düşük Öncelik
- [ ] Analytics dashboard
- [ ] Admin roller ve permissions
- [ ] SMS bildirimleri
- [ ] Social media entegrasyonu
- [ ] Member portal

## Kod Review

PR'ınız şunlar için kontrol edilecek:

- Code quality
- Test coverage
- Documentation
- Performance
- Security
- Accessibility
- Responsive design

## Sorularınız mı var?

- GitHub Discussions'da soru sorun
- Issues'da tartışma başlatın
- Email: admin@gym.com

## Davranış Kuralları

- Saygılı olun
- Yapıcı geri bildirim verin
- Yardımcı olun
- Öğrenmeye açık olun

Teşekkürler! 🎉
