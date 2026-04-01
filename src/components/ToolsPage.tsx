import { ImageProcessor } from './ImageProcessor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Image, FileType, Images, Wand2 } from 'lucide-react';

export function ToolsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">图片处理工具</h1>
        <p className="text-muted-foreground">
          专业的图片压缩、格式转换和批量处理工具
        </p>
      </div>

      <Tabs defaultValue="compress" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="compress" className="flex items-center gap-2">
            <Image className="h-4 w-4" />
            <span className="hidden sm:inline">图片压缩</span>
          </TabsTrigger>
          <TabsTrigger value="convert" className="flex items-center gap-2">
            <FileType className="h-4 w-4" />
            <span className="hidden sm:inline">格式转换</span>
          </TabsTrigger>
          <TabsTrigger value="batch" className="flex items-center gap-2">
            <Images className="h-4 w-4" />
            <span className="hidden sm:inline">批量处理</span>
          </TabsTrigger>
          <TabsTrigger value="enhance" className="flex items-center gap-2">
            <Wand2 className="h-4 w-4" />
            <span className="hidden sm:inline">智能增强</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compress" className="space-y-6">
          <ImageProcessor />
        </TabsContent>

        <TabsContent value="convert" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>格式转换</CardTitle>
              <CardDescription>将图片转换为不同的格式</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageProcessor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="batch" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>批量处理</CardTitle>
              <CardDescription>一次性处理多张图片</CardDescription>
            </CardHeader>
            <CardContent>
              <ImageProcessor />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enhance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>智能增强</CardTitle>
              <CardDescription>使用 AI 技术自动优化图片质量</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 mx-auto mb-4">
                  <Wand2 className="h-8 w-8 text-violet-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">即将推出</h3>
                <p className="text-muted-foreground">
                  AI 智能增强功能正在开发中，敬请期待
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Features */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100">
                <Image className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="font-medium">智能压缩</p>
                <p className="text-sm text-muted-foreground">保持质量的同时减小体积</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                <FileType className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium">格式支持</p>
                <p className="text-sm text-muted-foreground">JPEG、PNG、WebP、AVIF</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <Images className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium">批量处理</p>
                <p className="text-sm text-muted-foreground">一次处理多张图片</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                <Wand2 className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="font-medium">本地处理</p>
                <p className="text-sm text-muted-foreground">数据安全不上传</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
