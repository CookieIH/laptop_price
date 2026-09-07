import React from "react";


function SearchPanel({
  filters = {},
  brands = [],
  onFilterChange,
  onReset,
}) {


  // ==========================================
  // 修改输入框
  // ==========================================

  function handleChange(
    key,
    value
  ) {

    onFilterChange(
      key,
      value
    );

  }


  return (

    <div className="search-panel">


      {/* =====================================
          搜索面板标题
      ====================================== */}

      <div className="search-panel-header">

        <div>

          <span className="search-panel-label">
            FILTER
          </span>

          <h2>
            筛选笔记本
          </h2>

        </div>


        <button
          className="reset-button"
          onClick={onReset}
        >

          清空条件

        </button>

      </div>


      {/* =====================================
          第一行：名称 + 品牌
      ====================================== */}

      <div className="search-form-grid">


        {/* 名称 */}

        <div className="form-group">

          <label>
            笔记本名称
          </label>

          <div className="input-wrapper">

            <span className="input-icon">
              ⌕
            </span>

            <input
              type="text"
              value={filters.name || ""}
              onChange={(event) =>
                handleChange(
                  "name",
                  event.target.value
                )
              }
              placeholder="例如：ThinkPad、MacBook..."
            />

          </div>

        </div>


        {/* 品牌 */}

        <div className="form-group">

          <label>
            品牌
          </label>

          <select
            value={filters.brand || ""}
            onChange={(event) =>
              handleChange(
                "brand",
                event.target.value
              )
            }
          >

            <option value="">
              全部品牌
            </option>

            {brands.map(
              (brand, index) => (

                <option
                  value={brand}
                  key={`${brand}-${index}`}
                >
                  {brand}
                </option>

              )
            )}

          </select>

        </div>


      </div>


      {/* =====================================
          第二行：CPU + 内存 + 存储
      ====================================== */}

      <div className="search-form-grid search-form-grid-three">


        {/* CPU */}

        <div className="form-group">

          <label>
            CPU
          </label>

          <input
            type="text"
            value={filters.cpu || ""}
            onChange={(event) =>
              handleChange(
                "cpu",
                event.target.value
              )
            }
            placeholder="例如：Intel Core i5"
          />

          <span className="form-hint">
            支持关键词查询
          </span>

        </div>


        {/* 内存 */}

        <div className="form-group">

          <label>
            内存
          </label>

          <select
            value={filters.memory || ""}
            onChange={(event) =>
              handleChange(
                "memory",
                event.target.value
              )
            }
          >

            <option value="">
              不限内存
            </option>

            <option value="4GB">
              4GB
            </option>

            <option value="8GB">
              8GB
            </option>

            <option value="16GB">
              16GB
            </option>

            <option value="32GB">
              32GB
            </option>

            <option value="64GB">
              64GB
            </option>

          </select>

        </div>


        {/* 存储 */}

        <div className="form-group">

          <label>
            存储
          </label>

          <select
            value={filters.storage || ""}
            onChange={(event) =>
              handleChange(
                "storage",
                event.target.value
              )
            }
          >

            <option value="">
              不限存储
            </option>

            <option value="128GB">
              128GB
            </option>

            <option value="256GB">
              256GB
            </option>

            <option value="512GB">
              512GB
            </option>

            <option value="1TB">
              1TB
            </option>

            <option value="2TB">
              2TB
            </option>

          </select>

        </div>


      </div>


      {/* =====================================
          第三行：价格
      ====================================== */}

      <div className="search-price-row">


        <div className="form-group">

          <label>
            最低价格
          </label>

          <div className="price-input">

            <span>
              $
            </span>

            <input
              type="number"
              min="0"
              value={
                filters.minPrice || ""
              }
              onChange={(event) =>
                handleChange(
                  "minPrice",
                  event.target.value
                )
              }
              placeholder="不限"
            />

          </div>

        </div>


        <span className="price-separator">
          —
        </span>


        <div className="form-group">

          <label>
            最高价格
          </label>

          <div className="price-input">

            <span>
              $
            </span>

            <input
              type="number"
              min="0"
              value={
                filters.maxPrice || ""
              }
              onChange={(event) =>
                handleChange(
                  "maxPrice",
                  event.target.value
                )
              }
              placeholder="不限"
            />

          </div>

        </div>


      </div>


      {/* =====================================
          搜索提示
      ====================================== */}

      <div className="search-panel-tip">

        <span className="tip-icon">
          i
        </span>

        <span>
          筛选条件会实时应用到下方的产品列表，
          无需额外点击搜索按钮。
        </span>

      </div>


    </div>

  );

}


export default SearchPanel;