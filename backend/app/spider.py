"""
暂时放弃爬取京东数据，使用公开数据集
爬虫模块 - 爬取京东笔记本数据
使用 Selenium 模拟浏览器
"""

import sys
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

import os
import time
import random
import csv
import pandas as pd
from datetime import datetime
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager

# ===== 配置 =====
# 爬取页数（每页约30-60条商品，爬3页约100-150条）
MAX_PAGES = 3

# 输出文件
RAW_CSV = "backend/data/raw.csv"

# ===== 设置浏览器（无头模式可选） =====
def get_driver():
    """创建 Chrome 浏览器对象（与 test.py 保持一致）"""
    print("🚀 正在启动 Chrome...")
    
    chrome_options = Options()
    chrome_options.binary_location = r"C:\Program Files\Google\Chrome\Application\chrome.exe"   #强制固定Chrome的路径
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    # chrome_options.add_argument("--headless")  # 无头模式（可选）
    
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    print("✅ Chrome 启动成功！")
    return driver


def parse_price(price_text):
    """解析价格字符串 -> 浮点数"""
    if not price_text:
        return None
    # 去掉 ¥ 符号、空格、逗号
    cleaned = price_text.replace("¥", "").replace(",", "").replace(" ", "").strip()
    try:
        return float(cleaned)
    except:
        return None


def parse_review_count(text):
    """解析评价数 -> 整数"""
    if not text:
        return 0
    # 去掉"万"字，处理"1.2万"这种格式
    if "万" in text:
        try:
            return int(float(text.replace("万", "").strip()) * 10000)
        except:
            return 0
    # 去掉"+"号
    text = text.replace("+", "").strip()
    try:
        return int(text)
    except:
        return 0


def fetch_laptops():
    """
    读取公开数据集，标准化为统一格式
    
    输出列名: name, brand, price, review_count, source, crawl_date
    """
    import pandas as pd
    import os
    from datetime import datetime
    
    # 文件路径
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    file_path = os.path.join(base_dir, "input_data", "laptops.csv")
    
    print(f"📂 正在读取数据集: {file_path}")
    
    if not os.path.exists(file_path):
        print(f"❌ 文件不存在！请将 laptops.csv 放到 data/ 目录下")
        return []
    
    try:
        df = pd.read_csv(file_path)
        print(f"✅ 原始数据: {len(df)} 条")
        
        # 构建标准化 DataFrame
        result_df = pd.DataFrame()
        
        # brand 列
        if "Company" in df.columns:
            result_df["brand"] = df["Company"]
        elif "Brand" in df.columns:
            result_df["brand"] = df["Brand"]
        else:
            result_df["brand"] = "未知品牌"

        # name 列
        if "Product" in df.columns:
            result_df["name"] = df["Product"]
        elif "TypeName" in df.columns:
            result_df["name"] = df["TypeName"]
        elif "Model" in df.columns:
            result_df["name"] = df["Model"]
        else:
            result_df["name"] = "未知型号"
        
        # CPU 列
        if "CPU" in df.columns:
            result_df["cpu"] = df["CPU"]
        elif "Processor" in df.columns:
            result_df["cpu"] = df["Processor"]
        else:
            result_df["cpu"] = "未知CPU"

        # memory 列
        if "RAM_GB" in df.columns:
            result_df["memory"] = df["RAM_GB"]
        elif "Memory" in df.columns:
            result_df["memory"] = df["Memory"]
        else:
            result_df["memory"] = "未知内存"

        # storage 列
        if "Storage_GB" in df.columns:
            result_df["storage"] = df["Storage_GB"]
        elif "Storage" in df.columns:
            result_df["storage"] = df["Storage"]
        else:
            result_df["storage"] = "未知存储"

        # GPU 列
        if "GPU" in df.columns:
            result_df["gpu"] = df["GPU"]
        elif "Graphics" in df.columns:
            result_df["gpu"] = df["Graphics"]
        else:
            result_df["gpu"] = "未知GPU"

        # price 列
        if "Price_USD" in df.columns:
            result_df["price"] = df["Price_USD"]
        elif "Price" in df.columns:
            result_df["price"] = df["Price"]
        else:
            result_df["price"] = 0

        # category 列
        if "Category" in df.columns:    
            result_df["category"] = df["Category"]
        else:
            result_df["category"] = "未知类别"

        # review_count（固定为0）
        result_df["review_count"] = 0
        
        # source
        result_df["source"] = "sohaibdevv"
        
        # crawl_date
        result_df["crawl_date"] = datetime.now().strftime("%Y-%m-%d")
        
        # 清洗：剔除异常价格
        result_df = result_df[(result_df["price"] >= 100) & (result_df["price"] <= 50000)]
        result_df = result_df[result_df["brand"].notna() & (result_df["brand"] != "")]
        result_df = result_df[result_df["name"].notna() & (result_df["name"] != "")]
        
        print(f"✅ 清洗后数据: {len(result_df)} 条")
        
        # 保存
        output_path = os.path.join(base_dir, "backend","data", "raw.csv")
        os.makedirs(os.path.dirname(output_path), exist_ok=True)
        result_df.to_csv(output_path, index=False, encoding="utf-8-sig")
        print(f"✅ 已保存到: {output_path}")
        
        # 预览
        print("\n📋 数据预览（前3条）:")
        for i, row in result_df.head(3).iterrows():
            print(f"  {i+1}. {row['brand']} | {row['name'][:30]}... | ${row['price']}")
        
        return result_df.to_dict(orient="records")
        
    except Exception as e:
        print(f"❌ 读取失败: {e}")
        return []


def save_to_csv(items, filename=RAW_CSV):
    """保存数据到 CSV 文件"""
    if not items:
        print("⚠️ 没有数据可保存")
        return
    
    import os
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    
    with open(filename, "w", newline="", encoding="utf-8-sig") as f:
        fieldnames = ["name", "brand", "price", "review_count", "source", "crawl_date"]
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(items)
    
    print(f"✅ 已保存 {len(items)} 条数据到 {filename}")

# ===== 主函数 =====
if __name__ == "__main__":
    print("🚀 开始读取笔记本电脑数据...")
    
    # 爬取数据
    data = fetch_laptops()
    
    print(f"📊 共获取 {len(data)} 条有效数据")
