from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import text
from typing import List
import uuid
from datetime import datetime

from app.database import get_db
from app import models, schemas

router = APIRouter()

@router.get("/poll")
async def get_current_poll(db: Session = Depends(get_db)):
    """获取当前问卷及其选项 - 兼容前端数据格式"""
    poll = db.query(models.Poll).first()
    if not poll:
        raise HTTPException(status_code=404, detail="未找到投票问卷")
    
    # 计算总票数
    total_votes = sum(option.vote_count for option in poll.options)
    
    # 转换为前端期望的格式
    poll_data = {
        "success": True,
        "data": {
            "id": str(poll.poll_id),
            "title": poll.title,
            "description": "",  # 暂时为空
            "options": [
                {
                    "id": str(option.option_id),
                    "text": option.label,
                    "votes": option.vote_count
                }
                for option in poll.options
            ],
            "totalVotes": total_votes,
            "isActive": True,
            "createdAt": poll.created_at.isoformat(),
            "updatedAt": poll.created_at.isoformat()  # 暂时使用创建时间
        }
    }
    
    return poll_data

@router.get("/poll/{poll_id}/statistics", response_model=schemas.PollStatistics)
async def get_poll_statistics(poll_id: int, db: Session = Depends(get_db)):
    """获取投票统计数据"""
    poll = db.query(models.Poll).filter(models.Poll.poll_id == poll_id).first()
    if not poll:
        raise HTTPException(status_code=404, detail="问卷不存在")
    
    # 计算总票数
    total_votes = db.query(models.Vote).join(models.Option).filter(
        models.Option.poll_id == poll_id
    ).count()
    
    # 获取每个选项的统计数据
    options_stats = []
    for option in poll.options:
        vote_count = option.vote_count
        percentage = (vote_count / total_votes * 100) if total_votes > 0 else 0
        
        options_stats.append(schemas.VoteStatistics(
            option_id=option.option_id,
            label=option.label,
            vote_count=vote_count,
            percentage=round(percentage, 2)
        ))
    
    return schemas.PollStatistics(
        poll_id=poll.poll_id,
        title=poll.title,
        total_votes=total_votes,
        options=options_stats
    )

@router.post("/poll/vote")
async def submit_vote(
    vote_data: dict,  # 改为接受字典格式
    request: Request,
    db: Session = Depends(get_db)
):
    """提交投票 - 兼容前端数据格式"""
    
    print(f"收到投票请求: {vote_data}")  # 调试日志
    
    # 从前端数据中提取信息
    option_id = vote_data.get("optionId")
    user_token = vote_data.get("userToken", "")
    
    print(f"解析的数据: option_id={option_id}, user_token={user_token}")  # 调试日志
    
    if not option_id:
        print("错误: 缺少选项ID")
        raise HTTPException(status_code=400, detail="缺少选项ID")
    
    try:
        option_id = int(option_id)  # 转换为整数
        print(f"转换后的option_id: {option_id}")
    except ValueError:
        print(f"错误: 无效的选项ID: {option_id}")
        raise HTTPException(status_code=400, detail="无效的选项ID")
    
    # 生成客户端ID
    client_id = user_token
    if not client_id:
        # 使用IP地址和User-Agent生成简单的客户端标识
        client_ip = request.client.host
        user_agent = request.headers.get("user-agent", "")
        client_id = f"{client_ip}_{hash(user_agent)}"
    
    print(f"客户端ID: {client_id}")
    
    # 检查选项是否存在
    option = db.query(models.Option).filter(
        models.Option.option_id == option_id
    ).first()
    if not option:
        print(f"错误: 选项不存在, option_id={option_id}")
        raise HTTPException(status_code=400, detail="选项不存在")
    
    print(f"找到选项: {option.label}, poll_id={option.poll_id}")
    
    # 检查是否已经投过票（简单防重复）
    existing_vote = db.query(models.Vote).filter(
        models.Vote.client_id == client_id,
        models.Vote.option_id.in_(
            db.query(models.Option.option_id).filter(
                models.Option.poll_id == option.poll_id
            )
        )
    ).first()
    
    if existing_vote:
        print(f"用户已投票: client_id={client_id}, existing_vote_id={existing_vote.vote_id}")
        # 虽然已投票，但返回成功状态和当前数据
        poll = db.query(models.Poll).filter(models.Poll.poll_id == option.poll_id).first()
        total_votes = sum(opt.vote_count for opt in poll.options)
        
        updated_poll = {
            "id": str(poll.poll_id),
            "title": poll.title,
            "description": "",
            "options": [
                {
                    "id": str(opt.option_id),
                    "text": opt.label,
                    "votes": opt.vote_count
                }
                for opt in poll.options
            ],
            "totalVotes": total_votes,
            "isActive": True,
            "createdAt": poll.created_at.isoformat(),
            "updatedAt": poll.created_at.isoformat()
        }
        
        return {
            "success": True,
            "message": "您已经投过票了，这是当前投票结果",
            "poll": updated_poll
        }
    
    try:
        print("开始创建投票记录...")
        
        # 创建投票记录
        new_vote = models.Vote(
            option_id=option_id,
            client_id=client_id
        )
        db.add(new_vote)
        
        # 更新选项的投票计数缓存
        option.vote_count += 1
        
        db.commit()
        print(f"投票成功: vote_id={new_vote.vote_id}")
        
        # 获取更新后的投票数据
        poll = db.query(models.Poll).filter(models.Poll.poll_id == option.poll_id).first()
        total_votes = sum(opt.vote_count for opt in poll.options)
        
        # 返回兼容前端的格式
        updated_poll = {
            "id": str(poll.poll_id),
            "title": poll.title,
            "description": "",
            "options": [
                {
                    "id": str(opt.option_id),
                    "text": opt.label,
                    "votes": opt.vote_count
                }
                for opt in poll.options
            ],
            "totalVotes": total_votes,
            "isActive": True,
            "createdAt": poll.created_at.isoformat(),
            "updatedAt": poll.created_at.isoformat()
        }
        
        print("返回投票结果")
        return {
            "success": True,
            "message": "投票成功",
            "poll": updated_poll
        }
        
    except Exception as e:
        db.rollback()
        print(f"投票失败: {str(e)}")
        print(f"异常类型: {type(e)}")
        import traceback
        print(f"异常堆栈: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"投票失败: {str(e)}")

@router.get("/poll/{poll_id}/votes", response_model=List[schemas.Vote])
async def get_poll_votes(poll_id: int, db: Session = Depends(get_db)):
    """获取投票记录（管理功能）"""
    votes = db.query(models.Vote).join(models.Option).filter(
        models.Option.poll_id == poll_id
    ).all()
    
    return votes

@router.post("/poll", response_model=schemas.Poll)
async def create_poll(poll_data: schemas.PollCreate, db: Session = Depends(get_db)):
    """创建新的投票问卷（管理功能）"""
    try:
        # 创建问卷
        new_poll = models.Poll(title=poll_data.title)
        db.add(new_poll)
        db.flush()  # 获取poll_id
        
        # 创建选项
        for option_data in poll_data.options:
            new_option = models.Option(
                poll_id=new_poll.poll_id,
                label=option_data.label
            )
            db.add(new_option)
        
        db.commit()
        db.refresh(new_poll)
        
        return new_poll
        
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"创建问卷失败: {str(e)}") 