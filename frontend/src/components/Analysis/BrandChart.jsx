import React from "react";


function BrandChart({
  data = [],
}) {

  if (
    !data ||
    data.length === 0
  ) {

    return (

      <div className="chart-empty">

        <div>
          暂无品牌价格数据
        </div>

      </div>

    );

  }


  // ==========================================
  // 排序
  // ==========================================

  const sortedData = [
    ...data,
  ]
    .sort(
      (a, b) =>
        Number(
          b.avg_price || 0
        ) -
        Number(
          a.avg_price || 0
        )
    )
    .slice(0, 12);


  // ==========================================
  // 最大值
  // ==========================================

  const maxPrice =
    Math.max(
      ...sortedData.map(
        (item) =>
          Number(
            item.avg_price || 0
          )
      )
    );


  return (

    <div className="brand-chart">


      <div className="brand-chart-list">

        {sortedData.map(
          (item, index) => {

            const price =
              Number(
                item.avg_price || 0
              );


            const count =
              Number(
                item.count || 0
              );


            const percentage =
              maxPrice > 0
                ? (
                    price /
                    maxPrice
                  ) *
                  100
                : 0;


            return (

              <div
                className="brand-chart-row"
                key={
                  item.brand ||
                  index
                }
              >


                <div className="brand-chart-name">

                  <span>
                    {index + 1}
                  </span>

                  <strong>
                    {item.brand ||
                      "未知品牌"}
                  </strong>

                </div>


                <div className="brand-chart-bar-area">

                  <div className="brand-chart-bar-bg">

                    <div
                      className="brand-chart-bar"
                      style={{
                        width:
                          `${percentage}%`,
                      }}
                    ></div>

                  </div>

                </div>


                <div className="brand-chart-price">

                  <strong>
                    ${price.toFixed(0)}
                  </strong>

                  <span>
                    {count} 台
                  </span>

                </div>


              </div>

            );

          }
        )}

      </div>


      {data.length > 12 && (

        <div className="chart-footer">

          仅显示平均价格最高的前 12 个品牌

        </div>

      )}


    </div>

  );

}


export default BrandChart;