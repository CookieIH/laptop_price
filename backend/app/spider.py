import requests
from bs4 import BeautifulSoup
import csv
import time
import random
from config import HEADERS, DELAY, RAW_CSV

def fetch_jd_laptops(keyword="笔记本", pages=3):
    """爬取京东笔记本数据"""
    all_items = []
    for page in range(1, pages + 1):
        # 注意：京东搜索页实际URL需要处理，这里示意
        url = f"https://search.jd.com/Search?keyword={keyword}&page={page}"
        try:
            resp = requests.get(url, headers=HEADERS, timeout=10)
            soup = BeautifulSoup(resp.text, "html.parser")
            # 解析商品列表（实际选择器需按京东页面调整）
            items = soup.select(".gl-item")
            for item in items:
                # 提取数据（简化示例）
                name = item.select_one(".p-name em")
                price = item.select_one(".p-price i")
                if name and price:
                    all_items.append({
                        "name": name.text.strip(),
                        "price": float(price.text.replace("¥", "").strip()),
                        "brand": "待提取",   # 品牌需要从名称中提取
                        "source": "京东"
                    })
            time.sleep(random.uniform(1, DELAY + 1))
        except Exception as e:
            print(f"第{page}页爬取失败: {e}")
            continue

    # 保存为CSV
    with open(RAW_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["name", "price", "brand", "source"])
        writer.writeheader()
        writer.writerows(all_items)

    print(f"✅ 爬取完成，共{len(all_items)}条数据，已保存到 {RAW_CSV}")
    return all_items

if __name__ == "__main__":
    fetch_jd_laptops()