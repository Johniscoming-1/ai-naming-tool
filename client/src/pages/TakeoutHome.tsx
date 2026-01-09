import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, MapPin, Phone, ExternalLink, Star, DollarSign } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function TakeoutHome() {
  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState<"all" | "restaurant" | "supermarket" | "fruit" | "pharmacy">("all");
  const [searchKeyword, setSearchKeyword] = useState("");

  const { data, isLoading, refetch } = trpc.takeout.searchNearby.useQuery(
    {
      keyword: searchKeyword || "美食",
      category,
      page: 1,
    },
    {
      enabled: !!searchKeyword,
    }
  );

  const handleSearch = () => {
    if (!keyword.trim()) {
      toast.error("请输入搜索关键词");
      return;
    }
    setSearchKeyword(keyword);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value as typeof category);
    if (searchKeyword) {
      refetch();
    }
  };

  const handleQuickSearch = (term: string) => {
    setKeyword(term);
    setSearchKeyword(term);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50">
      {/* 头部导航 */}
      <header className="bg-white border-b border-red-100 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">创新港外卖比价</h1>
                <p className="text-sm text-gray-500">西安交大创新港周边 20km</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 主要内容 */}
      <main className="container mx-auto px-4 py-8">
        {/* 搜索区域 */}
        <div className="mb-8">
          <Card className="border-red-200 shadow-lg">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="搜索商家或商品（如：肯德基、水果、超市）"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    className="flex-1 h-12 text-base border-red-200 focus:border-red-500"
                  />
                  <Button
                    onClick={handleSearch}
                    className="h-12 px-8 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    搜索
                  </Button>
                </div>

                {/* 分类标签 */}
                <Tabs value={category} onValueChange={handleCategoryChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-5 bg-red-50">
                    <TabsTrigger value="all">全部</TabsTrigger>
                    <TabsTrigger value="restaurant">餐饮</TabsTrigger>
                    <TabsTrigger value="supermarket">超市</TabsTrigger>
                    <TabsTrigger value="fruit">水果</TabsTrigger>
                    <TabsTrigger value="pharmacy">药店</TabsTrigger>
                  </TabsList>
                </Tabs>

                {/* 热门搜索 */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-sm text-gray-500">热门搜索：</span>
                  {["肯德基", "麦当劳", "海底捞", "喜茶", "超市", "水果店", "药店"].map((term) => (
                    <Badge
                      key={term}
                      variant="outline"
                      className="cursor-pointer hover:bg-red-50 hover:border-red-300"
                      onClick={() => handleQuickSearch(term)}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 搜索结果 */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
            <p className="mt-4 text-gray-600">正在搜索周边商家...</p>
          </div>
        )}

        {data && data.shops.length > 0 && (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                找到 {data.total} 家商家
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.shops.map((shop) => (
                <Card key={shop.id} className="hover:shadow-lg transition-shadow border-gray-200">
                  <CardContent className="p-5">
                    <div className="space-y-3">
                      {/* 商家名称 */}
                      <div>
                        <h3 className="font-bold text-lg text-gray-900 mb-1">{shop.name}</h3>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          <span>{shop.distance}</span>
                          {shop.rating !== "暂无评分" && (
                            <>
                              <Star className="w-4 h-4 text-yellow-500 ml-2" />
                              <span>{shop.rating}分</span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* 地址 */}
                      <div className="text-sm text-gray-600">
                        <p className="line-clamp-2">{shop.address}</p>
                      </div>

                      {/* 电话 */}
                      {shop.phone !== "未提供" && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <a href={`tel:${shop.phone}`} className="hover:text-red-500">
                            {shop.phone}
                          </a>
                        </div>
                      )}

                      {/* 人均消费 */}
                      {shop.avgPrice !== "暂无" && (
                        <div className="flex items-center gap-2 text-sm text-orange-600">
                          <DollarSign className="w-4 h-4" />
                          <span>人均 {shop.avgPrice}元</span>
                        </div>
                      )}

                      {/* 跳转按钮 */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white"
                          onClick={() => window.open(shop.meituanLink, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          美团
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-blue-500 text-blue-500 hover:bg-blue-50"
                          onClick={() => window.open(shop.elemeLink, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4 mr-1" />
                          饿了么
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {data && data.shops.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">未找到相关商家</h3>
            <p className="text-gray-600">试试搜索其他关键词，如"肯德基"、"超市"、"水果"</p>
          </div>
        )}

        {!searchKeyword && !isLoading && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍔</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">搜索创新港周边外卖</h3>
            <p className="text-gray-600 mb-6">输入商家名称或商品关键词，找到最近的外卖商家</p>
            <div className="flex justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => handleQuickSearch("肯德基")}
                className="border-red-300 hover:bg-red-50"
              >
                试试"肯德基"
              </Button>
              <Button
                variant="outline"
                onClick={() => handleQuickSearch("超市")}
                className="border-red-300 hover:bg-red-50"
              >
                试试"超市"
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
