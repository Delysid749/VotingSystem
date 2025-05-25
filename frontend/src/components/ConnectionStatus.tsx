import { Badge, Button, Space, Typography, Tooltip } from 'antd';
import { 
  WifiOutlined, 
  DisconnectOutlined, 
  ReloadOutlined,
  InfoCircleOutlined 
} from '@ant-design/icons';

const { Text } = Typography;

export interface ConnectionStatusProps {
  isConnected: boolean;
  onReconnect: () => void;
  isReconnecting?: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  isConnected,
  onReconnect,
  isReconnecting = false
}) => {
  const getStatusConfig = () => {
    if (isReconnecting) {
      return {
        status: 'processing' as const,
        text: '正在连接...',
        color: '#faad14',
        icon: <ReloadOutlined spin />
      };
    }
    
    if (isConnected) {
      return {
        status: 'success' as const,
        text: '实时连接',
        color: '#52c41a',
        icon: <WifiOutlined />
      };
    }
    
    return {
      status: 'error' as const,
      text: '连接断开',
      color: '#f5222d',
      icon: <DisconnectOutlined />
    };
  };

  const statusConfig = getStatusConfig();

  return (
    <div 
      className="connection-status"
      style={{
        display: 'flex',
        alignItems: 'center',
        padding: '8px 16px',
        backgroundColor: '#fafafa',
        borderRadius: '6px',
        border: '1px solid #d9d9d9',
        margin: '8px 0'
      }}
    >
      <Space align="center">
        {/* 状态指示器 */}
        <Badge 
          status={statusConfig.status} 
          color={statusConfig.color}
        />
        
        {/* 状态图标和文字 */}
        <Space size="small">
          {statusConfig.icon}
          <Text 
            style={{ 
              color: statusConfig.color,
              fontWeight: '500',
              fontSize: '13px'
            }}
          >
            {statusConfig.text}
          </Text>
        </Space>

        {/* 状态说明 */}
        <Tooltip 
          title={
            isConnected 
              ? '已连接到服务器，投票结果将实时更新'
              : '连接已断开，投票结果可能不会实时更新。点击重连按钮尝试恢复连接。'
          }
        >
          <InfoCircleOutlined 
            style={{ 
              color: '#8c8c8c',
              cursor: 'help'
            }}
          />
        </Tooltip>

        {/* 重连按钮（仅在断开连接时显示） */}
        {!isConnected && (
          <Button
            type="text"
            size="small"
            icon={<ReloadOutlined />}
            loading={isReconnecting}
            onClick={onReconnect}
            style={{
              color: '#1890ff',
              fontSize: '12px',
              height: '24px',
              padding: '0 8px'
            }}
          >
            重连
          </Button>
        )}
      </Space>

      {/* 连接状态详细信息 */}
      <div style={{ marginLeft: 'auto' }}>
        <Text 
          type="secondary" 
          style={{ fontSize: '11px' }}
        >
          {isConnected ? '实时投票' : '离线模式'}
        </Text>
      </div>
    </div>
  );
};

export default ConnectionStatus; 