import os
import signal
import subprocess
from typing import List, Optional
from fastapi import FastAPI
import asyncio
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
# Set CORS policy
origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:8080",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

bag_info = {}
bag_folder_path = "./bags"

@app.post("/start_bag/{bag_name}")
async def start_ros_bag(bag_name: str, topics: List[str]):

    if not os.path.isdir(bag_folder_path):
        os.mkdir(bag_folder_path)

    if os.path.isdir(bag_name):
        return {"message": "Bag with name " + bag_name + " already exists"}

    topic_args = " ".join(topics)
    command = f"source /opt/ros/humble/setup.bash && ros2 bag record -o {bag_name} {topic_args}"
    process = subprocess.Popen(command, shell=True, executable="/bin/bash")

    bag_info[process.pid] = {"bag_name": bag_name, "topics": topics, "pid": process.pid, "status": "recording"}
    
    return bag_info[process.pid]

@app.get("/bag_info/{pid}")
def get_bag_info(pid: int):
    if pid in bag_info:
        return bag_info[pid]
    else:
        return {"message": "No bag info found for pid " + str(pid)}

@app.get("/bag_info/")
def get_all_bag_info():

    # scan the bag folder and get all the bag names, check if they already exist in bag_info, if not add them
    bag_files = os.listdir(bag_folder_path)
    for bag_name in bag_files:
        # check if bag_name already exists in bag_info[x]["bag_name"]
        bag_exists = False
        for x in bag_info:
            if bag_info[x]["bag_name"] == bag_name:
                bag_exists = True
                break
        
        if not bag_exists:
            bag_info[-len(bag_info)] = {"bag_name": bag_name, "topics": [], "pid": None, "status": "stopped"}

    return bag_info

@app.get("/stop_bag/{pid}")
def stop_ros_bag(pid: int):

    if pid not in bag_info:
        return {"message": "No bag info found for pid " + str(pid)}

    bag_name = bag_info[pid]["bag_name"]
    bag_info[pid]["status"] = "stopped"

    os.kill(pid, signal.SIGTERM)

    return {"message": "Stopped recording bag with pid " + str(pid) + " and name " + bag_name}

@app.get("/play_bag/{bag_name}")
def play_bag(bag_name: str):

    # check if bag exist, bag_name is a valid bag folder
    if not os.path.isdir(bag_name):
        return {"message": "Bag with name " + bag_name + " not found"}
    
    command = f"source /opt/ros/humble/setup.bash && ros2 bag play {bag_name}"
    subprocess.run(command, check=True, shell=True, executable="/bin/bash")
    return {"message": f"{bag_name} played successfully"}