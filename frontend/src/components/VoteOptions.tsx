import { useState } from 'react';
import { Card, Radio, Button, Space, Progress, Typography, message } from 'antd';
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import { VoteOption, Poll } from '../types';
import { VotingApiService } from '../services/api';

const { Title, Text } = Typography;

interface VoteOptionsProps {
  poll: Poll;
  hasVoted: boolean;
  onVoteSubmitted: (updatedPoll: Poll) => void;
  disabled?: boolean;
}

const VoteOptions: React.FC<VoteOptionsProps> = ({
  poll,
  hasVoted,
  onVoteSubmitted,
  disabled = false
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 处理选项选择
  const handleOptionChange = (optionId: string) => {
    if (hasVoted || disabled || isSubmitting) return;
    setSelectedOption(optionId);
  };

  // 提交投票
  const handleSubmitVote = async () => {
    if (!selectedOption) {
      message.warning('请选择一个选项');
      return;
    }

    if (hasVoted) {
      message.warning('您已经投过票了');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const userToken = VotingApiService.generateUserToken();
      const voteResponse = await VotingApiService.submitVote({
        optionId: selectedOption,
        userToken
      });

      if (voteResponse.success && voteResponse.poll) {
        message.success(voteResponse.message || '投票成功！');
        
        // 记录用户已投票
        VotingApiService.markUserAsVoted(poll.id);
        
        // 通知父组件更新投票数据
        onVoteSubmitted(voteResponse.poll);
      } else {
        message.error(voteResponse.message || '投票失败');
      }
    } catch (error) {
      console.error('投票提交错误:', error);
      message.error(error instanceof Error ? error.message : '投票失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 计算选项的投票占比
  const getOptionPercentage = (votes: number): number => {
    return poll.totalVotes > 0 ? (votes / poll.totalVotes) * 100 : 0;
  };

  // 获取进度条颜色
  const getProgressColor = (percentage: number): string => {
    if (percentage >= 50) return '#52c41a';  // 绿色
    if (percentage >= 30) return '#faad14';  // 橙色
    if (percentage >= 10) return '#1890ff';  // 蓝色
    return '#f5222d';  // 红色
  };

  return (
    <Card 
      title={
        <div style={{ textAlign: 'center' }}>
          <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
            {poll.title}
          </Title>
          {poll.description && (
            <Text type="secondary" style={{ fontSize: '14px' }}>
              {poll.description}
            </Text>
          )}
        </div>
      }
      className="vote-options-card"
      style={{ maxWidth: 600, margin: '0 auto' }}
    >
      <div className="vote-options-content">
        {/* 投票选项列表 */}
        <Radio.Group 
          value={selectedOption} 
          onChange={(e) => handleOptionChange(e.target.value)}
          style={{ width: '100%' }}
          disabled={hasVoted || disabled || isSubmitting}
        >
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {poll.options.map((option: VoteOption) => {
              const percentage = getOptionPercentage(option.votes);
              const isSelected = selectedOption === option.id;
              
              return (
                <Card
                  key={option.id}
                  size="small"
                  hoverable={!hasVoted && !disabled && !isSubmitting}
                  className={`vote-option ${isSelected ? 'selected' : ''}`}
                  style={{
                    borderColor: isSelected ? '#1890ff' : undefined,
                    backgroundColor: isSelected ? '#f6ffed' : undefined,
                    cursor: hasVoted || disabled || isSubmitting ? 'not-allowed' : 'pointer'
                  }}
                  onClick={() => handleOptionChange(option.id)}
                >
                  <div className="vote-option-content">
                    <div className="option-header" style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      marginBottom: hasVoted ? '8px' : '4px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Radio value={option.id} style={{ marginRight: '8px' }}>
                          <Text strong>{option.text}</Text>
                        </Radio>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Text type="secondary" style={{ fontSize: '12px', marginRight: '8px' }}>
                          {option.votes} 票
                        </Text>
                        {hasVoted && (
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            ({percentage.toFixed(1)}%)
                          </Text>
                        )}
                      </div>
                    </div>
                    
                    {/* 投票结果进度条（只有在已投票时显示） */}
                    {hasVoted && (
                      <Progress
                        percent={Number(percentage.toFixed(1))}
                        strokeColor={getProgressColor(percentage)}
                        trailColor="#f0f0f0"
                        showInfo={false}
                        size="small"
                        style={{ marginTop: '4px' }}
                      />
                    )}
                  </div>
                </Card>
              );
            })}
          </Space>
        </Radio.Group>

        {/* 投票状态和操作按钮 */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          {hasVoted ? (
            <Space direction="vertical" size="small">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '8px' }} />
                <Text type="success" strong>您已成功投票</Text>
              </div>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                感谢您的参与，投票结果将实时更新
              </Text>
            </Space>
          ) : (
            <Space direction="vertical" size="small">
              <Button
                type="primary"
                size="large"
                onClick={handleSubmitVote}
                disabled={!selectedOption || disabled || isSubmitting}
                loading={isSubmitting}
                icon={isSubmitting ? <LoadingOutlined /> : undefined}
                style={{ minWidth: '120px' }}
              >
                {isSubmitting ? '提交中...' : '提交投票'}
              </Button>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                请选择一个选项后提交，每人只能投票一次
              </Text>
            </Space>
          )}
        </div>

        {/* 投票统计信息 */}
        <div style={{ 
          marginTop: '20px', 
          padding: '12px', 
          backgroundColor: '#fafafa', 
          borderRadius: '6px',
          textAlign: 'center'
        }}>
          <Text type="secondary" style={{ fontSize: '14px' }}>
            当前总票数：<Text strong>{poll.totalVotes}</Text> 票
          </Text>
          {poll.totalVotes > 0 && (
            <div style={{ marginTop: '4px' }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                投票结果将实时更新显示
              </Text>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default VoteOptions; 