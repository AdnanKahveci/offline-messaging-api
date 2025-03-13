# Çevrimdışı Mesajlaşma API'si

Node.js, Express, TypeScript ve MySQL ile oluşturulmuş çevrimdışı mesajlaşma için RESTful API.

## Özellikler

- Kullanıcı kimlik doğrulaması (kayıt, oturum açma)
- Kullanıcılar arasında mesajlaşma
- Kullanıcı engelleme işlevi
- Etkinlik kaydı
- Kapsamlı hata işleme
- Swagger ile API dokümantasyonu

## API Kullanım Senaryoları

- Kullanıcılar hesap oluşturabilir ve oturum açabilir
- Kullanıcılar kullanıcı adını bildikleri sürece birbirlerine mesaj gönderebilirler
- Kullanıcılar mesaj geçmişlerine erişebilir
- Kullanıcılar mesaj almayı önlemek için diğer kullanıcıları engelleyebilir
- Etkinlik günlükleri (giriş, geçersiz giriş, vb.) kullanıcılar tarafından görüntülenebilir
- Kritik hata ayrıntıları kullanıcılara gösterilmez ve tüm hatalar günlüğe kaydedilir

## Teknik Gereksinimler

- Node.js ve TypeScript ile oluşturuldu
- RESTful mimarisi
- Test kapsamı en az %5
- Sequelize ORM ile MySQL veritabanı

## Veritabanı Tasarımı

### Tablolar

- Kullanıcılar (id, kullanıcı adı, e-posta, şifre, createdAt, updatedAt)
- Mesajlar (id, senderId, receiverId, content, createdAt)
- BlockedUsers (id, blockerId, blockedId, createdAt)
- ActivityLogs (id, userId, action, timestamp)

## API Uç Noktaları

### Kimlik Doğrulama

- POST /api/auth/register - Yeni bir kullanıcı kaydedin
- POST /api/auth/login - Kullanıcı girişi

### Kullanıcı Yönetimi

- GET /api/users/:id - Kullanıcı bilgilerini alın
- GET /api/users/me - Geçerli kullanıcı profilini al
- PUT /api/users/me - Kullanıcı profilini güncelleyin
- GET /api/users/search - Kullanıcıları kullanıcı adına göre arama

### Mesajlaşma

- POST /api/messages - Mesaj gönderme
- GET /api/messages?userId=2 - İki kullanıcı arasındaki mesajları al
- GET /api/messages/me - Tüm kullanıcı konuşmalarını al

### Engelleme

- POST /api/block - Bir kullanıcıyı engelle
- GET /api/block - Engellenen kullanıcıların listesini al
- DELETE /api/block/:id - Bir kullanıcının engelini kaldırın

### Etkinlik Günlükleri

- GET /api/activity - Kullanıcı etkinlik günlüklerini alın
- POST /api/activity - Etkinlik günlüğü oluştur

## Kurulum ve Yükleme

1. Depoyu klonlayın
2. Bağımlılıkları yükleyin:
   
npm install

3. Aşağıdaki değişkenleri içeren bir .env dosyası oluşturun:
   
DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=''
   DB_NAME=chatmessage
   JWT_SECRET=your_jwt_secret

4. Uygulamayı çalıştırın:
   
npm start

   
## Gelişim

npm run dev


## API Dokümantasyonu

Swagger belgelerine sunucu çalışırken /api-docs adresinden ulaşılabilir.

## Lisans

ISC 
