from pydantic import BaseModel, Field
from datetime import datetime
from typing import List, Optional

# 基础模式
class OptionBase(BaseModel):
    label: str = Field(..., max_length=100, description="选项文本")

class VoteBase(BaseModel):
    client_id: Optional[str] = Field(None, max_length=64, description="客户端标识")

class PollBase(BaseModel):
    title: str = Field(..., max_length=255, description="问卷标题")

# 创建模式
class OptionCreate(OptionBase):
    pass

class VoteCreate(VoteBase):
    option_id: int = Field(..., description="选项ID")

class PollCreate(PollBase):
    options: List[OptionCreate] = Field(..., description="选项列表")

# 响应模式
class Option(OptionBase):
    option_id: int
    poll_id: int
    vote_count: int = 0
    
    class Config:
        from_attributes = True

class Vote(VoteBase):
    vote_id: int
    option_id: int
    voted_at: datetime
    
    class Config:
        from_attributes = True

class Poll(PollBase):
    poll_id: int
    created_at: datetime
    options: List[Option] = []
    
    class Config:
        from_attributes = True

# 统计模式
class VoteStatistics(BaseModel):
    option_id: int
    label: str
    vote_count: int
    percentage: float = 0.0

class PollStatistics(BaseModel):
    poll_id: int
    title: str
    total_votes: int
    options: List[VoteStatistics]

# API响应模式
class ApiResponse(BaseModel):
    success: bool = True
    message: str = "操作成功"
    data: Optional[dict] = None 