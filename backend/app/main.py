from flask import Flask, jsonify, request
import sqlite3
import pandas as pd
from config import DB_PATH

app = Flask(__name__)

# CORS配置（一行搞定）
@app.after_request
def after_request(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "*"
    return resp

def get_db():
    return sqlite3.connect(DB_PATH)

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
    cursor = conn.cursor()
    if brand:
        cursor.execute("SELECT * FROM laptops WHERE brand = ? LIMIT ?", (brand, limit))
    else:
        cursor.execute("SELECT * FROM laptops LIMIT ?", (limit,))
    rows = cursor.fetchall()
    conn.close()

    # 转成字典（字段名写死，和表结构对应）
    result = []
    for r in rows:
        result.append({
            "id": r[0],
            "brand": r[1],
            "model": r[2],
            "price": r[3],
            "memory": r[6],
            "rating": r[8]
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

    bins = [0, 3000, 5000, 7000, 10000, 15000, 30000]
    labels = ["0-3k", "3k-5k", "5k-7k", "7k-10k", "10k-15k", "15k+"]
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
    app.run(host="0.0.0.0", port=8000, debug=True)