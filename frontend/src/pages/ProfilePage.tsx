import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../components/templates';
import { Heading, Button } from '../components/atoms';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <MainLayout title="Profil">
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <Heading level={1} className="text-3xl font-bold text-gray-900 mb-2">
              Profil Bilgileri
            </Heading>
            <p className="text-lg text-gray-600">
              Hesap bilgilerinizi görüntüleyin ve düzenleyin
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-8 mb-8">
            {/* Profile Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {user?.first_name?.[0]}{user?.last_name?.[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {user?.first_name && user?.last_name 
                      ? `${user.first_name} ${user.last_name}` 
                      : user?.username || 'Kullanıcı'}
                  </h2>
                  <p className="text-gray-600">@{user?.username}</p>
                </div>
              </div>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="secondary"
                className="flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Çıkış Yap
              </Button>
            </div>

            {/* Profile Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ad
                </label>
                <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                  {user?.first_name || 'Belirtilmemiş'}
                </div>
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Soyad
                </label>
                <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                  {user?.last_name || 'Belirtilmemiş'}
                </div>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kullanıcı Adı
                </label>
                <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                  {user?.username || 'Belirtilmemiş'}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-posta
                </label>
                <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                  {user?.email || 'Belirtilmemiş'}
                </div>
              </div>

              {/* Biography */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biyografi
                </label>
                <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-900 min-h-[100px]">
                  {user?.biography || 'Henüz biyografi eklenmemiş.'}
                </div>
              </div>
            </div>
          </div>

          {/* Account Info */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-100 p-8 mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Hesap Bilgileri</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hesap Oluşturulma Tarihi
                </label>
                <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Belirtilmemiş'}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Son Güncellenme
                </label>
                <div className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
                  {user?.updated_at ? new Date(user.updated_at).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Belirtilmemiş'}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
