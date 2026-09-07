import React from "react";

function Footer() {
  return (
    <footer className="footer">

      {/* ==============================
          左侧：系统名称
      ============================== */}
      <div className="footer-left">
        <span className="footer-logo">▰</span>

        <span className="footer-title">
          Laptop Price Analysis
        </span>
      </div>


      {/* ==============================
          中间：快速导航
      ============================== */}
      <div className="footer-center">

        <button type="button">
          数据分析
        </button>

        <span className="footer-divider">|</span>

        <button type="button">
          智能推荐
        </button>

        <span className="footer-divider">|</span>

        <button type="button">
          笔记本查询
        </button>

      </div>


      {/* ==============================
          右侧：数据来源 + 版权
      ============================== */}
      <div className="footer-right">

        <span>
          数据来源：公开数据集
        </span>

        <span className="footer-divider">
          © 2026 Laptop Price Analysis
        </span>

      </div>

    </footer>
  );
}

export default Footer;