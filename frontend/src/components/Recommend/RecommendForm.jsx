import React from "react";


function RecommendForm({
  formData,
  setFormData,
  onSubmit,
  loading,
}) {

  const handleChange = (field, value) => {

    setFormData({
      ...formData,
      [field]: value,
    });

  };


  const handleSubmit = (event) => {

    event.preventDefault();

    onSubmit();

  };


  return (

    <div className="recommend-form-card">


      <div className="recommend-form-header">

        <div>

          <h2>
            告诉我们你的需求
          </h2>

          <p>
            根据预算、专业和使用场景，为你筛选合适的笔记本。
          </p>

        </div>


        <div className="recommend-form-badge">

          <span>
            AI
          </span>

          个性化分析

        </div>

      </div>



      <form
        className="recommend-form"
        onSubmit={handleSubmit}
      >


        {/* =========================
            预算
        ========================= */}

        <div className="recommend-form-group">

          <label>
            预算
          </label>

          <div className="budget-input-wrapper">

            <span>
              ¥
            </span>

            <input
              type="number"
              min="1000"
              placeholder="例如：6000"
              value={formData.budget || ""}
              onChange={(e) =>
                handleChange(
                  "budget",
                  e.target.value
                )
              }
            />

          </div>

          <small className="form-hint">
            输入你可以接受的最高预算
          </small>

        </div>



        {/* =========================
            专业
        ========================= */}

        <div className="recommend-form-group">

          <label>
            所学专业
          </label>

          <select
            value={formData.major || ""}
            onChange={(e) =>
              handleChange(
                "major",
                e.target.value
              )
            }
          >

            <option value="">
              请选择专业
            </option>

            <option value="computer">
              计算机类
            </option>

            <option value="software">
              软件工程
            </option>

            <option value="ai">
              人工智能
            </option>

            <option value="design">
              设计类
            </option>

            <option value="engineering">
              工科类
            </option>

            <option value="business">
              经管类
            </option>

            <option value="humanities">
              文科类
            </option>

            <option value="other">
              其他专业
            </option>

          </select>

          <small className="form-hint">
            不同专业对性能需求不同
          </small>

        </div>



        {/* =========================
            使用场景
        ========================= */}

        <div className="recommend-form-group">

          <label>
            主要用途
          </label>

          <select
            value={formData.usage || ""}
            onChange={(e) =>
              handleChange(
                "usage",
                e.target.value
              )
            }
          >

            <option value="">
              请选择主要用途
            </option>

            <option value="study">
              日常学习
            </option>

            <option value="programming">
              编程开发
            </option>

            <option value="design">
              PS / 平面设计
            </option>

            <option value="video">
              视频剪辑
            </option>

            <option value="gaming">
              游戏娱乐
            </option>

            <option value="office">
              办公 / 网课
            </option>

            <option value="all">
              学习 + 娱乐
            </option>

          </select>

        </div>



        {/* =========================
            内存
        ========================= */}

        <div className="recommend-form-group">

          <label>
            内存需求
          </label>

          <div className="option-grid">

            <button
              type="button"
              className={
                `option-button ${
                  formData.memory === "8GB"
                    ? "active"
                    : ""
                }`
              }
              onClick={() =>
                handleChange(
                  "memory",
                  "8GB"
                )
              }
            >

              <strong>
                8 GB
              </strong>

              <span>
                基础学习
              </span>

            </button>


            <button
              type="button"
              className={
                `option-button ${
                  formData.memory === "16GB"
                    ? "active"
                    : ""
                }`
              }
              onClick={() =>
                handleChange(
                  "memory",
                  "16GB"
                )
              }
            >

              <strong>
                16 GB
              </strong>

              <span>
                主流推荐
              </span>

            </button>


            <button
              type="button"
              className={
                `option-button ${
                  formData.memory === "32GB"
                    ? "active"
                    : ""
                }`
              }
              onClick={() =>
                handleChange(
                  "memory",
                  "32GB"
                )
              }
            >

              <strong>
                32 GB
              </strong>

              <span>
                专业应用
              </span>

            </button>


            <button
              type="button"
              className={
                `option-button ${
                  formData.memory === "64GB"
                    ? "active"
                    : ""
                }`
              }
              onClick={() =>
                handleChange(
                  "memory",
                  "64GB"
                )
              }
            >

              <strong>
                64 GB
              </strong>

              <span>
                高性能需求
              </span>

            </button>

          </div>

        </div>



        {/* =========================
            性能偏好
        ========================= */}

        <div className="recommend-form-group">

          <label>
            性能偏好
          </label>

          <div className="preference-row">

            <button
              type="button"
              className={
                `preference-button ${
                  formData.preference === "price"
                    ? "active"
                    : ""
                }`
              }
              onClick={() =>
                handleChange(
                  "preference",
                  "price"
                )
              }
            >
              性价比
            </button>


            <button
              type="button"
              className={
                `preference-button ${
                  formData.preference === "balanced"
                    ? "active"
                    : ""
                }`
              }
              onClick={() =>
                handleChange(
                  "preference",
                  "balanced"
                )
              }
            >
              均衡
            </button>


            <button
              type="button"
              className={
                `preference-button ${
                  formData.preference === "performance"
                    ? "active"
                    : ""
                }`
              }
              onClick={() =>
                handleChange(
                  "preference",
                  "performance"
                )
              }
            >
              性能
            </button>

          </div>

        </div>



        {/* =========================
            品牌偏好
        ========================= */}

        <div className="recommend-form-group">

          <label>
            品牌偏好
          </label>

          <select
            value={formData.brand || ""}
            onChange={(e) =>
              handleChange(
                "brand",
                e.target.value
              )
            }
          >

            <option value="">
              不限品牌
            </option>

            <option value="Apple">
              Apple
            </option>

            <option value="Lenovo">
              Lenovo
            </option>

            <option value="Dell">
              Dell
            </option>

            <option value="HP">
              HP
            </option>

            <option value="ASUS">
              ASUS
            </option>

            <option value="Acer">
              Acer
            </option>

          </select>

        </div>



        {/* =========================
            提交
        ========================= */}

        <div className="recommend-form-footer">

          <div className="recommend-algorithm-info">

            <span className="algorithm-dot"></span>

            系统将综合预算、专业、配置和偏好进行分析

          </div>


          <button
            type="submit"
            className="button button-primary recommend-submit"
            disabled={loading}
          >

            {loading
              ? "分析中..."
              : "开始智能推荐"
            }

          </button>

        </div>


      </form>

    </div>

  );

}


export default RecommendForm;