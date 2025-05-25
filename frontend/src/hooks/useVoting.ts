import { useState, useEffect, useCallback, useRef } from 'react';
import { message } from 'antd';
import { Poll } from '../types';
import { VotingApiService } from '../services/api';
import { websocketService } from '../services/websocket';

interface UseVotingState {
  poll: Poll | null;
  loading: boolean;
  error: string | null;
  hasVoted: boolean;
  isConnected: boolean;
  isReconnecting: boolean;
}

interface UseVotingActions {
  refreshPoll: () => Promise<void>;
  handleVoteSubmitted: (updatedPoll: Poll) => void;
  reconnectWebSocket: () => void;
}

export function useVoting(): UseVotingState & UseVotingActions {
  // 状态定义
  const [poll, setPoll] = useState<Poll | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  
  // 使用 ref 来避免闭包陷阱
  const pollRef = useRef<Poll | null>(null);
  
  // 更新 poll 状态和 ref
  const updatePoll = useCallback((newPoll: Poll | null) => {
    setPoll(newPoll);
    pollRef.current = newPoll;
    
    // 检查用户是否已投票
    if (newPoll) {
      const voted = VotingApiService.hasUserVoted(newPoll.id);
      setHasVoted(voted);
    }
  }, []);

  // 获取投票数据
  const refreshPoll = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      
      const pollData = await VotingApiService.getCurrentPoll();
      updatePoll(pollData);
      
      console.log('投票数据加载成功:', pollData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '加载投票数据失败';
      setError(errorMessage);
      console.error('加载投票数据失败:', err);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [updatePoll]);

  // 处理投票提交成功
  const handleVoteSubmitted = useCallback((updatedPoll: Poll) => {
    updatePoll(updatedPoll);
    setHasVoted(true);
    console.log('投票提交成功，数据已更新:', updatedPoll);
  }, [updatePoll]);

  // WebSocket 事件处理器
  const handlePollUpdate = useCallback((updatedPoll: Poll) => {
    console.log('收到投票更新:', updatedPoll);
    updatePoll(updatedPoll);
    
    // 显示更新提示（可选）
    if (pollRef.current && updatedPoll.totalVotes > pollRef.current.totalVotes) {
      message.info('投票结果已更新', 1);
    }
  }, [updatePoll]);

  const handleWebSocketConnect = useCallback(() => {
    console.log('WebSocket 连接成功');
    setIsConnected(true);
    setIsReconnecting(false);
    message.success('实时连接已建立', 2);
  }, []);

  const handleWebSocketDisconnect = useCallback(() => {
    console.log('WebSocket 连接断开');
    setIsConnected(false);
    setIsReconnecting(false);
    message.warning('实时连接已断开，投票结果可能不会自动更新', 3);
  }, []);

  const handleWebSocketError = useCallback((error: any) => {
    console.error('WebSocket 错误:', error);
    setIsConnected(false);
    setIsReconnecting(false);
    
    if (error?.message) {
      message.error(`连接错误：${error.message}`, 3);
    }
  }, []);

  // 重连 WebSocket
  const reconnectWebSocket = useCallback(() => {
    if (isReconnecting) return;
    
    setIsReconnecting(true);
    console.log('正在重连 WebSocket...');
    
    // 先断开现有连接
    websocketService.disconnect();
    
    // 延迟重连
    setTimeout(() => {
      websocketService.connect();
    }, 1000);
  }, [isReconnecting]);

  // 组件挂载时的初始化
  useEffect(() => {
    let mounted = true;
    
    const initializeVoting = async () => {
      // 1. 加载投票数据
      await refreshPoll();
      
      if (!mounted) return;
      
      // 2. 设置 WebSocket 事件监听器
      websocketService.on('poll_update', handlePollUpdate);
      websocketService.on('connect', handleWebSocketConnect);
      websocketService.on('disconnect', handleWebSocketDisconnect);
      websocketService.on('error', handleWebSocketError);
      
      // 3. 连接 WebSocket
      websocketService.connect();
      
      // 4. 检查初始连接状态
      setIsConnected(websocketService.isConnectedStatus());
    };
    
    initializeVoting();
    
    // 清理函数
    return () => {
      mounted = false;
      
      // 移除事件监听器
      websocketService.off('poll_update', handlePollUpdate);
      websocketService.off('connect', handleWebSocketConnect);
      websocketService.off('disconnect', handleWebSocketDisconnect);
      websocketService.off('error', handleWebSocketError);
      
      // 断开 WebSocket 连接
      websocketService.disconnect();
    };
  }, [
    refreshPoll,
    handlePollUpdate,
    handleWebSocketConnect,
    handleWebSocketDisconnect,
    handleWebSocketError
  ]);

  // 定期检查连接状态（可选）
  useEffect(() => {
    const checkConnectionInterval = setInterval(() => {
      const currentStatus = websocketService.isConnectedStatus();
      if (currentStatus !== isConnected) {
        setIsConnected(currentStatus);
      }
    }, 5000); // 每5秒检查一次

    return () => clearInterval(checkConnectionInterval);
  }, [isConnected]);

  return {
    // 状态
    poll,
    loading,
    error,
    hasVoted,
    isConnected,
    isReconnecting,
    
    // 操作
    refreshPoll,
    handleVoteSubmitted,
    reconnectWebSocket
  };
} 