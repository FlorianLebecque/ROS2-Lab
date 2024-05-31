# Use the official ROS2 Docker image as the base image
FROM ros:humble

WORKDIR /ws_rosbridge
SHELL ["/bin/bash", "-c"]

# Install build dependencies
RUN apt-get update -y && apt-get install -y \
    libsqlite3-dev \
    build-essential\
    git \
    cmake \
    libyaml-cpp-dev \
    software-properties-common \
    pkg-config \ 
    wget \
    curl \
    libpdal-dev && \
    apt-get clean && rm -rf /var/lib/apt/lists/

RUN echo hello

RUN git clone --recursive --branch ros2 https://github.com/RobotWebTools/rosbridge_suite.git /ws_rosbridge/src/rosbridge_suite

ARG ROS2CustomMSGCompil
RUN if  [ "$ROS2CustomMSGCompil" = "true" ]; then \ 
    git clone --recursive https://github.com/FlorianLebecque/ROS2CustomMSGCompil.git /ws_rosbridge/src/ROS2CustomMSGCompil; \
    fi

ARG PX4_MSGS
RUN if  [ "$PX4_MSGS" = "true" ]; then \ 
    git clone https://github.com/PX4/px4_msgs.git /ws_rosbridge/src/px4_msgs; \
    fi

RUN cd /ws_rosbridge &&\
    source /opt/ros/${ROS_DISTRO}/setup.bash &&\
    apt-get update -y &&\
    apt-get install -y python3-rosdep \
    && source /opt/ros/${ROS_DISTRO}/setup.bash \
    && rm /etc/ros/rosdep/sources.list.d/20-default.list \
    && rosdep init \
    && rosdep update \
    && rosdep install -i --from-path src --rosdistro ${ROS_DISTRO} -y \
    && colcon build

RUN apt-get update && apt-get upgrade -y
RUN apt-get install -y python3-pip \
    ros-$ROS_DISTRO-rmw-cyclonedds-cpp

ENV RMW_IMPLEMENTATION rmw_cyclonedds_cpp

EXPOSE 9090

COPY ros_entrypoint.sh /sbin/ros_entrypoint.sh
RUN chmod 755 /sbin/ros_entrypoint.sh

ENTRYPOINT ["/sbin/ros_entrypoint.sh"]
CMD ["bash"]