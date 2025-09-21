from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# .env dosyasındaki değişkenleri yükler (yerel geliştirme için)
load_dotenv()

# DATABASE_URL ortam değişkenini oku. Render bu değişkeni otomatik olarak sağlar.
DATABASE_URL = os.getenv("DATABASE_URL")

# Eğer DATABASE_URL tanımlı değilse hata ver.
if DATABASE_URL is None:
    raise ValueError("DATABASE_URL ortam değişkeni ayarlanmamış. Lütfen .env dosyanızı kontrol edin veya sunucu ayarlarınızı yapın.")

# Render'ın eski postgres:// URL formatını sqlalchemy'nin beklediği postgresql:// formatına çevir.
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()