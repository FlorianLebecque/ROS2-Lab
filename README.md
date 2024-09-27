# ROS2-Lab
It is a web interface to interact with ROS2 environment made in NextJS, it was part of my master thesis at ECAM.
The project won't be developed further in this repository.

- Data visualization
- Allow remote teleoperation
- ROS Bag management
  
![Screenshot from 2024-09-27 12-53-23](https://github.com/user-attachments/assets/d54f7adc-2abd-41f9-89d3-c0aad2ada99b)

# Getting Started

First, run the development server:

```bash
# Start by moving in the "webapp/" folder and install dependency
bun install

# Run the docker:
docker-compose -f .\docker-compose.dev.yaml up

# The ROSBridge_suite need to have the custom message compile in its docker, you may need to edit its docker file (websocket)

```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
