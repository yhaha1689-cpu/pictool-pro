import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useImageProcessor } from '@/hooks/useImageProcessor';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  Upload,
  Image,
  Download,
  Trash2,
  Play,
  Check,
  X,
  AlertCircle,
  FileImage,
  Settings2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { formatFileSize } from '@/lib/utils';

const FORMAT_OPTIONS = [
  { value: 'original', label: '保持原格式' },
  { value: 'jpeg', label: 'JPEG' },
  { value: 'png', label: 'PNG' },
  { value: 'webp', label: 'WebP' },
  { value: 'avif', label: 'AVIF (推荐)' },
];

export function ImageProcessor() {
  const { user } = useAuth();
  const {
    tasks,
    isProcessing,
    addTask,
    removeTask,
    processImage,
    processAll,
    downloadImage,
    downloadAll,
    clearCompleted,
    updateTaskSettings,
    getStats,
  } = useImageProcessor();

  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [globalSettings, setGlobalSettings] = useState({
    quality: 80,
    format: 'original' as const,
    preserveMetadata: false,
  });

  const stats = getStats();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const maxFileSize = user?.plan === 'enterprise' ? 200 : user?.plan === 'pro' ? 50 : 5;
    
    acceptedFiles.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} 不是有效的图片文件`);
        return;
      }
      
      if (file.size > maxFileSize * 1024 * 1024) {
        toast.error(`${file.name} 超过 ${maxFileSize}MB 限制`);
        return;
      }

      addTask(file, globalSettings);
    });

    if (acceptedFiles.length > 0) {
      toast.success(`已添加 ${acceptedFiles.length} 个文件`);
    }
  }, [addTask, globalSettings, user?.plan]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.avif', '.gif'],
    },
    multiple: true,
  });

  const handleGlobalQualityChange = (value: number[]) => {
    setGlobalSettings(prev => ({ ...prev, quality: value[0] }));
  };

  const handleGlobalFormatChange = (value: string) => {
    setGlobalSettings(prev => ({ ...prev, format: value as any }));
  };

  const handleGlobalMetadataChange = (checked: boolean) => {
    setGlobalSettings(prev => ({ ...prev, preserveMetadata: checked }));
  };

  const applyGlobalSettings = () => {
    tasks.forEach(task => {
      if (task.status === 'pending') {
        updateTaskSettings(task.id, globalSettings);
      }
    });
    toast.success('全局设置已应用到所有待处理任务');
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-violet-500 bg-violet-50'
            : 'border-gray-300 hover:border-violet-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100">
            <Upload className="h-8 w-8 text-violet-600" />
          </div>
          <div>
            <p className="text-lg font-medium mb-1">
              {isDragActive ? '松开以上传图片' : '拖放图片到此处'}
            </p>
            <p className="text-sm text-muted-foreground">
              或点击选择文件，支持 JPG、PNG、WebP、AVIF 格式
            </p>
          </div>
          <Badge variant="secondary">
            最大 {user?.plan === 'enterprise' ? '200' : user?.plan === 'pro' ? '50' : '5'}MB/文件
          </Badge>
        </div>
      </div>

      {/* Global Settings */}
      {tasks.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Settings2 className="h-4 w-4" />
                全局设置
              </h3>
              <Button variant="outline" size="sm" onClick={applyGlobalSettings}>
                应用到全部
              </Button>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              <div>
                <Label className="mb-2 block">压缩质量: {globalSettings.quality}%</Label>
                <Slider
                  value={[globalSettings.quality]}
                  onValueChange={handleGlobalQualityChange}
                  min={1}
                  max={100}
                  step={1}
                />
              </div>
              <div>
                <Label className="mb-2 block">输出格式</Label>
                <Select value={globalSettings.format} onValueChange={handleGlobalFormatChange}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FORMAT_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={globalSettings.preserveMetadata}
                  onCheckedChange={handleGlobalMetadataChange}
                />
                <Label>保留元数据</Label>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task List */}
      {tasks.length > 0 && (
        <div className="space-y-4">
          {/* Stats */}
          <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <Badge variant="secondary">总计: {stats.total}</Badge>
            <Badge variant="outline" className="text-yellow-600">
              待处理: {stats.pending}
            </Badge>
            <Badge variant="outline" className="text-blue-600">
              处理中: {stats.processing}
            </Badge>
            <Badge variant="outline" className="text-green-600">
              已完成: {stats.completed}
            </Badge>
            {stats.completed > 0 && (
              <>
                <Badge variant="outline" className="text-green-600">
                  节省: {formatFileSize(stats.totalOriginalSize - stats.totalProcessedSize)}
                </Badge>
                <Badge variant="outline" className="text-green-600">
                  压缩率: {stats.totalSavings}%
                </Badge>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={processAll}
              disabled={isProcessing || stats.pending === 0}
            >
              <Play className="h-4 w-4 mr-2" />
              全部处理
            </Button>
            <Button
              variant="outline"
              onClick={downloadAll}
              disabled={stats.completed === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              下载全部
            </Button>
            <Button
              variant="outline"
              onClick={clearCompleted}
              disabled={stats.completed === 0}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              清空已完成
            </Button>
          </div>

          {/* Tasks */}
          <div className="space-y-3">
            {tasks.map((task) => (
              <Card key={task.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Thumbnail */}
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={task.originalUrl}
                        alt={task.originalFile.name}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <FileImage className="h-4 w-4 text-gray-400" />
                        <span className="font-medium truncate">{task.originalFile.name}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {formatFileSize(task.originalFile.size)}
                        {task.result && (
                          <span className="ml-2 text-green-600">
                            → {formatFileSize(task.result.processedSize)}
                            （节省 {task.result.savings}%）
                          </span>
                        )}
                      </div>
                      {task.status === 'processing' && (
                        <Progress value={task.progress} className="h-1 mt-2" />
                      )}
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-2">
                      {task.status === 'pending' && (
                        <Badge variant="outline">待处理</Badge>
                      )}
                      {task.status === 'processing' && (
                        <Badge variant="outline" className="text-blue-600">
                          处理中 {task.progress}%
                        </Badge>
                      )}
                      {task.status === 'completed' && (
                        <Badge className="bg-green-100 text-green-700">
                          <Check className="h-3 w-3 mr-1" />
                          完成
                        </Badge>
                      )}
                      {task.status === 'error' && (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          错误
                        </Badge>
                      )}

                      {/* Actions */}
                      {task.status === 'pending' && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => processImage(task.id)}
                          disabled={isProcessing}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      {task.status === 'completed' && (
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => downloadImage(task.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeTask(task.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => setExpandedTask(
                          expandedTask === task.id ? null : task.id
                        )}
                      >
                        {expandedTask === task.id ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Expanded Settings */}
                  {expandedTask === task.id && task.status === 'pending' && (
                    <div className="mt-4 pt-4 border-t grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label className="mb-2 block">
                          质量: {task.settings.quality}%
                        </Label>
                        <Slider
                          value={[task.settings.quality]}
                          onValueChange={(value) =>
                            updateTaskSettings(task.id, { quality: value[0] })
                          }
                          min={1}
                          max={100}
                          step={1}
                        />
                      </div>
                      <div>
                        <Label className="mb-2 block">输出格式</Label>
                        <Select
                          value={task.settings.format}
                          onValueChange={(value) =>
                            updateTaskSettings(task.id, { format: value as any })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {FORMAT_OPTIONS.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={task.settings.preserveMetadata}
                          onCheckedChange={(checked) =>
                            updateTaskSettings(task.id, { preserveMetadata: checked })
                          }
                        />
                        <Label>保留元数据</Label>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
