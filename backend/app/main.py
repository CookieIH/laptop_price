from flask import Flask, jsonify, request
import sqlite3
import pandas as pd
from config import DB_PATH
from config import SPIDER_PATH, IMPORT_PATH
import os
import subprocess
import sys

app = Flask(__name__)


# =========================================================
# 数据库准备
# =========================================================

def ensure_database():
    """确保数据库存在且有数据，否则自动生成"""

    db_exists = os.path.exists(DB_PATH)

    has_data = False
    count = 0

    if db_exists:
        try:
            conn = sqlite3.connect(DB_PATH)
            cursor = conn.cursor()

            cursor.execute("SELECT COUNT(*) FROM laptops")
            count = cursor.fetchone()[0]

            has_data = count > 0

            conn.close()

        except Exception as e:
            print(f"⚠️ 检查数据库失败: {e}")
            has_data = False

    # 数据库正常
    if db_exists and has_data:
        print(f"✅ 数据库已就绪: {DB_PATH} ({count} 条数据)")
        return True

    # =====================================================
    # 数据库不存在，需要重新生成
    # =====================================================

    print("🔄 数据库未就绪，开始自动准备数据...")

    # 第一步：运行 spider.py
    if os.path.exists(SPIDER_PATH):

        print("📂 步骤1: 运行 spider.py...")

        try:
            result = subprocess.run(
                [sys.executable, SPIDER_PATH],
                capture_output=True,
                text=True,
                cwd=os.path.dirname(SPIDER_PATH),
                encoding="utf-8"
            )

            print(result.stdout)

            if result.returncode != 0:
                print(f"❌ spider.py 执行失败:")
                print(result.stderr)
                return False

        except Exception as e:
            print(f"❌ 运行 spider.py 失败: {e}")
            return False

    else:
        print(f"❌ 找不到 spider.py: {SPIDER_PATH}")
        return False

    # 第二步：运行 import_db.py
    if os.path.exists(IMPORT_PATH):

        print("📂 步骤2: 运行 import_db.py...")

        try:
            result = subprocess.run(
                [sys.executable, IMPORT_PATH],
                capture_output=True,
                text=True,
                cwd=os.path.dirname(IMPORT_PATH),
                encoding="utf-8"
            )

            print(result.stdout)

            if result.returncode != 0:
                print("❌ import_db.py 执行失败:")
                print(result.stderr)
                return False

        except Exception as e:
            print(f"❌ 运行 import_db.py 失败: {e}")
            return False

    else:
        print(f"❌ 找不到 import_db.py: {IMPORT_PATH}")
        return False

    print("✅ 数据准备完成！")

    return True


# =========================================================
# 数据库连接
# =========================================================

def get_db():
    """获取数据库连接"""

    if not os.path.exists(DB_PATH):
        print(f"❌ 数据库文件不存在: {DB_PATH}")
        return None

    try:
        conn = sqlite3.connect(DB_PATH)
        conn.row_factory = sqlite3.Row
        return conn

    except sqlite3.Error as e:
        print(f"❌ 连接数据库失败: {e}")
        return None


# =========================================================
# CORS
# =========================================================

@app.after_request
def after_request(response):

    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"

    return response


# =========================================================
# 首页接口
# =========================================================

@app.route("/")
def index():

    return jsonify({
        "service": "大学生笔记本价格预测与推荐系统",
        "status": "运行中",
        "version": "2.0",
        "endpoints": [
            "/api/laptops",
            "/api/recommend",
            "/api/stats/brand_avg",
            "/api/stats/price_dist",
            "/api/stats/trend",
            "/api/options/brands",
            "/api/options/cpu",
            "/api/options/memory",
            "/api/options/storage"
        ]
    })


# =========================================================
# 笔记本查询
# =========================================================

@app.route("/api/laptops")
def get_laptops():
    """
    获取笔记本列表

    支持：
    brand       品牌
    name        名称关键词
    cpu         CPU关键词
    memory      内存
    storage     存储
    min_price   最低价格
    max_price   最高价格
    limit       返回数量
    """

    brand = request.args.get("brand")
    name = request.args.get("name")
    cpu = request.args.get("cpu")
    memory = request.args.get("memory")
    storage = request.args.get("storage")

    min_price = request.args.get("min_price", type=float)
    max_price = request.args.get("max_price", type=float)

    limit = request.args.get("limit", 50, type=int)

    # 防止一次请求太多
    limit = min(max(limit, 1), 1000)

    conn = get_db()

    if conn is None:
        return jsonify({
            "error": "数据库未就绪"
        }), 500

    # =====================================================
    # 动态 SQL
    # =====================================================

    sql = """
        SELECT *
        FROM laptops
        WHERE 1=1
    """

    params = []

    # 品牌
    if brand:
        sql += " AND brand = ?"
        params.append(brand)

    # 名称
    if name:
        sql += " AND name LIKE ?"
        params.append(f"%{name}%")

    # CPU
    if cpu:
        sql += """
            AND (
                cpu LIKE ?
                OR cpu_brand LIKE ?
            )
        """

        params.append(f"%{cpu}%")
        params.append(f"%{cpu}%")

    # 内存
    if memory:
        sql += " AND CAST(memory AS TEXT) LIKE ?"
        params.append(f"%{memory}%")

    # 存储
    if storage:
        sql += " AND CAST(storage AS TEXT) LIKE ?"
        params.append(f"%{storage}%")

    # 最低价格
    if min_price is not None:
        sql += " AND price >= ?"
        params.append(min_price)

    # 最高价格
    if max_price is not None:
        sql += " AND price <= ?"
        params.append(max_price)

    sql += " LIMIT ?"
    params.append(limit)

    try:

        cursor = conn.cursor()

        cursor.execute(sql, params)

        rows = cursor.fetchall()

        conn.close()

    except Exception as e:

        conn.close()

        return jsonify({
            "error": f"查询失败: {str(e)}"
        }), 500

    # =====================================================
    # 转换 JSON
    # =====================================================

    result = []

    for r in rows:

        try:

            result.append({
                "id": r["id"] if "id" in r.keys() else None,

                "brand": r["brand"] if r["brand"] else "未知品牌",

                "name": r["name"] if r["name"] else "未知型号",

                "cpu_brand": r["cpu_brand"] if r["cpu_brand"] else "",

                "cpu": r["cpu"] if r["cpu"] else "",

                "cpu_cores": r["cpu_cores"] if r["cpu_cores"] else "",

                "cpu_threads": r["cpu_threads"] if r["cpu_threads"] else "",

                "memory": r["memory"] if r["memory"] else "",

                "storage": r["storage"] if r["storage"] else "",

                "gpu_brand": r["gpu_brand"] if r["gpu_brand"] else "",

                "gpu": r["gpu"] if r["gpu"] else "",

                "price": float(r["price"]) if r["price"] else 0,

                "rating": r["rating"] if r["rating"] else "",

                "review_count": r["review_count"]
                if "review_count" in r.keys() and r["review_count"]
                else 0,

                "source": r["source"]
                if "source" in r.keys()
                else "",

                "crawl_date": r["crawl_date"]
                if "crawl_date" in r.keys()
                else ""
            })

        except Exception as e:

            print(f"⚠️ 数据转换失败: {e}")

    return jsonify(result)


# =========================================================
# 品牌列表
# =========================================================

@app.route("/api/options/brands")
def get_brands():

    conn = get_db()

    if conn is None:
        return jsonify([])

    cursor = conn.cursor()

    cursor.execute("""
        SELECT DISTINCT brand
        FROM laptops
        WHERE brand IS NOT NULL
        AND brand != ''
        ORDER BY brand
    """)

    rows = cursor.fetchall()

    conn.close()

    return jsonify([
        row["brand"]
        for row in rows
    ])


# =========================================================
# CPU选项
# =========================================================

@app.route("/api/options/cpu")
def get_cpu_options():

    conn = get_db()

    if conn is None:
        return jsonify([])

    cursor = conn.cursor()

    cursor.execute("""
        SELECT DISTINCT cpu_brand
        FROM laptops
        WHERE cpu_brand IS NOT NULL
        AND cpu_brand != ''
        ORDER BY cpu_brand
    """)

    rows = cursor.fetchall()

    conn.close()

    return jsonify([
        row["cpu_brand"]
        for row in rows
    ])


# =========================================================
# 内存选项
# =========================================================

@app.route("/api/options/memory")
def get_memory_options():

    conn = get_db()

    if conn is None:
        return jsonify([])

    cursor = conn.cursor()

    cursor.execute("""
        SELECT DISTINCT memory
        FROM laptops
        WHERE memory IS NOT NULL
        AND memory != ''
        ORDER BY memory
    """)

    rows = cursor.fetchall()

    conn.close()

    return jsonify([
        row["memory"]
        for row in rows
    ])


# =========================================================
# 存储选项
# =========================================================

@app.route("/api/options/storage")
def get_storage_options():

    conn = get_db()

    if conn is None:
        return jsonify([])

    cursor = conn.cursor()

    cursor.execute("""
        SELECT DISTINCT storage
        FROM laptops
        WHERE storage IS NOT NULL
        AND storage != ''
        ORDER BY storage
    """)

    rows = cursor.fetchall()

    conn.close()

    return jsonify([
        row["storage"]
        for row in rows
    ])


# =========================================================
# 品牌平均价格
# =========================================================

@app.route("/api/stats/brand_avg")
def brand_avg():

    conn = get_db()

    if conn is None:
        return jsonify([])

    try:

        df = pd.read_sql(
            """
            SELECT brand, price
            FROM laptops
            WHERE price > 0
            """,
            conn
        )

        conn.close()

    except Exception as e:

        conn.close()

        return jsonify({
            "error": str(e)
        }), 500

    if df.empty:
        return jsonify([])

    result = (
        df.groupby("brand")["price"]
        .agg(["mean", "count"])
        .round(2)
    )

    data = []

    for brand, row in result.iterrows():

        data.append({
            "brand": brand,
            "avg_price": float(row["mean"]),
            "count": int(row["count"])
        })

    return jsonify(data)


# =========================================================
# 价格区间分布
# =========================================================

@app.route("/api/stats/price_dist")
def price_dist():

    conn = get_db()

    if conn is None:
        return jsonify([])

    try:

        df = pd.read_sql(
            """
            SELECT price
            FROM laptops
            WHERE price > 0
            """,
            conn
        )

        conn.close()

    except Exception as e:

        conn.close()

        return jsonify({
            "error": str(e)
        }), 500

    if df.empty:
        return jsonify([])

    bins = [
        0,
        300,
        500,
        800,
        1000,
        1500,
        2000,
        3000,
        5000,
        float("inf")
    ]

    labels = [
        "0-300",
        "300-500",
        "500-800",
        "800-1000",
        "1000-1500",
        "1500-2000",
        "2000-3000",
        "3000-5000",
        "5000+"
    ]

    df["range"] = pd.cut(
        df["price"],
        bins=bins,
        labels=labels,
        right=False
    )

    result = (
        df["range"]
        .value_counts()
        .sort_index()
        .reset_index()
    )

    return jsonify([
        {
            "range_label": str(row["range"]),
            "count": int(row["count"])
        }
        for _, row in result.iterrows()
    ])


# =========================================================
# 趋势数据
# =========================================================

@app.route("/api/stats/trend")
def price_trend():

    conn = get_db()

    if conn is None:
        return jsonify([])

    try:

        df = pd.read_sql(
            """
            SELECT crawl_date, price
            FROM laptops
            WHERE price > 0
            AND crawl_date IS NOT NULL
            AND crawl_date != ''
            """,
            conn
        )

        conn.close()

    except Exception as e:

        conn.close()

        return jsonify({
            "error": str(e)
        }), 500

    if df.empty:
        return jsonify([])

    result = (
        df.groupby("crawl_date")["price"]
        .mean()
        .round(2)
        .reset_index()
    )

    return jsonify([
        {
            "date": row["crawl_date"],
            "avg_price": float(row["price"])
        }
        for _, row in result.iterrows()
    ])


# =========================================================
# 推荐系统
# =========================================================

@app.route("/api/recommend", methods=["GET", "POST"])
def recommend():

    """
    大学生笔记本推荐

    参数：

    budget:
        用户预算

    major:
        用户专业

    memory:
        期望内存

    storage:
        期望存储

    brand:
        品牌偏好

    """

    # =====================================================
    # 同时支持 GET 和 POST
    # =====================================================

    if request.method == "POST":

        data = request.get_json(silent=True) or {}

        budget = data.get("budget")
        major = data.get("major")
        memory = data.get("memory")
        storage = data.get("storage")
        brand = data.get("brand")

    else:

        budget = request.args.get("budget", type=float)
        major = request.args.get("major")
        memory = request.args.get("memory")
        storage = request.args.get("storage")
        brand = request.args.get("brand")

    # =====================================================
    # 默认预算
    # =====================================================

    if budget is None:
        budget = 1000

    try:
        budget = float(budget)
    except:
        budget = 1000

    # =====================================================
    # 查询数据库
    # =====================================================

    conn = get_db()

    if conn is None:
        return jsonify({
            "error": "数据库未就绪"
        }), 500

    try:

        df = pd.read_sql(
            """
            SELECT *
            FROM laptops
            WHERE price > 0
            """,
            conn
        )

        conn.close()

    except Exception as e:

        conn.close()

        return jsonify({
            "error": str(e)
        }), 500

    if df.empty:

        return jsonify([])

    # =====================================================
    # 计算推荐评分
    # =====================================================

    recommendations = []

    for _, laptop in df.iterrows():

        price = float(laptop["price"])

        score = 0

        reasons = []

        # -------------------------------------------------
        # 1. 预算评分
        # -------------------------------------------------

        if price <= budget:

            score += 40

            reasons.append("价格符合预算")

        else:

            # 超预算越多，扣分越多
            over_ratio = (price - budget) / budget

            score += max(
                0,
                40 - over_ratio * 100
            )

        # -------------------------------------------------
        # 2. 专业评分
        # -------------------------------------------------

        cpu_text = str(
            laptop.get("cpu", "")
        ).lower()

        gpu_text = str(
            laptop.get("gpu", "")
        ).lower()

        name_text = str(
            laptop.get("name", "")
        ).lower()

        major_text = str(
            major or ""
        ).lower()

        # 计算机类
        if any(word in major_text for word in [
            "计算机",
            "软件",
            "人工智能",
            "computer",
            "software"
        ]):

            score += 20

            if any(word in gpu_text for word in [
                "rtx",
                "gtx",
                "nvidia",
                "radeon"
            ]):

                score += 10
                reasons.append("适合编程及计算任务")

            if any(word in cpu_text for word in [
                "i7",
                "i9",
                "ryzen 7",
                "ryzen 9",
                "ultra 7",
                "ultra 9"
            ]):

                score += 8

        # -------------------------------------------------
        # 设计类
        # -------------------------------------------------

        elif any(word in major_text for word in [
            "设计",
            "艺术",
            "视觉",
            "动画"
        ]):

            score += 20

            if any(word in gpu_text for word in [
                "rtx",
                "gtx",
                "nvidia"
            ]):

                score += 15

                reasons.append("独立显卡适合设计软件")

        # -------------------------------------------------
        # 经管类
        # -------------------------------------------------

        elif any(word in major_text for word in [
            "经济",
            "金融",
            "会计",
            "管理",
            "工商"
        ]):

            score += 20

            if price <= budget:

                score += 5

            reasons.append("适合办公和数据处理")

        # -------------------------------------------------
        # 文科类
        # -------------------------------------------------

        elif any(word in major_text for word in [
            "文学",
            "语言",
            "历史",
            "新闻",
            "法学",
            "教育"
        ]):

            score += 20

            if price <= budget:

                score += 10

            reasons.append("适合日常学习和办公")

        # -------------------------------------------------
        # 3. 内存
        # -------------------------------------------------

        memory_text = str(
            laptop.get("memory", "")
        ).lower()

        if memory:

            if str(memory).lower() in memory_text:

                score += 10

                reasons.append("内存符合需求")

        # -------------------------------------------------
        # 4. 存储
        # -------------------------------------------------

        storage_text = str(
            laptop.get("storage", "")
        ).lower()

        if storage:

            if str(storage).lower() in storage_text:

                score += 10

                reasons.append("存储容量符合需求")

        # -------------------------------------------------
        # 5. 品牌
        # -------------------------------------------------

        if brand:

            if str(
                laptop.get("brand", "")
            ).lower() == str(brand).lower():

                score += 8

                reasons.append("符合品牌偏好")

        # -------------------------------------------------
        # 6. 评分
        # -------------------------------------------------

        try:

            rating = float(
                laptop.get("rating", 0)
            )

            if rating >= 4:

                score += 5

        except:

            pass

        # -------------------------------------------------
        # 保存
        # -------------------------------------------------

        recommendations.append({

            "id": laptop.get("id"),

            "brand": laptop.get(
                "brand",
                "未知品牌"
            ),

            "name": laptop.get(
                "name",
                "未知型号"
            ),

            "cpu_brand": laptop.get(
                "cpu_brand",
                ""
            ),

            "cpu": laptop.get(
                "cpu",
                ""
            ),

            "cpu_cores": laptop.get(
                "cpu_cores",
                ""
            ),

            "cpu_threads": laptop.get(
                "cpu_threads",
                ""
            ),

            "memory": laptop.get(
                "memory",
                ""
            ),

            "storage": laptop.get(
                "storage",
                ""
            ),

            "gpu_brand": laptop.get(
                "gpu_brand",
                ""
            ),

            "gpu": laptop.get(
                "gpu",
                ""
            ),

            "price": price,

            "rating": laptop.get(
                "rating",
                ""
            ),

            "score": round(
                min(score, 100),
                2
            ),

            "reasons": reasons

        })

    # =====================================================
    # 排序
    # =====================================================

    recommendations.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    # =====================================================
    # 返回前10
    # =====================================================

    return jsonify(
        recommendations[:10]
    )


# =========================================================
# 数据库统计
# =========================================================

@app.route("/api/stats/overview")
def overview():

    conn = get_db()

    if conn is None:
        return jsonify({}), 500

    try:

        cursor = conn.cursor()

        # 总数量
        cursor.execute(
            "SELECT COUNT(*) FROM laptops"
        )

        total = cursor.fetchone()[0]

        # 平均价格
        cursor.execute(
            """
            SELECT AVG(price)
            FROM laptops
            WHERE price > 0
            """
        )

        avg_price = cursor.fetchone()[0]

        # 最低价格
        cursor.execute(
            """
            SELECT MIN(price)
            FROM laptops
            WHERE price > 0
            """
        )

        min_price = cursor.fetchone()[0]

        # 最高价格
        cursor.execute(
            """
            SELECT MAX(price)
            FROM laptops
            WHERE price > 0
            """
        )

        max_price = cursor.fetchone()[0]

        # 品牌数量
        cursor.execute(
            """
            SELECT COUNT(DISTINCT brand)
            FROM laptops
            """
        )

        brand_count = cursor.fetchone()[0]

        conn.close()

        return jsonify({

            "total": int(total),

            "avg_price": round(
                float(avg_price or 0),
                2
            ),

            "min_price": round(
                float(min_price or 0),
                2
            ),

            "max_price": round(
                float(max_price or 0),
                2
            ),

            "brand_count": int(
                brand_count
            )

        })

    except Exception as e:

        conn.close()

        return jsonify({
            "error": str(e)
        }), 500


# =========================================================
# 启动
# =========================================================

if __name__ == "__main__":

    print("=" * 50)
    print("💻 大学生笔记本价格预测与推荐系统")
    print("=" * 50)

    if ensure_database():

        print("🚀 启动 Flask 服务...")
        print("🌐 地址：http://localhost:8000")

        app.run(
            host="0.0.0.0",
            port=8000,
            debug=True
        )

    else:

        print("❌ 数据准备失败，请检查数据库和数据文件")