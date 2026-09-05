import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import sqlite3
import pandas as pd
import os
from config import DB_PATH
from config import RAW_CSV  

def import_csv_to_db():
    if not os.path.exists(RAW_CSV):
        print(f"❌ 请先运行 spider.py 生成 raw.csv")
        return
    
    df = pd.read_csv(RAW_CSV)
    print(f"📂 读取到 {len(df)} 条数据")
    
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    df.to_sql("laptops", conn, if_exists="replace", index=False)
    conn.close()
    
    print(f"✅ 已导入到 {DB_PATH}")

if __name__ == "__main__":
    import_csv_to_db()