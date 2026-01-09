import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles, CheckCircle2, Star, BookOpen, Heart } from "lucide-react";
import { toast } from "sonner";
import { useLocation } from "wouter";

interface NameResult {
  name: string;
  givenName: string;
  meaning: string;
  wuxing: string;
  poetry?: string;
  score: number;
}

export default function NamingVIP() {
  const [location] = useLocation();
  const [paymentProof, setPaymentProof] = useState("");
  const [names, setNames] = useState<NameResult[]>([]);
  const [showResults, setShowResults] = useState(false);

  // 从 URL 参数获取起名信息
  const params = new URLSearchParams(location.split("?")[1] || "");
  const surname = params.get("surname") || "";
  const gender = (params.get("gender") as "male" | "female" | "neutral") || "neutral";
  const birthDate = params.get("birthDate") || undefined;
  const preferences = params.get("preferences") || undefined;

  const generateVIPMutation = trpc.naming.generateVIP.useMutation({
    onSuccess: (data) => {
      setNames(data.names);
      setShowResults(true);
      toast.success(`成功生成 ${data.names.length} 个精选好名！`);
      // 滚动到结果区域
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    },
    onError: (error) => {
      toast.error("生成失败：" + error.message);
    },
  });

  const handleConfirmPayment = () => {
    if (!paymentProof.trim()) {
      toast.error("请输入支付宝交易单号或上传支付截图");
      return;
    }

    generateVIPMutation.mutate({
      surname,
      gender,
      birthDate,
      preferences,
      paymentProof: paymentProof.trim(),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-red-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              AI 起名神器 VIP
            </h1>
          </div>
          <Badge className="bg-gradient-to-r from-red-600 to-orange-600">
            VIP 专享
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {!showResults ? (
          <>
            {/* VIP Features */}
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
                升级 VIP，获得更多精选好名
              </h2>
              <p className="text-gray-600 text-lg">
                为姓 <span className="font-bold text-red-600">{surname}</span> 的宝宝生成 50 个精选好名
              </p>
            </div>

            {/* VIP Benefits */}
            <Card className="mb-8 shadow-lg border-2 border-red-600">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50">
                <CardTitle className="text-2xl">VIP 专享特权</CardTitle>
                <CardDescription>一次付费，终身受益</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold mb-1">50 个精选好名</h4>
                      <p className="text-sm text-gray-600">
                        相比免费版的 5 个名字，VIP 提供 10 倍选择空间
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold mb-1">详细五行分析</h4>
                      <p className="text-sm text-gray-600">
                        专业的五行八字分析，确保名字与宝宝命理相合
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold mb-1">诗词典故出处</h4>
                      <p className="text-sm text-gray-600">
                        每个名字都有诗词出处，富有文化内涵
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold mb-1">名字寓意解读</h4>
                      <p className="text-sm text-gray-600">
                        深度解读每个名字的美好寓意和文化内涵
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Section */}
            <Card className="mb-8 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  支付方式
                </CardTitle>
                <CardDescription>
                  扫描下方二维码支付 ￥9.9，即可解锁 VIP 功能
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price */}
                <div className="text-center py-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-4xl font-bold text-red-600">￥9.9</span>
                    <span className="text-xl text-gray-500 line-through">¥99</span>
                  </div>
                  <p className="text-sm text-gray-600">限时特惠，立省 ￥89.1</p>
                </div>

                {/* QR Code */}
                <div className="flex justify-center">
                  <div className="bg-white p-4 rounded-lg shadow-md">
                    <img
                      src="/alipay-qr.jpg"
                      alt="支付宝收款码"
                      className="w-64 h-64 object-contain"
                    />
                    <p className="text-center text-sm text-gray-600 mt-2">
                      使用支付宝扫码支付 ￥9.9
                    </p>
                  </div>
                </div>

                {/* Payment Proof Input */}
                <div className="space-y-2">
                  <Label htmlFor="paymentProof">支付完成后，请输入支付宝交易单号</Label>
                  <Input
                    id="paymentProof"
                    placeholder="例如：2024010922001234567890123456"
                    value={paymentProof}
                    onChange={(e) => setPaymentProof(e.target.value)}
                  />
                  <p className="text-xs text-gray-500">
                    💡 提示：支付成功后，在支付宝账单详情中可以找到交易单号
                  </p>
                </div>

                {/* Confirm Button */}
                <Button
                  onClick={handleConfirmPayment}
                  disabled={generateVIPMutation.isPending}
                  className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-lg h-12"
                >
                  {generateVIPMutation.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      正在生成 VIP 名字...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      确认支付，生成 50 个好名字
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </>
        ) : (
          /* Results Section */
          <div id="results" className="space-y-6">
            <div className="text-center">
              <h3 className="text-3xl font-bold mb-2">🎉 恭喜！VIP 名字生成成功</h3>
              <p className="text-gray-600">为您精选了 {names.length} 个好名字</p>
            </div>

            <div className="grid gap-4">
              {names.map((name, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="secondary" className="text-xs">
                            No.{index + 1}
                          </Badge>
                          <h4 className="text-2xl font-bold text-red-600">{name.name}</h4>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          五行：{name.wuxing}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="font-bold">{name.score}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-700">
                        <span className="font-semibold">寓意：</span>
                        {name.meaning}
                      </p>
                      {name.poetry && (
                        <p className="text-sm text-gray-600 italic bg-gray-50 p-3 rounded">
                          <BookOpen className="w-4 h-4 inline mr-1" />
                          {name.poetry}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Thank You Message */}
            <Card className="border-2 border-green-600 bg-gradient-to-br from-green-50 to-emerald-50">
              <CardContent className="p-6 text-center">
                <Heart className="w-12 h-12 text-green-600 mx-auto mb-3" />
                <h3 className="text-xl font-bold mb-2">感谢您的支持！</h3>
                <p className="text-gray-600">
                  希望这些名字能为您的宝宝带来美好的未来
                  <br />
                  如有任何问题，欢迎随时联系我们
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
