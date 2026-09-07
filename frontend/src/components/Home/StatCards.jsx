import React from "react";

function StatCards({
  laptops = [],
  brands = [],
  brandAvg = [],
  priceDist = [],
}) {

  // ==========================================
  // 笔记本数量
  // ==========================================

  const laptopCount = laptops.length;


  // ==========================================
  // 品牌数量
  // ==========================================

  const brandCount = brands.length;


  // ==========================================
  // 计算平均价格
  // ==========================================

  const prices = laptops
    .map((item) => Number(item.price))
    .filter((price) => price > 0);

  const averagePrice =
    prices.length > 0
      ? prices.reduce((sum, price) => sum + price, 0) /
        prices.length
      : 0;


  // ==========================================
  // 找出数据最多的价格区间
  // ==========================================

  let popularPriceRange = "--";

  if (priceDist.length > 0) {

    const maxRange = [...priceDist].sort(
      (a, b) => Number(b.count) - Number(a.count)
    )[0];

    if (maxRange) {
      popularPriceRange =
        maxRange.range_label || "--";
    }
  }


  // ==========================================
  // 格式化数字
  // ==========================================

  function formatNumber(number) {

    if (!number) {
      return "--";
    }

    return Number(number).toLocaleString();
  }


  // ==========================================
  // 格式化价格
  // ==========================================

  function formatPrice(price) {

    if (!price) {
      return "--";
    }

    return `$${Number(price).toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })}`;
  }


  // ==========================================
  // 统计卡片
  // ==========================================

  const cards = [

    // {
    //   key: "laptops",
    //   icon: "💻",
    //   label: "笔记本数据",
    //   value: formatNumber(laptopCount),
    //   unit: "台",
    //   description: "当前数据集中的笔记本数量",
    //   className: "stat-card-laptop",
    // },
// 
    // {
    //   key: "brands",
    //   icon: "🏷",
    //   label: "品牌数量",
    //   value: formatNumber(brandCount),
    //   unit: "个",
    //   description: "当前数据集包含的品牌",
    //   className: "stat-card-brand",
    // },
// 
    // {
    //   key: "average",
    //   icon: "$",
    //   label: "平均价格",
    //   value: formatPrice(averagePrice),
    //   unit: "",
    //    description: "所有有效笔记本的平均价格",
    //    className: "stat-card-price",
    //  },
//  
    //  {
    //    key: "range",
    //    icon: "▤",
    //    label: "主要价格区间",
    //    value: popularPriceRange,
    //    unit: "",
    //    description: "数据量最多的价格区间",
    //    className: "stat-card-range",
    // },

  ];


  return (
    <div className="stat-cards">

      {cards.map((card) => (

        <div
          className={`stat-card ${card.className}`}
          key={card.key}
        >

          {/* ==================================
              卡片顶部
          ================================== */}

          <div className="stat-card-header">

            <div className="stat-icon">
              {card.icon}
            </div>

            <span className="stat-label">
              {card.label}
            </span>

          </div>


          {/* ==================================
              数值
          ================================== */}

          <div className="stat-value">

            <strong>
              {card.value}
            </strong>

            {card.unit && (
              <span className="stat-unit">
                {card.unit}
              </span>
            )}

          </div>


          {/* ==================================
              说明
          ================================== */}

          <p className="stat-description">
            {card.description}
          </p>


          {/* ==================================
              底部装饰线
          ================================== */}

          <div className="stat-line"></div>

        </div>

      ))}

    </div>
  );
}

export default StatCards;