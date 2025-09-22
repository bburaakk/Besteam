
# Yolcu - Kariyer Yol Haritanız

**Sizi neden işe alalım?**

**Yolcu**, yeni mezun öğrencileri ve kariyerinin başındakileri profesyonel hayata hazırlamak için tasarlanmış yenilikçi bir web uygulamasıdır. Kullanıcıların hedefledikleri alanda uzmanlaşmaları için kişiselleştirilmiş yol haritaları oluşturur, teknik ve sosyal becerilerini geliştirir ve iş arama süreçlerinde onlara rehberlik eder.

---

## 🎯 Projenin Amacı

Mezuniyet sonrası kariyer yolculuğu genellikle belirsizliklerle doludur. "Nereden başlamalıyım?", "Hangi teknolojileri öğrenmeliyim?", "CV'm yeterli mi?" gibi sorular genç profesyonellerin en büyük endişeleridir. Yolcu, bu süreci yapılandırılmış, eğlenceli ve verimli bir hale getirmeyi amaçlar:

-   **Yol Göstermek:** Kullanıcının hedeflediği kariyere özel, adım adım ilerleyen bir öğrenme yol haritası sunmak.
-   **Geliştirmek:** Teknik bilgi özetleri, pekiştirme soruları ve pratik projeler ile yetkinlik kazandırmak.
-   **Hazırlamak:** CV'leri **ATS (Applicant Tracking System)** sistemlerine uyumlu hale getirmek, analiz etmek ve iyileştirme önerileri sunmak.
-   **Birleştirmek:** Kullanıcıları takım yarışmalarına dahil ederek network oluşturmalarını ve eğlenerek öğrenmelerini sağlamak.

## ✍🏻 Hedef Kitle
- Yeni mezun öğrenciler

- Bootcamp mezunları

- Kariyer değiştirmek isteyenler

## ✨ Temel Özellikler

-   **🤖 Akıllı Yol Haritası Oluşturucu:** Yapay zeka (Gemini API) destekli modülümüz, "Veri Bilimci", "Frontend Geliştirici" gibi hedeflere yönelik dinamik ve kapsamlı yol haritaları üretir.
-   **📝 Konu Özetleri ve Pekiştirme:** Her bir öğrenme adımının sonunda, konuyu pekiştirmek için **kolay, orta ve zor** seviyelerde kategorize edilmiş sorular sunulur.
-   **📄 ATS Uyumlu CV Analizi:**
    -   Kullanıcıların yüklediği CV'leri (PDF, TXT) analiz eder.
    -   **Doğal Dil İşleme (NLP)** kullanarak CV'nin ATS puanını hesaplar.
    -   Eksik anahtar kelimeleri, format hatalarını ve iyileştirme alanlarını raporlar.
    -   Yapay zeka destekli kişiselleştirilmiş geri bildirimler sunar.
-   **🚀 Proje Önerileri:** Öğrenilen bilgileri pratiğe dökmek için kullanıcının yol haritasındaki konulara uygun, farklı zorluk seviyelerinde proje fikirleri sunar.
-   **💬 Yol Haritası Sohbet Asistanı:** Kullanıcılar, yol haritalarındaki konularla ilgili anlamadıkları noktaları yapay zeka destekli sohbet botuna sorabilirler.
-   **👥 Takım Çalışması ve Network:** Kullanıcıları bir araya getirerek takım halinde projelere ve yarışmalara katılmalarını teşvik eder.
-   **💖 Motivasyonel Mesajlar:** İhtiyaç duyduğunuzda sizi motive edecek, yapay zeka tarafından üretilen ilham verici mesajlar.

## 🛠️ Kullanılan Teknolojiler

Projemiz, modern ve ölçeklenebilir teknolojiler kullanılarak geliştirilmiştir.

## 🛠️ Kullanılan Teknolojiler

| Kategori      | Teknoloji / Kütüphane                                              |
|---------------|--------------------------------------------------------------------|
| **Backend**   | FastAPI, Uvicorn, SQLAlchemy, Pydantic, JWT (pyjwt)                |
| **Frontend**  | React, TypeScript, Vite                                            |
| **Veritabanı**| PostgreSQL, SQLAlchemy ORM                                         |
| **Yapay Zeka**| Google Gemini API, langdetect, PyMuPDF                             |
| **NLP**       | `re`, `collections` (CV analizi için)                              |
| **Asenkron**  | WebSockets (FastAPI ile canlı sohbet için)                         |
| **Cloud**     | Render (Deployment için), Sanal Makine, SQL Server, Ağ Bileşenleri |


## 🏛️ Sistem Mimarisi ve Veritabanı

Uygulamamız, frontend, backend ve bulut servisleri arasında etkileşimli bir yapıya sahiptir. Veritabanı şemamız (ER Diagram), kullanıcılar, yol haritaları, CV'ler ve projeler arasındaki ilişkileri yönetmek üzere tasarlanmıştır.

![Veritabanı ER Şeması](https://github.com/user-attachments/assets/57457360-d486-4582-b8a0-7b972da30cff)

## 🚀 Projeyi Yerel Makinede Çalıştırma

Projeyi kendi makinenizde denemek için aşağıdaki adımları izleyebilirsiniz.

### **Gereksinimler**
-   Python 3.9+
-   Node.js ve npm/yarn
-   PostgreSQL

### **Backend Kurulumu**
1.  **Depoyu klonlayın:**
    ```bash
    git clone https://github.com/kullanici-adiniz/yolcu.git
    cd yolcu/yolcu_backend
    ```

2.  **Sanal ortam oluşturun ve aktive edin:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # Windows için: venv\Scripts\activate
    ```

3.  **Gerekli Python paketlerini yükleyin:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Ortam değişkenlerini ayarlayın:**
    `.env` adında bir dosya oluşturun ve içine `GEMINI_API_KEY` ile veritabanı bağlantı bilgilerinizi ekleyin.
    ```env
    GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
    DATABASE_URL="postgresql://user:password@host:port/dbname"
    ```

5.  **Backend sunucusunu başlatın:**
    ```bash
    uvicorn main:app --reload --host 0.0.0.0 --port 8080
    ```
    Sunucu artık `http://localhost:8080` adresinde çalışıyor. API dokümantasyonuna `http://localhost:8080/docs` adresinden ulaşabilirsiniz.

### **Frontend Kurulumu**
1.  **Frontend klasörüne gidin:**
    ```bash
    cd ../yolcu_frontend # Frontend klasörünüzün adına göre düzenleyin
    ```

2.  **Gerekli Node.js paketlerini yükleyin:**
    ```bash
    npm install
    ```

3.  **Frontend uygulamasını başlatın:**
    ```bash
    npm run dev
    ```
    Uygulama genellikle `http://localhost:5173` adresinde çalışmaya başlayacaktır.


## 📜 Lisans

Bu proje MIT Lisansı altında lisanslanmıştır. Detaylar için `LICENSE` dosyasına göz atabilirsiniz.

