import { useState } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { Pricing } from '@/components/Pricing';
import { Dashboard } from '@/components/Dashboard';
import { LoginForm } from '@/components/LoginForm';
import { RegisterForm } from '@/components/RegisterForm';
import { Checkout } from '@/components/Checkout';
import { ToolsPage } from '@/components/ToolsPage';

type Page = 'home' | 'pricing' | 'tools' | 'dashboard' | 'login' | 'register' | 'checkout';

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [checkoutPlan, setCheckoutPlan] = useState<string>('');
  const { isAuthenticated } = useAuth();

  const navigateTo = (page: Page, params?: string) => {
    if (page === 'checkout' && params) {
      setCheckoutPlan(params);
    }
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateTo} />;
      case 'pricing':
        return (
          <>
            <Navbar currentPage={currentPage} onNavigate={navigateTo} />
            <Pricing onNavigate={navigateTo} />
          </>
        );
      case 'tools':
        return (
          <>
            <Navbar currentPage={currentPage} onNavigate={navigateTo} />
            <ToolsPage />
          </>
        );
      case 'dashboard':
        return isAuthenticated ? (
          <>
            <Navbar currentPage={currentPage} onNavigate={navigateTo} />
            <Dashboard />
          </>
        ) : (
          <LoginForm onNavigate={navigateTo} />
        );
      case 'login':
        return <LoginForm onNavigate={navigateTo} />;
      case 'register':
        return <RegisterForm onNavigate={navigateTo} />;
      case 'checkout':
        return isAuthenticated ? (
          <>
            <Navbar currentPage={currentPage} onNavigate={navigateTo} />
            <Checkout planId={checkoutPlan} onNavigate={navigateTo} />
          </>
        ) : (
          <LoginForm onNavigate={navigateTo} />
        );
      default:
        return <HomePage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {renderPage()}
      <Toaster position="top-center" />
    </div>
  );
}

interface HomePageProps {
  onNavigate: (page: Page, params?: string) => void;
}

function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="home" onNavigate={onNavigate} />
      <main>
        <Hero onNavigate={onNavigate} />
        
        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold mb-4">强大的图片处理功能</h2>
              <p className="text-lg text-muted-foreground">
                从压缩到格式转换，我们提供您需要的一切工具
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-violet-100 mb-6">
                  <svg className="h-6 w-6 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">智能压缩</h3>
                <p className="text-muted-foreground">
                  采用先进的压缩算法，在保持图片质量的同时大幅减小文件体积，最高可节省 90% 的存储空间。
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 mb-6">
                  <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">格式转换</h3>
                <p className="text-muted-foreground">
                  支持 JPEG、PNG、WebP、AVIF 等主流格式互转，轻松适配各种使用场景和平台要求。
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 mb-6">
                  <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-3">批量处理</h3>
                <p className="text-muted-foreground">
                  一次性处理多张图片，支持自定义设置，大幅提升工作效率，节省宝贵时间。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-3xl p-12 text-center text-white">
              <h2 className="text-3xl font-bold mb-4">准备好开始了吗？</h2>
              <p className="text-lg text-violet-100 mb-8 max-w-2xl mx-auto">
                立即注册免费账户，体验专业级图片处理功能。无需信用卡，随时升级。
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => onNavigate('register')}
                  className="inline-flex items-center justify-center px-8 py-3 rounded-lg bg-white text-violet-600 font-medium hover:bg-gray-100 transition-colors"
                >
                  免费注册
                </button>
                <button
                  onClick={() => onNavigate('pricing')}
                  className="inline-flex items-center justify-center px-8 py-3 rounded-lg border-2 border-white text-white font-medium hover:bg-white/10 transition-colors"
                >
                  查看定价
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xl font-bold text-white">PicTool Pro</span>
              </div>
              <p className="text-sm">
                专业级图片处理工具，简单、快速、高效。
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">产品</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => onNavigate('tools')} className="hover:text-white transition-colors">图片压缩</button></li>
                <li><button onClick={() => onNavigate('tools')} className="hover:text-white transition-colors">格式转换</button></li>
                <li><button onClick={() => onNavigate('tools')} className="hover:text-white transition-colors">批量处理</button></li>
                <li><button onClick={() => onNavigate('pricing')} className="hover:text-white transition-colors">定价</button></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">公司</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">关于我们</a></li>
                <li><a href="#" className="hover:text-white transition-colors">博客</a></li>
                <li><a href="#" className="hover:text-white transition-colors">联系我们</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">法律</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">隐私政策</a></li>
                <li><a href="#" className="hover:text-white transition-colors">服务条款</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie 政策</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-sm">
            <p>&copy; 2024 PicTool Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
