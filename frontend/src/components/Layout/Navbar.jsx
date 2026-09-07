import React from "react";


function Navbar({
  currentPage,
  onPageChange,
}) {

  /**
   * 导航菜单
   */
  const navItems = [
    {
      key: "home",
      label: "首页",
    },
    {
      key: "search",
      label: "笔记本查询",
    },
    {
      key: "recommend",
      label: "智能推荐",
    },
    {
      key: "analysis",
      label: "数据分析",
    },
  ];


  /**
   * 点击导航
   */
  function handleClick(page) {

    onPageChange(page);

  }


  return (

    <header className="navbar">

      <div className="navbar-inner">


        {/* =====================================
            Logo
        ====================================== */}

        <div
          className="navbar-logo"
          onClick={() => handleClick("home")}
        >

          <div className="navbar-logo-icon">
            L
          </div>

          <div className="navbar-logo-text">

            <div className="navbar-logo-title">
              CampusLaptop
            </div>

            <div className="navbar-logo-subtitle">
              大学生笔记本选购系统
            </div>

          </div>

        </div>


        {/* =====================================
            导航菜单
        ====================================== */}

        <nav className="navbar-menu">

          {navItems.map((item) => (

            <button
              key={item.key}
              className={
                currentPage === item.key
                  ? "navbar-item active"
                  : "navbar-item"
              }
              onClick={() =>
                handleClick(item.key)
              }
            >

              {item.label}

            </button>

          ))}

        </nav>


        {/* =====================================
            API 状态
        ====================================== */}

        <div className="navbar-status">

          <span className="navbar-status-dot"></span>

          <span>
            数据服务正常
          </span>

        </div>


      </div>

    </header>

  );

}


export default Navbar;