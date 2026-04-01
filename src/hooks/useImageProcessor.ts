import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import type { ImageTask, ProcessingSettings } from '@/types';

const DEFAULT_SETTINGS: ProcessingSettings = {
  quality: 80,
  format: 'original',
  maxWidth: undefined,
  maxHeight: undefined,
  preserveMetadata: false,
};

export function useImageProcessor() {
  const { user, refreshUsage } = useAuth();
  const [tasks, setTasks] = useState<ImageTask[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // 添加图片任务
  const addTask = useCallback((file: File, settings: Partial<ProcessingSettings> = {}) => {
    const task: ImageTask = {
      id: Math.random().toString(36).substr(2, 9),
      originalFile: file,
      originalUrl: URL.createObjectURL(file),
      status: 'pending',
      progress: 0,
      settings: { ...DEFAULT_SETTINGS, ...settings },
    };

    setTasks(prev => [...prev, task]);
    return task.id;
  }, []);

  // 移除任务
  const removeTask = useCallback((taskId: string) => {
    setTasks(prev => {
      const task = prev.find(t => t.id === taskId);
      if (task?.originalUrl) {
        URL.revokeObjectURL(task.originalUrl);
      }
      if (task?.processedUrl) {
        URL.revokeObjectURL(task.processedUrl);
      }
      return prev.filter(t => t.id !== taskId);
    });
  }, []);

  // 处理单张图片
  const processImage = useCallback(async (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setIsProcessing(true);
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, status: 'processing', progress: 0 } : t
    ));

    try {
      // 模拟处理进度
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));
        setTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, progress } : t
        ));
      }

      // 创建处理后的图片（实际项目中这里会进行真正的压缩/转换）
      const processedUrl = task.originalUrl; // 模拟处理后的图片
      
      // 计算压缩比例（模拟）
      const originalSize = task.originalFile.size;
      const quality = task.settings.quality / 100;
      const processedSize = Math.floor(originalSize * quality * 0.8);
      const savings = Math.round(((originalSize - processedSize) / originalSize) * 100);

      setTasks(prev => prev.map(t => 
        t.id === taskId ? {
          ...t,
          status: 'completed',
          progress: 100,
          processedUrl,
          result: {
            originalSize,
            processedSize,
            savings,
          },
        } : t
      ));

      // 更新使用量
      if (user) {
        user.usage.imagesProcessed++;
        refreshUsage();
      }

    } catch (error) {
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: 'error', progress: 0 } : t
      ));
    } finally {
      setIsProcessing(false);
    }
  }, [tasks, user, refreshUsage]);

  // 批量处理
  const processAll = useCallback(async () => {
    const pendingTasks = tasks.filter(t => t.status === 'pending');
    for (const task of pendingTasks) {
      await processImage(task.id);
    }
  }, [tasks, processImage]);

  // 下载处理后的图片
  const downloadImage = useCallback((taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task?.processedUrl) return;

    const link = document.createElement('a');
    link.href = task.processedUrl;
    
    // 确定文件扩展名
    let extension = task.originalFile.name.split('.').pop() || 'jpg';
    if (task.settings.format !== 'original') {
      extension = task.settings.format;
    }
    
    const baseName = task.originalFile.name.replace(/\.[^/.]+$/, '');
    link.download = `${baseName}_compressed.${extension}`;
    link.click();
  }, [tasks]);

  // 下载所有
  const downloadAll = useCallback(() => {
    const completedTasks = tasks.filter(t => t.status === 'completed');
    completedTasks.forEach((task, index) => {
      setTimeout(() => downloadImage(task.id), index * 500);
    });
  }, [tasks, downloadImage]);

  // 清空已完成
  const clearCompleted = useCallback(() => {
    setTasks(prev => prev.filter(t => t.status !== 'completed'));
  }, []);

  // 更新任务设置
  const updateTaskSettings = useCallback((taskId: string, settings: Partial<ProcessingSettings>) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, settings: { ...t.settings, ...settings } } : t
    ));
  }, []);

  // 获取统计
  const getStats = useCallback(() => {
    const completed = tasks.filter(t => t.status === 'completed');
    const totalOriginal = completed.reduce((sum, t) => sum + (t.result?.originalSize || 0), 0);
    const totalProcessed = completed.reduce((sum, t) => sum + (t.result?.processedSize || 0), 0);
    const totalSavings = totalOriginal > 0 ? Math.round(((totalOriginal - totalProcessed) / totalOriginal) * 100) : 0;

    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      processing: tasks.filter(t => t.status === 'processing').length,
      completed: completed.length,
      error: tasks.filter(t => t.status === 'error').length,
      totalOriginalSize: totalOriginal,
      totalProcessedSize: totalProcessed,
      totalSavings,
    };
  }, [tasks]);

  return {
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
  };
}
