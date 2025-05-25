#!/usr/bin/env python3
"""
清理投票记录脚本
用于测试时清除所有投票记录
"""

import sys
import os

# 添加当前目录到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal
from app import models

def clear_votes():
    """清理所有投票记录并重置计数"""
    db = SessionLocal()
    try:
        # 删除所有投票记录
        vote_count = db.query(models.Vote).count()
        db.query(models.Vote).delete()
        
        # 重置所有选项的投票计数
        options = db.query(models.Option).all()
        for option in options:
            option.vote_count = 0
        
        db.commit()
        print(f"已清理 {vote_count} 条投票记录")
        print("已重置所有选项的投票计数")
        
    except Exception as e:
        db.rollback()
        print(f"清理失败: {e}")
    finally:
        db.close()

def main():
    """主函数"""
    print("开始清理投票记录...")
    clear_votes()
    print("清理完成！")

if __name__ == "__main__":
    main() 