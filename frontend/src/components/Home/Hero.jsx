import React from "react";

function Hero({
  laptops = [],
  brands = [],
  onPageChange,
}) {

  // ==========================================
  // 页面跳转
  // ==========================================

  function handleSearch() {
    if (onPageChange) {
      onPageChange("search");
    }
  }

  function handleRecommend() {
    if (onPageChange) {
      onPageChange("recommend");
    }
  }


  // ==========================================
  // 数据统计
  // ==========================================

  const laptopCount = laptops.length;

  const brandCount = brands.length;


  return (
    <section className="hero">

      {/* ======================================
          左侧主要介绍
      ====================================== */}

      <div className="hero-content">

        <div className="hero-tag">
          <span className="hero-tag-dot"></span>
          CAMPUS LAPTOP
        </div>


        <h1 className="hero-title">
          大学生笔记本
          <br />
          <span>价格预测与推荐系统</span>
        </h1>


        <p className="hero-description">
          基于笔记本电脑数据，为大学生提供价格分析、
          产品查询和个性化选机建议。
        </p>


        {/* ==================================
            核心操作按钮
        ================================== */}

        <div className="hero-actions">    

        </div>


        {/* ==================================
            简单数据说明
        ================================== */}

        <div className="hero-data-info">

          <div className="hero-data-line"></div>

          <div className="hero-data-line"></div>


          <div className="hero-data-item">

            <strong>
              4
            </strong>

            <span>
              大核心功能
            </span>

          </div>

        </div>

      </div>


      {/* ======================================
          右侧功能说明卡片
      ====================================== */}

      <div className="hero-visual">

        <div className="hero-laptop-card">

          {/* 电脑图形 */}

          <div className="hero-laptop">

            <div className="hero-laptop-screen">

              <div className="screen-top">

                <span></span>
                <span></span>
                <span></span>

              </div>


              <div className="screen-content">

                <div className="screen-lines">

                  <i></i>
                  <i></i>
                  <i></i>

                </div>

              </div>

            </div>


            <div className="hero-laptop-base"></div>

          </div>


          {/* ==================================
              浮动信息
          ================================== */}

          <div className="hero-float-card hero-float-top">

            <div>

              <strong>
                价格分析|
              </strong>

              <small>
                Price Analysis
              </small>

            </div>

          </div>


          <div className="hero-float-card hero-float-bottom">

            <div>

              <strong>
                个性化推荐|
              </strong>

              <small>
                Smart Choice
              </small>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;