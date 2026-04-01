import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Image,
  User,
  Settings,
  CreditCard,
  LogOut,
  Menu,
  X,
  Crown,
} from 'lucide-react';

type Page = 'home' | 'pricing' | 'tools' | 'dashboard' | 'login' | 'register' | 'checkout';

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { page: 'home' as Page, label: '首页', public: true },
    { page: 'tools' as Page, label: '工具', public: true },
    { page: 'pricing' as Page, label: '定价', public: true },
    { page: 'dashboard' as Page, label: '仪表盘', public: false },
  ];

  const isActive = (page: Page) => currentPage === page;

  const handleLogout = () => {
    logout();
    onNavigate('home');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <button onClick={() => onNavigate('home')} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-purple-600">
              <Image className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              PicTool Pro
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              (link.public || isAuthenticated) && (
                <button
                  key={link.page}
                  onClick={() => onNavigate(link.page)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.page)
                      ? 'bg-violet-100 text-violet-700'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  }`}
                >
                  {link.label}
                </button>
              )
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    {user?.plan !== 'free' && (
                      <div className="absolute -top-1 -right-1">
                        <Crown className="h-4 w-4 text-amber-500 fill-amber-500" />
                      </div>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center gap-2 p-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium">{user?.name}</p>
                      <p className="text-xs text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onNavigate('dashboard')} className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    仪表盘
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onNavigate('pricing')} className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    订阅管理
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    设置
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    退出登录
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button variant="ghost" onClick={() => onNavigate('login')}>
                  登录
                </Button>
                <Button className="bg-gradient-to-r from-violet-600 to-purple-600" onClick={() => onNavigate('register')}>
                  免费注册
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                (link.public || isAuthenticated) && (
                  <button
                    key={link.page}
                    onClick={() => {
                      onNavigate(link.page);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium text-left ${
                      isActive(link.page)
                        ? 'bg-violet-100 text-violet-700'
                        : 'text-muted-foreground hover:bg-accent'
                    }`}
                  >
                    {link.label}
                  </button>
                )
              ))}
              {!isAuthenticated && (
                <div className="flex flex-col gap-2 pt-2 border-t">
                  <Button variant="ghost" onClick={() => onNavigate('login')}>
                    登录
                  </Button>
                  <Button className="bg-gradient-to-r from-violet-600 to-purple-600" onClick={() => onNavigate('register')}>
                    免费注册
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
