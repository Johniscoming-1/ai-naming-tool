import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Heart, Star, BookOpen } from "lucide-react";
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

export default function NamingHome() {
  const [, setLocation] = useLocation();
  const [surname, setSurname] = useState("");
  const [gender, setGender] = useState<"male" | "female" | "neutral">("neutral");
  const [birthDate, setBirthDate] = useState("");
  const [preferences, setPreferences] = useState("");
  const [names, setNames] = useState<NameResult[]>([]);
  const [showVipPrompt, setShowVipPrompt] = useState(false);

  const generateMutation = trpc.naming.generateFree.useMutation({
    onSuccess: (data) => {
      setNames(data.names);
      setShowVipPrompt(true);
      toast.success("成功生成 5 个精选好名！");
    },
    onError: (error) => {
      toast.error("生成失败：" + error.message);
    },
  });

  const handleGenerate = () => {
    if (!surname.trim()) {
      toast.error("请输入姓氏");
      return;
    }

    generateMutation.mutate({
      surname: surname.trim(),
      gender,
      birthDate: birthDate || undefined,
      preferences: preferences || undefined,
    });
  };

  const handleUpgradeToVIP = () => {
    setLocation("/naming-vip?surname=" + encodeURIComponent(surname) + 
      "&gender=" + gender + 
      (birthDate ? "&birthDate=" + encodeURIComponent(birthDate) : "") +
      (preferences ? "&preferences=" + encodeURIComponent(preferences) : ""));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-red-600" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              AI 起名神器
            </h1>
          </div>
          <Badge variant="outline" className="text-sm">
            已为 10000+ 宝宝起名
          </Badge>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent">
            为宝宝起一个好名字
          </h2>
          <p className="text-gray-600 text-lg">
            结合传统文化、五行八字、诗词典故，AI 智能生成寓意美好的名字
          </p>
        </div>

        {/* Input Form */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              填写宝宝信息
            </CardTitle>
            <CardDescription>
              请填写以下信息，我们将为您生成最适合的名字
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* 姓氏 */}
            <div className="space-y-2">
              <Label htmlFor="surname">姓氏 *</Label>
              <Input
                id="surname"
                placeholder="请输入姓氏（如：张、李、王）"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                maxLength={2}
                className="text-lg"
              />
            </div>

            {/* 性别 */}
            <div className="space-y-2">
              <Label>性别</Label>
              <RadioGroup value={gender} onValueChange={(v) => setGender(v as any)}>
                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="cursor-pointer">男孩</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="cursor-pointer">女孩</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="neutral" id="neutral" />
                    <Label htmlFor="neutral" className="cursor-pointer">中性</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* 出生日期 */}
            <div className="space-y-2">
              <Label htmlFor="birthDate">出生日期（选填）</Label>
              <Input
                id="birthDate"
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
              />
              <p className="text-sm text-gray-500">提供出生日期可以更好地考虑五行平衡</p>
            </div>

            {/* 其他偏好 */}
            <div className="space-y-2">
              <Label htmlFor="preferences">其他要求（选填）</Label>
              <Textarea
                id="preferences"
                placeholder="例如：希望名字有文化内涵、寓意美好、读音优美等"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                rows={3}
              />
            </div>

            {/* Generate Button */}
            <Button
              onClick={handleGenerate}
              disabled={generateMutation.isPending}
              className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-lg h-12"
            >
              {generateMutation.isPending ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  AI 正在生成中...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  免费生成 5 个好名字
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {names.length > 0 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">为您精选的好名字</h3>
              <p className="text-gray-600">点击名字查看详细解释</p>
            </div>

            <div className="grid gap-4">
              {names.map((name, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-2xl font-bold text-red-600 mb-1">{name.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {name.wuxing}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="w-5 h-5 fill-current" />
                        <span className="font-bold">{name.score}</span>
                      </div>
                    </div>
                    <p className="text-gray-700 mb-2">{name.meaning}</p>
                    {name.poetry && (
                      <p className="text-sm text-gray-500 italic">
                        📖 {name.poetry}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* VIP Upgrade Prompt */}
            {showVipPrompt && (
              <Card className="border-2 border-red-600 bg-gradient-to-br from-red-50 to-orange-50">
                <CardContent className="p-6 text-center">
                  <Heart className="w-12 h-12 text-red-600 mx-auto mb-3" />
                  <h3 className="text-xl font-bold mb-2">想要更多好名字？</h3>
                  <p className="text-gray-600 mb-4">
                    升级 VIP 版，获得 <span className="font-bold text-red-600">50 个</span> 精选好名字
                    <br />
                    包含详细的五行分析、诗词出处、名字寓意
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-3xl font-bold text-red-600">¥19.9</span>
                    <span className="text-gray-500 line-through">¥99</span>
                  </div>
                  <Button
                    onClick={handleUpgradeToVIP}
                    className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-lg h-12 px-8"
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    立即升级 VIP
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Features */}
        {names.length === 0 && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <BookOpen className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="font-bold mb-2">传统文化</h3>
                <p className="text-sm text-gray-600">
                  结合五行八字、诗词典故，传承中华文化
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Sparkles className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="font-bold mb-2">AI 智能</h3>
                <p className="text-sm text-gray-600">
                  先进 AI 算法，生成寓意美好、读音优美的名字
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="font-bold mb-2">用心服务</h3>
                <p className="text-sm text-gray-600">
                  已为 10000+ 家庭提供起名服务，好评如潮
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
