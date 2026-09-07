import React from "react";

function LaptopCard({
  laptop = {},
  index = 0,
  onDetail,
}) {
  // ==========================================
  // 数据处理
  // ==========================================

  const brand = laptop.brand || "未知品牌";
  const name = laptop.name || "未知型号";

  const cpu = laptop.cpu || "未知 CPU";
  const memory = laptop.memory || "--";
  const storage = laptop.storage || "--";
  const gpu = laptop.gpu || "未知 GPU";

  const price = Number(laptop.price) || 0;
  const rating = laptop.rating || "--";

  const reviewCount =
    Number(laptop.review_count) || 0;


  // ==========================================
  // 价格格式化
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
  // 查看详情
  // ==========================================

  function handleDetail() {
    if (onDetail) {
      onDetail(laptop);
    }
  }


  return (
    <article className="laptop-card">

      {/* ======================================
          卡片顶部
      ====================================== */}

      <div className="laptop-card-header">

        <div className="laptop-card-brand">

          <span className="laptop-brand-icon">
            💻
          </span>

          <span>
            {brand}
          </span>

        </div>


        <span className="laptop-card-rank">
          #{index + 1}
        </span>

      </div>


      {/* ======================================
          笔记本名称
      ====================================== */}

      <div className="laptop-card-title">

        <h3>
          {name}
        </h3>

        <span className="laptop-card-type">
          Notebook
        </span>

      </div>


      {/* ======================================
          配置信息
      ====================================== */}

      <div className="laptop-spec-grid">

        {/* CPU */}

        <div className="laptop-spec">

          <span className="spec-icon">
            CPU
          </span>

          <div>

            <small>
              处理器
            </small>

            <strong title={cpu}>
              {cpu}
            </strong>

          </div>

        </div>


        {/* 内存 */}

        <div className="laptop-spec">

          <span className="spec-icon">
            RAM
          </span>

          <div>

            <small>
              内存
            </small>

            <strong>
              {memory}
              {!String(memory).toLowerCase().includes("gb")
                ? " GB"
                : ""}
            </strong>

          </div>

        </div>


        {/* 存储 */}

        <div className="laptop-spec">

          <span className="spec-icon">
            SSD
          </span>

          <div>

            <small>
              存储
            </small>

            <strong>
              {storage}
              {!String(storage)
                .toLowerCase()
                .includes("gb")
                ? " GB"
                : ""}
            </strong>

          </div>

        </div>


        {/* GPU */}

        <div className="laptop-spec">

          <span className="spec-icon">
            GPU
          </span>

          <div>

            <small>
              显卡
            </small>

            <strong title={gpu}>
              {gpu}
            </strong>

          </div>

        </div>

      </div>


      {/* ======================================
          卡片底部
      ====================================== */}

      <div className="laptop-card-footer">

        <div className="laptop-price">

          <small>
            参考价格
          </small>

          <strong>
            {formatPrice(price)}
          </strong>

        </div>


        <div className="laptop-rating">

          <span className="rating-star">
            ★
          </span>

          <strong>
            {rating}
          </strong>

          {reviewCount > 0 && (
            <small>
              {reviewCount.toLocaleString()} 条评价
            </small>
          )}

        </div>


        <button
          type="button"
          className="laptop-detail-button"
          onClick={handleDetail}
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

export default LaptopCard;