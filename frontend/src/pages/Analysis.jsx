import React, { useEffect, useState } from "react";

import BrandChart from "../components/Analysis/BrandChart";
import PriceChart from "../components/Analysis/PriceChart";

import {
  getBrandAvg,
  getPriceDist,
} from "../services/api";


function Analysis() {

  const [brandData, setBrandData] = useState([]);
  const [priceData, setPriceData] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const loadAnalysisData = async () => {

    try {

      setLoading(true);
      setError("");

      const [
        brandResult,
        priceResult,
      ] = await Promise.all([
        getBrandAvg(),
        getPriceDist(),
      ]);


      setBrandData(
        Array.isArray(brandResult)
          ? brandResult
          : []
      );

      setPriceData(
        Array.isArray(priceResult)
          ? priceResult
          : []
      );


    } catch (err) {

      console.error(
        "获取分析数据失败:",
        err
      );

      setError(
        "暂时无法获取分析数据，请确认 Flask 后端已经启动。"
      );

    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    loadAnalysisData();

  }, []);


  /*
   * 根据品牌数据计算一些简单的概览数据
   */

  const totalBrands = brandData.length;

  const totalLaptops = brandData.reduce(
    (sum, item) =>
      sum + Number(item.count || 0),
    0
  );


  const averagePrice =
    brandData.length > 0
      ? brandData.reduce(
          (sum, item) =>
            sum + Number(item.avg_price || 0),
          0
        ) / brandData.length
      : 0;


  const highestBrand =
    brandData.length > 0
      ? [...brandData].sort(
          (a, b) =>
            Number(b.avg_price || 0) -
            Number(a.avg_price || 0)
        )[0]
      : null;


  return (

    <div className="analysis-page">


      {/* ==============================
          页面顶部
      ============================== */}

      <section className="page-header">

        <div className="page-container">

          <span className="section-label">
            DATA ANALYSIS
          </span>

          <h1>
            笔记本市场分析
          </h1>

          <p>
            从品牌价格和价格区间两个维度观察当前笔记本市场。
          </p>

        </div>

      </section>



      {/* ==============================
          内容区域
      ============================== */}

      <main className="analysis-content">

        <div className="page-container">


          {/* ============================
              加载状态
          ============================ */}

          {loading && (

            <div className="analysis-loading">

              <div className="loading-spinner"></div>

              <p>
                正在加载市场数据...
              </p>

            </div>

          )}



          {/* ============================
              错误状态
          ============================ */}

          {!loading && error && (

            <div className="analysis-error">

              <div className="analysis-error-icon">
                !
              </div>

              <div>

                <h3>
                  数据加载失败
                </h3>

                <p>
                  {error}
                </p>

              </div>

              <button
                className="button button-secondary"
                onClick={loadAnalysisData}
              >
                重新加载
              </button>

            </div>

          )}



          {/* ============================
              正常数据
          ============================ */}

          {!loading && !error && (

            <>

              {/* ==========================
                  数据概览
              ========================== */}

              <section className="analysis-overview">


                <div className="analysis-stat">

                  <span>
                    品牌数量
                  </span>

                  <strong>
                    {totalBrands}
                  </strong>

                  <small>
                    数据集中包含的品牌
                  </small>

                </div>



                <div className="analysis-stat">

                  <span>
                    笔记本数量
                  </span>

                  <strong>
                    {totalLaptops}
                  </strong>

                  <small>
                    当前有效样本数量
                  </small>

                </div>



                <div className="analysis-stat">

                  <span>
                    品牌平均价格
                  </span>

                  <strong>
                    ${averagePrice.toFixed(0)}
                  </strong>

                  <small>
                    不同品牌平均价格的均值
                  </small>

                </div>



                <div className="analysis-stat">

                  <span>
                    最高均价品牌
                  </span>

                  <strong>
                    {highestBrand
                      ? highestBrand.brand
                      : "--"}
                  </strong>

                  <small>
                    按品牌平均价格计算
                  </small>

                </div>


              </section>



              {/* ==========================
                  图表
              ========================== */}

              <section className="analysis-charts">


                <div className="analysis-chart-card">

                  <div className="analysis-chart-header">

                    <h2>
                      各品牌平均价格
                    </h2>

                    <p>
                      对比不同品牌笔记本的平均价格水平
                    </p>

                  </div>


                  <BrandChart
                    data={brandData}
                  />

                </div>



                <div className="analysis-chart-card">

                  <div className="analysis-chart-header">

                    <h2>
                      价格区间分布
                    </h2>

                    <p>
                      查看不同价格区间的笔记本数量
                    </p>

                  </div>


                  <PriceChart
                    data={priceData}
                  />

                </div>


              </section>



              {/* ==========================
                  市场观察
              ========================== */}

              <section className="market-observation">

                <div className="market-observation-header">

                  <h2>
                    市场观察
                  </h2>

                </div>


                <div className="observation-grid">


                  <div className="observation-item">

                    <div className="observation-number">
                      01
                    </div>

                    <div>

                      <h3>
                        品牌价格差异
                      </h3>

                      <p>
                        不同品牌的平均价格存在明显差异，
                        用户可以结合预算选择合适的品牌。
                      </p>

                    </div>

                  </div>



                  <div className="observation-item">

                    <div className="observation-number">
                      02
                    </div>

                    <div>

                      <h3>
                        主流价格区间
                      </h3>

                      <p>
                        价格分布可以帮助大学生快速了解
                        当前市场的主要消费区间。
                      </p>

                    </div>

                  </div>



                  <div className="observation-item">

                    <div className="observation-number">
                      03
                    </div>

                    <div>

                      <h3>
                        预算选择
                      </h3>

                      <p>
                        对于预算有限的学生，
                        可以优先关注中低价格区间的产品。
                      </p>

                    </div>

                  </div>



                  <div className="observation-item">

                    <div className="observation-number">
                      04
                    </div>

                    <div>

                      <h3>
                        个性化推荐
                      </h3>

                      <p>
                        市场分析结果可以作为推荐系统的
                        辅助信息，为用户提供更合理的购买建议。
                      </p>

                    </div>

                  </div>


                </div>


                <div className="analysis-note">

                  <span>
                    数据说明
                  </span>

                  <p>
                    当前分析结果来自系统采集的笔记本数据，
                    实际购买时还应结合具体型号、配置和用户需求进行判断。
                  </p>

                </div>


              </section>

            </>

          )}

        </div>

      </main>

    </div>

  );

}


export default Analysis;