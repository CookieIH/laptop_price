# 有什么通知都在这上面说 直接更新在最上面就行

### 直接运行main.py就可以开启api

### 执行 pip install -r requirements.txt 一键安装所有依赖

### 目前的结构
```
Laptop_Price/
├── backend/ # 后端服务
│ ├── app/              # 应用主目录
│ │ ├── main.py                 # Flask 主程序（API 入口）
│ │ ├── spider.py               # 数据采集模块（数据加载）
│ │ ├── config.py               # 配置文件（数据库路径、参数等）
│ │ ├── db_helper.py            # 数据库工具函数（查询封装）
│ │ ├── import_db.py            # 数据库导入
│ │ └── test.py                 # 测试脚本（Selenium 环境验证）
| | 
│ ├── data/             # 数据目录
│ │ ├── laptops.db              # SQLite 数据库文件
│ │ ├── raw.csv                 # 原始数据（字段标准化后）
│ │ └── clean.csv               # 清洗后数据（P3 产出）
│ └─── requirements.txt # Python 依赖清单
│
├── input_data/    # 项目数据根目录（用于外部输入）
│ └── laptops.csv       # 公开原始数据集（备份）
│
├── docs/    # 项目文档
│ └── 途中遇到的问题.md  # 开发问题记录
│
├── frontend/ # 前端代码（React + Vite）
│ ├── public/
│ │ └── index.html              # HTML 入口
│ ├── src/
│ │ ├── components/             # React 组件
│ │ │ ├── Dashboard/
│ │ │ │ └── StatsCards.jsx      # 统计卡片
│ │ │ └── Charts/
│ │ │ ├── BrandChart.jsx        # 品牌均价柱状图
│ │ │ └── PriceDistChart.jsx    # 价格分布饼图
│ │ ├── services/
│ │ │ └── api.js                # API 调用服务
│ │ ├── styles/
│ │ │ └── main.css              # 全局样式
│ │ ├── App.jsx                 # 主应用组件
│ │ └── main.jsx                # 应用入口
│ ├── package.json              # 前端依赖
│ └── vite.config.js            # Vite 配置
│
│
├── .gitignore # Git 忽略文件
└── README.md # 项目说明文档（本文件）
```
