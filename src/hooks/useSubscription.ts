import { useState } from 'react';
import { useAuth } from './useAuth';
import { PRICE_IDS } from '@/lib/stripe';
import type { SubscriptionPlan, CheckoutSessionResponse } from '@/types';

// 定价配置
export const PRICING_PLANS = [
  {
    id: 'free' as SubscriptionPlan,
    name: '免费版',
    description: '适合个人偶尔使用',
    price: 0,
    priceId: '',
    period: 'month' as const,
    features: [
      '每月处理 50 张图片',
      '最大文件 5MB',
      '100MB 存储空间',
      '基础压缩算法',
      '标准格式支持 (JPEG, PNG)',
    ],
    limits: {
      imagesPerMonth: 50,
      maxFileSize: 5,
      storageGB: 0.1,
      apiCalls: 100,
    },
  },
  {
    id: 'pro' as SubscriptionPlan,
    name: '专业版',
    description: '适合专业设计师和创作者',
    price: 29,
    priceId: PRICE_IDS.pro,
    period: 'month' as const,
    features: [
      '每月处理 500 张图片',
      '最大文件 50MB',
      '1GB 存储空间',
      '高级压缩算法',
      '全部格式支持 (WebP, AVIF)',
      '批量处理',
      '优先处理队列',
      'API 访问 (1000次/月)',
    ],
    limits: {
      imagesPerMonth: 500,
      maxFileSize: 50,
      storageGB: 1,
      apiCalls: 1000,
    },
    popular: true,
  },
  {
    id: 'enterprise' as SubscriptionPlan,
    name: '企业版',
    description: '适合团队和企业级需求',
    price: 99,
    priceId: PRICE_IDS.enterprise,
    period: 'month' as const,
    features: [
      '无限图片处理',
      '最大文件 200MB',
      '10GB 存储空间',
      '企业级压缩算法',
      '全部格式支持',
      '批量处理',
      '优先处理队列',
      'API 访问 (10000次/月)',
      '团队协作',
      '专属客服支持',
      '自定义集成',
    ],
    limits: {
      imagesPerMonth: 999999,
      maxFileSize: 200,
      storageGB: 10,
      apiCalls: 10000,
    },
  },
];

export function useSubscription() {
  const { user, updatePlan } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 创建 Stripe Checkout 会话
  const createCheckoutSession = async (planId: SubscriptionPlan): Promise<CheckoutSessionResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const plan = PRICING_PLANS.find(p => p.id === planId);
      if (!plan || planId === 'free') {
        throw new Error('无效的计划');
      }

      // 调用后端 API 创建 Checkout Session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          userId: user?.id,
          email: user?.email,
        }),
      });

      if (!response.ok) {
        throw new Error('创建支付会话失败');
      }

      const { sessionId, url } = await response.json();

      // 跳转到 Stripe Checkout 页面
      window.location.href = url;

      return { sessionId, url };
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建结账会话失败');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // 处理订阅成功（从 Stripe Webhook 或回调处理）
  const handleSubscriptionSuccess = async (planId: SubscriptionPlan) => {
    setIsLoading(true);
    try {
      updatePlan(planId);
      return true;
    } catch (err) {
      setError('订阅更新失败');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 取消订阅
  const cancelSubscription = async () => {
    setIsLoading(true);
    try {
      // 调用后端 API 取消订阅
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?.id,
        }),
      });

      if (!response.ok) {
        throw new Error('取消订阅失败');
      }

      updatePlan('free');
      return true;
    } catch (err) {
      setError('取消订阅失败');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 获取当前计划
  const getCurrentPlan = () => {
    return PRICING_PLANS.find(p => p.id === user?.plan) || PRICING_PLANS[0];
  };

  // 检查功能是否可用
  const canUseFeature = (feature: keyof typeof PRICING_PLANS[0]['limits']) => {
    const plan = getCurrentPlan();
    const limit = plan.limits[feature];
    const usage = user?.usage;
    
    if (!usage) return false;

    switch (feature) {
      case 'imagesPerMonth':
        return usage.imagesProcessed < limit;
      case 'maxFileSize':
        return true;
      case 'storageGB':
        return usage.storageUsed < limit * 1024;
      case 'apiCalls':
        return usage.apiCalls < limit;
      default:
        return false;
    }
  };

  return {
    plans: PRICING_PLANS,
    currentPlan: getCurrentPlan(),
    isLoading,
    error,
    createCheckoutSession,
    handleSubscriptionSuccess,
    cancelSubscription,
    canUseFeature,
  };
}