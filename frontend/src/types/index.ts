// 投票选项类型
export interface VoteOption {
  id: string;
  text: string;
  votes: number;
}

// 投票问卷类型
export interface Poll {
  id: string;
  title: string;
  description?: string;
  options: VoteOption[];
  totalVotes: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 投票请求类型
export interface VoteRequest {
  optionId: string;
  userToken?: string;  // 用于防止重复投票的简单标识
}

// 投票响应类型
export interface VoteResponse {
  success: boolean;
  message: string;
  poll?: Poll;
}

// WebSocket 消息类型
export interface WebSocketMessage {
  type: 'poll_update' | 'vote_result' | 'error';
  data: Poll | string;
  timestamp: string;
}

// API 响应基础类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
} 