from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import socketio
from app.api import polls
import os

# 创建FastAPI应用
app = FastAPI(
    title="投票系统API",
    description="简化版实时投票系统",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 生产环境应该限制具体域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 创建Socket.IO实例
sio = socketio.AsyncServer(
    async_mode='asgi',
    cors_allowed_origins="*",
    logger=True,
    engineio_logger=True
)

# 包含API路由
app.include_router(polls.router, prefix="/api", tags=["polls"])

# Socket.IO事件处理
@sio.event
async def connect(sid, environ):
    print(f"客户端 {sid} 已连接")
    # 可以在这里发送当前统计数据
    await sio.emit('message', {'data': '欢迎连接投票系统'}, room=sid)

@sio.event
async def disconnect(sid):
    print(f"客户端 {sid} 已断开连接")

@sio.event
async def join_poll(sid, data):
    """加入特定投票房间"""
    poll_id = data.get('poll_id')
    if poll_id:
        await sio.enter_room(sid, f"poll_{poll_id}")
        print(f"客户端 {sid} 加入投票房间 poll_{poll_id}")

# 广播投票更新的函数
async def broadcast_vote_update(poll_id: int, statistics: dict):
    """向所有连接的客户端广播投票更新"""
    await sio.emit('vote_update', statistics, room=f"poll_{poll_id}")

# 将Socket.IO集成到FastAPI
socket_app = socketio.ASGIApp(sio, app)

# 健康检查端点
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "投票系统运行正常"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    
    uvicorn.run(
        "app.main:socket_app",
        host=host,
        port=port,
        reload=True,
        log_level="info"
    ) 