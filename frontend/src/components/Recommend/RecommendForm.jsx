import React, { useState } from "react";


function RecommendForm({
  onRecommend,
}) {

  // ==========================================
  // 用户需求
  // ==========================================

  const [budget, setBudget] = useState("500-800");

  const [major, setMajor] =
    useState("计算机类");

  const [scene, setScene] =
    useState("学习办公");

  const [performance, setPerformance] =
    useState("均衡");

  const [memory, setMemory] =
    useState("16");

  const [dedicatedGpu, setDedicatedGpu] =
    useState("不限");


  // ==========================================
  // 预算
  // ==========================================

  const budgetOptions = [
    {
      value: "300-500",
      label: "$300 - $500",
    },
    {
      value: "500-800",
      label: "$500 - $800",
    },
    {
      value: "800-1200",
      label: "$800 - $1200",
    },
    {
      value: "1200-2000",
      label: "$1200 - $2000",
    },
    {
      value: "2000+",
      label: "$2000+",
    },
  ];


  // ==========================================
  // 专业
  // ==========================================

  const majorOptions = [
    "计算机类",
    "设计类",
    "经管类",
    "理工类",
    "文科类",
    "其他专业",
  ];


  // ==========================================
  // 使用场景
  // ==========================================

  const sceneOptions = [
    "学习办公",
    "编程开发",
    "设计建模",
    "游戏娱乐",
    "视频剪辑",
  ];


  // ==========================================
  // 性能需求
  // ==========================================

  const performanceOptions = [
    "轻度",
    "均衡",
    "高性能",
  ];


  // ==========================================
  // 内存需求
  // ==========================================

  const memoryOptions = [
    "8",
    "16",
    "32",
    "64",
  ];


  // ==========================================
  // 提交
  // ==========================================

  function handleSubmit(event) {

    event.preventDefault();


    const requirements = {

      budget,

      major,

      scene,

      performance,

      memory,

      dedicatedGpu,

    };


    if (onRecommend) {

      onRecommend(requirements);

    }

  }


  return (
    <section className="recommend-form">

      {/* ======================================
          标题
      ====================================== */}

      <div className="recommend-form-header">

        <div>

          <span className="recommend-form-tag">
            PERSONALIZED RECOMMENDATION
          </span>

          <h2>
            告诉我们你的需求
          </h2>

          <p>
            系统将根据你的预算、专业和使用场景，
            分析适合你的笔记本。
          </p>

        </div>


      </div>


      <form onSubmit={handleSubmit}>

        {/* ====================================
            预算
        ==================================== */}

        <div className="recommend-form-section">

          <div className="recommend-section-title">


            <div>

              <h3>
                你的预算是多少？
              </h3>

              <p>
                选择一个可以接受的价格范围
              </p>

            </div>

          </div>


          <div className="recommend-choice-grid">

            {budgetOptions.map((item) => (

              <button
                type="button"
                key={item.value}
                className={
                  budget === item.value
                    ? "recommend-choice active"
                    : "recommend-choice"
                }
                onClick={() =>
                  setBudget(item.value)
                }
              >

                {item.label}

              </button>

            ))}

          </div>

        </div>


        {/* ====================================
            专业
        ==================================== */}

        <div className="recommend-form-section">

          <div className="recommend-section-title">

            <span>
              02
            </span>

            <div>

              <h3>
                你的专业是什么？
              </h3>

              <p>
                不同专业对电脑性能的需求不同
              </p>

            </div>

          </div>


          <div className="recommend-select-wrapper">

            <select
              value={major}
              onChange={(event) =>
                setMajor(event.target.value)
              }
            >

              {majorOptions.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              ))}

            </select>

          </div>

        </div>


        {/* ====================================
            使用场景
        ==================================== */}

        <div className="recommend-form-section">

          <div className="recommend-section-title">

            <span>
              03
            </span>

            <div>

              <h3>
                主要使用场景？
              </h3>

              <p>
                选择最主要的一项用途
              </p>

            </div>

          </div>


          <div className="recommend-choice-grid scene-grid">

            {sceneOptions.map((item) => (

              <button
                type="button"
                key={item}
                className={
                  scene === item
                    ? "recommend-choice active"
                    : "recommend-choice"
                }
                onClick={() =>
                  setScene(item)
                }
              >

                {item}

              </button>

            ))}

          </div>

        </div>


        {/* ====================================
            性能要求
        ==================================== */}

        <div className="recommend-form-section">

          <div className="recommend-section-title">

            <span>
              04
            </span>

            <div>

              <h3>
                你希望什么性能水平？
              </h3>

            </div>

          </div>


          <div className="recommend-choice-grid">

            {performanceOptions.map((item) => (

              <button
                type="button"
                key={item}
                className={
                  performance === item
                    ? "recommend-choice active"
                    : "recommend-choice"
                }
                onClick={() =>
                  setPerformance(item)
                }
              >

                {item}

              </button>

            ))}

          </div>

        </div>


        {/* ====================================
            内存
        ==================================== */}

        <div className="recommend-form-section compact">

          <div className="recommend-inline-field">

            <label>
              最低内存需求
            </label>

            <select
              value={memory}
              onChange={(event) =>
                setMemory(event.target.value)
              }
            >

              {memoryOptions.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item} GB
                </option>

              ))}

            </select>

          </div>


          <div className="recommend-inline-field">

            <label>
              是否需要独立显卡
            </label>

            <select
              value={dedicatedGpu}
              onChange={(event) =>
                setDedicatedGpu(event.target.value)
              }
            >

              <option value="不限">
                不限
              </option>

              <option value="需要">
                需要
              </option>

              <option value="不需要">
                不需要
              </option>

            </select>

          </div>

        </div>


        {/* ====================================
            提交
        ==================================== */}

        <div className="recommend-form-submit">

          <div>

            <span>
              READY?
            </span>

            <p>
              系统将根据以上条件生成推荐结果
            </p>

          </div>


          <button
            type="submit"
            className="recommend-submit-button"
          >

            开始智能推荐

            <span>
              →
            </span>

          </button>

        </div>

      </form>

    </section>
  );
}


export default RecommendForm;