#!/usr/bin/env python3
"""
数据库初始化脚本
用于创建表结构和插入初始测试数据
"""

import sys
import os
from sqlalchemy.orm import Session

# 添加当前目录到Python路径
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import engine, SessionLocal
from app import models

def create_tables():
    """创建数据库表"""
    print("正在创建数据库表...")
    models.Base.metadata.create_all(bind=engine)
    print("数据库表创建完成！")

def insert_sample_data():
    """插入示例投票数据"""
    db = SessionLocal()
    try:
        # 检查是否已有数据
        existing_poll = db.query(models.Poll).first()
        if existing_poll:
            print("数据库中已存在投票数据，跳过初始化")
            return

        print("正在插入示例投票数据...")
        
        # 创建示例投票问卷
        sample_poll = models.Poll(
            title="你最喜欢的编程语言是什么？"
        )
        db.add(sample_poll)
        db.flush()  # 获取poll_id
        
        # 创建投票选项
        options = [
            "Python",
            "JavaScript",
            "Java",
            "C++",
            "Go"
        ]
        
        for option_text in options:
            option = models.Option(
                poll_id=sample_poll.poll_id,
                label=option_text,
                vote_count=0
            )
            db.add(option)
        
        db.commit()
        print(f"成功创建投票问卷: {sample_poll.title}")
        print(f"创建了 {len(options)} 个投票选项")
        
    except Exception as e:
        db.rollback()
        print(f"插入数据失败: {e}")
    finally:
        db.close()

def main():
    """主函数"""
    print("开始初始化数据库...")
    
    try:
        # 1. 创建表
        create_tables()
        
        # 2. 插入示例数据
        insert_sample_data()
        
        print("数据库初始化完成！")
        print("\n可以启动后端服务了:")
        print("python -m app.main")
        
    except Exception as e:
        print(f"数据库初始化失败: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main() 