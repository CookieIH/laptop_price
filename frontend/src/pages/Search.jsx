import React, { useMemo, useState } from "react";

import SearchPanel from "../components/Laptop/SearchPanel";
import LaptopCard from "../components/Laptop/LaptopCard";
import LaptopDetail from "../components/Laptop/LaptopDetail";


function Search({
  laptops = [],
  brands = [],
}) {

  // ==========================================
  // 当前筛选条件
  // ==========================================

  const [filters, setFilters] = useState({
    name: "",
    brand: "",
    cpu: "",
    memory: "",
    storage: "",
    minPrice: "",
    maxPrice: "",
  });


  // ==========================================
  // 是否已经进行搜索
  // ==========================================

  const [hasSearched, setHasSearched] = useState(false);


  // ==========================================
  // 当前查看详情的笔记本
  // ==========================================

  const [selectedLaptop, setSelectedLaptop] = useState(null);


  // ==========================================
  // 执行搜索
  // ==========================================

  function handleSearch(searchFilters) {

    setFilters(searchFilters);

    setHasSearched(true);

    // 搜索后回到结果区域

    setTimeout(() => {

      const resultElement =
        document.getElementById("search-results");

      if (resultElement) {

        resultElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

      }

    }, 100);
  }


  // ==========================================
  // 重置搜索
  // ==========================================

  function handleReset() {

    setFilters({
      name: "",
      brand: "",
      cpu: "",
      memory: "",
      storage: "",
      minPrice: "",
      maxPrice: "",
    });

    setHasSearched(false);
  }


  // ==========================================
  // 筛选数据
  // ==========================================

  const filteredLaptops = useMemo(() => {

    let result = [...laptops];


    // ------------------------------------------
    // 名称
    // ------------------------------------------

    if (filters.name) {

      const keyword =
        filters.name.toLowerCase();

      result = result.filter((laptop) => {

        const name =
          String(laptop.name || "")
            .toLowerCase();

        return name.includes(keyword);

      });

    }


    // ------------------------------------------
    // 品牌
    // ------------------------------------------

    if (filters.brand) {

      result = result.filter((laptop) => {

        return String(laptop.brand || "")
          .toLowerCase()
          .includes(
            String(filters.brand).toLowerCase()
          );

      });

    }


    // ------------------------------------------
    // CPU
    // ------------------------------------------

    if (filters.cpu) {

      result = result.filter((laptop) => {

        const cpuBrand =
          String(laptop.cpu_brand || "")
            .toLowerCase();

        const cpu =
          String(laptop.cpu || "")
            .toLowerCase();

        const keyword =
          String(filters.cpu)
            .toLowerCase();

        return (
          cpuBrand.includes(keyword) ||
          cpu.includes(keyword)
        );

      });

    }


    // ------------------------------------------
    // 内存
    // ------------------------------------------

    if (filters.memory) {

      const targetMemory =
        Number(filters.memory);

      result = result.filter((laptop) => {

        const memory =
          parseFloat(
            String(laptop.memory || "")
          );

        return memory === targetMemory;

      });

    }


    // ------------------------------------------
    // 存储
    // ------------------------------------------

    if (filters.storage) {

      const targetStorage =
        Number(filters.storage);

      result = result.filter((laptop) => {

        const storage =
          parseFloat(
            String(laptop.storage || "")
          );

        return storage === targetStorage;

      });

    }


    // ------------------------------------------
    // 最低价格
    // ------------------------------------------

    if (filters.minPrice !== "") {

      const min =
        Number(filters.minPrice);

      result = result.filter((laptop) => {

        const price =
          Number(laptop.price) || 0;

        return price >= min;

      });

    }


    // ------------------------------------------
    // 最高价格
    // ------------------------------------------

    if (filters.maxPrice !== "") {

      const max =
        Number(filters.maxPrice);

      result = result.filter((laptop) => {

        const price =
          Number(laptop.price) || 0;

        return price <= max;

      });

    }


    return result;

  }, [laptops, filters]);


  // ==========================================
  // 默认显示的数据
  // ==========================================

  const displayLaptops = hasSearched
    ? filteredLaptops
    : laptops;


  return (
    <div className="page search-page">

      {/* ======================================
          页面标题
      ====================================== */}

      <section className="page-heading">

        <div>

          <span className="page-heading-tag">
            LAPTOP DATABASE
          </span>

          <h1>
            笔记本查询
          </h1>

          <p>
            根据品牌、处理器、内存、存储和价格
            快速找到符合需求的笔记本。
          </p>

        </div>

      </section>


      {/* ======================================
          搜索面板
      ====================================== */}

      <SearchPanel
        brands={brands}
        onSearch={handleSearch}
        onReset={handleReset}
      />


      {/* ======================================
          查询结果
      ====================================== */}

      <section
        id="search-results"
        className="search-results"
      >

        <div className="search-results-header">

          <div>

            <span>
              SEARCH RESULTS
            </span>

            <h2>
              {hasSearched
                ? "筛选结果"
                : "全部笔记本"}
            </h2>

          </div>


          <div className="result-count">

            共

            <strong>
              {displayLaptops.length}
            </strong>

            台

          </div>

        </div>


        {/* ====================================
            没有结果
        ==================================== */}

        {displayLaptops.length === 0 ? (

          <div className="empty-search-result">

            <div className="empty-search-icon">
              🔍
            </div>

            <h3>
              没有找到符合条件的笔记本
            </h3>

            <p>
              可以尝试放宽价格范围，
              或减少部分筛选条件。
            </p>

            <button
              type="button"
              onClick={handleReset}
            >
              重置筛选条件
            </button>

          </div>

        ) : (

          /* ==================================
             卡片列表
          ================================== */

          <div className="laptop-card-grid">

            {displayLaptops.map((laptop, index) => (

              <LaptopCard
                key={
                  laptop.id ||
                  `${laptop.brand}-${laptop.name}-${index}`
                }
                laptop={laptop}
                index={index}
                onDetail={setSelectedLaptop}
              />

            ))}

          </div>

        )}

      </section>


      {/* ======================================
          详情弹窗
      ====================================== */}

      {selectedLaptop && (

        <LaptopDetail
          laptop={selectedLaptop}
          onClose={() => setSelectedLaptop(null)}
        />

      )}

    </div>
  );
}


export default Search;