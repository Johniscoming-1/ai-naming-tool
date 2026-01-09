import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createMockContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("takeout.searchNearby", () => {
  it("should search KFC restaurants near Innovation Port", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.takeout.searchNearby({
      keyword: "肯德基",
      category: "all",
      page: 1,
    });

    expect(result).toBeDefined();
    expect(result.shops).toBeDefined();
    expect(Array.isArray(result.shops)).toBe(true);
    expect(result.total).toBeGreaterThanOrEqual(0);
    
    if (result.shops.length > 0) {
      const shop = result.shops[0];
      expect(shop).toHaveProperty("id");
      expect(shop).toHaveProperty("name");
      expect(shop).toHaveProperty("address");
      expect(shop).toHaveProperty("distance");
      expect(shop).toHaveProperty("meituanLink");
      expect(shop).toHaveProperty("elemeLink");
      
      // 验证链接格式
      expect(shop.meituanLink).toContain("waimai.meituan.com");
      expect(shop.elemeLink).toContain("ele.me");
    }
  });

  it("should search supermarkets near Innovation Port", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.takeout.searchNearby({
      keyword: "超市",
      category: "supermarket",
      page: 1,
    });

    expect(result).toBeDefined();
    expect(result.shops).toBeDefined();
    expect(Array.isArray(result.shops)).toBe(true);
  });

  it("should search fruit shops near Innovation Port", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.takeout.searchNearby({
      keyword: "水果",
      category: "fruit",
      page: 1,
    });

    expect(result).toBeDefined();
    expect(result.shops).toBeDefined();
    expect(Array.isArray(result.shops)).toBe(true);
  });

  it("should search pharmacies near Innovation Port", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.takeout.searchNearby({
      keyword: "药店",
      category: "pharmacy",
      page: 1,
    });

    expect(result).toBeDefined();
    expect(result.shops).toBeDefined();
    expect(Array.isArray(result.shops)).toBe(true);
  });

  it("should handle empty search results gracefully", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.takeout.searchNearby({
      keyword: "不存在的商家名称xyz123",
      category: "all",
      page: 1,
    });

    expect(result).toBeDefined();
    expect(result.shops).toBeDefined();
    expect(Array.isArray(result.shops)).toBe(true);
    expect(result.total).toBe(0);
  });
});
