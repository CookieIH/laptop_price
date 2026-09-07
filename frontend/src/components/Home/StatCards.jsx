import React from "react";


function formatPrice(price) {

  if (!price || price <= 0) {
    return "--";
  }

  return `$${Math.round(price).toLocaleString()}`;

}


function StatCards({
  statistics = {},
}) {

  const {

    totalLaptops = 0,

    totalBrands = 0,

    minPrice = 0,

    maxPrice = 0,

    averagePrice = 0,

  } = statistics;


  const cards = [

    {
      key: "laptops",

      title: "笔记本数量",

      value: totalLaptops,

      suffix: " 台",

      description: "当前数据库产品数量",

      icon: "▣",

    },

    {
      key: "brands",

      title: "覆盖品牌",

      value: totalBrands,

      suffix: " 个",

      description: "数据库中的品牌数量",

      icon: "◇",

    },

    {
      key: "average",

      title: "平均价格",

      value: formatPrice(averagePrice),

      suffix: "",

      description: "当前数据平均售价",

      icon: "＄",

    },

    {
      key: "range",

      title: "价格范围",

      value: formatPrice(minPrice),

      suffix: "",

      description:
        `${formatPrice(minPrice)} - ${formatPrice(maxPrice)}`,

      icon: "↕",

    },

  ];


  return (

    <div className="stat-grid">

      {cards.map((card) => (

        <div
          className="stat-card"
          key={card.key}
        >

          <div className="stat-card-top">

            <div className="stat-card-icon">

              {card.icon}

            </div>

            <span className="stat-card-title">

              {card.title}

            </span>

          </div>


          <div className="stat-card-value">

            {card.value}

            <small>
              {card.suffix}
            </small>

          </div>


          <div className="stat-card-description">

            {card.description}

          </div>

        </div>

      ))}

    </div>

  );

}


export default StatCards;