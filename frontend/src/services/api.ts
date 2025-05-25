import axios, { AxiosResponse } from 'axios';
import { Poll, VoteRequest, VoteResponse, ApiResponse } from '../types';

// 创建 axios 实例，配置基础 URL 和默认设置
const apiClient = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器：添加通用的请求头或认证信息
apiClient.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证 token 等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：统一处理响应和错误
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    console.error('API 请求错误:', error);
    
    // 统一错误处理
    if (error.response) {
      // 服务器返回错误状态码
      const message = error.response.data?.message || '服务器错误';
      throw new Error(message);
    } else if (error.request) {
      // 网络错误
      throw new Error('网络连接失败，请检查网络设置');
    } else {
      // 其他错误
      throw new Error(error.message || '未知错误');
    }
  }
);

// API 服务类
export class VotingApiService {
  /**
   * 获取当前投票问卷及统计信息
   */
  static async getCurrentPoll(): Promise<Poll> {
    try {
      const response: ApiResponse<Poll> = await apiClient.get('/poll');
      if (response.success && response.data) {
        return response.data;
      }
      throw new Error(response.message || '获取投票信息失败');
    } catch (error) {
      console.error('获取投票信息失败:', error);
      throw error;
    }
  }

  /**
   * 提交投票
   */
  static async submitVote(voteRequest: VoteRequest): Promise<VoteResponse> {
    try {
      console.log('发送投票请求:', voteRequest);
      
      // 直接发送投票请求，axios响应拦截器会返回response.data
      const response: VoteResponse = await apiClient.post('/poll/vote', voteRequest);
      
      console.log('收到投票响应:', response);
      
      // 后端直接返回VoteResponse格式
      if (response.success) {
        return response;
      }
      throw new Error(response.message || '投票失败');
    } catch (error) {
      console.error('提交投票失败:', error);
      throw error;
    }
  }

  /**
   * 检查用户是否已经投票（基于本地存储）
   */
  static hasUserVoted(pollId: string): boolean {
    const votedPolls = localStorage.getItem('votedPolls');
    if (!votedPolls) return false;
    
    try {
      const voted: string[] = JSON.parse(votedPolls);
      return voted.includes(pollId);
    } catch {
      return false;
    }
  }

  /**
   * 记录用户已投票状态
   */
  static markUserAsVoted(pollId: string): void {
    try {
      const votedPolls = localStorage.getItem('votedPolls');
      const voted: string[] = votedPolls ? JSON.parse(votedPolls) : [];
      
      if (!voted.includes(pollId)) {
        voted.push(pollId);
        localStorage.setItem('votedPolls', JSON.stringify(voted));
      }
    } catch (error) {
      console.error('记录投票状态失败:', error);
    }
  }

  /**
   * 生成简单的用户标识（用于防重复投票）
   */
  static generateUserToken(): string {
    let userToken = localStorage.getItem('userToken');
    if (!userToken) {
      userToken = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userToken', userToken);
    }
    return userToken;
  }
} 