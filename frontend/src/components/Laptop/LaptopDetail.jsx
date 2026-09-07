import React from "react";

function LaptopDetail({
  laptop,
  onClose,
}) {
  // 没有选择笔记本时不显示
  if (!laptop) {
    return null;
  }

  const price = Number(laptop.price) || 0;

  const rating =
    laptop.rating !== null &&
    laptop.rating !== undefined &&
    laptop.rating !== ""
      ? laptop.rating
      : "--";

  const reviewCount =
    Number(laptop.review_count) || 0;


  // ==========================================
  // 格式化价格
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
  // 配置项
  // ==========================================

  const specifications = [
    {
      label: "品牌",
      value: laptop.brand || "未知",
    },
    {
      label: "产品名称",
      value: laptop.name || "未知型号",
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
      label: "CPU 核心数",
      value: laptop.cpu_cores || "未知",
    },
    {
      label: "CPU 线程数",
      value: laptop.cpu_threads || "未知",
    },
    {
      label: "内存",
      value: laptop.memory
        ? String(laptop.memory).toLowerCase().includes("gb")
          ? laptop.memory
          : `${laptop.memory} GB`
        : "未知",
    },
    {
      label: "存储",
      value: laptop.storage
        ? String(laptop.storage).toLowerCase().includes("gb")
          ? laptop.storage
          : `${laptop.storage} GB`
        : "未知",
    },
    {
      label: "GPU 品牌",
      value: laptop.gpu_brand || "未知",
    },
    {
      label: "显卡",
      value: laptop.gpu || "未知",
    },
  ];


  // ==========================================
  // 点击背景关闭
  // ==========================================

  function handleOverlayClick(event) {

    if (event.target === event.currentTarget) {

      if (onClose) {
        onClose();
      }

    }

  }


  return (
    <div
      className="laptop-detail-overlay"
      onClick={handleOverlayClick}
    >

      <div className="laptop-detail-modal">

        {/* ====================================
            顶部
        ==================================== */}

        <div className="laptop-detail-header">

          <div className="detail-header-left">

            <div className="detail-laptop-icon">
              💻
            </div>

            <div>

              <span className="detail-brand">
                {laptop.brand || "未知品牌"}
              </span>

              <h2>
                {laptop.name || "未知型号"}
              </h2>

            </div>

          </div>


          <button
            type="button"
            className="detail-close-button"
            onClick={onClose}
            aria-label="关闭"
          >
            ×
          </button>

        </div>


        {/* ====================================
            核心数据
        ==================================== */}

        <div className="detail-summary">

          <div className="detail-summary-item">

            <small>
              参考价格
            </small>

            <strong className="detail-price">
              {formatPrice(price)}
            </strong>

          </div>


          <div className="detail-summary-item">

            <small>
              用户评分
            </small>

            <strong className="detail-rating">
              ★ {rating}
            </strong>

          </div>


          <div className="detail-summary-item">

            <small>
              评价数量
            </small>

            <strong>
              {reviewCount > 0
                ? reviewCount.toLocaleString()
                : "--"}
            </strong>

          </div>

        </div>


        {/* ====================================
            详细配置
        ==================================== */}

        <div className="detail-section">

          <div className="detail-section-title">

            <span>
              SPECIFICATIONS
            </span>

            <h3>
              详细配置
            </h3>

          </div>


          <div className="detail-spec-grid">

            {specifications.map((item) => (

              <div
                className="detail-spec-item"
                key={item.label}
              >

                <span>
                  {item.label}
                </span>

                <strong title={String(item.value)}>
                  {item.value}
                </strong>

              </div>

            ))}

          </div>

        </div>


        {/* ====================================
            数据来源
        ==================================== */}

        <div className="detail-source">

          <div>

            <span>
              数据来源
            </span>

            <strong>
              {laptop.source || "暂无"}
            </strong>

          </div>


          <div>

            <span>
              数据日期
            </span>

            <strong>
              {laptop.crawl_date || "暂无"}
            </strong>

          </div>

        </div>


        {/* ====================================
            底部按钮
        ==================================== */}

        <div className="detail-footer">

          <button
            type="button"
            className="detail-back-button"
            onClick={onClose}
          >
            返回查询结果
          </button>

        </div>

      </div>

    </div>
  );
}

export default LaptopDetail;