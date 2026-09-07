import React from "react";


function Footer() {

  const currentYear = new Date().getFullYear();


  return (

    <footer className="footer">

      <div className="footer-inner">


        {/* =================================
            左侧
        ================================= */}

        <div className="footer-brand">

          <div className="footer-logo">
            L
          </div>

          <div>

            <div className="footer-title">
              CampusLaptop
            </div>

            <div className="footer-description">
              大学生笔记本价格预测与推荐系统
            </div>

          </div>

        </div>


        {/* =================================
            中间
        ================================= */}

        <div className="footer-info">

          <div className="footer-info-title">
            系统功能
          </div>

          <div className="footer-links">

            <span>
              笔记本查询
            </span>

            <span>
              智能推荐
            </span>

            <span>
              数据分析
            </span>

            <span>
              价格预测
            </span>

          </div>

        </div>


        {/* =================================
            右侧
        ================================= */}

        <div className="footer-tech">

          <div className="footer-info-title">
            技术架构
          </div>

          <div className="tech-tags">

            <span>
              Flask
            </span>

            <span>
              SQLite
            </span>

            <span>
              React
            </span>

            <span>
              Vite
            </span>

          </div>

        </div>


      </div>


      {/* =================================
          底部版权
      ================================= */}

      <div className="footer-bottom">

        <span>
          © {currentYear} CampusLaptop
        </span>

        <span>
          大学生笔记本选购辅助系统
        </span>

        <span>
          课程项目
        </span>

      </div>

    </footer>

  );

}


export default Footer;