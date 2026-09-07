import React from "react";


function LaptopDetail({
  laptop,
  onClose,
}) {

  if (!laptop) {
    return null;
  }


  // ==========================================
  // 价格
  // ==========================================

  const price = Number(
    laptop.price || 0
  );


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


  // ==========================================
  // 配置项
  // ==========================================

  const specifications = [

    {
      label: "品牌",
      value: laptop.brand || "未知",
    },

    {
      label: "产品名称",
      value: laptop.name || "未知",
    },

    {
      label: "CPU 品牌",
      value: laptop.cpu_brand || "未知",
    },

    {
      label: "处理器",
      value: laptop.cpu || "未知",
    },

    {
      label: "CPU 核心",
      value:
        laptop.cpu_cores !== null &&
        laptop.cpu_cores !== undefined
          ? laptop.cpu_cores
          : "未知",
    },

    {
      label: "CPU 线程",
      value:
        laptop.cpu_threads !== null &&
        laptop.cpu_threads !== undefined
          ? laptop.cpu_threads
          : "未知",
    },

    {
      label: "内存",
      value: laptop.memory || "未知",
    },

    {
      label: "存储",
      value: laptop.storage || "未知",
    },

    {
      label: "显卡品牌",
      value: laptop.gpu_brand || "未知",
    },

    {
      label: "显卡",
      value: laptop.gpu || "未知",
    },

    {
      label: "评价数量",
      value:
        laptop.review_count !== null &&
        laptop.review_count !== undefined
          ? laptop.review_count
          : 0,
    },

  ];


  return (

    <div
      className="detail-overlay"
      onClick={onClose}
    >


      <div
        className="laptop-detail-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >


        {/* =====================================
            弹窗头部
        ====================================== */}

        <div className="detail-header">

          <div>

            <span className="detail-brand">
              {laptop.brand || "未知品牌"}
            </span>

            <h2>
              {laptop.name || "未知型号"}
            </h2>

          </div>


          <button
            className="detail-close"
            onClick={onClose}
            aria-label="关闭"
          >
            ×
          </button>

        </div>


        {/* =====================================
            价格区域
        ====================================== */}

        <div className="detail-price-section">

          <div>

            <span className="detail-price-label">
              参考价格
            </span>

            <div className="detail-price">
              {displayPrice}
            </div>

          </div>


          {rating !== null && (

            <div className="detail-rating">

              <span>
                综合评分
              </span>

              <strong>
                ★ {rating.toFixed(1)}
              </strong>

            </div>

          )}

        </div>


        {/* =====================================
            配置
        ====================================== */}

        <div className="detail-section">

          <div className="detail-section-title">
            硬件配置
          </div>


          <div className="detail-spec-grid">

            {specifications.map(
              (item, index) => (

                <div
                  className="detail-spec-item"
                  key={`${item.label}-${index}`}
                >

                  <span className="detail-spec-label">
                    {item.label}
                  </span>

                  <span className="detail-spec-value">
                    {item.value}
                  </span>

                </div>

              )
            )}

          </div>

        </div>


        {/* =====================================
            数据来源
        ====================================== */}

        <div className="detail-source">

          <div>

            <span>
              数据来源
            </span>

            <strong>
              {laptop.source || "数据库"}
            </strong>

          </div>


          <div>

            <span>
              抓取日期
            </span>

            <strong>
              {laptop.crawl_date || "未知"}
            </strong>

          </div>

        </div>


        {/* =====================================
            底部
        ====================================== */}

        <div className="detail-footer">

          <button
            className="button button-primary"
            onClick={onClose}
          >
            关闭详情
          </button>

        </div>


      </div>

    </div>

  );

}


export default LaptopDetail;