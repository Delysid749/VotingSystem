import { useEffect, useMemo, useRef } from 'react';
import ReactECharts from 'echarts-for-react';
import { VoteOption } from '../types';

interface VoteChartProps {
  options: VoteOption[];
  totalVotes: number;
  height?: string;
  showPercentage?: boolean;
}

const VoteChart: React.FC<VoteChartProps> = ({ 
  options, 
  totalVotes, 
  height = '400px',
  showPercentage = true 
}) => {
  // 计算图表配置选项
  const chartOption = useMemo(() => {
    // 准备图表数据
    const chartData = options.map(option => ({
      name: option.text,
      value: option.votes,
      percentage: totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : '0.0'
    }));

    // 定义颜色主题
    const colors = [
      '#5470c6', '#91cc75', '#fac858', '#ee6666',
      '#73c0de', '#3ba272', '#fc8452', '#9a60b4',
      '#ea7ccc', '#d4a574', '#5fb3d4', '#6c9bd1'
    ];

    return {
      title: {
        text: '投票结果统计',
        left: 'center',
        textStyle: {
          fontSize: 18,
          fontWeight: 'bold',
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params: any) => {
          const percentage = params.data.percentage;
          return `${params.name}<br/>票数: ${params.value}<br/>占比: ${percentage}%`;
        }
      },
      legend: {
        orient: 'horizontal',
        bottom: '5%',
        left: 'center',
        textStyle: {
          fontSize: 12
        }
      },
      color: colors,
      series: [
        {
          name: '投票结果',
          type: 'pie',
          radius: ['40%', '70%'],
          center: ['50%', '45%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: showPercentage,
            position: 'outside',
            formatter: (params: any) => {
              return `${params.name}\n${params.data.percentage}%`;
            },
            fontSize: 12,
            fontWeight: 'bold'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold'
            },
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          labelLine: {
            show: showPercentage,
            length: 15,
            length2: 20,
            smooth: 0.2
          },
          data: chartData,
          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: (idx: number) => idx * 200
        }
      ],
      // 响应式配置
      media: [
        {
          query: {
            maxWidth: 768
          },
          option: {
            series: [{
              radius: ['30%', '60%'],
              center: ['50%', '40%']
            }],
            legend: {
              orient: 'horizontal',
              bottom: '2%'
            }
          }
        }
      ]
    };
  }, [options, totalVotes, showPercentage]);

  // 图表实例引用
  const chartRef = useRef<any>();

  // 监听窗口大小变化，调整图表大小
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.getEchartsInstance().resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="vote-chart-container">
      <ReactECharts
        ref={chartRef}
        option={chartOption}
        style={{ height }}
        notMerge={true}
        lazyUpdate={true}
        opts={{ renderer: 'canvas' }}
      />
      
      {/* 总票数显示 */}
      <div className="vote-summary" style={{
        textAlign: 'center',
        marginTop: '10px',
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#666'
      }}>
        总票数：{totalVotes} 票
      </div>
    </div>
  );
};

export default VoteChart; 