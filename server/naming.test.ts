import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// 增加超时时间，因为 LLM 调用需要时间
const TIMEOUT = 60000;

function createTestContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("naming.generateFree", () => {
  it("应该为姓张的男孩生成 5 个名字", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.naming.generateFree({
      surname: "张",
      gender: "male",
    });

    expect(result.names).toBeDefined();
    expect(result.names.length).toBe(5);
    
    // 验证每个名字的结构
    result.names.forEach((name) => {
      expect(name.name).toMatch(/^张/); // 名字应该以"张"开头
      expect(name.givenName).toBeDefined();
      expect(name.meaning).toBeDefined();
      expect(name.wuxing).toBeDefined();
      expect(name.score).toBeGreaterThanOrEqual(80);
      expect(name.score).toBeLessThanOrEqual(100);
    });
  }, TIMEOUT);

  it("应该为姓李的女孩生成 5 个名字", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.naming.generateFree({
      surname: "李",
      gender: "female",
    });

    expect(result.names).toBeDefined();
    expect(result.names.length).toBe(5);
    
    result.names.forEach((name) => {
      expect(name.name).toMatch(/^李/);
      expect(name.meaning).toBeDefined();
    });
  }, TIMEOUT);
});

describe("naming.generateVIP", () => {
  it("应该生成 50 个 VIP 名字", async () => {
    const ctx = createTestContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.naming.generateVIP({
      surname: "陈",
      gender: "male",
      paymentProof: "test-transaction-id-123456",
    });

    expect(result.names).toBeDefined();
    expect(result.names.length).toBeGreaterThanOrEqual(50); // VIP 版至少 50 个
    expect(result.paymentVerified).toBe(true);
    
    // 验证 VIP 名字质量
    result.names.forEach((name) => {
      expect(name.name).toMatch(/^陈/);
      expect(name.meaning).toBeDefined();
      expect(name.wuxing).toBeDefined();
    });
    
    // 至少 80% 的名字应该有诗词出处
    const namesWithPoetry = result.names.filter(n => n.poetry && n.poetry.length > 0);
    expect(namesWithPoetry.length).toBeGreaterThan(result.names.length * 0.8);
  }, TIMEOUT);
});
