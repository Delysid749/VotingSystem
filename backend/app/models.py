from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, BigInteger
from sqlalchemy.dialects.mysql import BIGINT
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base

class Poll(Base):
    """投票问卷表"""
    __tablename__ = "polls"
    
    poll_id = Column(BIGINT(unsigned=True), primary_key=True, autoincrement=True, comment="问卷唯一主键，自增")
    title = Column(String(255), nullable=False, comment="问卷标题")
    created_at = Column(DateTime, nullable=False, server_default=func.current_timestamp(), comment="创建时间")
    
    # 关系映射
    options = relationship("Option", back_populates="poll", cascade="all, delete-orphan")

class Option(Base):
    """投票选项表"""
    __tablename__ = "options"
    
    option_id = Column(BIGINT(unsigned=True), primary_key=True, autoincrement=True, comment="选项唯一主键，自增")
    poll_id = Column(BIGINT(unsigned=True), ForeignKey("polls.poll_id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, comment="所属问卷ID")
    label = Column(String(100), nullable=False, comment="选项文本")
    vote_count = Column(Integer, nullable=False, default=0, comment="累计票数缓存")
    
    # 关系映射
    poll = relationship("Poll", back_populates="options")
    votes = relationship("Vote", back_populates="option", cascade="all, delete-orphan")

class Vote(Base):
    """投票记录表"""
    __tablename__ = "votes"
    
    vote_id = Column(BIGINT(unsigned=True), primary_key=True, autoincrement=True, comment="投票记录唯一主键，自增")
    option_id = Column(BIGINT(unsigned=True), ForeignKey("options.option_id", ondelete="CASCADE", onupdate="CASCADE"), nullable=False, comment="所投选项ID")
    voted_at = Column(DateTime, nullable=False, server_default=func.current_timestamp(), comment="投票时间戳")
    client_id = Column(String(64), nullable=True, comment="客户端标识")
    
    # 关系映射
    option = relationship("Option", back_populates="votes") 