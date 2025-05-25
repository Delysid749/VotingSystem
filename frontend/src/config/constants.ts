// 应用常量配置

// API 配置
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || '/api',
  TIMEOUT: parseInt(import.meta.env.VITE_REQUEST_TIMEOUT || '10000'),
};

// WebSocket 配置
export const WS_CONFIG = {
  URL: import.meta.env.VITE_WS_URL || window.location.origin,
  RECONNECT_ATTEMPTS: parseInt(import.meta.env.VITE_WS_RECONNECT_ATTEMPTS || '5'),
  RECONNECT_INTERVAL: parseInt(import.meta.env.VITE_WS_RECONNECT_INTERVAL || '3000'),
  TRANSPORTS: ['websocket'] as const,
};

// 应用信息
export const APP_INFO = {
  NAME: import.meta.env.VITE_APP_NAME || '实时投票系统',
  VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0',
  DEBUG: import.meta.env.VITE_DEBUG === 'true',
};

// 本地存储键名
export const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  VOTED_POLLS: 'votedPolls',
  USER_PREFERENCES: 'userPreferences',
};

// 消息提示配置
export const MESSAGE_CONFIG = {
  DURATION: {
    SUCCESS: 2,
    ERROR: 3,
    WARNING: 3,
    INFO: 1,
  },
  MAX_COUNT: 3,
};

// 投票相关常量
export const POLL_CONFIG = {
  MIN_OPTIONS: 2,
  MAX_OPTIONS: 10,
  REFRESH_INTERVAL: 30000, // 30秒
  CHART_COLORS: [
    '#5470c6', '#91cc75', '#fac858', '#ee6666',
    '#73c0de', '#3ba272', '#fc8452', '#9a60b4',
    '#ea7ccc', '#d4a574', '#5fb3d4', '#6c9bd1'
  ],
};

// 响应式断点
export const BREAKPOINTS = {
  XS: 576,
  SM: 768,
  MD: 992,
  LG: 1200,
  XL: 1600,
};

// 错误消息
export const ERROR_MESSAGES = {
  NETWORK_ERROR: '网络连接失败，请检查网络设置',
  SERVER_ERROR: '服务器错误，请稍后重试',
  TIMEOUT_ERROR: '请求超时，请稍后重试',
  PARSE_ERROR: '数据解析失败',
  UNKNOWN_ERROR: '未知错误',
  VOTE_FAILED: '投票失败，请重试',
  LOAD_FAILED: '加载数据失败',
  WEBSOCKET_ERROR: 'WebSocket 连接失败',
  ALREADY_VOTED: '您已经投过票了',
  INVALID_OPTION: '请选择一个有效选项',
}; 