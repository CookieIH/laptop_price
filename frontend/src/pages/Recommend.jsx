import React, { useState } from "react";

import RecommendForm from "../components/Recommend/RecommendForm";
import RecommendCard from "../components/Recommend/RecommendCard";


function Recommend() {

  // 用户填写的推荐条件
  const [formData, setFormData] = useState({
    budget: "",
    major: "",
    usage: "",
    memory: "",
    preference: "balanced",
    brand: "",
  });


  // 推荐结果
  const [results, setResults] = useState([]);

  // 加载状态
  const [loading, setLoading] = useState(false);


  // 点击“开始智能推荐”
  const handleRecommend = () => {

    setLoading(true);

    /*
     * 当前先使用前端测试逻辑。
     *
     * 等 api.js 和 Flask 推荐接口完成之后，
     * 再把这里替换成真实的后端推荐算法。
     */

    setTimeout(() => {

      setResults([]);

      setLoading(false);

    }, 500);

  };


  return (

    <div className="recommend-page">


      {/* =========================
          页面标题
      ========================= */}

      <section className="page-header">

        <div className="page-container">

          <span className="section-label">
            SMART RECOMMEND
          </span>

          <h1>
            个性化笔记本推荐
          </h1>

          <p>
            根据你的预算、专业和使用需求，
            找到更适合大学生的笔记本电脑。
          </p>

        </div>

      </section>



      {/* =========================
          推荐主体
      ========================= */}

      <main className="recommend-content">

        <div className="page-container">


          {/* 推荐条件表单 */}

          <RecommendForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleRecommend}
            loading={loading}
          />



          {/* =========================
              推荐结果
          ========================= */}

          {results.length > 0 && (

            <section className="recommend-results">

              <div className="recommend-results-header">

                <div>

                  <span className="section-label">
                    RECOMMENDATIONS
                  </span>

                  <h2>
                    为你推荐
                  </h2>

                  <p>
                    根据你的需求筛选出的笔记本电脑
                  </p>

                </div>

              </div>


              <div className="recommend-results-grid">

                {results.map((laptop, index) => (

                  <RecommendCard
                    key={
                      laptop.id || index
                    }
                    laptop={laptop}
                    rank={index + 1}
                  />

                ))}

              </div>

            </section>

          )}



          {/* =========================
              暂无推荐结果
          ========================= */}

          {results.length === 0 && !loading && (

            <div className="recommend-empty">

              <div className="recommend-empty-icon">
                ✓
              </div>

              <h3>
                等待你的需求
              </h3>

              <p>
                填写上面的预算、专业和使用场景，
                系统将为你生成个性化推荐。
              </p>

            </div>

          )}



          {/* =========================
              分析说明
          ========================= */}

          <section className="recommend-explanation">

            <div className="recommend-explanation-title">

              <span className="section-label">
                HOW IT WORKS
              </span>

              <h2>
                推荐系统如何分析？
              </h2>

            </div>


            <div className="recommend-steps">


              <div className="recommend-step">

                <div className="recommend-step-number">
                  01
                </div>

                <div>

                  <h3>
                    用户需求
                  </h3>

                  <p>
                    收集预算、专业、用途、内存需求和品牌偏好。
                  </p>

                </div>

              </div>



              <div className="recommend-step">

                <div className="recommend-step-number">
                  02
                </div>

                <div>

                  <h3>
                    配置分析
                  </h3>

                  <p>
                    根据 CPU、内存、存储、GPU 和价格等指标分析产品。
                  </p>

                </div>

              </div>



              <div className="recommend-step">

                <div className="recommend-step-number">
                  03
                </div>

                <div>

                  <h3>
                    综合匹配
                  </h3>

                  <p>
                    综合用户需求和笔记本配置计算匹配程度。
                  </p>

                </div>

              </div>



              <div className="recommend-step">

                <div className="recommend-step-number">
                  04
                </div>

                <div>

                  <h3>
                    个性化建议
                  </h3>

                  <p>
                    最终给出多个候选型号，并说明推荐理由。
                  </p>

                </div>

              </div>


            </div>

          </section>


        </div>

      </main>

    </div>

  );

}


export default Recommend;