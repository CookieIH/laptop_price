import React, { useMemo, useState } from "react";

import SearchPanel from "../components/Laptop/SearchPanel";
import LaptopCard from "../components/Laptop/LaptopCard";
import LaptopDetail from "../components/Laptop/LaptopDetail";


function Search({
  laptops = [],
  brands = [],
}) {

  // ==========================================
  // 搜索条件
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
  // 当前选中的笔记本
  // ==========================================

  const [selectedLaptop, setSelectedLaptop] =
    useState(null);


  // ==========================================
  // 当前页
  // ==========================================

  const [currentPage, setCurrentPage] =
    useState(1);


  const pageSize = 12;


  // ==========================================
  // 处理搜索条件变化
  // ==========================================

  function handleFilterChange(
    key,
    value
  ) {

    setFilters((prev) => ({

      ...prev,

      [key]: value,

    }));

    // 修改条件后回到第一页

    setCurrentPage(1);

  }


  // ==========================================
  // 清空搜索
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

    setCurrentPage(1);

  }


  // ==========================================
  // 根据条件筛选笔记本
  // ==========================================

  const filteredLaptops = useMemo(() => {

    return laptops.filter((laptop) => {

      // ------------------------------
      // 名称
      // ------------------------------

      if (
        filters.name &&
        !String(laptop.name || "")
          .toLowerCase()
          .includes(
            filters.name.toLowerCase()
          )
      ) {

        return false;

      }


      // ------------------------------
      // 品牌
      // ------------------------------

      if (
        filters.brand &&
        laptop.brand !== filters.brand
      ) {

        return false;

      }


      // ------------------------------
      // CPU
      // ------------------------------

      if (
        filters.cpu &&
        !String(laptop.cpu || "")
          .toLowerCase()
          .includes(
            filters.cpu.toLowerCase()
          )
      ) {

        return false;

      }


      // ------------------------------
      // 内存
      // ------------------------------

      if (
        filters.memory &&
        !String(laptop.memory || "")
          .toLowerCase()
          .includes(
            filters.memory.toLowerCase()
          )
      ) {

        return false;

      }


      // ------------------------------
      // 存储
      // ------------------------------

      if (
        filters.storage &&
        !String(laptop.storage || "")
          .toLowerCase()
          .includes(
            filters.storage.toLowerCase()
          )
      ) {

        return false;

      }


      // ------------------------------
      // 最低价格
      // ------------------------------

      const price = Number(
        laptop.price || 0
      );


      if (
        filters.minPrice &&
        price < Number(filters.minPrice)
      ) {

        return false;

      }


      // ------------------------------
      // 最高价格
      // ------------------------------

      if (
        filters.maxPrice &&
        price > Number(filters.maxPrice)
      ) {

        return false;

      }


      return true;

    });

  }, [laptops, filters]);


  // ==========================================
  // 分页
  // ==========================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredLaptops.length / pageSize
    )
  );


  const startIndex =
    (currentPage - 1) * pageSize;


  const currentLaptops =
    filteredLaptops.slice(
      startIndex,
      startIndex + pageSize
    );


  // ==========================================
  // 页码切换
  // ==========================================

  function handlePageChange(page) {

    if (
      page < 1 ||
      page > totalPages
    ) {

      return;

    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  }


  // ==========================================
  // 打开详情
  // ==========================================

  function handleLaptopClick(laptop) {

    setSelectedLaptop(laptop);

  }


  // ==========================================
  // 关闭详情
  // ==========================================

  function handleCloseDetail() {

    setSelectedLaptop(null);

  }


  return (

    <div className="search-page">


      {/* =====================================
          页面标题
      ====================================== */}

      <section className="page-header">

        <div className="page-container">

          <span className="section-label">
            LAPTOP DATABASE
          </span>

          <h1>
            笔记本查询
          </h1>

          <p>
            根据品牌、名称、CPU、内存、存储和价格，
            快速找到符合条件的笔记本电脑。
          </p>

        </div>

      </section>


      {/* =====================================
          查询主体
      ====================================== */}

      <section className="search-content">

        <div className="page-container">


          {/* 搜索面板 */}

          <SearchPanel
            filters={filters}
            brands={brands}
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />


          {/* =================================
              查询结果标题
          ================================== */}

          <div className="search-result-header">

            <div>

              <h2>
                查询结果
              </h2>

              <p>

                共找到

                <strong>
                  {" "}
                  {filteredLaptops.length}
                  {" "}
                </strong>

                台笔记本

              </p>

            </div>


            <div className="search-result-page">

              第 {currentPage} / {totalPages} 页

            </div>

          </div>


          {/* =================================
              没有结果
          ================================== */}

          {currentLaptops.length === 0 && (

            <div className="empty-result">

              <div className="empty-result-icon">
                ?
              </div>

              <h3>
                没有找到符合条件的笔记本
              </h3>

              <p>
                可以尝试放宽价格范围，
                或减少部分筛选条件。
              </p>

              <button
                className="button button-primary"
                onClick={handleReset}
              >
                清空筛选条件
              </button>

            </div>

          )}


          {/* =================================
              笔记本列表
          ================================== */}

          {currentLaptops.length > 0 && (

            <div className="laptop-grid">

              {currentLaptops.map(
                (laptop, index) => (

                  <LaptopCard
                    key={
                      laptop.id ||
                      `${laptop.brand}-${laptop.name}-${index}`
                    }
                    laptop={laptop}
                    onClick={
                      handleLaptopClick
                    }
                  />

                )
              )}

            </div>

          )}


          {/* =================================
              分页
          ================================== */}

          {filteredLaptops.length > 0 && (

            <div className="pagination">

              <button
                className="pagination-button"
                disabled={currentPage === 1}
                onClick={() =>
                  handlePageChange(
                    currentPage - 1
                  )
                }
              >
                ←
              </button>


              {Array.from(
                {
                  length: Math.min(
                    totalPages,
                    7
                  ),
                },
                (_, index) => {

                  let pageNumber;

                  if (totalPages <= 7) {

                    pageNumber =
                      index + 1;

                  } else if (
                    currentPage <= 4
                  ) {

                    pageNumber =
                      index + 1;

                  } else if (
                    currentPage >=
                    totalPages - 3
                  ) {

                    pageNumber =
                      totalPages - 6 + index;

                  } else {

                    pageNumber =
                      currentPage - 3 + index;

                  }


                  return (

                    <button
                      key={pageNumber}
                      className={
                        currentPage ===
                        pageNumber
                          ? "pagination-button active"
                          : "pagination-button"
                      }
                      onClick={() =>
                        handlePageChange(
                          pageNumber
                        )
                      }
                    >
                      {pageNumber}
                    </button>

                  );

                }
              )}


              <button
                className="pagination-button"
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  handlePageChange(
                    currentPage + 1
                  )
                }
              >
                →
              </button>

            </div>

          )}

        </div>

      </section>


      {/* =====================================
          笔记本详情弹窗
      ====================================== */}

      {selectedLaptop && (

        <LaptopDetail
          laptop={selectedLaptop}
          onClose={handleCloseDetail}
        />

      )}

    </div>

  );

}


export default Search;