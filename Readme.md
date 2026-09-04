# 有什么要求或者问题都在这上面说 直接更新在最上面就行

### 执行 pip install -r requirements.txt 一键安装所有依赖

### 目前的结构
```
backend/
├── main.py                 # Flask主程序（API入口）
├── spider.py              # 爬虫代码
├── config.py              # 配置（数据库路径、爬虫参数）
├── db_helper.py           # 数据库工具函数（查询封装）
├── data/
│   ├── laptops.db         # SQLite数据库
│   ├── raw.csv            # 爬虫原始输出
│   └── clean.csv          # P3清洗后输出
└── requirements.txt
```