import React from "react";


function PriceChart({
  data = [],
}) {

  if (
    !data ||
    data.length === 0
  ) {

    return (

      <div className="chart-empty">

        <div>
          暂无价格分布数据
        </div>

      </div>

    );

  }


  // ==========================================
  // 找到最大数量
  // ==========================================

  const maxCount =
    Math.max(
      ...data.map(
        (item) =>
          Number(
            item.count || 0
          )
      )
    );


  return (

    <div className="price-chart">


      {/* =====================================
          柱状图
      ====================================== */}

      <div className="price-chart-area">


        {data.map(
          (item, index) => {

            const count =
              Number(
                item.count || 0
              );


            const height =
              maxCount > 0
                ? (
                    count /
                    maxCount
                  ) *
                  100
                : 0;


            return (

              <div
                className="price-chart-column"
                key={
                  item.range_label ||
                  index
                }
              >


                {/* 数量 */}

                <div className="price-chart-count">

                  {count}

                </div>


                {/* 柱子 */}

                <div className="price-chart-bar-area">

                  <div
                    className="price-chart-bar"
                    style={{
                      height:
                        `${height}%`,
                    }}
                  ></div>

                </div>


                {/* 区间 */}

                <div className="price-chart-label">

                  {item.range_label}

                </div>


              </div>

            );

          }
        )}

      </div>


      {/* =====================================
          图例
      ====================================== */}

      <div className="price-chart-legend">

        <span className="legend-mark"></span>

        <span>
          产品数量
        </span>

      </div>


    </div>

  );

}


export default PriceChart;