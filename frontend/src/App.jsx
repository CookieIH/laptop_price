import React, { useEffect, useState } from "react";
import "./styles/global.css";

import Navbar from "./components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Recommend from "./pages/Recommend";
import Analysis from "./pages/Analysis";

import {
  getLaptops,
  getBrands,
  getBrandAvg,
  getPriceDist,
} from "./services/api";


function App() {

  // ==========================================
  // 当前页面
  // ==========================================

  const [currentPage, setCurrentPage] = useState("home");


  // ==========================================
  // 后端数据
  // ==========================================

  const [laptops, setLaptops] = useState([]);

  const [brands, setBrands] = useState([]);

  const [brandAvg, setBrandAvg] = useState([]);

  const [priceDist, setPriceDist] = useState([]);


  // ==========================================
  // 加载状态
  // ==========================================

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================
  // 页面启动时加载数据
  // ==========================================

  useEffect(() => {

    loadData();

  }, []);


  // ==========================================
  // 从 Flask API 获取数据
  // ==========================================

  async function loadData() {

    try {

      setLoading(true);

      setError("");


      /*
       * 同时请求四个 API
       *
       * /api/laptops
       * /api/options/brands
       * /api/stats/brand_avg
       * /api/stats/price_dist
       */

      const [
        laptopData,
        brandData,
        brandAverageData,
        priceDistributionData,
      ] = await Promise.all([

        getLaptops({
          limit: 991,
        }),

        getBrands(),

        getBrandAvg(),

        getPriceDist(),

      ]);


      // ======================================
      // 保存笔记本数据
      // ======================================

      setLaptops(
        Array.isArray(laptopData)
          ? laptopData
          : []
      );


      // ======================================
      // 保存品牌数据
      // ======================================

      setBrands(
        Array.isArray(brandData)
          ? brandData
          : []
      );


      // ======================================
      // 保存品牌均价数据
      // ======================================

      setBrandAvg(
        Array.isArray(brandAverageData)
          ? brandAverageData
          : []
      );


      // ======================================
      // 保存价格分布数据
      // ======================================

      setPriceDist(
        Array.isArray(priceDistributionData)
          ? priceDistributionData
          : []
      );


    } catch (err) {

      console.error(
        "获取后端数据失败:",
        err
      );

      setError(
        "无法连接 Flask 后端服务，请检查后端是否正常启动。"
      );

    } finally {

      setLoading(false);

    }

  }


  // ==========================================
  // 页面切换
  // ==========================================

  function handlePageChange(page) {

    setCurrentPage(page);

    // 切换页面时回到顶部

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }


  // ==========================================
  // Loading 页面
  // ==========================================

  if (loading) {

    return (

      <div className="loading-page">

        <div className="loading-content">

          <div className="loading-logo">
            L
          </div>

          <h2>
            CampusLaptop
          </h2>

          <p>
            正在加载笔记本数据...
          </p>

          <div className="loading-spinner"></div>

        </div>

      </div>

    );

  }


  // ==========================================
  // API 连接失败页面
  // ==========================================

  if (error) {

    return (

      <div className="error-page">

        <div className="error-card">

          <div className="error-icon">
            !
          </div>

          <h2>
            数据服务连接失败
          </h2>

          <p>
            {error}
          </p>


          <div className="error-help">

            <strong>
              请检查以下内容：
            </strong>

            <ol>

              <li>
                Flask 后端是否运行在 8000 端口
              </li>

              <li>
                SQLite 数据库是否已经准备完成
              </li>

              <li>
                前端 Vite 服务是否已经启动
              </li>

              <li>
                vite.config.js 是否配置了 API 代理
              </li>

            </ol>

          </div>


          <button
            className="retry-button"
            onClick={loadData}
          >
            重新连接
          </button>

        </div>

      </div>

    );

  }


  // ==========================================
  // 正常页面
  // ==========================================

  return (

    <div className="app">


      {/* ======================================
          顶部导航
      ======================================= */}

      <Navbar
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />


      {/* ======================================
          页面主体
      ======================================= */}

      <main className="main-content">


        {/* ===============================
            首页
        ================================ */}

        {currentPage === "home" && (

          <Home
            laptops={laptops}
            brands={brands}
            brandAvg={brandAvg}
            priceDist={priceDist}
            onPageChange={handlePageChange}
          />

        )}


        {/* ===============================
            笔记本查询
        ================================ */}

        {currentPage === "search" && (

          <Search
            laptops={laptops}
            brands={brands}
          />

        )}


        {/* ===============================
            智能推荐
        ================================ */}

        {currentPage === "recommend" && (

          <Recommend
            laptops={laptops}
            onPageChange={handlePageChange}
          />

        )}


        {/* ===============================
            数据分析
        ================================ */}

        {currentPage === "analysis" && (

          <Analysis
            laptops={laptops}
            brandAvg={brandAvg}
            priceDist={priceDist}
          />

        )}

      </main>


      {/* ======================================
          底部 Footer
      ======================================= */}

      <Footer />


    </div>

  );

}


export default App;