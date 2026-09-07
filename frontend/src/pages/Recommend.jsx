import React, { useMemo, useState } from "react";

import RecommendForm from "../components/Recommend/RecommendForm";
import RecommendCard from "../components/Recommend/RecommendCard";
import LaptopDetail from "../components/Laptop/LaptopDetail";


function Recommend({
  laptops = [],
}) {

  // ==========================================
  // 是否已经开始推荐
  // ==========================================

  const [hasRecommended, setHasRecommended] =
    useState(false);


  // ==========================================
  // 用户需求
  // ==========================================

  const [requirements, setRequirements] =
    useState(null);


  // ==========================================
  // 当前查看详情
  // ==========================================

  const [selectedLaptop, setSelectedLaptop] =
    useState(null);


  // ==========================================
  // 预算转换
  // ==========================================

  function getBudgetRange(budget) {

    switch (budget) {

      case "300-500":
        return {
          min: 300,
          max: 500,
        };

      case "500-800":
        return {
          min: 500,
          max: 800,
        };

      case "800-1200":
        return {
          min: 800,
          max: 1200,
        };

      case "1200-2000":
        return {
          min: 1200,
          max: 2000,
        };

      case "2000+":
        return {
          min: 2000,
          max: Infinity,
        };

      default:
        return {
          min: 0,
          max: Infinity,
        };
    }
  }


  // ==========================================
  // 判断是否包含独立显卡
  // ==========================================

  function hasDedicatedGpu(laptop) {

    const gpuBrand =
      String(laptop.gpu_brand || "")
        .toLowerCase();

    const gpu =
      String(laptop.gpu || "")
        .toLowerCase();


    const text =
      `${gpuBrand} ${gpu}`;


    if (
      text.includes("nvidia") ||
      text.includes("geforce") ||
      text.includes("rtx") ||
      text.includes("gtx") ||
      text.includes("amd radeon") ||
      text.includes("radeon rx")
    ) {
      return true;
    }


    return false;
  }


  // ==========================================
  // 专业与用途匹配
  // ==========================================

  function getSceneScore(
    laptop,
    requirements
  ) {

    const cpu =
      String(laptop.cpu || "")
        .toLowerCase();

    const gpu =
      String(laptop.gpu || "")
        .toLowerCase();

    const name =
      String(laptop.name || "")
        .toLowerCase();


    const text =
      `${cpu} ${gpu} ${name}`;


    let score = 0;


    // ------------------------------------------
    // 编程开发
    // ------------------------------------------

    if (
      requirements.scene === "编程开发"
    ) {

      if (
        cpu.includes("i5") ||
        cpu.includes("i7") ||
        cpu.includes("i9") ||
        cpu.includes("ryzen 5") ||
        cpu.includes("ryzen 7") ||
        cpu.includes("ryzen 9") ||
        cpu.includes("m1") ||
        cpu.includes("m2") ||
        cpu.includes("m3")
      ) {
        score += 15;
      }

    }


    // ------------------------------------------
    // 设计建模
    // ------------------------------------------

    if (
      requirements.scene === "设计建模"
    ) {

      if (hasDedicatedGpu(laptop)) {
        score += 20;
      }

      if (
        text.includes("rtx") ||
        text.includes("quadro") ||
        text.includes("radeon")
      ) {
        score += 10;
      }

    }


    // ------------------------------------------
    // 游戏娱乐
    // ------------------------------------------

    if (
      requirements.scene === "游戏娱乐"
    ) {

      if (hasDedicatedGpu(laptop)) {
        score += 25;
      }

    }


    // ------------------------------------------
    // 视频剪辑
    // ------------------------------------------

    if (
      requirements.scene === "视频剪辑"
    ) {

      if (hasDedicatedGpu(laptop)) {
        score += 20;
      }

      if (
        cpu.includes("i7") ||
        cpu.includes("i9") ||
        cpu.includes("ryzen 7") ||
        cpu.includes("ryzen 9")
      ) {
        score += 10;
      }

    }


    // ------------------------------------------
    // 学习办公
    // ------------------------------------------

    if (
      requirements.scene === "学习办公"
    ) {

      if (!hasDedicatedGpu(laptop)) {
        score += 10;
      }

      score += 5;

    }


    return score;
  }


  // ==========================================
  // 专业匹配
  // ==========================================

  function getMajorScore(
    laptop,
    requirements
  ) {

    const gpu =
      String(laptop.gpu || "")
        .toLowerCase();

    const cpu =
      String(laptop.cpu || "")
        .toLowerCase();


    let score = 0;


    // 计算机类
    if (
      requirements.major === "计算机类"
    ) {

      if (
        cpu.includes("i5") ||
        cpu.includes("i7") ||
        cpu.includes("ryzen 5") ||
        cpu.includes("ryzen 7") ||
        cpu.includes("m1") ||
        cpu.includes("m2") ||
        cpu.includes("m3")
      ) {
        score += 15;
      }

    }


    // 设计类
    if (
      requirements.major === "设计类"
    ) {

      if (hasDedicatedGpu(laptop)) {
        score += 15;
      }

    }


    // 理工类
    if (
      requirements.major === "理工类"
    ) {

      if (
        cpu.includes("i5") ||
        cpu.includes("i7") ||
        cpu.includes("ryzen 5") ||
        cpu.includes("ryzen 7")
      ) {
        score += 15;
      }

      if (hasDedicatedGpu(laptop)) {
        score += 5;
      }

    }


    // 经管类
    if (
      requirements.major === "经管类"
    ) {

      if (!hasDedicatedGpu(laptop)) {
        score += 10;
      }

    }


    // 文科类
    if (
      requirements.major === "文科类"
    ) {

      if (!hasDedicatedGpu(laptop)) {
        score += 10;
      }

    }


    return score;
  }


  // ==========================================
  // 计算推荐结果
  // ==========================================

  const recommendations = useMemo(() => {

    if (
      !hasRecommended ||
      !requirements ||
      laptops.length === 0
    ) {
      return [];
    }


    const budgetRange =
      getBudgetRange(
        requirements.budget
      );


    const scored = laptops.map((laptop) => {

      const price =
        Number(laptop.price) || 0;


      const memory =
        parseFloat(
          String(laptop.memory || "")
        ) || 0;


      let score = 0;

      const reasons = [];


      // ======================================
      // 预算匹配
      // ======================================

      if (
        price >= budgetRange.min &&
        price <= budgetRange.max
      ) {

        score += 35;

        reasons.push(
          "价格符合你的预算范围"
        );

      } else {

        // 距离预算越近，给予一定分数

        let distance = 0;

        if (price < budgetRange.min) {
          distance =
            budgetRange.min - price;
        } else {
          distance =
            price - budgetRange.max;
        }

        if (distance < 100) {
          score += 25;
        } else if (distance < 200) {
          score += 15;
        } else if (distance < 400) {
          score += 5;
        }

      }


      // ======================================
      // 内存
      // ======================================

      const requiredMemory =
        Number(requirements.memory);


      if (
        memory >= requiredMemory
      ) {

        score += 15;

        reasons.push(
          `内存达到 ${requirements.memory}GB 以上`
        );

      }


      // ======================================
      // 独立显卡
      // ======================================

      const dedicated =
        hasDedicatedGpu(laptop);


      if (
        requirements.dedicatedGpu === "需要"
      ) {

        if (dedicated) {

          score += 15;

          reasons.push(
            "配备独立显卡，适合图形性能需求"
          );

        }

      } else if (
        requirements.dedicatedGpu === "不需要"
      ) {

        if (!dedicated) {

          score += 10;

          reasons.push(
            "无需独立显卡，更适合日常学习办公"
          );

        }

      } else {

        score += 5;

      }


      // ======================================
      // 使用场景
      // ======================================

      const sceneScore =
        getSceneScore(
          laptop,
          requirements
        );


      score += sceneScore;


      if (sceneScore >= 15) {

        reasons.push(
          `配置适合${requirements.scene}`
        );

      }


      // ======================================
      // 专业
      // ======================================

      const majorScore =
        getMajorScore(
          laptop,
          requirements
        );


      score += majorScore;


      if (majorScore >= 10) {

        reasons.push(
          `比较适合${requirements.major}专业使用`
        );

      }


      // ======================================
      // 性能等级
      // ======================================

      const cpu =
        String(laptop.cpu || "")
          .toLowerCase();


      if (
        requirements.performance ===
        "高性能"
      ) {

        if (
          cpu.includes("i7") ||
          cpu.includes("i9") ||
          cpu.includes("ryzen 7") ||
          cpu.includes("ryzen 9") ||
          cpu.includes("m2") ||
          cpu.includes("m3")
        ) {

          score += 10;

          reasons.push(
            "处理器性能较强"
          );

        }

      }


      if (
        requirements.performance ===
        "均衡"
      ) {

        if (
          cpu.includes("i5") ||
          cpu.includes("i7") ||
          cpu.includes("ryzen 5") ||
          cpu.includes("ryzen 7") ||
          cpu.includes("m1") ||
          cpu.includes("m2")
        ) {

          score += 8;

        }

      }


      if (
        requirements.performance ===
        "轻度"
      ) {

        if (!dedicated) {

          score += 8;

          reasons.push(
            "配置能够满足日常学习办公"
          );

        }

      }


      // ======================================
      // 评分
      // ======================================

      const rating =
        parseFloat(
          String(laptop.rating || "")
        );


      if (!Number.isNaN(rating)) {

        if (rating >= 4.5) {

          score += 5;

          reasons.push(
            "产品评分较高"
          );

        } else if (rating >= 4) {

          score += 3;

        }

      }


      return {
        laptop,
        score: Math.min(
          100,
          Math.round(score)
        ),
        reasons,
      };

    });


    // ======================================
    // 排序
    // ======================================

    scored.sort(
      (a, b) =>
        b.score - a.score
    );


    // ======================================
    // 取前6台
    // ======================================

    return scored.slice(0, 6);

  }, [
    laptops,
    requirements,
    hasRecommended,
  ]);


  // ==========================================
  // 开始推荐
  // ==========================================

  function handleRecommend(
    userRequirements
  ) {

    setRequirements(
      userRequirements
    );

    setHasRecommended(true);


    setTimeout(() => {

      const result =
        document.getElementById(
          "recommend-results"
        );

      if (result) {

        result.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

      }

    }, 100);

  }


  return (
    <div className="page recommend-page">

      {/* ======================================
          页面标题
      ====================================== */}

      <section className="page-heading">

        <div>

          <span className="page-heading-tag">
            SMART RECOMMENDATION
          </span>

          <h1>
            智能推荐
          </h1>

          <p>
            告诉系统你的预算、专业和使用需求，
            我们将为你分析合适的笔记本。
          </p>

        </div>

      </section>


      {/* ======================================
          推荐表单
      ====================================== */}

      <RecommendForm
        onRecommend={handleRecommend}
      />


      {/* ======================================
          推荐结果
      ====================================== */}

      <section
        id="recommend-results"
        className="recommend-results"
      >

        <div className="recommend-results-header">

          <div>

            <span>
              RECOMMENDATION RESULTS
            </span>

            <h2>
              {hasRecommended
                ? "为你找到的推荐方案"
                : "等待生成推荐"}
            </h2>

          </div>


          {hasRecommended && (

            <div className="recommend-result-count">

              推荐

              <strong>
                {recommendations.length}
              </strong>

              台

            </div>

          )}

        </div>


        {/* ====================================
            尚未推荐
        ==================================== */}

        {!hasRecommended && (

          <div className="recommend-empty">

            <div className="recommend-empty-icon">
              ✦
            </div>

            <h3>
              还没有生成推荐结果
            </h3>

            <p>
              完成上面的需求选择后，
              点击“开始智能推荐”。
            </p>

          </div>

        )}


        {/* ====================================
            没有数据
        ==================================== */}

        {hasRecommended &&
          recommendations.length === 0 && (

          <div className="recommend-empty">

            <div className="recommend-empty-icon">
              !
            </div>

            <h3>
              暂时无法生成推荐
            </h3>

            <p>
              当前没有可用于分析的笔记本数据。
            </p>

          </div>

        )}


        {/* ====================================
            推荐卡片
        ==================================== */}

        {recommendations.length > 0 && (

          <div className="recommend-card-grid">

            {recommendations.map(
              (item, index) => (

                <RecommendCard
                  key={
                    item.laptop.id ||
                    `${item.laptop.brand}-${item.laptop.name}-${index}`
                  }
                  laptop={item.laptop}
                  index={index}
                  score={item.score}
                  reasons={item.reasons}
                  onDetail={
                    setSelectedLaptop
                  }
                />

              )
            )}

          </div>

        )}

      </section>


      {/* ======================================
          推荐说明
      ====================================== */}

      {hasRecommended &&
        recommendations.length > 0 && (

        <section className="recommend-explanation">

          <div className="recommend-explanation-icon">
            i
          </div>

          <div>

            <strong>
              推荐结果说明
            </strong>

            <p>
              当前推荐结果综合考虑预算匹配度、
              内存配置、CPU 性能、显卡情况、
              专业需求和使用场景进行评分。
              匹配度仅用于辅助选购参考。
            </p>

          </div>

        </section>

      )}


      {/* ======================================
          详情
      ====================================== */}

      {selectedLaptop && (

        <LaptopDetail
          laptop={selectedLaptop}
          onClose={() =>
            setSelectedLaptop(null)
          }
        />

      )}

    </div>
  );
}


export default Recommend;