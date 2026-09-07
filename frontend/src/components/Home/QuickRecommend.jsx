import React, { useState } from "react";

function QuickRecommend({
  laptops = [],
  onPageChange,
}) {
  const [budget, setBudget] = useState("500-800");
  const [major, setMajor] = useState("计算机类");
  const [scene, setScene] = useState("学习办公");


  // ==========================================
  // 进入智能推荐页面
  // ==========================================

  function handleRecommend() {
    if (onPageChange) {
      onPageChange("recommend");
    }
  }


  // ==========================================
  // 快速预算选择
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
      value: "1200+",
      label: "$1200+",
    },
  ];


  // ==========================================
  // 专业选择
  // ==========================================

  const majorOptions = [
    "计算机类",
    "设计类",
    "经管类",
    "理工类",
    "文科类",
  ];


  // ==========================================
  // 使用场景
  // ==========================================

  const sceneOptions = [
    "学习办公",
    "编程开发",
    "设计建模",
    "游戏娱乐",
  ];


  return (
    <section className="quick-recommend">

      {/* ======================================
          左侧介绍
      ====================================== */}

      <div className="quick-recommend-intro">

      </div>

    </section>
  );
}

export default QuickRecommend;