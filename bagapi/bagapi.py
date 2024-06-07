import os
import signal
import subprocess
from typing import List, Optional
from fastapi import FastAPI
import asyncio
from fastapi.responses import StreamingResponse

app = FastAPI()

bag_info = {}

@app.post("/start_bag/{bag_name}")
async def start_ros_bag(bag_name: str, topics: List[str]):
    topic_args = " ".join(topics)
    command = f"source /opt/ros/humble/setup.bash && ros2 bag record -o {bag_name} {topic_args}"
    process = await asyncio.create_subprocess_shell(command, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)

    async def stream_output():
        while True:
            line = await process.stdout.readline()
            if not line:
                break
            yield line

    bag_info[process.pid] = {"bag_name": bag_name, "topics": topics}

    return StreamingResponse(stream_output(), media_type="text/plain")

@app.get("/bag_info/{pid}")
def get_bag_info(pid: int):
    if pid in bag_info:
        return bag_info[pid]
    else:
        return {"message": "No bag info found for pid " + str(pid)}

@app.get("/bag_info/")
def get_all_bag_info():
    return bag_info

@app.get("/stop_bag/{pid}")
def stop_ros_bag(pid: int):

    if pid not in bag_info:
        return {"message": "No bag info found for pid " + str(pid)}

    os.kill(pid, signal.SIGTERM)
    return {"status": "stopped"}

@app.get("/play_bag/{bag_name}")
def play_bag(bag_name: str):

    # check if bag exist, bag_name is a valid bag folder
    if not os.path.isdir(bag_name):
        return {"message": "Bag with name " + bag_name + " not found"}
    
    command = f"source /opt/ros/humble/setup.bash && ros2 bag play {bag_name}"
    subprocess.run(command, check=True, shell=True, executable="/bin/bash")
    return {"message": "Started playing bag with name " + bag_name}