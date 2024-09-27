import os
import signal
import subprocess
from typing import List
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware

import yaml
import time
import zipfile

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
BAG_FOLDER_PATH = "./bags"

@app.post("/start_bag/{bagName}")
async def start_ros_bag(bagName: str, topics: List[str]):

    if not os.path.isdir(BAG_FOLDER_PATH):
        os.mkdir(BAG_FOLDER_PATH)

    bagPath = os.path.join(BAG_FOLDER_PATH, bagName)

    if os.path.isdir(bagPath):
        return {"code":1,"message": "Bag with name " + bagName + " already exists"}

    topic_args = " ".join(topics)
    command = f"source /opt/ros/humble/setup.bash && ros2 bag record -o {bagPath} {topic_args}"
    process = subprocess.Popen(command, shell=True, executable="/bin/bash")

    bag_info[bagName] = {"bagName": bagName, "pid": process.pid, "status": "recording"}
    
    return bag_info[bagName]

@app.get("/bag_info/{bagName}")
def get_bag_info(bagName: str):
    ScanBags()

    if bagName in bag_info:
        return bag_info[bagName]
    else:
        return {"code":1,"message": f"No bag named {bagName} found"}

@app.get("/bag_info/")
def get_all_bag_info():
    ScanBags()

    return bag_info

@app.get("/recoring_bags")
def get_recording_bags():
    ScanBags()

    recording_bags = {}
    for x in bag_info:
        if bag_info[x]["status"] == "recording":
            recording_bags[x] = bag_info[x]
    
    return recording_bags

@app.delete("/delete_bag/{bagName}")
def delete_bag(bagName: str):
    if bagName not in bag_info:
        return {"message": f"No bag named {bagName} found"}

    bagPath = os.path.join(BAG_FOLDER_PATH, bagName)
    if os.path.isdir(bagPath):

        # remove path, the folder is not empty
        command = f"rm -rf {bagPath}"
        subprocess.run(command, check=True, shell=True, executable="/bin/bash")

        # check if a _csv folder exists, remove it
        bag_csv_folder = os.path.join(BAG_FOLDER_PATH, bagName + "_csv")
        if os.path.isdir(bag_csv_folder):
            command = f"rm -rf {bag_csv_folder}"
            subprocess.run(command, check=True, shell=True, executable="/bin/bash")

        # check if _csv.zip exists, remove it
        zip_file_path = os.path.join(bag_csv_folder + ".zip")
        if os.path.isfile(zip_file_path):
            command = f"rm -rf {zip_file_path}"
            subprocess.run(command, check=True, shell=True, executable="/bin/bash")


        del bag_info[bagName]
        return {"code":0,"message": f"Bag with name {bagName} deleted"}
    else:
        return {"code":1,"message": f"No bag named {bagName} found"}

@app.get("/stop_bag/{bagName}")
def stop_ros_bag(bagName: str):

    if bagName not in bag_info:
        return {"message": f"No bag named {bagName} found"}


    bag = bag_info[bagName]
    if bag["status"] != "recording":
        return {"code":1,"message": "Bag with name " + bagName + " is not recording"}

    pid = bag["pid"]
    if pid is None:
        return {"code":2,"message": "Bag with name " + bagName + " has no pid"}

    # check if the pid is still running
    try:
        os.kill(pid, signal.SIGTERM)

        bag_info[bagName]["status"] = "stopped"
        bag_info[bagName]["pid"] = None

    except OSError:
        return {"code":3,"message": "Bag with name " + bagName + " is not running"}
    
    return {"code":0,"message": "Stopped recording bag with pid " + str(pid) + " and name " + bagName}

@app.get("/play_bag/{bagName}")
def play_bag(bagName: str):

    bagPath = os.path.join(BAG_FOLDER_PATH, bagName)

    # check if bag exist, bagName is a valid bag folder
    if not os.path.isdir(bagPath):
        return {"code":1,"message": "Bag with name " + bagName + " not found"}
    
    bagPath = os.path.join(BAG_FOLDER_PATH, bagName)

    bag_info[bagName]["status"] = "playing"

    command = f"source /opt/ros/humble/setup.bash && ros2 bag play {bagPath}"
    subprocess.run(command, check=True, shell=True, executable="/bin/bash")

    bag_info[bagName]["status"] = "stopped"

    return {"code":0,"message": f"{bagName} played successfully"}


@app.get("/download_bag/{bagName}")
def download_bag(bagName: str, response_class:FileResponse):
    bagPath = os.path.join(BAG_FOLDER_PATH, bagName)

    # check if bag exist, bagName is a valid bag folder
    if not os.path.isdir(bagPath):
        return {"code":1,"message": "Bag with name " + bagName + " not found"}

    
    # get the db3 file path (the bag file name .db3)
    db3_file = os.path.join(bagPath, bagName + "_0.db3")

    # output folder is the bag folder _csv
    bagPath_csv = os.path.join(BAG_FOLDER_PATH, bagName + "_csv")

    # check if the zip file already exists
    zip_file_path = os.path.join(bagPath_csv + ".zip")
    if os.path.isfile(zip_file_path):
        return FileResponse(zip_file_path)
    
    # convert the bag to csv, then compress the folder
        # run script bag2csv.py <input> <output>
    command = f"python3 bag2csv.py {db3_file} {bagPath_csv}"
    subprocess.run(command, check=True, shell=True, executable="/bin/bash", stdout=subprocess.PIPE)



    # compress the bag folder into a zip file
    zip_path = compress_folder(bagPath_csv)

    return FileResponse(zip_path)

def IsBagAlreadyInBagInfo(bagName: str):
    for x in bag_info:
        if bag_info[x]["bagName"] == bagName:
            return True
    return False

def LoadMetaData(bagName: str):
    yamlBagPath = os.path.join(BAG_FOLDER_PATH, bagName, "metadata.yaml")
    if os.path.isfile(yamlBagPath):
        with open(yamlBagPath, "r") as file:
            content = file.read()

            # parse the yaml file
            bag_info[bagName]["metadata"] = yaml.load(content, Loader=yaml.FullLoader)
    else:
        bag_info[bagName]["metadata"] = None


    bagPath = os.path.join(BAG_FOLDER_PATH, bagName)
    if os.path.isdir(bagPath):
        bag_info[bagName]["size"] = os.path.getsize(os.path.join(BAG_FOLDER_PATH, bagName))
    else:
        bag_info[bagName]["size"] = None

    # if metadata is not None, get the starting time and duration of the bag
    if bag_info[bagName]["metadata"] is not None:

        nanoEpochWhenStarted = bag_info[bagName]["metadata"]["rosbag2_bagfile_information"]["starting_time"]["nanoseconds_since_epoch"]
        durationNanoseconds = bag_info[bagName]["metadata"]["rosbag2_bagfile_information"]["duration"]["nanoseconds"]
        # convert the epoch time to human readable time
        bag_info[bagName]["startDate"] = time.strftime("%a, %d %b %Y %H:%M:%S +0000", time.localtime(nanoEpochWhenStarted / 1000000000))
        bag_info[bagName]["durationSeconde"] = durationNanoseconds / 1000000000
    else:
        bag_info[bagName]["startDate"] = None
        bag_info[bagName]["durationSeconde"] = None

def compress_folder(bag_csv_folder: str):

    zip_file_path = bag_csv_folder + ".zip"

    # Validate folder path
    if not os.path.isdir(bag_csv_folder):
        raise ValueError(f"Invalid folder path: {bag_csv_folder}")

    # check if the ZIP file already exists
    if os.path.isfile(zip_file_path):
        return zip_file_path

    # Create the ZIP file in write mode with compression
    with zipfile.ZipFile(zip_file_path, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for root, _, files in os.walk(bag_csv_folder):
            for file in files:
                file_path = os.path.join(root, file)
                # Add files to the ZIP with relative paths (preserving folder structure)
                zip_file.write(file_path, os.path.relpath(file_path, bag_csv_folder))

    return zip_file_path

def ScanBags():
    # scan the bag folder and get all the bag names, check if they already exist in bag_info, if not add them
    bag_files = os.listdir(BAG_FOLDER_PATH)

    for bagName in bag_files:
        # check if bagName is a folder
        if not os.path.isdir(os.path.join(BAG_FOLDER_PATH, bagName)):
            continue

        # check if bagName already exists in bag_info[x]["bagName"]
        if IsBagAlreadyInBagInfo(bagName):
            LoadMetaData(bagName)
            continue
          
        bag_info[bagName] = {"bagName": bagName, "status": "stopped", "pid":None}

        # get the metadata of the bag file
        LoadMetaData(bagName)

        # get the size in bytes of the bag file
    