import { Button } from '@/components/ui/button';
import { ArrowRight, Zap, Shield, Gauge } from 'lucide-react';

type Page = 'home' | 'pricing' | 'tools' | 'dashboard' | 'login' | 'register' | 'checkout';

interface HeroProps {
  onNavigate: (page: Page) => void;
}

export function Hero({ onNavigate }: HeroProps) {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-purple-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-r from-violet-200/40 to-purple-200/40 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 text-violet-700 text-sm font-medium mb-8">
            <Zap className="h-4 w-4" />
            全新升级 - 支持 AVIF 格式
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            专业级图片处理
            <span className="block bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              简单、快速、高效
            </span>
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mb-10">
            PicTool Pro 提供强大的图片压缩、格式转换和批量处理功能。
            无论是个人用户还是企业团队，都能找到适合的解决方案。
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button
              size="lg"
              className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-lg px-8"
              onClick={() => onNavigate('tools')}
            >
              开始使用
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8"
              onClick={() => onNavigate('pricing')}
            >
              查看定价
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 sm:gap-16">
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                10M+
              </div>
              <div className="text-sm text-muted-foreground mt-1">图片已处理</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                50K+
              </div>
              <div className="text-sm text-muted-foreground mt-1">活跃用户</div>
            </div>
            <div className="text-center">
              <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                99.9%
              </div>
              <div className="text-sm text-muted-foreground mt-1">服务可用性</div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid sm:grid-cols-3 gap-6 mt-20 max-w-4xl mx-auto">
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/50 backdrop-blur border">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
              <Zap className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">闪电般快速</h3>
              <p className="text-sm text-muted-foreground">先进的压缩算法，秒级处理</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/50 backdrop-blur border">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
              <Shield className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">安全私密</h3>
              <p className="text-sm text-muted-foreground">本地处理，数据永不离开浏览器</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/50 backdrop-blur border">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
              <Gauge className="h-5 w-5 text-violet-600" />
            </div>
            <div>
              <h3 className="font-semibold mb-1">智能优化</h3>
              <p className="text-sm text-muted-foreground">自动选择最佳压缩参数</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
