import React from "react";

import Hero from "../components/Home/Hero";
import StatCards from "../components/Home/StatCards";
import QuickRecommend from "../components/Home/QuickRecommend";

function Home({
  laptops = [],
  brands = [],
  brandAvg = [],
  priceDist = [],
  onPageChange,
}) {
  // ==========================================
  // 数据统计
  // ==========================================

  const laptopCount = laptops.length;

  const brandCount = brands.length;

  const validPrices = laptops
    .map((item) => Number(item.price))
    .filter((price) => price > 0);

  const averagePrice =
    validPrices.length > 0
      ? validPrices.reduce((sum, price) => sum + price, 0) /
        validPrices.length
      : 0;

  const maxPrice =
    validPrices.length > 0
      ? Math.max(...validPrices)
      : 0;


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
  // 找出热门 / 推荐展示的笔记本
  // ==========================================

  const popularLaptops = [...laptops]
    .sort((a, b) => {
      const ratingA = Number(a.rating) || 0;
      const ratingB = Number(b.rating) || 0;

      return ratingB - ratingA;
    })
    .slice(0, 6);


  // ==========================================
  // 页面跳转
  // ==========================================

  function goToSearch() {
    if (onPageChange) {
      onPageChange("search");
    }
  }

  function goToRecommend() {
    if (onPageChange) {
      onPageChange("recommend");
    }
  }

  function goToAnalysis() {
    if (onPageChange) {
      onPageChange("analysis");
    }
  }


  return (
    <div className="home-page">

      {/* ==================================================
          首页顶部欢迎区域
      ================================================== */}

      <section className="home-hero-section">

        <Hero
          laptops={laptops}
          brands={brands}
          onPageChange={onPageChange}
        />

      </section>


      {/* ==================================================
          快速入口
      ================================================== */}

      <section className="home-action-section">

        <div className="section-heading">

          <div>
            <span className="section-tag">
              QUICK ACCESS
            </span>

            <h2>
              快速开始
            </h2>

            <p>
              根据你的需求快速查询或选择适合自己的笔记本电脑
            </p>
          </div>

        </div>


        <div className="home-action-grid">

          {/* 查询 */}

          <button
            type="button"
            className="home-action-card search-action"
            onClick={goToSearch}
          >

            <div className="action-icon">
              🔍
            </div>

            <div className="action-content">

              <h3>
                笔记本查询
              </h3>

              <p>
                根据名称、CPU、内存、存储等条件查找笔记本
              </p>

            </div>

            <span className="action-arrow">
              →
            </span>

          </button>


          {/* 推荐 */}

          <button
            type="button"
            className="home-action-card recommend-action"
            onClick={goToRecommend}
          >

            <div className="action-icon">
              ★
            </div>

            <div className="action-content">

              <h3>
                智能推荐
              </h3>

              <p>
                输入预算和专业需求，获取个性化选机建议
              </p>

            </div>

            <span className="action-arrow">
              →
            </span>

          </button>


          {/* 分析 */}

          <button
            type="button"
            className="home-action-card analysis-action"
            onClick={goToAnalysis}
          >

            <div className="action-icon">
              ▥
            </div>

            <div className="action-content">

              <h3>
                数据分析
              </h3>

              <p>
                查看品牌价格、价格区间等数据分析结果
              </p>

            </div>

            <span className="action-arrow">
              →
            </span>

          </button>

        </div>

      </section>


      {/* ==================================================
          数据概览
      ================================================== */}




      {/* ==================================================
          数据摘要
      ================================================== */}

      <section className="home-summary-section">

      </section>


      {/* ==================================================
          热门笔记本
      ================================================== */}

      <section className="home-popular-section">

        <div className="section-heading section-heading-row">

          <div>

            <span className="section-tag">
              LAPTOP DATA
            </span>

            <h2>
              热门笔记本
            </h2>

            <p>
              从当前数据中选择部分产品进行展示
            </p>

          </div>

        </div>


        <div className="popular-grid">

          {popularLaptops.length > 0 ? (

            popularLaptops.map((laptop, index) => (

              <div
                className="popular-card"
                key={laptop.id || `${laptop.name}-${index}`}
              >

                <div className="popular-card-top">

                  <span className="popular-rank">
                    #{index + 1}|
                  </span>

                  <strong className="popular-brand">
                    {laptop.brand || "未知品牌"}
                  </strong>

                </div>


                <h3>
                  {laptop.name || "未知型号"}
                </h3>


                <div className="popular-specs">

                  <span>
                    CPU：{laptop.cpu || "--"}/
                  </span>

                  <span>
                    内存：{laptop.memory || "--"}G/
                  </span>

                  <span>
                    存储：{laptop.storage || "--"}G
                  </span>

                </div>


                <div className="popular-bottom">

                  <strong>
                    {formatPrice(laptop.price)}/
                  </strong>

                  <span>
                    评分：
                    {laptop.rating || "--"}
                  </span>

                </div>

              </div>

            ))

          ) : (

            <div className="empty-data-card">

              <div className="empty-icon">
                💻
              </div>

              <h3>
                暂无笔记本数据
              </h3>

              <p>
                当前尚未连接到数据服务，可以先浏览页面结构。
              </p>

            </div>

          )}

        </div>

      </section>


      {/* ==================================================
          智能推荐入口
      ================================================== */}

      <section className="home-recommend-section">

        <QuickRecommend
          laptops={laptops}
          onPageChange={onPageChange}
        />

      </section>


      {/* ==================================================
          首页底部提示
      ================================================== */}

      <section className="home-bottom-tip">

      </section>

    </div>
  );
}

export default Home;