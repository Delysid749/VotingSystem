import { io, Socket } from 'socket.io-client';
import { Poll } from '../types';

// WebSocket 事件类型
export type WebSocketEventType = 'poll_update' | 'vote_result' | 'error' | 'connect' | 'disconnect';

// WebSocket 事件监听器类型
export type WebSocketEventListener = (data: any) => void;

// WebSocket 服务类
export class WebSocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private eventListeners: Map<WebSocketEventType, WebSocketEventListener[]> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 3000; // 3秒

  constructor() {
    this.initializeEventListeners();
  }

  /**
   * 初始化事件监听器映射
   */
  private initializeEventListeners(): void {
    const eventTypes: WebSocketEventType[] = ['poll_update', 'vote_result', 'error', 'connect', 'disconnect'];
    eventTypes.forEach(eventType => {
      this.eventListeners.set(eventType, []);
    });
  }

  /**
   * 连接到 WebSocket 服务器
   */
  connect(): void {
    if (this.socket && this.isConnected) {
      console.log('WebSocket 已经连接');
      return;
    }

    try {
      // 创建 Socket.IO 连接
      this.socket = io({
        transports: ['websocket'],
        upgrade: false,
        reconnection: true,
        reconnectionDelay: this.reconnectInterval,
        reconnectionAttempts: this.maxReconnectAttempts,
      });

      this.setupSocketListeners();
      
    } catch (error) {
      console.error('WebSocket 连接失败:', error);
      this.emit('error', { message: 'WebSocket 连接失败' });
    }
  }

  /**
   * 设置 Socket 事件监听器
   */
  private setupSocketListeners(): void {
    if (!this.socket) return;

    // 连接成功
    this.socket.on('connect', () => {
      console.log('WebSocket 连接成功');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.emit('connect', { timestamp: new Date().toISOString() });

      // 加入投票房间以接收实时更新
      this.socket?.emit('join_poll', { pollId: 'current' });
    });

    // 连接断开
    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket 连接断开:', reason);
      this.isConnected = false;
      this.emit('disconnect', { reason, timestamp: new Date().toISOString() });
    });

    // 投票结果更新
    this.socket.on('poll_update', (data: Poll) => {
      console.log('收到投票更新:', data);
      this.emit('poll_update', data);
    });

    // 投票提交结果
    this.socket.on('vote_result', (data: any) => {
      console.log('收到投票结果:', data);
      this.emit('vote_result', data);
    });

    // 错误处理
    this.socket.on('error', (error: any) => {
      console.error('WebSocket 错误:', error);
      this.emit('error', error);
    });

    // 连接错误
    this.socket.on('connect_error', (error) => {
      console.error('WebSocket 连接错误:', error);
      this.reconnectAttempts++;
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('WebSocket 重连失败，已达到最大重试次数');
        this.emit('error', { message: '连接失败，请刷新页面重试' });
      }
    });
  }

  /**
   * 断开 WebSocket 连接
   */
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
      console.log('WebSocket 连接已断开');
    }
  }

  /**
   * 添加事件监听器
   */
  on(eventType: WebSocketEventType, listener: WebSocketEventListener): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.push(listener);
    }
  }

  /**
   * 移除事件监听器
   */
  off(eventType: WebSocketEventType, listener: WebSocketEventListener): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  /**
   * 触发事件
   */
  private emit(eventType: WebSocketEventType, data: any): void {
    const listeners = this.eventListeners.get(eventType);
    if (listeners) {
      listeners.forEach(listener => {
        try {
          listener(data);
        } catch (error) {
          console.error(`事件监听器执行错误 (${eventType}):`, error);
        }
      });
    }
  }

  /**
   * 获取连接状态
   */
  isConnectedStatus(): boolean {
    return this.isConnected;
  }

  /**
   * 发送消息到服务器（如果需要）
   */
  send(eventName: string, data: any): void {
    if (this.socket && this.isConnected) {
      this.socket.emit(eventName, data);
    } else {
      console.warn('WebSocket 未连接，无法发送消息');
    }
  }
}

// 导出单例实例
export const websocketService = new WebSocketService(); 