import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createTestContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };

  return { ctx };
}

describe("product.search", () => {
  it("should search products by keyword successfully", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.product.search({
      keyword: "肯德基",
      page: 1,
      pageSize: 20,
    });

    expect(result).toBeDefined();
    expect(result.products).toBeInstanceOf(Array);
    expect(result.products.length).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(0);
    expect(result.page).toBe(1);
    expect(result.pageSize).toBe(20);
  });

  it("should search for phone products", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.product.search({
      keyword: "iPhone",
      page: 1,
      pageSize: 20,
    });

    expect(result.products).toBeInstanceOf(Array);
    expect(result.products.length).toBeGreaterThan(0);
    expect(result.products.some(p => p.title.includes("iPhone") || p.title.includes("手机"))).toBe(true);
  });

  it("should search for hotel products", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.product.search({
      keyword: "酒店",
      page: 1,
      pageSize: 20,
    });

    expect(result.products).toBeInstanceOf(Array);
    expect(result.products.length).toBeGreaterThan(0);
    expect(result.products.some(p => p.category === "酒店住宿")).toBe(true);
  });

  it("should search for food products", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.product.search({
      keyword: "外卖",
      page: 1,
      pageSize: 20,
    });

    expect(result.products).toBeInstanceOf(Array);
    expect(result.products.length).toBeGreaterThan(0);
    expect(result.products.some(p => p.category === "美食外卖")).toBe(true);
  });

  it("should handle pagination correctly", async () => {
    const { ctx } = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const page1 = await caller.product.search({
      keyword: "手机",
      page: 1,
      pageSize: 2,
    });

    expect(page1.products.length).toBeLessThanOrEqual(2);
    expect(page1.page).toBe(1);
    expect(page1.pageSize).toBe(2);
  });
});
