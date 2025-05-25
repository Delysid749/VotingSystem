"""
投票系统API测试
"""
import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import get_db, Base
from app import models

# 测试数据库配置
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    """覆盖数据库依赖，使用测试数据库"""
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(scope="module")
def setup_database():
    """设置测试数据库"""
    Base.metadata.create_all(bind=engine)
    
    # 创建测试数据
    db = TestingSessionLocal()
    try:
        # 创建测试问卷
        test_poll = models.Poll(title="测试投票问卷")
        db.add(test_poll)
        db.commit()
        db.refresh(test_poll)
        
        # 创建测试选项
        options = [
            models.Option(poll_id=test_poll.poll_id, label="选项A", vote_count=0),
            models.Option(poll_id=test_poll.poll_id, label="选项B", vote_count=0),
            models.Option(poll_id=test_poll.poll_id, label="选项C", vote_count=0),
        ]
        for option in options:
            db.add(option)
        db.commit()
        
        yield test_poll
        
    finally:
        db.close()
    
    # 清理测试数据库
    Base.metadata.drop_all(bind=engine)

class TestPollAPI:
    """投票API测试类"""
    
    def test_get_current_poll(self, setup_database):
        """测试获取当前投票问卷"""
        response = client.get("/api/poll")
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert "data" in data
        assert data["data"]["title"] == "测试投票问卷"
        assert len(data["data"]["options"]) == 3
        assert data["data"]["totalVotes"] == 0
    
    def test_submit_vote_success(self, setup_database):
        """测试成功提交投票"""
        # 先获取选项ID
        poll_response = client.get("/api/poll")
        poll_data = poll_response.json()
        option_id = poll_data["data"]["options"][0]["id"]
        
        # 提交投票
        vote_data = {
            "optionId": option_id,
            "userToken": "test_user_001"
        }
        response = client.post("/api/poll/vote", json=vote_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert data["poll"]["totalVotes"] == 1
    
    def test_submit_vote_duplicate(self, setup_database):
        """测试重复投票"""
        # 先获取选项ID
        poll_response = client.get("/api/poll")
        poll_data = poll_response.json()
        option_id = poll_data["data"]["options"][0]["id"]
        
        # 第一次投票
        vote_data = {
            "optionId": option_id,
            "userToken": "test_user_002"
        }
        client.post("/api/poll/vote", json=vote_data)
        
        # 第二次投票（重复）
        response = client.post("/api/poll/vote", json=vote_data)
        assert response.status_code == 200
        
        data = response.json()
        assert data["success"] is True
        assert "已经投过票" in data["message"]
    
    def test_submit_vote_invalid_option(self, setup_database):
        """测试投票无效选项"""
        vote_data = {
            "optionId": "999999",  # 不存在的选项ID
            "userToken": "test_user_003"
        }
        response = client.post("/api/poll/vote", json=vote_data)
        assert response.status_code == 400
        
        data = response.json()
        assert "选项不存在" in data["detail"]
    
    def test_health_check(self):
        """测试健康检查接口"""
        response = client.get("/health")
        assert response.status_code == 200
        
        data = response.json()
        assert data["status"] == "healthy"
        assert "投票系统运行正常" in data["message"]

class TestPollStatistics:
    """投票统计测试类"""
    
    def test_get_poll_statistics(self, setup_database):
        """测试获取投票统计"""
        test_poll = setup_database
        response = client.get(f"/api/poll/{test_poll.poll_id}/statistics")
        assert response.status_code == 200
        
        data = response.json()
        assert data["poll_id"] == test_poll.poll_id
        assert data["title"] == "测试投票问卷"
        assert data["total_votes"] >= 0
        assert len(data["options"]) == 3
    
    def test_get_nonexistent_poll_statistics(self):
        """测试获取不存在问卷的统计"""
        response = client.get("/api/poll/999999/statistics")
        assert response.status_code == 404
        
        data = response.json()
        assert "问卷不存在" in data["detail"]

if __name__ == "__main__":
    pytest.main([__file__]) 