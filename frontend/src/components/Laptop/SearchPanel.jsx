import React, { useState } from "react";

function SearchPanel({
  brands = [],
  onSearch,
  onReset,
}) {
  // ==========================================
  // 查询条件
  // ==========================================

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [cpu, setCpu] = useState("");
  const [memory, setMemory] = useState("");
  const [storage, setStorage] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");


  // ==========================================
  // CPU选项
  // ==========================================

  const cpuOptions = [
    "Intel",
    "AMD",
    "Apple",
    "Qualcomm",
  ];


  // ==========================================
  // 内存选项
  // ==========================================

  const memoryOptions = [
    "4",
    "8",
    "16",
    "32",
    "64",
  ];


  // ==========================================
  // 存储选项
  // ==========================================

  const storageOptions = [
    "128",
    "256",
    "512",
    "1024",
    "2048",
  ];


  // ==========================================
  // 执行查询
  // ==========================================

  function handleSearch(event) {

    event.preventDefault();

    const filters = {
      name: name.trim(),
      brand,
      cpu,
      memory,
      storage,
      minPrice,
      maxPrice,
    };

    if (onSearch) {
      onSearch(filters);
    }
  }


  // ==========================================
  // 重置
  // ==========================================

  function handleReset() {

    setName("");
    setBrand("");
    setCpu("");
    setMemory("");
    setStorage("");
    setMinPrice("");
    setMaxPrice("");

    if (onReset) {
      onReset();
    }
  }


  return (
    <section className="search-panel">

      {/* ======================================
          筛选标题
      ====================================== */}

      <div className="search-panel-header">

        <div>

          <span className="search-panel-tag">
            LAPTOP SEARCH
          </span>

          <h2>
            查找笔记本
          </h2>

          <p>
            根据你的需求筛选合适的笔记本电脑
          </p>

        </div>


        <div className="search-panel-icon">
          🔍
        </div>

      </div>


      {/* ======================================
          查询表单
      ====================================== */}

      <form
        className="search-form"
        onSubmit={handleSearch}
      >

        {/* ==================================
            第一行：名称 + 品牌
        ================================== */}

        <div className="search-form-row">

          <div className="search-field search-field-large">

            <label>
              笔记本名称
            </label>

            <div className="input-with-icon">

              <span>
                🔎
              </span>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="例如：ThinkPad、MacBook、Inspiron"
              />

            </div>

          </div>


          <div className="search-field">

            <label>
              品牌
            </label>

            <select
              value={brand}
              onChange={(event) =>
                setBrand(event.target.value)
              }
            >

              <option value="">
                全部品牌
              </option>

              {brands.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              ))}

            </select>

          </div>

        </div>


        {/* ==================================
            第二行：CPU + 内存 + 存储
        ================================== */}

        <div className="search-form-row three-columns">

          <div className="search-field">

            <label>
              CPU 品牌
            </label>

            <select
              value={cpu}
              onChange={(event) =>
                setCpu(event.target.value)
              }
            >

              <option value="">
                全部 CPU
              </option>

              {cpuOptions.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>

              ))}

            </select>

          </div>


          <div className="search-field">

            <label>
              内存
            </label>

            <select
              value={memory}
              onChange={(event) =>
                setMemory(event.target.value)
              }
            >

              <option value="">
                全部内存
              </option>

              {memoryOptions.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item} GB
                </option>

              ))}

            </select>

          </div>


          <div className="search-field">

            <label>
              存储
            </label>

            <select
              value={storage}
              onChange={(event) =>
                setStorage(event.target.value)
              }
            >

              <option value="">
                全部存储
              </option>

              {storageOptions.map((item) => (

                <option
                  key={item}
                  value={item}
                >
                  {item} GB
                </option>

              ))}

            </select>

          </div>

        </div>


        {/* ==================================
            第三行：价格
        ================================== */}

        <div className="search-form-row">

          <div className="search-field">

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
                value={minPrice}
                onChange={(event) =>
                  setMinPrice(event.target.value)
                }
                placeholder="最低价格"
              />

            </div>

          </div>


          <div className="search-field">

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
                value={maxPrice}
                onChange={(event) =>
                  setMaxPrice(event.target.value)
                }
                placeholder="最高价格"
              />

            </div>

          </div>

        </div>


        {/* ==================================
            操作按钮
        ================================== */}

        <div className="search-actions">

          <button
            type="button"
            className="search-reset-button"
            onClick={handleReset}
          >
            ↻
            <span>
              重置条件
            </span>
          </button>


          <button
            type="submit"
            className="search-submit-button"
          >

            <span>
              🔍
            </span>

            <strong>
              开始查询
            </strong>

            <span>
              →
            </span>

          </button>

        </div>

      </form>

    </section>
  );
}

export default SearchPanel;