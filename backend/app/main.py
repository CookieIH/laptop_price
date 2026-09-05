from flask import Flask, jsonify, request
import sqlite3
import pandas as pd
from config import DB_PATH
from config import SPIDER_PATH, IMPORT_PATH
import os
import subprocess
import sys

app = Flask(__name__)

def ensure_database():
    """确保数据库存在且有数据，否则自动生成"""
    
    # 检查数据库是否存在
    db_exists = os.path.exists(DB_PATH)
    
    # 如果数据库存在，检查是否有数据
    has_data = False
    if db_exists:
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()
            cursor.execute("SELECT COUNT(*) FROM laptops")
            count = cursor.fetchone()[0]
            has_data = count > 0
            conn.close()
        except:
            has_data = False
    
    # 如果数据库存在且有数据，直接返回
    if db_exists and has_data:
        print(f"✅ 数据库已就绪: {DB_PATH} ({count} 条数据)")
        return True
    
    # ===== 需要重新生成数据 =====
    print("🔄 数据库未就绪，开始自动准备数据...")
    
    # 第1步：运行 spider.py 生成 raw.csv
    if os.path.exists(SPIDER_PATH):
        print("📂 步骤1: 运行 spider.py...")
        result = subprocess.run(
            [sys.executable, SPIDER_PATH],
            capture_output=True,
            text=True,
            cwd=os.path.dirname(SPIDER_PATH),
            encoding='utf-8',
        )
        print(result.stdout)
        if result.returncode != 0:
            print(f"❌ spider.py 执行失败: {result.stderr}")
            return False
    else:
        print(f"❌ 找不到 spider.py: {SPIDER_PATH}")
        return False

    # 第2步：运行 import_db.py 导入数据库
    if os.path.exists(IMPORT_PATH):
        print("📂 步骤2: 运行 import_db.py...")
        result = subprocess.run(
            [sys.executable, IMPORT_PATH],
            capture_output=True,
            text=True,
            cwd=os.path.dirname(IMPORT_PATH),
            encoding='utf-8',
        )
        print(result.stdout)
        if result.returncode != 0:
            print(f"❌ import_db.py 执行失败: {result.stderr}")
            return False
    else:
        print(f"❌ 找不到 import_db.py: {IMPORT_PATH}")
        return False

    print("✅ 数据准备完成！")

    return True

def get_db():
    if not os.path.exists(DB_PATH):
        return None
    return sqlite3.connect(DB_PATH)

# CORS配置
@app.after_request
def after_request(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "*"
    return resp

def get_db():
    """获取数据库连接"""
    # 检查数据库文件是否存在
    if not os.path.exists(DB_PATH):
        print(f"❌ 数据库文件不存在: {DB_PATH}")
        print("💡 请先运行: python backend/app/spider.py")
        return None
    
    try:
        return sqlite3.connect(DB_PATH)
    except sqlite3.Error as e:
        print(f"❌ 连接数据库失败: {e}")
        return None

# ============= API接口 =============

@app.route("/")
def index():
    return jsonify({
        "service": "笔记本价格分析系统",
        "status": "运行中",
        "endpoints": [
            "/api/laptops",
            "/api/stats/brand_avg",
            "/api/stats/price_dist",
            "/api/stats/trend",
            "/api/options/brands"
        ]
    })

@app.route("/api/laptops")
def get_laptops():
    """获取笔记本列表（支持品牌筛选）"""
    brand = request.args.get("brand")
    limit = request.args.get("limit", 100, type=int)

    conn = get_db()

    if conn is None:
        return jsonify({"error": "数据库未就绪，请先运行 spider.py 生成数据"}), 500
    
    cursor = conn.cursor()
    if brand:
        cursor.execute("SELECT * FROM laptops WHERE brand = ? LIMIT ?", (brand, limit))
    else:
        cursor.execute("SELECT * FROM laptops LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()

    # 转成字典
    result = []
    for r in rows:
        result.append({
            "brand": r[0],
            "category": r[7],
            "model": r[1],
            "price_USD": r[10],
            "cpu": r[3],
            "gpu": r[5],
            "storage": r[7],
            "memory": r[3],
            "rating": r[11],
            "cpu_cores": r[9],
            "cpu_threads": r[6],
            "cpu_brand": r[2],
            "gpu_brand": r[12],

        })
    return jsonify(result)

@app.route("/api/stats/brand_avg")
def brand_avg():
    """各品牌均价"""
    conn = get_db()
    df = pd.read_sql("SELECT brand, price FROM laptops WHERE price > 0", conn)
    conn.close()

    if df.empty:
        return jsonify([])

    result = df.groupby("brand")["price"].agg(["mean", "count"]).round(2)
    data = []
    for brand, row in result.iterrows():
        data.append({
            "brand": brand,
            "avg_price": row["mean"],
            "count": int(row["count"])
        })
    return jsonify(data)

@app.route("/api/stats/price_dist")
def price_dist():
    """价格区间分布"""
    conn = get_db()
    df = pd.read_sql("SELECT price FROM laptops WHERE price > 0", conn)
    conn.close()

    # 美元价格区间
    bins = [0, 300, 500, 800, 1000, 1500, 2000, 3000, 5000]
    labels = ["0-300", "300-500", "500-800", "800-1000", "1000-1500", "1500-2000","2000-3000", "3000+"]
    df["range"] = pd.cut(df["price"], bins=bins, labels=labels, right=False)

    result = df["range"].value_counts().sort_index().reset_index()
    return jsonify([
        {"range_label": row["range"], "count": int(row["count"])}
        for _, row in result.iterrows()
    ])

@app.route("/api/options/brands")
def get_brands():
    """获取所有品牌列表（前端下拉框用）"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT brand FROM laptops ORDER BY brand")
    rows = cursor.fetchall()
    conn.close()
    return jsonify([r[0] for r in rows])

if __name__ == "__main__":
    # ===== 启动前自动准备数据 =====
    if ensure_database():
        print("🚀 启动 Flask 服务...")
        app.run(host="0.0.0.0", port=8000, debug=True)
    else:
        print("❌ 数据准备失败，请手动检查")