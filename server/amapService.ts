/**
 * 高德地图 POI 搜索服务
 * 用于获取西安交大创新港周边的真实商家数据
 */

import axios from 'axios';

const AMAP_API_KEY = '0b4051f20c8f41dade332f45cc5882d2';
const AMAP_API_BASE = 'https://restapi.amap.com/v3';

// 西安交大创新港坐标 (经度, 纬度)
const INNOVATION_PORT_LOCATION = '108.833333,34.316667';

export interface AmapPOI {
  id: string;
  name: string;
  type: string;
  address: string;
  location: string; // 经纬度 "lng,lat"
  tel: string;
  distance: string; // 距离（米）
  businessArea: string;
  rating: string;
  cost: string; // 人均消费
}

export interface SearchResult {
  pois: AmapPOI[];
  count: number;
}

/**
 * 搜索周边 POI
 * @param keyword 搜索关键词
 * @param types POI 类型代码，多个用|分隔
 * @param radius 搜索半径（米），最大50000
 * @param page 页码，从1开始
 * @param pageSize 每页数量，最大50
 */
export async function searchNearbyPOI(
  keyword: string,
  types?: string,
  radius: number = 20000,
  page: number = 1,
  pageSize: number = 20
): Promise<SearchResult> {
  try {
    const params: Record<string, string | number> = {
      key: AMAP_API_KEY,
      location: INNOVATION_PORT_LOCATION,
      keywords: keyword,
      radius: radius,
      page: page,
      offset: pageSize,
      extensions: 'all', // 返回详细信息
      sortrule: 'distance', // 按距离排序
    };

    if (types) {
      params.types = types;
    }

    const response = await axios.get(`${AMAP_API_BASE}/place/around`, {
      params,
      timeout: 10000,
    });

    if (response.data.status === '1' && response.data.pois) {
      return {
        pois: response.data.pois,
        count: parseInt(response.data.count) || 0,
      };
    }

    return { pois: [], count: 0 };
  } catch (error) {
    console.error('[AmapService] Search failed:', error);
    return { pois: [], count: 0 };
  }
}

/**
 * 搜索餐饮商家
 */
export async function searchRestaurants(keyword: string, page: number = 1) {
  // 餐饮服务类型代码
  const types = '050000|060000|070000'; // 餐饮服务|购物服务|生活服务
  return searchNearbyPOI(keyword, types, 20000, page, 20);
}

/**
 * 搜索超市便利店
 */
export async function searchSupermarkets(keyword: string, page: number = 1) {
  const types = '060100|060101|060102'; // 购物服务-超市-便利店
  return searchNearbyPOI(keyword, types, 20000, page, 20);
}

/**
 * 搜索水果店
 */
export async function searchFruitShops(keyword: string, page: number = 1) {
  const types = '060200'; // 专卖店
  return searchNearbyPOI(keyword || '水果', types, 20000, page, 20);
}

/**
 * 搜索药店
 */
export async function searchPharmacies(keyword: string, page: number = 1) {
  const types = '090600'; // 医疗保健服务-药店
  return searchNearbyPOI(keyword || '药店', types, 20000, page, 20);
}

/**
 * 生成美团搜索链接
 */
export function generateMeituanLink(shopName: string): string {
  return `https://waimai.meituan.com/search?q=${encodeURIComponent(shopName)}`;
}

/**
 * 生成饿了么搜索链接
 */
export function generateElemeLink(shopName: string): string {
  return `https://www.ele.me/search?keyword=${encodeURIComponent(shopName)}`;
}

/**
 * 计算两点之间的距离（米）
 */
export function calculateDistance(location: string): number {
  const [lng, lat] = location.split(',').map(Number);
  const [baseLng, baseLat] = INNOVATION_PORT_LOCATION.split(',').map(Number);
  
  const R = 6371000; // 地球半径（米）
  const dLat = ((lat - baseLat) * Math.PI) / 180;
  const dLng = ((lng - baseLng) * Math.PI) / 180;
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((baseLat * Math.PI) / 180) *
      Math.cos((lat * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance);
}

/**
 * 格式化距离显示
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  }
  return `${(meters / 1000).toFixed(1)}km`;
}
