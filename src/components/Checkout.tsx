import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription, PRICING_PLANS } from '@/hooks/useSubscription';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Check, CreditCard, Shield, Lock } from 'lucide-react';
import { toast } from 'sonner';

type Page = 'home' | 'pricing' | 'tools' | 'dashboard' | 'login' | 'register' | 'checkout';

interface CheckoutProps {
  planId: string;
  onNavigate: (page: Page) => void;
}

export function Checkout({ planId, onNavigate }: CheckoutProps) {
  const { user } = useAuth();
  const { handleSubscriptionSuccess } = useSubscription();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'payment' | 'processing' | 'success'>('payment');

  const plan = PRICING_PLANS.find(p => p.id === planId);

  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
  });

  if (!plan || planId === 'free') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground">无效的计划</p>
            <Button onClick={() => onNavigate('pricing')} className="mt-4">
              返回定价
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStep('processing');

    await new Promise(resolve => setTimeout(resolve, 3000));

    const success = await handleSubscriptionSuccess(planId as any);
    if (success) {
      setStep('success');
      toast.success('订阅成功！');
    } else {
      setStep('payment');
      toast.error('支付失败，请重试');
    }

    setIsLoading(false);
  };

  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim()
      .slice(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .slice(0, 5);
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-6">
              <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
                <Check className="h-10 w-10 text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2">订阅成功！</h2>
            <p className="text-muted-foreground mb-6">
              感谢您订阅 {plan.name}。您现在可以享用所有专业功能。
            </p>
            <div className="space-y-2">
              <Button
                className="w-full bg-gradient-to-r from-violet-600 to-purple-600"
                onClick={() => onNavigate('dashboard')}
              >
                前往仪表盘
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onNavigate('tools')}
              >
                开始使用
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="flex justify-center mb-6">
              <Loader2 className="h-16 w-16 text-violet-600 animate-spin" />
            </div>
            <h2 className="text-2xl font-bold mb-2">正在处理支付...</h2>
            <p className="text-muted-foreground">
              请稍候，正在安全处理您的付款
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => onNavigate('pricing')} className="mb-4">
          ← 返回定价
        </Button>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>支付信息</CardTitle>
                <CardDescription>安全加密支付</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardholderName">持卡人姓名</Label>
                    <Input
                      id="cardholderName"
                      placeholder="张三"
                      value={paymentData.cardholderName}
                      onChange={(e) => setPaymentData({ ...paymentData, cardholderName: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">卡号</Label>
                    <div className="relative">
                      <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        className="pl-10"
                        value={paymentData.cardNumber}
                        onChange={(e) => setPaymentData({ ...paymentData, cardNumber: formatCardNumber(e.target.value) })}
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiryDate">有效期</Label>
                      <Input
                        id="expiryDate"
                        placeholder="MM/YY"
                        value={paymentData.expiryDate}
                        onChange={(e) => setPaymentData({ ...paymentData, expiryDate: formatExpiryDate(e.target.value) })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cvv"
                          type="password"
                          placeholder="123"
                          className="pl-10"
                          maxLength={4}
                          value={paymentData.cvv}
                          onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                          required
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-violet-600 to-purple-600"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      `支付 ¥${plan.price}`
                    )}
                  </Button>
                </form>
              </CardContent>
              <CardFooter className="flex justify-center">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  256位 SSL 加密保护
                </div>
              </CardFooter>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>订单摘要</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{plan.name}</p>
                    <p className="text-sm text-muted-foreground">按月订阅</p>
                  </div>
                  <Badge variant="secondary">{plan.price > 0 ? `¥${plan.price}/月` : '免费'}</Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <p className="font-medium">包含功能：</p>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <Check className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div className="flex items-center justify-between text-lg font-bold">
                  <span>总计</span>
                  <span>¥{plan.price}/月</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
