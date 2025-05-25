#!/usr/bin/env python3
"""
投票系统测试运行器
"""
import subprocess
import sys
import os

def run_tests():
    """运行所有测试"""
    print("🧪 开始运行投票系统测试...")
    
    # 确保在正确的目录
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    
    try:
        # 运行pytest
        result = subprocess.run([
            sys.executable, "-m", "pytest", 
            "tests/", 
            "-v",  # 详细输出
            "--tb=short",  # 简化错误信息
            "--color=yes"  # 彩色输出
        ], check=True)
        
        print("✅ 所有测试通过！")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ 测试失败，退出码: {e.returncode}")
        return False
    except FileNotFoundError:
        print("❌ pytest 未安装，请先运行: pip install pytest")
        return False

def run_coverage():
    """运行测试覆盖率检查"""
    print("📊 运行测试覆盖率检查...")
    
    try:
        # 运行pytest with coverage
        result = subprocess.run([
            sys.executable, "-m", "pytest", 
            "tests/", 
            "--cov=app",  # 检查app模块的覆盖率
            "--cov-report=html",  # 生成HTML报告
            "--cov-report=term-missing"  # 终端显示缺失的行
        ], check=True)
        
        print("✅ 覆盖率检查完成，报告已生成到 htmlcov/ 目录")
        return True
        
    except subprocess.CalledProcessError as e:
        print(f"❌ 覆盖率检查失败，退出码: {e.returncode}")
        return False
    except FileNotFoundError:
        print("❌ pytest-cov 未安装，请先运行: pip install pytest-cov")
        return False

if __name__ == "__main__":
    # 检查命令行参数
    if len(sys.argv) > 1 and sys.argv[1] == "--coverage":
        success = run_coverage()
    else:
        success = run_tests()
    
    # 根据测试结果退出
    sys.exit(0 if success else 1) 