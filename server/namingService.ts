import { invokeLLM } from "./_core/llm";

/**
 * AI 起名服务
 * 根据姓氏、性别、生辰八字等信息生成名字
 */

export interface NamingRequest {
  surname: string; // 姓氏
  gender?: "male" | "female" | "neutral"; // 性别
  birthDate?: string; // 生辰八字或出生日期
  preferences?: string; // 其他偏好（如：希望名字有文化内涵、寓意美好等）
}

export interface NameResult {
  name: string; // 完整姓名
  givenName: string; // 名字（不含姓氏）
  meaning: string; // 寓意
  wuxing: string; // 五行属性
  poetry?: string; // 诗词出处
  score: number; // 综合评分 (1-100)
}

/**
 * 生成名字（免费版 - 5个名字）
 */
export async function generateNamesFree(request: NamingRequest): Promise<NameResult[]> {
  return generateNames(request, 5);
}

/**
 * 生成名字（VIP版 - 50个名字）
 */
export async function generateNamesVIP(request: NamingRequest): Promise<NameResult[]> {
  return generateNames(request, 50);
}

/**
 * 核心起名逻辑
 */
async function generateNames(request: NamingRequest, count: number): Promise<NameResult[]> {
  const { surname, gender = "neutral", birthDate, preferences } = request;

  const genderText = gender === "male" ? "男孩" : gender === "female" ? "女孩" : "中性";
  const prompt = `请为姓"${surname}"的${genderText}起${count}个好名字。

要求：
1. 名字要有美好的寓意
2. 读音优美，朗朗上口
3. 符合中国传统文化
4. 避免生僻字
${birthDate ? `5. 出生日期：${birthDate}，请考虑五行平衡` : ""}
${preferences ? `6. 其他要求：${preferences}` : ""}

请以 JSON 数组格式返回，每个名字包含以下字段：
- name: 完整姓名
- givenName: 名字（不含姓氏）
- meaning: 名字的寓意解释（50字以内）
- wuxing: 五行属性（如：金水、木火土等）
- poetry: 诗词出处（如果有的话，格式：诗句 - 作者《诗名》）
- score: 综合评分（1-100）

示例格式：
[
  {
    "name": "张诗涵",
    "givenName": "诗涵",
    "meaning": "诗意盎然，涵养深厚，寓意才华横溢、气质优雅",
    "wuxing": "金水",
    "poetry": "腹有诗书气自华 - 苏轼《和董传留别》",
    "score": 95
  }
]`;

  try {
    const response = await invokeLLM({
      messages: [
        {
          role: "system",
          content: "你是一位精通中国传统文化和姓名学的起名大师，擅长根据五行八字、诗词典故为新生儿起名。",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "name_list",
          strict: true,
          schema: {
            type: "object",
            properties: {
              names: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    givenName: { type: "string" },
                    meaning: { type: "string" },
                    wuxing: { type: "string" },
                    poetry: { type: "string" },
                    score: { type: "number" },
                  },
                  required: ["name", "givenName", "meaning", "wuxing", "score"],
                  additionalProperties: false,
                },
              },
            },
            required: ["names"],
            additionalProperties: false,
          },
        },
      },
    });

    const content = response.choices[0]?.message?.content;
    if (!content || typeof content !== "string") {
      throw new Error("AI 返回内容为空或格式错误");
    }

    const result = JSON.parse(content);
    return result.names || [];
  } catch (error) {
    console.error("[NamingService] 生成名字失败:", error);
    // 返回备用名字
    return generateFallbackNames(surname, count);
  }
}

/**
 * 备用名字生成（当 AI 失败时）
 */
function generateFallbackNames(surname: string, count: number): NameResult[] {
  const fallbackNames = [
    { givenName: "诗涵", meaning: "诗意盎然，涵养深厚", wuxing: "金水", score: 95 },
    { givenName: "梓轩", meaning: "梓木成材，气宇轩昂", wuxing: "木土", score: 93 },
    { givenName: "雨萱", meaning: "雨露滋润，萱草忘忧", wuxing: "水木", score: 92 },
    { givenName: "浩然", meaning: "浩然正气，胸怀宽广", wuxing: "水金", score: 94 },
    { givenName: "婉清", meaning: "温婉清雅，气质出众", wuxing: "土水", score: 91 },
    { givenName: "子涵", meaning: "君子涵养，德才兼备", wuxing: "水水", score: 90 },
    { givenName: "思远", meaning: "思虑深远，志向高远", wuxing: "金土", score: 92 },
    { givenName: "欣怡", meaning: "欣欣向荣，怡然自得", wuxing: "木土", score: 89 },
    { givenName: "俊杰", meaning: "才智过人，杰出非凡", wuxing: "火木", score: 93 },
    { givenName: "雅琪", meaning: "高雅脱俗，美玉无瑕", wuxing: "木木", score: 91 },
  ];

  return fallbackNames.slice(0, count).map((item) => ({
    name: surname + item.givenName,
    ...item,
  }));
}
