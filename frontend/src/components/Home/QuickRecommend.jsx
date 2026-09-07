import React, { useMemo } from "react";


function QuickRecommend({
  laptops = [],
  brandAvg = [],
  priceDist = [],
  onPageChange,
}) {

  // ==========================================
  // 根据现有数据计算几个简单的价格区间
  // ==========================================

  const priceInfo = useMemo(() => {

    const prices = laptops
      .map((item) => Number(item.price))
      .filter((price) => price > 0);

    if (prices.length === 0) {

      return {
        low: 0,
        middle: 0,
        high: 0,
      };

    }

    const low = prices.filter(
      (price) => price < 800
    ).length;

    const middle = prices.filter(
      (price) => price >= 800 && price < 1500
    ).length;

    const high = prices.filter(
      (price) => price >= 1500
    ).length;

    return {
      low,
      middle,
      high,
    };

  }, [laptops]);


  // ==========================================
  // 快速推荐选项
  // ==========================================

  const options = [

    {
      key: "student",

      title: "日常学习",

      description:
        "适合 Word、PPT、网页浏览、在线课程等日常大学学习任务。",

      budget:
        "预算参考：$400 - $800",

      icon: "▤",

      tag: "性价比",

    },

    {
      key: "design",

      title: "设计与编程",

      description:
        "适合计算机、设计等专业，兼顾处理器、内存与多任务性能。",

      budget:
        "预算参考：$700 - $1,500",

      icon: "◇",

      tag: "均衡",

    },

    {
      key: "performance",

      title: "游戏与高性能",

      description:
        "更关注独立显卡、处理器性能和整体性能，适合高负载任务。",

      budget:
        "预算参考：$1,000+",

      icon: "◆",

      tag: "高性能",

    },

  ];


  return (

    <div className="quick-recommend">


      {/* =====================================
          标题
      ====================================== */}

      <div className="quick-recommend-header">

        <div>

          <span className="section-label">
            QUICK START
          </span>

          <h2>
            不知道怎么选？
          </h2>

          <p>
            从你的主要使用场景开始，
            系统将进一步帮你筛选合适的笔记本。
          </p>

        </div>


        <button
          className="text-button"
          onClick={() =>
            onPageChange("recommend")
          }
        >

          查看完整推荐

          <span>
            →
          </span>

        </button>

      </div>


      {/* =====================================
          推荐卡片
      ====================================== */}

      <div className="quick-recommend-grid">

        {options.map((option) => (

          <div
            className="quick-recommend-card"
            key={option.key}
            onClick={() =>
              onPageChange("recommend")
            }
          >

            <div className="quick-card-top">

              <div className="quick-card-icon">

                {option.icon}

              </div>

              <span className="quick-card-tag">

                {option.tag}

              </span>

            </div>


            <h3>
              {option.title}
            </h3>


            <p>
              {option.description}
            </p>


            <div className="quick-card-bottom">

              <span>
                {option.budget}
              </span>

              <span className="quick-card-arrow">
                →
              </span>

            </div>

          </div>

        ))}

      </div>


      {/* =====================================
          数据说明
      ====================================== */}

      <div className="quick-data-summary">

        <div className="quick-data-summary-item">

          <span className="quick-summary-number">
            {priceInfo.low}
          </span>

          <span>
            $800 以下产品
          </span>

        </div>


        <div className="quick-summary-divider"></div>


        <div className="quick-data-summary-item">

          <span className="quick-summary-number">
            {priceInfo.middle}
          </span>

          <span>
            $800-$1500 产品
          </span>

        </div>


        <div className="quick-summary-divider"></div>


        <div className="quick-data-summary-item">

          <span className="quick-summary-number">
            {priceInfo.high}
          </span>

          <span>
            $1500 以上产品
          </span>

        </div>

      </div>

    </div>

  );

}


export default QuickRecommend;