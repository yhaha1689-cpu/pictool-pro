import { useAuth } from '@/hooks/useAuth';
import { useSubscription, PRICING_PLANS } from '@/hooks/useSubscription';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Image,
  HardDrive,
  Zap,
  CreditCard,
  Settings,
  Crown,
  TrendingUp,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatFileSize } from '@/lib/utils';

export function Dashboard() {
  const { user } = useAuth();
  const { currentPlan, cancelSubscription } = useSubscription();

  if (!user) return null;

  const usagePercentages = {
    images: Math.min((user.usage.imagesProcessed / user.usage.imagesLimit) * 100, 100),
    storage: Math.min((user.usage.storageUsed / user.usage.storageLimit) * 100, 100),
    api: Math.min((user.usage.apiCalls / user.usage.apiCallsLimit) * 100, 100),
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">仪表盘</h1>
          <p className="text-muted-foreground">管理您的账户和订阅</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant={user.plan === 'free' ? 'secondary' : 'default'}
            className={user.plan !== 'free' ? 'bg-gradient-to-r from-violet-600 to-purple-600' : ''}
          >
            <Crown className="h-3 w-3 mr-1" />
            {currentPlan.name}
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">概览</TabsTrigger>
          <TabsTrigger value="subscription">订阅</TabsTrigger>
          <TabsTrigger value="usage">使用详情</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
                    <Image className="h-5 w-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">本月处理</p>
                    <p className="text-2xl font-bold">{user.usage.imagesProcessed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                    <HardDrive className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">存储使用</p>
                    <p className="text-2xl font-bold">
                      {formatFileSize(user.usage.storageUsed * 1024 * 1024)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <Zap className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">API 调用</p>
                    <p className="text-2xl font-bold">{user.usage.apiCalls}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                    <TrendingUp className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">节省空间</p>
                    <p className="text-2xl font-bold">85%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Usage Progress */}
          <Card>
            <CardHeader>
              <CardTitle>本月使用情况</CardTitle>
              <CardDescription>您的配额使用进度</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">图片处理</span>
                  <span className="text-sm text-muted-foreground">
                    {user.usage.imagesProcessed} / {user.usage.imagesLimit === 999999 ? '无限' : user.usage.imagesLimit}
                  </span>
                </div>
                <Progress value={usagePercentages.images} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">存储空间</span>
                  <span className="text-sm text-muted-foreground">
                    {formatFileSize(user.usage.storageUsed * 1024 * 1024)} / {formatFileSize(user.usage.storageLimit * 1024 * 1024)}
                  </span>
                </div>
                <Progress value={usagePercentages.storage} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">API 调用</span>
                  <span className="text-sm text-muted-foreground">
                    {user.usage.apiCalls} / {user.usage.apiCallsLimit.toLocaleString()}
                  </span>
                </div>
                <Progress value={usagePercentages.api} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
                    <Image className="h-5 w-5 text-violet-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">处理图片</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      开始压缩和转换您的图片
                    </p>
                    <Button asChild>
                      <Link to="/tools">开始使用</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                    <CreditCard className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">升级计划</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      解锁更多功能和更高配额
                    </p>
                    <Button variant="outline" asChild>
                      <Link to="/pricing">查看定价</Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Subscription Tab */}
        <TabsContent value="subscription" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>当前订阅</CardTitle>
              <CardDescription>管理您的订阅计划</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-lg">{currentPlan.name}</h3>
                  <p className="text-sm text-muted-foreground">{currentPlan.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">
                    ¥{currentPlan.price}
                    <span className="text-sm font-normal text-muted-foreground">/月</span>
                  </p>
                </div>
              </div>

              {user.subscriptionStatus && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>订阅到期: {user.subscriptionEndDate?.toLocaleDateString('zh-CN')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span>状态: {user.subscriptionStatus === 'active' ? '活跃' : user.subscriptionStatus}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button asChild>
                  <Link to="/pricing">更改计划</Link>
                </Button>
                {user.plan !== 'free' && (
                  <Button variant="outline" onClick={cancelSubscription}>
                    取消订阅
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Plan Features */}
          <Card>
            <CardHeader>
              <CardTitle>计划功能</CardTitle>
              <CardDescription>您当前计划包含的功能</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {currentPlan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Usage Details Tab */}
        <TabsContent value="usage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>详细使用统计</CardTitle>
              <CardDescription>过去30天的使用情况</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">总处理</p>
                    <p className="text-2xl font-bold">{user.usage.imagesProcessed}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">剩余</p>
                    <p className="text-2xl font-bold">
                      {user.usage.imagesLimit === 999999
                        ? '无限'
                        : Math.max(0, user.usage.imagesLimit - user.usage.imagesProcessed)}
                    </p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">使用率</p>
                    <p className="text-2xl font-bold">{Math.round(usagePercentages.images)}%</p>
                  </div>
                </div>

                {usagePercentages.images > 80 && (
                  <div className="flex items-center gap-2 p-4 bg-amber-50 text-amber-800 rounded-lg">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-sm">
                      您的图片处理配额即将用完，建议升级到更高计划。
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
