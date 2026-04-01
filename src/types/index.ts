// 用户订阅计划类型
export type SubscriptionPlan = 'free' | 'pro' | 'enterprise';

// 用户信息接口
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  plan: SubscriptionPlan;
  subscriptionStatus: 'active' | 'canceled' | 'past_due' | 'unpaid' | null;
  subscriptionEndDate: Date | null;
  usage: UsageStats;
}

// 使用统计
export interface UsageStats {
  imagesProcessed: number;
  imagesLimit: number;
  storageUsed: number; // MB
  storageLimit: number; // MB
  apiCalls: number;
  apiCallsLimit: number;
}

// 定价计划
export interface PricingPlan {
  id: SubscriptionPlan;
  name: string;
  description: string;
  price: number;
  priceId: string; // Stripe price ID
  period: 'month' | 'year';
  features: string[];
  limits: {
    imagesPerMonth: number;
    maxFileSize: number; // MB
    storageGB: number;
    apiCalls: number;
  };
  popular?: boolean;
}

// 图片处理任务
export interface ImageTask {
  id: string;
  originalFile: File;
  originalUrl: string;
  processedUrl?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  settings: ProcessingSettings;
  result?: {
    originalSize: number;
    processedSize: number;
    savings: number; // percentage
  };
}

// 处理设置
export interface ProcessingSettings {
  quality: number; // 0-100
  format: 'original' | 'jpeg' | 'png' | 'webp' | 'avif';
  maxWidth?: number;
  maxHeight?: number;
  preserveMetadata: boolean;
}

// 支付会话响应
export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

// API 响应
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
