import React from "react";


function Hero({
  onPageChange,
  laptopCount = 0,
}) {

  return (

    <section className="hero">

      <div className="hero-container">


        {/* =====================================
            左侧文字
        ====================================== */}

        <div className="hero-content">

          <div className="hero-label">

            <span className="hero-label-dot"></span>

            大学生笔记本选购辅助系统

          </div>


          <h1>

            找到适合你的

            <br />

            <span>
              笔记本电脑
            </span>

          </h1>


          <p className="hero-description">

            根据预算、专业和硬件配置，
            分析笔记本价格与性能，
            为大学生提供简单、清晰的购机建议。

          </p>


          {/* =================================
              操作按钮
          ================================= */}

          <div className="hero-actions">

            <button
              className="button button-primary"
              onClick={() =>
                onPageChange("recommend")
              }
            >

              开始智能推荐

              <span className="button-arrow">
                →
              </span>

            </button>


            <button
              className="button button-secondary"
              onClick={() =>
                onPageChange("search")
              }
            >

              查询笔记本

            </button>

          </div>


          {/* =================================
              数据提示
          ================================= */}

          <div className="hero-data-info">

            <div className="hero-data-item">

              <strong>
                {laptopCount}
              </strong>

              <span>
                条笔记本数据
              </span>

            </div>


            <div className="hero-data-divider"></div>


            <div className="hero-data-item">

              <strong>
                多维度
              </strong>

              <span>
                配置分析
              </span>

            </div>


            <div className="hero-data-divider"></div>


            <div className="hero-data-item">

              <strong>
                个性化
              </strong>

              <span>
                推荐方案
              </span>

            </div>

          </div>

        </div>


        {/* =====================================
            右侧视觉区域
        ====================================== */}

        <div className="hero-visual">

          <div className="hero-laptop">

            <div className="hero-laptop-screen">

              <div className="hero-screen-top">

                <span></span>
                <span></span>
                <span></span>

              </div>


              <div className="hero-screen-content">

                <div className="screen-line screen-line-long"></div>

                <div className="screen-line screen-line-medium"></div>

                <div className="screen-card-row">

                  <div className="screen-card"></div>

                  <div className="screen-card"></div>

                  <div className="screen-card"></div>

                </div>

              </div>

            </div>


            <div className="hero-laptop-base">

              <div className="hero-laptop-keyboard">

                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>

              </div>

              <div className="hero-laptop-trackpad"></div>

            </div>

          </div>


          {/* 浮动信息卡 */}

          <div className="hero-floating-card hero-floating-price">

            <span className="floating-card-label">
              价格分析
            </span>

            <strong>
              Smart
            </strong>

            <span className="floating-card-small">
              更合理的预算选择
            </span>

          </div>


          <div className="hero-floating-card hero-floating-score">

            <span className="floating-card-label">
              推荐
            </span>

            <strong>
              多因素
            </strong>

            <span className="floating-card-small">
              综合配置评分
            </span>

          </div>

        </div>

      </div>

    </section>

  );

}


export default Hero;