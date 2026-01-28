import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import connectDB from './db';
import User from '@/models/User';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Şifre', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error('❌ Credentials eksik');
            throw new Error('Email ve şifre gereklidir');
          }

          console.log('🔌 MongoDB bağlantısı kuruluyor...');
          await connectDB();
          console.log('✅ MongoDB bağlantısı başarılı');

          console.log('🔍 Kullanıcı aranıyor:', credentials.email);
          const user = await User.findOne({ email: credentials.email });

          if (!user) {
            console.error('❌ Kullanıcı bulunamadı:', credentials.email);
            throw new Error('Geçersiz email veya şifre');
          }

          console.log('✅ Kullanıcı bulundu:', user.email, 'Role:', user.role);

          console.log('🔐 Şifre kontrol ediliyor...');
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            console.error('❌ Şifre yanlış');
            throw new Error('Geçersiz email veya şifre');
          }

          console.log('✅ Şifre doğru, giriş başarılı');

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('❌ Auth hatası:', error);
          throw error;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 gün
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        console.log('🎫 JWT Token oluşturuldu:', { id: user.id, role: user.role });
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        console.log('👤 Session oluşturuldu:', { id: token.id, role: token.role });
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
};
