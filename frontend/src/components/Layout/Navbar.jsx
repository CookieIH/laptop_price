import React from "react";

function Navbar({ currentPage, onPageChange }) {
  const menuItems = [
    {
      key: "home",
      icon: "⌂",
      label: "首页",
    },
    {
      key: "search",
      icon: "▣",
      label: "笔记本查询",
    },
    {
      key: "recommend",
      icon: "☆",
      label: "智能推荐",
    },
    {
      key: "analysis",
      icon: "▥",
      label: "数据分析",
    },
  ];

  return (
    <aside className="sidebar">

      {/* ==============================
          Logo区域
      ============================== */}
      <div className="sidebar-logo">

        <div className="logo-icon">
          💻
        </div>

        <div className="logo-text">
          <div className="logo-title">
            Laptop Price
          </div>

          <div className="logo-subtitle">
            ANALYSIS SYSTEM
          </div>
        </div>

      </div>


      {/* ==============================
          导航菜单
      ============================== */}
      <nav className="sidebar-nav">

        {menuItems.map((item) => (

          <button
            key={item.key}
            type="button"
            className={`nav-item ${
              currentPage === item.key ? "active" : ""
            }`}
            onClick={() => onPageChange(item.key)}
          >

            <span className="nav-icon">
              {item.icon}
            </span>

            <span className="nav-label">
              {item.label}
            </span>

          </button>

        ))}

      </nav>


      {/* ==============================
          左下角装饰区域
          对应参考图中的电脑插画区域
      ============================== */}
      <div className="sidebar-decoration">

        <div className="decoration-laptop">
          💻
        </div>

        <div className="decoration-title">
          更好的选择
        </div>

        <div className="decoration-text">
          从数据开始
        </div>

      </div>

    </aside>
  );
}

export default Navbar;