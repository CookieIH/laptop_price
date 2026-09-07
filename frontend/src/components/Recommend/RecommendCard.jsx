import React from "react";


function RecommendCard({
  laptop,
  index = 0,
  score = 0,
  reasons = [],
  onDetail,
}) {

  if (!laptop) {
    return null;
  }


  const price =
    Number(laptop.price) || 0;


  const rating =
    laptop.rating || "--";


  // ==========================================
  // 价格
  // ==========================================

  function formatPrice(value) {

    if (!value) {
      return "--";
    }

    return `$${value.toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })}`;

  }


  // ==========================================
  // 默认推荐理由
  // ==========================================

  const defaultReasons = [

    laptop.price
      ? "价格符合你的预算范围"
      : "价格信息可供参考",

    laptop.memory
      ? `拥有 ${laptop.memory}GB 内存`
      : "内存配置较为均衡",

    laptop.cpu
      ? `搭载 ${laptop.cpu}`
      : "处理器配置满足日常需求",

  ];


  const displayReasons =
    reasons.length > 0
      ? reasons
      : defaultReasons;


  return (
    <article
      className={
        index === 0
          ? "recommend-card recommend-card-best"
          : "recommend-card"
      }
    >

      {/* ======================================
          推荐标签
      ====================================== */}

      <div className="recommend-card-top">

        <div className="recommend-rank">

          {index === 0
            ? "BEST MATCH"
            : `RECOMMEND ${String(index + 1).padStart(2, "0")}`}

        </div>


        <div className="recommend-match">

          <strong>
            {Math.round(score)}%
          </strong>

          <span>
            匹配度
          </span>

        </div>

      </div>


      {/* ======================================
          产品信息
      ====================================== */}

      <div className="recommend-card-product">

        <div className="recommend-product-icon">
          💻
        </div>


        <div className="recommend-product-info">

          <span>
            {laptop.brand || "未知品牌"}
          </span>

          <h3>
            {laptop.name || "未知型号"}
          </h3>

        </div>

      </div>


      {/* ======================================
          配置
      ====================================== */}

      <div className="recommend-specs">

        <div>

          <small>
            CPU
          </small>

          <strong title={laptop.cpu}>
            {laptop.cpu || "--"}
          </strong>

        </div>


        <div>

          <small>
            内存
          </small>

          <strong>
            {laptop.memory || "--"}
            {!String(laptop.memory || "")
              .toLowerCase()
              .includes("gb") &&
              laptop.memory
              ? " GB"
              : ""}
          </strong>

        </div>


        <div>

          <small>
            存储
          </small>

          <strong>
            {laptop.storage || "--"}
            {!String(laptop.storage || "")
              .toLowerCase()
              .includes("gb") &&
              laptop.storage
              ? " GB"
              : ""}
          </strong>

        </div>


        <div>

          <small>
            GPU
          </small>

          <strong title={laptop.gpu}>
            {laptop.gpu || "--"}
          </strong>

        </div>

      </div>


      {/* ======================================
          推荐理由
      ====================================== */}

      <div className="recommend-reasons">

        <h4>
          为什么推荐？
        </h4>


        <ul>

          {displayReasons
            .slice(0, 4)
            .map((reason, reasonIndex) => (

              <li key={reasonIndex}>

                <span>
                  ✓
                </span>

                {reason}

              </li>

            ))}

        </ul>

      </div>


      {/* ======================================
          底部
      ====================================== */}

      <div className="recommend-card-footer">

        <div className="recommend-price">

          <small>
            参考价格
          </small>

          <strong>
            {formatPrice(price)}
          </strong>

        </div>


        <div className="recommend-rating">

          <span>
            ★
          </span>

          {rating}

        </div>


        <button
          type="button"
          className="recommend-detail-button"
          onClick={() => {

            if (onDetail) {
              onDetail(laptop);
            }

          }}
        >

          查看详情

          <span>
            →
          </span>

        </button>

      </div>

    </article>
  );
}


export default RecommendCard;