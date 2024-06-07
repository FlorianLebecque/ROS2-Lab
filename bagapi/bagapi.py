import os
import signal
import subprocess
from fastapi import FastAPI

app = FastAPI()

@app.get("/start_bag/{bag_name}")
def start_ros_bag(bag_name: str):
    command = f"source /opt/ros/humble/setup.bash && ros2 bag record -o {bag_name} /robot/pad_teleop/cmd_vel"
    process = subprocess.Popen(command, shell=True, executable="/bin/bash")
    return {"message": "Started registering bag with name " + bag_name, "pid": process.pid}

@app.get("/stop_bag/{pid}")
def stop_ros_bag(pid: int):
    os.kill(pid, signal.SIGTERM)
    return {"status": "stopped"}

@app.get("/play_bag/{bag_name}")
def play_bag(bag_name: str):
    command = f"source /opt/ros/humble/setup.bash && ros2 bag play {bag_name}"
    subprocess.run(command, check=True, shell=True, executable="/bin/bash")
    return {"message": "Started playing bag with name " + bag_name}