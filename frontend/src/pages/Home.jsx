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
  // 计算一些首页统计数据
  // ==========================================

  const totalLaptops = laptops.length;

  const totalBrands = brands.length;


  // 计算最低价格
  const validPrices = laptops
    .map((item) => Number(item.price))
    .filter((price) => price > 0);


  const minPrice =
    validPrices.length > 0
      ? Math.min(...validPrices)
      : 0;


  // 计算最高价格
  const maxPrice =
    validPrices.length > 0
      ? Math.max(...validPrices)
      : 0;


  // 平均价格
  const averagePrice =
    validPrices.length > 0
      ? validPrices.reduce(
          (sum, price) => sum + price,
          0
        ) / validPrices.length
      : 0;


  // ==========================================
  // 首页统计数据
  // ==========================================

  const statistics = {

    totalLaptops,

    totalBrands,

    minPrice,

    maxPrice,

    averagePrice,

  };


  return (

    <div className="home-page">


      {/* =====================================
          首页 Hero
      ====================================== */}

      <Hero
        onPageChange={onPageChange}
        laptopCount={totalLaptops}
      />


      {/* =====================================
          数据统计
      ====================================== */}

      <section className="home-section">

        <div className="section-container">

          <div className="section-heading">

            <div>

              <span className="section-label">
                DATA OVERVIEW
              </span>

              <h2>
                笔记本数据概览
              </h2>

              <p>
                基于当前数据库中的笔记本产品数据，
                为大学生选购提供基础参考。
              </p>

            </div>

          </div>


          <StatCards
            statistics={statistics}
          />

        </div>

      </section>


      {/* =====================================
          快速推荐
      ====================================== */}

      <section className="home-section home-section-light">

        <div className="section-container">

          <QuickRecommend
            laptops={laptops}
            brandAvg={brandAvg}
            priceDist={priceDist}
            onPageChange={onPageChange}
          />

        </div>

      </section>


      {/* =====================================
          系统说明
      ====================================== */}

      <section className="home-section">

        <div className="section-container">

          <div className="home-introduction">

            <div className="home-introduction-text">

              <span className="section-label">
                ABOUT SYSTEM
              </span>

              <h2>
                帮助大学生更理性地选择笔记本电脑
              </h2>

              <p>
                CampusLaptop 是一个面向大学生的
                笔记本价格分析与推荐系统。
              </p>

              <p>
                系统结合笔记本的处理器、内存、
                存储、显卡以及价格等信息，
                为用户提供产品查询、价格分析和
                个性化推荐服务。
              </p>

              <p>
                用户可以根据自己的预算和专业需求，
                快速了解不同配置笔记本之间的差异，
                从而辅助完成购机决策。
              </p>

            </div>


            <div className="home-feature-list">

              <div className="feature-item">

                <div className="feature-number">
                  01
                </div>

                <div>

                  <h3>
                    数据查询
                  </h3>

                  <p>
                    根据 CPU、内存、存储、
                    品牌和名称等条件筛选笔记本。
                  </p>

                </div>

              </div>


              <div className="feature-item">

                <div className="feature-number">
                  02
                </div>

                <div>

                  <h3>
                    个性化推荐
                  </h3>

                  <p>
                    根据预算、专业和使用需求，
                    对候选笔记本进行综合评分。
                  </p>

                </div>

              </div>


              <div className="feature-item">

                <div className="feature-number">
                  03
                </div>

                <div>

                  <h3>
                    数据分析
                  </h3>

                  <p>
                    通过品牌均价和价格区间，
                    帮助用户了解市场价格情况。
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>


    </div>

  );

}


export default Home;