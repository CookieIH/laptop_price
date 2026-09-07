import React from "react";


function RecommendCard({
  laptop,
  rank,
}) {

  if (!laptop) {
    return null;
  }


  /*
   * 推荐分数
   *
   * 如果后端以后返回 recommendation_score，
   * 优先使用后端数据。
   *
   * 当前暂时根据已有数据生成一个展示分数。
   */

  const score =
    laptop.recommendation_score ??
    laptop.score ??
    Math.max(
      70,
      96 - rank * 4
    );


  const safeScore = Math.min(
    100,
    Math.max(
      0,
      Number(score)
    )
  );


  const price = Number(
    laptop.price || 0
  );


  const formatPrice = () => {

    if (!price) {
      return "--";
    }

    return `$${price.toLocaleString()}`;

  };


  const memory =
    laptop.memory || "未知";

  const storage =
    laptop.storage || "未知";

  const cpu =
    laptop.cpu || "未知";

  const gpu =
    laptop.gpu || "集成显卡";



  /*
   * 根据分数生成简单的推荐理由。
   */

  const reasons = [];


  if (price > 0) {

    reasons.push(
      "价格处于合理预算范围"
    );

  }


  if (
    String(memory)
      .toLowerCase()
      .includes("16")
  ) {

    reasons.push(
      "16GB 内存适合大学生多任务学习"
    );

  }


  if (cpu !== "未知") {

    reasons.push(
      "处理器能够满足日常学习需求"
    );

  }


  if (gpu !== "集成显卡") {

    reasons.push(
      "独立显卡适合图形或游戏需求"
    );

  }


  if (reasons.length === 0) {

    reasons.push(
      "综合配置与价格进行推荐"
    );

  }



  return (

    <article
      className={
        `recommend-card ${
          rank === 1
            ? "recommend-card-first"
            : ""
        }`
      }
    >


      {/* =========================
          卡片头部
      ========================= */}

      <div className="recommend-card-header">

        <div className="recommend-rank">

          <strong>
            TOP {rank}
          </strong>

          <span>
            推荐
          </span>

        </div>


        <div className="recommend-score">

          <span>
            匹配度
          </span>

          <strong>
            {safeScore.toFixed(0)}
          </strong>

        </div>

      </div>



      {/* =========================
          产品信息
      ========================= */}

      <div className="recommend-product">

        <div className="recommend-product-brand">

          {laptop.brand || "UNKNOWN"}

        </div>


        <h3>
          {laptop.name || "未知型号"}
        </h3>


        <div className="recommend-price">

          {formatPrice()}

        </div>

      </div>



      {/* =========================
          配置
      ========================= */}

      <div className="recommend-spec-list">


        <div className="recommend-spec">

          <span>
            CPU
          </span>

          <strong title={cpu}>
            {cpu}
          </strong>

        </div>


        <div className="recommend-spec">

          <span>
            内存
          </span>

          <strong>
            {memory}
          </strong>

        </div>


        <div className="recommend-spec">

          <span>
            存储
          </span>

          <strong>
            {storage}
          </strong>

        </div>


        <div className="recommend-spec">

          <span>
            GPU
          </span>

          <strong title={gpu}>
            {gpu}
          </strong>

        </div>


      </div>



      {/* =========================
          匹配度
      ========================= */}

      <div className="recommend-score-section">

        <div className="recommend-score-title">

          <span>
            综合匹配度
          </span>

          <strong>
            {safeScore.toFixed(0)}%
          </strong>

        </div>


        <div className="score-bar">

          <div
            className="score-bar-inner"
            style={{
              width: `${safeScore}%`,
            }}
          ></div>

        </div>


        <div className="recommend-score-level">

          {safeScore >= 90
            ? "非常推荐"
            : safeScore >= 80
              ? "值得考虑"
              : "可以参考"
          }

        </div>

      </div>



      {/* =========================
          推荐理由
      ========================= */}

      <div className="recommend-reasons">

        <div className="recommend-reasons-title">

          推荐理由

        </div>


        {reasons
          .slice(0, 3)
          .map(
            (reason, index) => (

              <div
                className="recommend-reason"
                key={index}
              >

                <span>
                  ✓
                </span>

                {reason}

              </div>

            )
          )}

      </div>



      {/* =========================
          底部指标
      ========================= */}

      <div className="recommend-metrics">


        <div className="metric">

          <span>
            价格
          </span>

          <strong>
            {price
              ? `${Math.round(price)}`
              : "--"}
          </strong>

        </div>


        <div className="metric">

          <span>
            内存
          </span>

          <strong>
            {memory}
          </strong>

        </div>


        <div className="metric">

          <span>
            评分
          </span>

          <strong>
            {laptop.rating || "--"}
          </strong>

        </div>


        <div className="metric">

          <span>
            评价
          </span>

          <strong>
            {laptop.review_count || "--"}
          </strong>

        </div>


      </div>



      {/* =========================
          商品评价
      ========================= */}

      <div className="recommend-rating">

        <span>
          数据来源
        </span>

        <strong>
          {laptop.source || "系统数据"}
        </strong>

      </div>


    </article>

  );

}


export default RecommendCard;