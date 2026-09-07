import React, { useState } from "react";

function Sidebar({ currentPage, onPageChange, isCollapsed, onToggle }) {
  const menuItems = [
    { key: "home", icon: "⌂", label: "首页" },
    { key: "search", icon: "▣", label: "笔记本查询" },
    { key: "recommend", icon: "☆", label: "智能推荐" },
    { key: "analysis", icon: "▥", label: "数据分析" },
  ];

  return (
    <>
      {/* 折叠/展开按钮 - 固定在左上角 */}
      <button 
        className={`sidebar-toggle ${isCollapsed ? 'collapsed' : ''}`}
        onClick={onToggle}
        title={isCollapsed ? "展开菜单" : "收起菜单"}
      >
        {isCollapsed ? '☰' : '✕'}
      </button>

      <aside className={`sidebar ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Logo区域 */}
        <div className="sidebar-logo">
          <div className="logo-icon">💻</div>
          {!isCollapsed && (
            <div className="logo-text">
              <div className="logo-title">Laptop Price</div>
              <div className="logo-subtitle">ANALYSIS SYSTEM</div>
            </div>
          )}
        </div>

        {/* 导航菜单 */}
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`nav-item ${currentPage === item.key ? "active" : ""}`}
              onClick={() => onPageChange(item.key)}
              title={isCollapsed ? item.label : ""}
            >
              <span className="nav-icon">{item.icon}</span>
              {!isCollapsed && <span className="nav-label">{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* 底部装饰 */}
        {!isCollapsed && (
          <div className="sidebar-decoration">
            <div className="decoration-laptop">💻</div>
            <div className="decoration-title">更好的选择</div>
            <div className="decoration-text">从数据开始</div>
          </div>
        )}
      </aside>
    </>
  );
}

export default Sidebar;