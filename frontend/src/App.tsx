import { ConfigProvider, Layout, Row, Col, Spin, Alert, Button, Space, Typography } from 'antd';
import { ReloadOutlined, BarChartOutlined, FormOutlined } from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import VoteOptions from './components/VoteOptions';
import VoteChart from './components/VoteChart';
import ConnectionStatus from './components/ConnectionStatus';
import { useVoting } from './hooks/useVoting';
import './App.css';

const { Header, Content } = Layout;
const { Title, Paragraph } = Typography;

function App() {
  const {
    poll,
    loading,
    error,
    hasVoted,
    isConnected,
    isReconnecting,
    refreshPoll,
    handleVoteSubmitted,
    reconnectWebSocket
  } = useVoting();

  // 加载中状态
  if (loading) {
    return (
      <ConfigProvider locale={zhCN}>
        <Layout className="App" style={{ minHeight: '100vh' }}>
          <div 
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              flexDirection: 'column'
            }}
          >
            <Spin size="large" />
            <p style={{ marginTop: '16px', color: '#666' }}>正在加载投票数据...</p>
          </div>
        </Layout>
      </ConfigProvider>
    );
  }

  // 错误状态
  if (error && !poll) {
    return (
      <ConfigProvider locale={zhCN}>
        <Layout className="App" style={{ minHeight: '100vh' }}>
          <div 
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100vh',
              padding: '20px'
            }}
          >
            <Alert
              message="加载失败"
              description={error}
              type="error"
              showIcon
              style={{ maxWidth: '500px' }}
              action={
                <Button 
                  size="small" 
                  type="primary" 
                  icon={<ReloadOutlined />}
                  onClick={refreshPoll}
                >
                  重新加载
                </Button>
              }
            />
          </div>
        </Layout>
      </ConfigProvider>
    );
  }

  // 正常渲染
  return (
    <ConfigProvider locale={zhCN}>
      <Layout className="App" style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
        {/* 页面头部 */}
        <Header 
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <Title 
              level={2} 
              style={{ 
                color: 'white', 
                margin: 0,
                fontSize: 'clamp(1.5rem, 4vw, 2.5rem)'
              }}
            >
              🗳️ 实时投票系统
            </Title>
            <Paragraph 
              style={{ 
                color: 'rgba(255, 255, 255, 0.85)', 
                margin: 0,
                fontSize: '14px'
              }}
            >
              参与投票，实时查看结果
            </Paragraph>
          </div>
        </Header>

        {/* 主要内容区域 */}
        <Content style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
          {/* 连接状态指示器 */}
          <ConnectionStatus
            isConnected={isConnected}
            isReconnecting={isReconnecting}
            onReconnect={reconnectWebSocket}
          />

          {poll ? (
            <Row gutter={[24, 24]} justify="center">
              {/* 投票区域 */}
              <Col xs={24} lg={12}>
                <div 
                  style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '16px',
                      color: '#1890ff'
                    }}
                  >
                    <FormOutlined style={{ marginRight: '8px', fontSize: '18px' }} />
                    <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                      投票区域
                    </Title>
                  </div>
                  
                  <VoteOptions
                    poll={poll}
                    hasVoted={hasVoted}
                    onVoteSubmitted={handleVoteSubmitted}
                    disabled={loading}
                  />
                </div>
              </Col>

              {/* 结果图表区域 */}
              <Col xs={24} lg={12}>
                <div 
                  style={{
                    background: 'white',
                    borderRadius: '8px',
                    padding: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                  }}
                >
                  <div 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '16px',
                      color: '#52c41a'
                    }}
                  >
                    <BarChartOutlined style={{ marginRight: '8px', fontSize: '18px' }} />
                    <Title level={4} style={{ margin: 0, color: '#52c41a' }}>
                      实时结果
                    </Title>
                  </div>
                  
                  {poll.totalVotes > 0 ? (
                    <VoteChart
                      options={poll.options}
                      totalVotes={poll.totalVotes}
                      height="350px"
                      showPercentage={hasVoted}
                    />
                  ) : (
                    <div 
                      style={{
                        height: '350px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#8c8c8c'
                      }}
                    >
                      <BarChartOutlined style={{ fontSize: '48px', marginBottom: '16px' }} />
                      <Title level={4} type="secondary">暂无投票数据</Title>
                      <Paragraph type="secondary">
                        成为第一个投票的人吧！
                      </Paragraph>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <Alert
                message="暂无可用的投票"
                description="当前没有活跃的投票问卷"
                type="info"
                showIcon
                action={
                  <Button 
                    type="primary" 
                    icon={<ReloadOutlined />}
                    onClick={refreshPoll}
                  >
                    刷新
                  </Button>
                }
              />
            </div>
          )}

          {/* 操作按钮区域 */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <Space>
              <Button 
                icon={<ReloadOutlined />}
                onClick={refreshPoll}
                loading={loading}
              >
                刷新数据
              </Button>
            </Space>
          </div>

          {/* 页脚信息 */}
          <div 
            style={{
              textAlign: 'center',
              marginTop: '48px',
              padding: '16px',
              borderTop: '1px solid #f0f0f0',
              color: '#8c8c8c',
              fontSize: '12px'
            }}
          >
            <Paragraph type="secondary" style={{ margin: 0 }}>
              实时投票系统 - 支持多人同时投票，结果实时更新
            </Paragraph>
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App; 