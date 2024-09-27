# ROS2-Lab
It is a web interface to interact with ROS2 environment made in NextJS, it was part of my master thesis at ECAM.
The project won't be developed further in this repository.

- Data visualization
- Allow remote teleoperation
- ROS Bag management

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
