import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription, PRICING_PLANS } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Page = 'home' | 'pricing' | 'tools' | 'dashboard' | 'login' | 'register' | 'checkout';

interface PricingProps {
  onNavigate: (page: Page, params?: string) => void;
}

export function Pricing({ onNavigate }: PricingProps) {
  const { isAuthenticated, user } = useAuth();
  const { createCheckoutSession, isLoading } = useSubscription();
  const [isYearly, setIsYearly] = useState(false);

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated) {
      toast.info('请先登录', {
        description: '登录后即可订阅计划',
      });
      onNavigate('login');
      return;
    }

    if (planId === 'free') {
      toast.info('您当前已是免费版');
      return;
    }

    const result = await createCheckoutSession(planId as any);
    if (result) {
      toast.success('正在跳转到支付页面...');
      setTimeout(() => {
        onNavigate('checkout', planId);
      }, 1000);
    }
  };

  const getButtonText = (planId: string) => {
    if (user?.plan === planId) {
      return '当前计划';
    }
    if (planId === 'free') {
      return '免费使用';
    }
    return '立即订阅';
  };

  const getYearlyPrice = (monthlyPrice: number) => {
    return Math.floor(monthlyPrice * 10);
  };

  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            选择适合您的
            <span className="bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              订阅计划
            </span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            从免费版开始，随时升级到专业版或企业版以解锁更多功能
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-sm ${!isYearly ? 'font-medium' : 'text-muted-foreground'}`}>
              月付
            </span>
            <Switch
              checked={isYearly}
              onCheckedChange={setIsYearly}
            />
            <span className={`text-sm ${isYearly ? 'font-medium' : 'text-muted-foreground'}`}>
              年付
            </span>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              省2个月
            </Badge>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {PRICING_PLANS.map((plan) => (
            <Card
              key={plan.id}
              className={`relative flex flex-col ${
                plan.popular
                  ? 'border-violet-500 shadow-lg shadow-violet-500/10'
                  : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-violet-600 to-purple-600">
                    <Sparkles className="h-3 w-3 mr-1" />
                    最受欢迎
                  </Badge>
                </div>
              )}

              <CardHeader>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
              </CardHeader>

              <CardContent className="flex-1">
                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ¥{isYearly ? getYearlyPrice(plan.price) : plan.price}
                  </span>
                  <span className="text-muted-foreground">
                    /{isYearly ? '年' : '月'}
                  </span>
                  {isYearly && plan.price > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      相当于 ¥{Math.floor(getYearlyPrice(plan.price) / 12)}/月
                    </p>
                  )}
                </div>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700'
                      : ''
                  }`}
                  variant={user?.plan === plan.id ? 'outline' : 'default'}
                  disabled={isLoading || user?.plan === plan.id}
                  onClick={() => handleSubscribe(plan.id)}
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    getButtonText(plan.id)
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-center mb-8">常见问题</h3>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2">可以随时取消订阅吗？</h4>
              <p className="text-sm text-muted-foreground">
                是的，您可以随时取消订阅。取消后，您仍可使用已付费的功能直到当前计费周期结束。
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2">支持哪些支付方式？</h4>
              <p className="text-sm text-muted-foreground">
                我们支持支付宝、微信支付以及主流信用卡支付。
              </p>
            </div>
            <div className="p-4 rounded-lg border">
              <h4 className="font-medium mb-2">如何升级或降级计划？</h4>
              <p className="text-sm text-muted-foreground">
                您可以在仪表盘随时更改计划。升级立即生效，降级在当前周期结束后生效。
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
