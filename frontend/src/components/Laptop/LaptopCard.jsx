import React from "react";


function LaptopCard({
  laptop,
  onClick,
}) {

  if (!laptop) {
    return null;
  }


  // ==========================================
  // 处理价格
  // ==========================================

  const price = Number(laptop.price || 0);

  const displayPrice =
    price > 0
      ? `$${price.toLocaleString()}`
      : "价格未知";


  // ==========================================
  // 评分
  // ==========================================

  const rating =
    laptop.rating !== null &&
    laptop.rating !== undefined &&
    laptop.rating !== ""
      ? Number(laptop.rating)
      : null;


  return (

    <div
      className="laptop-card"
      onClick={() => onClick(laptop)}
    >


      {/* =====================================
          顶部
      ====================================== */}

      <div className="laptop-card-header">

        <div className="laptop-brand">
          {laptop.brand || "未知品牌"}
        </div>

        {rating !== null && (

          <div className="laptop-rating">

            ★ {rating.toFixed(1)}

          </div>

        )}

      </div>


      {/* =====================================
          产品名称
      ====================================== */}

      <h3 className="laptop-name">

        {laptop.name || "未知型号"}

      </h3>


      {/* =====================================
          配置信息
      ====================================== */}

      <div className="laptop-specs">


        <div className="spec-item">

          <span className="spec-label">
            CPU
          </span>

          <span className="spec-value">

            {laptop.cpu || "未知"}

          </span>

        </div>


        <div className="spec-item">

          <span className="spec-label">
            内存
          </span>

          <span className="spec-value">

            {laptop.memory || "未知"}

          </span>

        </div>


        <div className="spec-item">

          <span className="spec-label">
            存储
          </span>

          <span className="spec-value">

            {laptop.storage || "未知"}

          </span>

        </div>


        <div className="spec-item">

          <span className="spec-label">
            显卡
          </span>

          <span className="spec-value">

            {laptop.gpu || "集成显卡 / 未知"}

          </span>

        </div>


      </div>


      {/* =====================================
          底部价格
      ====================================== */}

      <div className="laptop-card-footer">

        <div>

          <span className="price-label">
            参考价格
          </span>

          <div className="laptop-price">

            {displayPrice}

          </div>

        </div>


        <button
          className="laptop-detail-button"
          onClick={(event) => {

            event.stopPropagation();

            onClick(laptop);

          }}
        >

          查看详情

          <span>
            →
          </span>

        </button>

      </div>


    </div>

  );

}


export default LaptopCard;