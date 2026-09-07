import axios from "axios";


// ========================================
// Flask 后端地址
// ========================================

const API_BASE_URL = "http://localhost:8000";


// ========================================
// Axios 实例
// ========================================

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,

  headers: {
    "Content-Type": "application/json",
  },
});


// ========================================
// 1. 获取笔记本列表
//
// Flask:
// GET /api/laptops
//
// 支持：
// brand
// limit
// ========================================

export const getLaptops = async (params = {}) => {

  try {

    const response = await api.get(
      "/api/laptops",
      {
        params,
      }
    );

    return response.data;

  } catch (error) {

    console.error(
      "获取笔记本列表失败:",
      error
    );

    throw error;
  }
};



// ========================================
// 2. 根据品牌获取笔记本
//
// 例如：
// getLaptopsByBrand("Lenovo")
// ========================================

export const getLaptopsByBrand = async (
  brand,
  limit = 991
) => {

  return getLaptops({
    brand,
    limit,
  });

};



// ========================================
// 3. 获取所有品牌
//
// Flask:
// GET /api/options/brands
// ========================================

export const getBrands = async () => {

  try {

    const response = await api.get(
      "/api/options/brands"
    );

    return response.data;

  } catch (error) {

    console.error(
      "获取品牌列表失败:",
      error
    );

    throw error;
  }

};



// ========================================
// 4. 获取品牌平均价格
//
// Flask:
// GET /api/stats/brand_avg
// ========================================

export const getBrandAvg = async () => {

  try {

    const response = await api.get(
      "/api/stats/brand_avg"
    );

    return response.data;

  } catch (error) {

    console.error(
      "获取品牌平均价格失败:",
      error
    );

    throw error;
  }

};



// ========================================
// 兼容旧名称
//
// Analysis.jsx 如果使用：
// getBrandAverage
//
// 也可以正常工作
// ========================================

export const getBrandAverage = getBrandAvg;



// ========================================
// 5. 获取价格区间分布
//
// Flask:
// GET /api/stats/price_dist
// ========================================

export const getPriceDist = async () => {

  try {

    const response = await api.get(
      "/api/stats/price_dist"
    );

    return response.data;

  } catch (error) {

    console.error(
      "获取价格区间分布失败:",
      error
    );

    throw error;
  }

};



// ========================================
// 兼容旧名称
//
// Analysis.jsx 如果使用：
// getPriceDistribution
//
// 也可以正常工作
// ========================================

export const getPriceDistribution = getPriceDist;



// ========================================
// 6. 获取服务器状态
//
// Flask:
// GET /
// ========================================

export const getServerStatus = async () => {

  try {

    const response = await api.get(
      "/"
    );

    return response.data;

  } catch (error) {

    console.error(
      "Flask 后端连接失败:",
      error
    );

    throw error;
  }

};



// ========================================
// 7. 测试 Flask 是否连接成功
// ========================================

export const checkServerConnection = async () => {

  try {

    await api.get("/");

    return true;

  } catch (error) {

    return false;

  }

};



// ========================================
// 8. 根据查询条件筛选笔记本
//
// 当前 Flask 后端主要支持 brand。
// CPU、内存、存储、名称等条件，
// 等你把完整后端给我后再正式接入。
// ========================================

export const searchLaptops = async ({
  brand = "",
  cpu = "",
  memory = "",
  storage = "",
  name = "",
  limit = 991,
} = {}) => {

  /*
   * 当前后端 /api/laptops 只支持 brand。
   *
   * 所以暂时只把 brand 发送给 Flask。
   *
   * 后面增加后端查询 API 后，
   * 再把 cpu / memory / storage / name
   * 加入 params。
   */

  const params = {
    limit,
  };

  if (brand) {
    params.brand = brand;
  }

  const laptops = await getLaptops(params);


  /*
   * 如果后端暂时没有 CPU、内存、存储、
   * 名称筛选，我们可以先在前端做一次过滤。
   *
   * 这样目前就可以测试查询页面。
   */

  let result = Array.isArray(laptops)
    ? laptops
    : [];


  // 名称筛选

  if (name) {

    const keyword =
      name.toLowerCase();

    result = result.filter(
      (laptop) => {

        const laptopName =
          String(
            laptop.name || ""
          ).toLowerCase();

        return laptopName.includes(
          keyword
        );

      }
    );

  }


  // CPU 筛选

  if (cpu) {

    const keyword =
      cpu.toLowerCase();

    result = result.filter(
      (laptop) => {

        const laptopCpu =
          String(
            laptop.cpu || ""
          ).toLowerCase();

        return laptopCpu.includes(
          keyword
        );

      }
    );

  }


  // 内存筛选

  if (memory) {

    const keyword =
      memory.toLowerCase();

    result = result.filter(
      (laptop) => {

        const laptopMemory =
          String(
            laptop.memory || ""
          ).toLowerCase();

        return laptopMemory.includes(
          keyword
        );

      }
    );

  }


  // 存储筛选

  if (storage) {

    const keyword =
      storage.toLowerCase();

    result = result.filter(
      (laptop) => {

        const laptopStorage =
          String(
            laptop.storage || ""
          ).toLowerCase();

        return laptopStorage.includes(
          keyword
        );

      }
    );

  }


  return result;

};



// ========================================
// 9. 推荐接口
//
// 注意：
// 目前你给我的 Flask 后端还没有
// /api/recommend 接口。
//
// 所以这里暂时不请求后端。
// 等你把后端完整代码给我后，
// 再正式接入推荐算法。
// ========================================

export const getRecommendations = async (
  preferences
) => {

  try {

    const response = await api.post(
      "/api/recommend",
      preferences
    );

    return response.data;

  } catch (error) {

    console.error(
      "获取推荐结果失败:",
      error
    );

    throw error;
  }

};



// ========================================
// 10. 价格预测接口
//
// 目前 Flask 后端还没有提供。
// 先预留接口。
// ========================================

export const predictPrice = async (
  laptopData
) => {

  try {

    const response = await api.post(
      "/api/predict",
      laptopData
    );

    return response.data;

  } catch (error) {

    console.error(
      "价格预测失败:",
      error
    );

    throw error;
  }

};



// ========================================
// 默认导出
// ========================================

export default api;