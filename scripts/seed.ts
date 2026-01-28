import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/gym-management';

// User Schema
const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  name: String,
  role: String,
  createdAt: { type: Date, default: Date.now },
});

// Package Schema
const PackageSchema = new mongoose.Schema({
  name: String,
  description: String,
  duration: Number,
  price: Number,
  features: [String],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Package = mongoose.models.Package || mongoose.model('Package', PackageSchema);

async function seed() {
  try {
    console.log('🔌 MongoDB bağlantısı kuruluyor...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB bağlantısı başarılı!');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@gym.com' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin kullanıcı zaten mevcut, atlanıyor...');
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const admin = await User.create({
        email: 'admin@gym.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
      });
      console.log('✅ Admin kullanıcı oluşturuldu:', admin.email);
    }

    // Check if packages already exist
    const existingPackages = await Package.countDocuments();
    
    if (existingPackages > 0) {
      console.log('⚠️  Paketler zaten mevcut, atlanıyor...');
    } else {
      // Create sample packages
      const packages = [
        {
          name: 'Aylık Paket',
          description: 'Temel üyelik paketi - 1 ay geçerli',
          duration: 30,
          price: 500,
          features: [
            'Tüm ekipmanlara erişim',
            'Grup dersleri',
            'Duş ve soyunma odası',
          ],
          isActive: true,
        },
        {
          name: '3 Aylık Paket',
          description: 'Popüler tercih - 3 ay geçerli',
          duration: 90,
          price: 1350,
          features: [
            'Tüm ekipmanlara erişim',
            'Grup dersleri',
            'Duş ve soyunma odası',
            'Fitness analizi',
            '1 özel antrenör seansı',
          ],
          isActive: true,
        },
        {
          name: '6 Aylık Paket',
          description: 'Orta vadeli plan - 6 ay geçerli',
          duration: 180,
          price: 2500,
          features: [
            'Tüm ekipmanlara erişim',
            'Grup dersleri',
            'Duş ve soyunma odası',
            'Fitness analizi',
            '2 özel antrenör seansı',
            'Sauna erişimi',
          ],
          isActive: true,
        },
        {
          name: 'Yıllık Paket',
          description: 'En avantajlı paket - 1 yıl geçerli',
          duration: 365,
          price: 4500,
          features: [
            'Tüm ekipmanlara erişim',
            'Grup dersleri',
            'Duş ve soyunma odası',
            'Fitness analizi',
            '5 özel antrenör seansı',
            'Sauna erişimi',
            'Beslenme danışmanlığı',
            'Havuz erişimi',
          ],
          isActive: true,
        },
        {
          name: 'Öğrenci Paketi',
          description: 'Öğrencilere özel indirimli paket - 1 ay',
          duration: 30,
          price: 350,
          features: [
            'Tüm ekipmanlara erişim',
            'Grup dersleri',
            'Duş ve soyunma odası',
          ],
          isActive: true,
        },
      ];

      await Package.insertMany(packages);
      console.log(`✅ ${packages.length} örnek paket oluşturuldu`);
    }

    console.log('\n🎉 Seed işlemi tamamlandı!');
    console.log('\n📝 Giriş bilgileri:');
    console.log('   Email: admin@gym.com');
    console.log('   Şifre: admin123');
    console.log('\n🚀 Uygulamayı başlatmak için: npm run dev');

  } catch (error) {
    console.error('❌ Seed hatası:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 MongoDB bağlantısı kapatıldı');
  }
}

seed();
