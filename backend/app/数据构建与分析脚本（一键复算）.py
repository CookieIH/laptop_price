# -*- coding: utf-8 -*-
"""
笔记本市场价格走势分析与可视化系统 —— 数据集构建 + 统计计算 + 性能评分模型
口径说明：
- 时间窗口：2025-09 ~ 2026-08（12 个月）
- 机型：73 款主流在售机型，配置与首发价锚定 2025-2026 年公开市场行情（中关村在线/京东/太平洋等公开报价）
- 价格序列：基于公开行情建模生成的教学分析数据（非逐日实测），用于演示完整分析流程
- 涨价周期：2026-04 起存储/内存成本上涨驱动；苹果 2026-06 全球涨价 12%-20%
"""
import json, math, random, statistics

random.seed(20260905)
MONTHS = ["2025-09","2025-10","2025-11","2025-12","2026-01","2026-02",
          "2026-03","2026-04","2026-05","2026-06","2026-07","2026-08"]

# ---------------- 性能评分基准表 ----------------
CPU_SCORE = {
    # Intel
    "Core Ultra 9 285HX": 96, "Core Ultra 9 275HX": 93, "Core Ultra 7 255HX": 88,
    "Core Ultra 7 251HX": 85, "Core Ultra 7 258V": 80, "Core Ultra 7 155H": 74,
    "i9-14900HX": 84, "Core Ultra 9 185H": 82, "i7-14650HX": 77, "i7-13700H": 70, "i7-13650HX": 68,
    "Core Ultra 5 225H": 64, "Core Ultra 5 125H": 58, "i5-13500H": 54, "i5-1235U": 32,
    # AMD
    "Ryzen 9 9955HX3D": 97, "Ryzen 9 9955HX": 94, "Ryzen AI 9 HX 375": 90,
    "Ryzen AI 9 HX 370": 87, "Ryzen 9 8940HX": 85, "Ryzen 9 7945HX": 83,
    "Ryzen AI 7 350": 68, "Ryzen 7 8845H": 72, "Ryzen 7 8745H": 66,
    "Ryzen 7 7735H": 57, "Ryzen 5 7640H": 55, "Ryzen 5 7530U": 42,
    # Apple
    "M5 Max": 98, "M5 Pro": 92, "M5": 81, "M4 Pro": 88, "M4": 76, "M3": 63, "M2": 52,
}
GPU_SCORE = {
    "RTX 5090 Laptop": 99, "RTX 5080 Laptop": 94, "RTX 5070 Ti Laptop": 87,
    "RTX 5070 Laptop": 80, "RTX 5060 Laptop": 67, "RTX 5050 Laptop": 54,
    "RTX 4070 Laptop": 70, "RTX 4060 Laptop": 58, "RTX 4050 Laptop": 45,
    "RX 9070M XT": 84, "RX 9070M": 80, "Radeon 780M": 22, "Arc 140T": 20,
    "Arc 核显": 16, "Iris Xe": 10,
    "Apple M5 Max 集成": 96, "Apple M5 Pro 集成": 86, "Apple M5 集成": 72,
    "Apple M4 Pro 集成": 80, "Apple M4 集成": 63, "Apple M3 集成": 50,
}
def ram_score(gb): return {64:100, 48:96, 36:92, 32:90, 24:80, 16:68, 8:42}[gb]
def sto_score(gb): return {4096:100, 2048:92, 1024:78, 512:58, 256:38}[gb]
def scr_score(res, hz, size):
    base = {"1080p":45, "2.5K":66, "2.8K":70, "3K":72, "3.1K":72, "3.2K":78, "3.5K":82, "4K":85}[res]
    ref = {60:0, 90:4, 120:8, 144:10, 165:10, 180:12, 240:14, 300:16}[hz]
    size_b = 3 if size < 14 else (5 if size < 15.5 else (6 if size < 17 else 4))
    return min(100, base + ref + size_b)

def perf_score(m):
    cpu, gpu = CPU_SCORE[m["cpu"]], GPU_SCORE[m["gpu"]]
    return round(0.40*cpu + 0.30*gpu + 0.12*ram_score(m["ram"]) + 0.10*sto_score(m["sto"]) + 0.08*scr_score(m["res"], m["hz"], m["size"]), 1)

# ---------------- 机型目录（配置/首发价锚定公开行情） ----------------
# (brand, series, cat, cpu, gpu, ram, sto, size, res, hz, weight, launch_ym, launch_price)
CAT = {"轻薄本","全能本","游戏本","创作本","商务本"}
M = [
 ("联想","拯救者 Y7000P 2026","游戏本","Core Ultra 7 251HX","RTX 5060 Laptop",16,1024,16,"2.5K",240,2.4,"2025-10",10999),
 ("联想","拯救者 Y7000P 2026 高配","游戏本","Core Ultra 7 255HX","RTX 5070 Laptop",32,1024,16,"2.5K",240,2.4,"2025-11",13999),
 ("联想","拯救者 Y9000P 2026","游戏本","Core Ultra 9 275HX","RTX 5070 Ti Laptop",32,1024,16,"2.5K",240,2.6,"2025-11",16499),
 ("联想","拯救者 R9000P 2026","游戏本","Ryzen 9 8940HX","RTX 5060 Laptop",16,1024,16,"2.5K",240,2.5,"2025-10",9999),
 ("联想","拯救者 R7000P 2026","游戏本","Ryzen 7 8845H","RTX 5060 Laptop",16,1024,16,"2.5K",165,2.4,"2025-09",7999),
 ("联想","小新 Pro 16 2026","轻薄本","Core Ultra 5 225H","Arc 核显",32,1024,16,"2.5K",120,1.8,"2026-03",7899),
 ("联想","小新 Pro 14 2026","轻薄本","Core Ultra 5 225H","Arc 核显",16,1024,14,"2.8K",120,1.45,"2026-03",6499),
 ("联想","小新 Pro 14 2025","轻薄本","Core Ultra 5 125H","Arc 核显",16,512,14,"2.8K",120,1.46,"2025-04",5499),
 ("联想","ThinkBook 14+ 2026","轻薄本","Core Ultra 5 225H","Arc 核显",16,1024,14.5,"3K",120,1.5,"2026-04",5999),
 ("联想","ThinkBook 16+ 2026","全能本","Core Ultra 7 255HX","RTX 5060 Laptop",32,1024,16,"3.2K",165,1.9,"2026-04",9499),
 ("联想","ThinkPad X1 Carbon Gen13","商务本","Core Ultra 7 258V","Arc 140T",32,1024,14,"2.8K",120,1.09,"2025-06",12999),
 ("联想","IdeaPad Pro 16 2024","全能本","Core Ultra 7 155H","RTX 4060 Laptop",16,1024,16,"2.5K",120,1.9,"2024-10",7499),
 ("华硕","天选 7 Pro 锐龙版","游戏本","Ryzen 9 8940HX","RTX 5070 Laptop",16,1024,16,"2.5K",300,2.2,"2025-10",9299),
 ("华硕","天选 6 Pro 酷睿版","游戏本","i9-14900HX","RTX 5060 Laptop",16,1024,16,"2.5K",165,2.3,"2025-05",9999),
 ("华硕","ROG 魔霸 9","游戏本","Core Ultra 9 275HX","RTX 5070 Ti Laptop",32,1024,16,"2.5K",240,2.5,"2025-10",13999),
 ("华硕","ROG 幻 16 Air","创作本","Core Ultra 9 285HX","RTX 5080 Laptop",32,2048,16,"2.5K",240,1.9,"2026-01",17999),
 ("华硕","无畏 Pro 16 2025","创作本","Core Ultra 9 185H","RTX 4070 Laptop",32,1024,16,"4K",120,1.8,"2025-04",9999),
 ("华硕","灵耀 14 2026","轻薄本","Core Ultra 5 225H","Arc 核显",32,1024,14,"2.8K",120,1.19,"2026-05",6999),
 ("华硕","灵耀 16 Air","轻薄本","Core Ultra 7 258V","Arc 140T",32,1024,16,"2.8K",120,1.49,"2025-08",9999),
 ("华硕","a豆 Air 14","轻薄本","Core Ultra 5 125H","Arc 核显",16,512,14,"2.8K",120,1.29,"2025-02",4299),
 ("华硕","天选 5 Pro","游戏本","i7-13650HX","RTX 4060 Laptop",16,1024,16,"2.5K",165,2.5,"2024-10",7999),
 ("华硕","无畏 14 2025","轻薄本","i5-13500H","Iris Xe",16,512,14,"2.8K",60,1.4,"2025-01",4599),
 ("惠普","暗影精灵 11","游戏本","i7-14650HX","RTX 5060 Laptop",16,1024,16,"2.5K",240,2.3,"2025-05",9499),
 ("惠普","暗影精灵 PRO 15","游戏本","Core Ultra 7 255HX","RTX 5050 Laptop",16,1024,15.6,"2.5K",180,2.2,"2026-05",10999),
 ("惠普","星 Book Pro 14 2026","轻薄本","Core Ultra 5 225H","Arc 核显",16,1024,14,"2.8K",120,1.4,"2026-04",5499),
 ("惠普","星 Book Pro 16 2025","轻薄本","Core Ultra 5 125H","Arc 核显",16,1024,16,"2.5K",120,1.7,"2025-03",4999),
 ("惠普","战 66 七代","商务本","i5-13500H","Iris Xe",16,512,15.6,"1080p",60,1.77,"2024-09",4599),
 ("惠普","幽灵 Spectre x360 14","商务本","Core Ultra 7 258V","Arc 140T",32,1024,14,"2.8K",120,1.34,"2025-07",11999),
 ("惠普","暗影精灵 9","游戏本","i7-13700H","RTX 4060 Laptop",16,512,16.1,"2.5K",165,2.4,"2024-06",8499),
 ("惠普","星 Book 14 2025","轻薄本","i5-1235U","Iris Xe",16,512,14,"1080p",60,1.4,"2025-02",3599),
 ("戴尔","游匣 G16 2025","游戏本","i7-13650HX","RTX 5060 Laptop",16,1024,16,"2.5K",240,2.7,"2025-04",8999),
 ("戴尔","灵越 16 Plus 2025","创作本","Core Ultra 9 185H","RTX 4060 Laptop",32,1024,16,"2.5K",120,2.0,"2025-03",9499),
 ("戴尔","XPS 13 2025","轻薄本","Core Ultra 7 258V","Arc 140T",32,1024,13.4,"3K",120,1.2,"2025-04",10999),
 ("戴尔","灵越 14 2026","轻薄本","Core Ultra 5 225H","Arc 核显",16,512,14,"2.5K",120,1.5,"2026-04",5499),
 ("戴尔","游匣 G15 2024","游戏本","i7-13650HX","RTX 4060 Laptop",16,512,15.6,"1080p",165,2.65,"2024-08",7499),
 ("戴尔","成就 Vostro 15","商务本","i5-13500H","Iris Xe",16,512,15.6,"1080p",60,1.75,"2024-11",4999),
 ("华为","MateBook X Pro 2026","轻薄本","Core Ultra 7 258V","Arc 140T",32,2048,14.2,"3.1K",120,0.98,"2026-03",13999),
 ("华为","MateBook Pro 柔光版","轻薄本","Core Ultra 7 155H","Arc 核显",32,1024,14.2,"3.1K",120,1.49,"2025-05",9999),
 ("华为","MateBook 14 2026","轻薄本","Core Ultra 5 225H","Arc 核显",16,1024,14.2,"2.8K",120,1.31,"2026-04",6199),
 ("华为","MateBook 14 2024","轻薄本","Core Ultra 5 125H","Arc 核显",16,1024,14.2,"2.8K",120,1.31,"2024-06",6099),
 ("华为","MateBook D16 2026","商务本","i5-13500H","Iris Xe",16,1024,16,"1080p",60,1.7,"2026-03",4899),
 ("华为","MateBook GT 14","全能本","i9-14900HX","RTX 4060 Laptop",16,1024,14.2,"2.8K",144,1.49,"2025-08",8899),
 ("华为","MateBook D14 2024","轻薄本","i5-1235U","Iris Xe",16,512,14,"1080p",60,1.39,"2024-04",4499),
 ("苹果","MacBook Air 13 M5 2026","轻薄本","M5","Apple M5 集成",16,512,13.6,"2.5K",60,1.24,"2026-03",9999),
 ("苹果","MacBook Air 13 M4 2025","轻薄本","M4","Apple M4 集成",16,256,13.6,"2.5K",60,1.24,"2025-03",6999),
 ("苹果","MacBook Air 15 M4 2025","轻薄本","M4","Apple M4 集成",16,512,15.3,"2.5K",60,1.51,"2025-03",10999),
 ("苹果","MacBook Air 15 M5 2026","轻薄本","M5","Apple M5 集成",16,512,15.3,"2.5K",60,1.51,"2026-03",11999),
 ("苹果","MacBook Pro 14 M4 Pro 2025","创作本","M4 Pro","Apple M4 Pro 集成",24,1024,14.2,"3K",120,1.6,"2025-04",14999),
 ("苹果","MacBook Pro 14 M5 Pro 2026","创作本","M5 Pro","Apple M5 Pro 集成",24,1024,14.2,"3K",120,1.6,"2026-02",17999),
 ("苹果","MacBook Pro 16 M5 Pro 2026","创作本","M5 Pro","Apple M5 Pro 集成",36,1024,16.2,"3.5K",120,2.14,"2026-02",23999),
 ("苹果","MacBook Pro 16 M5 Max 2026","创作本","M5 Max","Apple M5 Max 集成",48,2048,16.2,"3.5K",120,2.14,"2026-02",33999),
 ("小米","RedmiBook Pro 16 2026","轻薄本","Core Ultra 5 225H","Arc 核显",32,1024,16,"3.2K",165,1.8,"2026-03",5699),
 ("小米","RedmiBook Pro 15 2025","轻薄本","Core Ultra 5 125H","Arc 核显",16,512,15.6,"3.2K",120,1.8,"2025-03",4999),
 ("小米","小米笔记本 Pro 14 2025","轻薄本","Core Ultra 7 155H","Arc 核显",32,1024,14,"2.8K",120,1.5,"2025-06",6999),
 ("小米","Redmi G Pro 2025","游戏本","i7-14650HX","RTX 5060 Laptop",16,1024,16,"2.5K",240,2.6,"2025-07",7999),
 ("小米","RedmiBook 14 2025","轻薄本","Core Ultra 5 125H","Arc 核显",16,512,14,"2.8K",120,1.37,"2025-04",4299),
 ("荣耀","MagicBook Pro 16 2026","全能本","Core Ultra 5 225H","Arc 核显",24,1024,16,"3.2K",165,1.79,"2026-03",5999),
 ("荣耀","MagicBook 14 2026","轻薄本","Core Ultra 5 225H","Arc 核显",16,1024,14.2,"2.8K",120,1.34,"2026-04",4999),
 ("荣耀","MagicBook Pro 16 2025","创作本","Core Ultra 7 155H","RTX 4060 Laptop",32,1024,16,"3.2K",165,1.9,"2025-04",7499),
 ("荣耀","MagicBook Art 14","轻薄本","Core Ultra 7 258V","Arc 140T",32,1024,14.6,"3.1K",144,1.0,"2025-08",8499),
 ("机械革命","蛟龙 16 Pro 2026","游戏本","Ryzen 7 8845H","RTX 5060 Laptop",16,1024,16,"2.5K",240,2.4,"2025-10",7999),
 ("机械革命","蛟龙 16 Pro 2025","游戏本","Ryzen 7 8745H","RTX 4060 Laptop",16,512,16,"2.5K",165,2.4,"2025-03",6999),
 ("机械革命","旷世 16 Pro 2026","游戏本","Ryzen 9 8940HX","RTX 5070 Ti Laptop",32,1024,16,"2.5K",240,2.6,"2026-01",11999),
 ("机械革命","极光 X 2025","游戏本","i7-14650HX","RTX 5060 Laptop",16,1024,16,"2.5K",240,2.3,"2025-05",7499),
 ("机械革命","无界 14X 2025","轻薄本","Core Ultra 5 125H","Arc 核显",16,1024,14,"2.8K",120,1.4,"2025-03",3799),
 ("机械革命","耀世 16 Pro","游戏本","Ryzen 9 7945HX","RTX 4070 Laptop",16,1024,16,"2.5K",240,2.5,"2024-12",8499),
 ("神舟","战神 Z8 2026","游戏本","i7-13650HX","RTX 5060 Laptop",16,1024,15.6,"2.5K",165,2.4,"2025-11",6499),
 ("神舟","战神 S8 2025","游戏本","i5-13500H","RTX 4060 Laptop",16,512,15.6,"1080p",144,2.4,"2025-02",5699),
 ("神舟","战神 T8 2026","游戏本","Core Ultra 7 255HX","RTX 5070 Laptop",16,1024,16,"2.5K",240,2.5,"2026-04",8999),
 ("神舟","优雅 X5 2025","轻薄本","i5-1235U","Iris Xe",16,512,15.6,"1080p",60,1.7,"2025-01",3299),
 ("宏碁","暗影骑士·擎 2025","游戏本","i7-13650HX","RTX 5060 Laptop",16,1024,16,"2.5K",165,2.5,"2025-04",8499),
 ("宏碁","非凡 Go 14 2025","轻薄本","Core Ultra 5 125H","Arc 核显",16,512,14,"2.8K",120,1.3,"2025-05",4799),
 ("宏碁","掠夺者·擎 Neo 16","游戏本","i9-14900HX","RTX 4070 Laptop",16,1024,16,"2.5K",240,2.6,"2024-11",9499),
]

# ---------------- 价格序列生成（确定性建模） ----------------
def launch_index(ym):
    y, m = int(ym[:4]), int(ym[5:])
    return (y - 2025) * 12 + (m - 8)   # 2025-09 -> 1（窗口起点为 0）

def gen_series(model):
    idx, cat, brand = model["idx"], model["cat"], model["brand"]
    rng = random.Random(20260905 + idx * 131)
    lp = model["launch_price"]
    launch_i = launch_index(model["launch_ym"])   # 0=2025-09 起点；>0 表示窗口内上市
    age0 = max(0, 1 - launch_i)                   # 2025-09 时上市月龄（>=0）
    # 月折旧率（上市 3 个月后开始缓慢降价；老机型折旧衰减）
    dep = {"轻薄本": (0.005, 0.010), "全能本": (0.004, 0.008), "游戏本": (0.003, 0.006),
           "创作本": (0.004, 0.007), "商务本": (0.003, 0.007)}[cat]
    dep_rate = rng.uniform(*dep)
    # 2025-09~2026-03 温和成本缓涨
    infl1 = rng.uniform(0.001, 0.005)
    # 2026-04 起 存储/内存涨价潮（老机型同步跟涨）
    g = {"轻薄本": (0.018, 0.035), "全能本": (0.015, 0.035), "游戏本": (0.022, 0.050),
         "创作本": (0.015, 0.040), "商务本": (0.012, 0.025)}[cat]
    infl2 = rng.uniform(*g)
    apple_hike = rng.uniform(0.12, 0.18) if brand == "苹果" else 0.0
    series = []
    p = float(lp)
    for m in range(12):
        if m < launch_i - 1:                 # 尚未上市
            series.append(None)
            continue
        age = max(age0, m - (launch_i - 1))  # 上市后月龄
        dep_f = min(max(0.0, age - 3), 12) * dep_rate
        if age > 9:
            dep_f *= 0.25                    # 成熟机型折旧显著衰减
        dep_f = min(dep_f, 0.004 if age > 9 else 0.008)  # 月折旧率封顶：成熟 0.4% / 新品 0.8%
        promo = 0.0
        if m == 2:   promo = rng.uniform(-0.050, -0.020)   # 2025-11 双11
        if m == 9:   promo = rng.uniform(-0.060, -0.020)   # 2026-06 618
        if m == 11:  promo = rng.uniform(-0.030, -0.010)   # 2026-08 开学季
        infl = infl1 if m <= 6 else infl2
        # 苹果：2026-06 一次性全球涨价
        apple_f = apple_hike if (brand == "苹果" and m == 9) else (0.01 if (brand == "苹果" and m > 9) else 0.0)
        f = 1.0 - dep_f + infl + promo + apple_f
        p = max(lp * 0.50, min(p * f, lp * 1.45))
        series.append(int(round(p)))
    return series

models = []
for i, row in enumerate(M):
    brand, series, cat, cpu, gpu, ram, sto, size, res, hz, wt, ym, lp = row
    m = {"id": i+1, "brand": brand, "series": series, "cat": cat, "cpu": cpu, "gpu": gpu,
         "ram": ram, "sto": sto, "size": size, "res": res, "hz": hz, "weight": wt,
         "launch_ym": ym, "launch_price": lp, "idx": i}
    m["score"] = perf_score(m)
    m["price_series"] = gen_series(m)
    avail = [x for x in m["price_series"] if x is not None]
    m["price"] = avail[-1]
    m["chg12"] = round((avail[-1] / avail[0] - 1) * 100, 1)
    m["value_idx"] = round(m["score"] * 1000 / m["price"], 1)
    m["grade"] = ("旗舰级" if m["score"] >= 85 else "高端级" if m["score"] >= 70
                  else "主流级" if m["score"] >= 55 else "入门级")
    models.append(m)

# ---------------- 统计指标 ----------------
prices = [m["price"] for m in models]
scores = [m["score"] for m in models]
mean_p = statistics.mean(prices); med_p = statistics.median(prices)
stdev_p = statistics.pstdev(prices); var_p = statistics.pvariance(prices)
q1, q3 = statistics.quantiles(prices, n=4)[0], statistics.quantiles(prices, n=4)[2]
n = len(prices)
skew = (sum((x - mean_p)**3 for x in prices) / n) / (stdev_p**3) if stdev_p else 0.0

def pearson(xs, ys):
    mx, my = sum(xs)/len(xs), sum(ys)/len(ys)
    cov = sum((x-mx)*(y-my) for x, y in zip(xs, ys))
    sx = math.sqrt(sum((x-mx)**2 for x in xs)); sy = math.sqrt(sum((y-my)**2 for y in ys))
    return cov / (sx * sy) if sx and sy else 0.0

bands = [("4000元以下", lambda p: p < 4000), ("4000-6000元", lambda p: 4000 <= p < 6000),
         ("6000-8000元", lambda p: 6000 <= p < 8000), ("8000-10000元", lambda p: 8000 <= p < 10000),
         ("10000-15000元", lambda p: 10000 <= p < 15000), ("15000元以上", lambda p: p >= 15000)]
hist = [{"band": b, "count": sum(1 for p in prices if fn(p))} for b, fn in bands]
mode_band = max(hist, key=lambda h: h["count"])["band"]

brand_stats, brand_chg = {}, {}
for b in sorted({m["brand"] for m in models}):
    ms = [m for m in models if m["brand"] == b]
    ps = [m["price"] for m in ms]
    # 同机型可比口径：仅统计 2025-09 已在售机型
    fixed_b = [m for m in ms if m["price_series"][0] is not None]
    ratios = [m["price"] / m["price_series"][0] for m in fixed_b] if fixed_b else []
    brand_stats[b] = {"n": len(ps), "mean": round(statistics.mean(ps)), "median": round(statistics.median(ps)),
                      "min": min(ps), "max": max(ps), "std": round(statistics.pstdev(ps))}
    brand_chg[b] = round((statistics.mean(ratios) - 1) * 100, 1) if ratios else None

cat_stats, cat_trend, cat_chg = {}, {}, {}
for c in CAT:
    ms = [m for m in models if m["cat"] == c]
    ps = [m["price"] for m in ms]
    cat_stats[c] = {"n": len(ms), "mean": round(statistics.mean(ps)), "median": round(statistics.median(ps))}
    # 可比样本口径：仅统计 2025-09 已在售机型，剔除新机入市的结构效应
    fixed = [m for m in ms if m["price_series"][0] is not None]
    if fixed:
        cat_trend[c] = [round(statistics.mean([m["price_series"][k] for m in fixed])) for k in range(12)]
        cat_chg[c] = round((cat_trend[c][-1] / cat_trend[c][0] - 1) * 100, 1)
    else:
        cat_trend[c] = [None]*12
        cat_chg[c] = None

# 市场整体走势：可比样本口径
fixed_all = [m for m in models if m["price_series"][0] is not None]
trend_all = [round(statistics.mean([m["price_series"][k] for m in fixed_all])) for k in range(12)]
market_chg = round((trend_all[-1] / trend_all[0] - 1) * 100, 1)

# 新机入市结构效应：2025-10 之后上市机型首发价均值 vs 2025-09 在售均价
new_launch = [m for m in models if launch_index(m["launch_ym"]) > 1]
new_mean = round(statistics.mean([m["launch_price"] for m in new_launch]))
old_mean = round(statistics.mean([m["price_series"][0] for m in fixed_all]))
new_n = len(new_launch)
corr_ps = round(pearson(prices, scores), 3)

grades = {}
for g in ["旗舰级", "高端级", "主流级", "入门级"]:
    grades[g] = sum(1 for m in models if m["grade"] == g)

top_value = sorted(models, key=lambda m: -m["value_idx"])[:10]
top_perf  = sorted(models, key=lambda m: -m["score"])[:10]

stats_out = {
    "n": n, "mean": round(mean_p), "median": round(med_p), "std": round(stdev_p),
    "var": round(var_p), "range": max(prices) - min(prices), "min": min(prices), "max": max(prices),
    "q1": round(q1), "q3": round(q3), "iqr": round(q3 - q1), "cv": round(stdev_p / mean_p * 100, 1),
    "skew": round(skew, 2), "mode_band": mode_band,
    "corr_price_score": corr_ps, "market_chg": market_chg,
    "mean_score": round(statistics.mean(scores), 1),
    "mean_value": round(statistics.mean([m["value_idx"] for m in models]), 1),
    "launch_mean": round(statistics.mean([m["launch_price"] for m in models])),
    "new_mean": new_mean, "old_mean": old_mean, "new_n": new_n,
}

out = {
    "months": MONTHS,
    "stats": stats_out,
    "hist": hist,
    "trend_all": trend_all,
    "trend_cat": cat_trend,
    "brand_stats": brand_stats,
    "brand_chg": brand_chg,
    "cat_stats": cat_stats,
    "cat_chg": cat_chg,
    "grades": grades,
    "top_value": [{"brand": m["brand"], "series": m["series"], "cat": m["cat"], "score": m["score"],
                   "price": m["price"], "value_idx": m["value_idx"]} for m in top_value],
    "top_perf": [{"brand": m["brand"], "series": m["series"], "cat": m["cat"], "score": m["score"],
                  "price": m["price"], "value_idx": m["value_idx"]} for m in top_perf],
    "models": [{k: m[k] for k in ("id","brand","series","cat","cpu","gpu","ram","sto","size","res","hz",
                                  "weight","launch_ym","launch_price","score","price","chg12","value_idx","grade","price_series")}
               for m in models],
}
with open("/home/user/.super_doubao/super-doubao-runtime/workspace/laptop-market-dashboard/data.json", "w", encoding="utf-8") as f:
    json.dump(out, f, ensure_ascii=False, indent=1)

print("样本数:", n)
print("市场均价(2025-09):", trend_all[0], "-> (2026-08):", trend_all[-1], f"({market_chg:+.1f}%)")
print("均值:", stats_out["mean"], "中位数:", stats_out["median"], "标准差:", stats_out["std"],
      "变异系数:", stats_out["cv"], "% 偏度:", stats_out["skew"])
print("Q1:", stats_out["q1"], "Q3:", stats_out["q3"], "IQR:", stats_out["iqr"], "极差:", stats_out["range"])
print("众数段:", mode_band, "| 价格-性能相关系数:", corr_ps)
print("评级分布:", grades)
print("分类均价变化:", {k: f"{v:+.1f}%" for k, v in cat_chg.items()})
print("品牌涨幅 Top3:", sorted(brand_chg.items(), key=lambda x: -x[1])[:3])
print("品牌涨幅 Bottom3:", sorted(brand_chg.items(), key=lambda x: x[1])[:3])
print("性价比 Top5:", [(t["brand"], t["series"], t["value_idx"]) for t in top_value[:5]])
