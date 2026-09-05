import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, "data", "laptops.db")
RAW_CSV = os.path.join(BASE_DIR, "data", "raw.csv")
CLEAN_CSV = os.path.join(BASE_DIR, "data", "clean.csv")
SPIDER_PATH = os.path.join(BASE_DIR, "app", "spider.py")
IMPORT_PATH = os.path.join(BASE_DIR, "app", "import_db.py")

# 爬虫配置
# HEADERS = {
#     "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
# }

DELAY = 2