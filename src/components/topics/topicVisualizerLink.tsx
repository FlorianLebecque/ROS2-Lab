import IDynamicComponent from "@/utils/interfaces/iDynamicComponent";


export interface IVisualizerDefinition extends IDynamicComponent {
    types: string[],
    topics: string[]
}

// Path relative to src/components/DynamicFactory.tsx
export const visualizers: Map<string, IVisualizerDefinition> = new Map([
    [
        "basic",
        {
            id: "basic",
            path: "./topics/visualizer/basic/basic",
            params: {
                list: false
            },
            name: "Basic",
            description: "Basic visualizer, display last data as JSON",
            types: ["*"],
            topics: ["*"]
        }
    ],
    [
        "basicList",
        {
            id: "basicList",
            path: "./topics/visualizer/basic/basic",
            name: "Basic List",
            params: {
                list: true
            },
            description: "Basic List visualizer, display list of data as JSON",
            types: ["*"],
            topics: ["*"]
        }
    ],
    [
        "gpsRTK",
        {
            id: "gpsRTK",
            path: "./topics/visualizer/gps/rtk",
            name: "GPS RTK",
            description: "GPS RTK visualizer, display GPS RTK data",
            types: ["sensor_msgs/msg/NavSatFix"],
            topics: ["*"]
        }
    ],
    [
        "pointCloud",
        {
            id: "pointCloud",
            path: "./topics/visualizer/image/pointCloud",
            name: "Point Cloud",
            description: "Point Cloud visualizer, display Point Cloud data",
            types: ["sensor_msgs/msg/PointCloud2"],
            topics: ["*"]
        }
    ],
    [
        "odom3D",
        {
            id: "odom3D",
            path: "./topics/visualizer/odom/odom3D",
            name: "Odometry 3D",
            description: "Odometry 3D visualizer, display odometry data in 3D",
            types: ["nav_msgs/msg/Odometry"],
            topics: ["*"]
        }
    ],
    [
        "imu3D",
        {
            id: "imu3D",
            path: "./topics/visualizer/imu/imu3D",
            name: "IMU Data",
            description: "IMU Data visualizer, display IMU data in 3D",
            types: ["sensor_msgs/msg/Imu"],
            topics: ["*"]
        }
    ],
    [
        "imuACC",
        {
            id: "imuACC",
            path: "./topics/visualizer/basic/basicGraph",
            params: {
                dataset: "linear_acceleration",
                title: "IMU Acceleration",
                min: -50,
                max: 50,
                single: false
            },
            name: "IMU Acceleration",
            description: "IMU Acceleration visualizer, display IMU acceleration data",
            types: ["sensor_msgs/msg/Imu"],
            topics: ["*"]
        }
    ],
    [
        "imuORR",
        {
            id: "imuORR",
            path: "./topics/visualizer/basic/basicGraph",
            params: {
                dataset: "orientation",
                title: "IMU orientation",
                min: -1.5,
                max: 1.5,
                single: false
            },
            name: "IMU Orientation",
            description: "IMU Orientation visualizer, display IMU orientation data",
            types: ["sensor_msgs/msg/Imu"],
            topics: ["*"]
        }
    ],
    [
        "imuAVEL",
        {
            id: "imuAVEL",
            path: "./topics/visualizer/basic/basicGraph",
            params: {
                dataset: "angular_velocity",
                title: "IMU Angular velocity",
                min: -20,
                max: 20,
                single: false
            },
            name: "IMU Angular velocity",
            description: "IMU angular velocity visualizer, display IMU orientation data",
            types: ["sensor_msgs/msg/Imu"],
            topics: ["*"]
        }
    ],
    [
        "temperature",
        {
            id: "temperature",
            path: "./topics/visualizer/basic/basicGraph",
            params: {
                dataset: "temperature",
                title: "Temperature",
                min: -10,
                max: 100,
                single: true
            },
            name: "Temperature",
            description: "Temperature visualizer, display temperature data",
            types: ["sensor_msgs/msg/Temperature"],
            topics: ["*"]
        }
    ],
    [
        "emiPulse",
        {
            id: "emiPulse",
            path: "./topics/visualizer/emi/pulse",
            name: "IME Pulse",
            description: "IME Pulse visualizer, display IME pulse data",
            types: ["vmc4_msgs/msg/PulseRaw"],
            topics: ["ime_pulse_raw"]
        }
    ],
    [
        "imeDiode",
        {
            id: "imeDiode",
            path: "./topics/visualizer/emi/diode",
            name: "IME Diode Temp",
            description: "IME Diode Temp visualizer, display IME diode temperature data",
            types: ["std_msgs/msg/String"],
            topics: ["ime_diode_adc_temperatur"]
        }
    ],
    [
        "jpeg",
        {
            id: "jpeg",
            path: "./topics/visualizer/image/jpeg",
            name: "Video Display JPEG",
            description: "Video Display JPEG visualizer, display video stream in JPEG format",
            types: ["sensor_msgs/msg/CompressedImage"],
            topics: ["*"]
        }
    ],
    [
        "uncompressed",
        {
            id: "uncompressed",
            path: "./topics/visualizer/image/uncompressed",
            name: "Video Display Uncompressed",
            description: "Video Display Uncompressed visualizer, display video stream in uncompressed format",
            types: ["sensor_msgs/msg/Image"],
            topics: ["*"]
        }
    ]
]);

export function TopicVisualizerLink(topicName: string, topicType: string): IVisualizerDefinition[] {

    /*
        To be a possible visualizer:
        
        - The topic type must be in the types list
        - The topic name must be in the topics list
    
        If the topic type is "*", it means it can be used for any topic type
        If the topic name is "*", it means it can be used for any topic name
    
        If the visualizer defined both topic type and topic name, the topic must match both
        If the visualizer defined only topic type, the topic must match the type
        If the visualizer defined only topic name, the topic must match the name
    */

    let possibleVisualizers: IVisualizerDefinition[] = [];

    for (let v of visualizers.values()) {

        if (v.types.includes("*") && v.topics.includes("*")) {
            possibleVisualizers.push(v);
            continue;
        }

        // if type and topic are defined -> 'name' must be include (partial match), type must be include (exact match)
        if (v.types[0] !== "*" && v.topics[0] !== "*") {

            // check if topicType is in the types list
            if (v.types.includes(topicType)) {

                // check if we have a partial match in the topic name
                for (let j = 0; j < v.topics.length; j++) {
                    if (topicName.includes(v.topics[j])) {
                        possibleVisualizers.push(v);
                        break;
                    }
                }

            }
        }

        // if only type is defined -> type must be include (exact match)
        if (v.types[0] !== "*" && v.topics[0] === "*") {
            if (v.types.includes(topicType)) {
                possibleVisualizers.push(v);
            }
        }

        // if only topic is defined -> 'name' must be include (partial match)
        if (v.types[0] === "*" && v.topics[0] !== "*") {
            for (let j = 0; j < v.topics.length; j++) {
                if (topicName.includes(v.topics[j])) {
                    possibleVisualizers.push(v);
                    break;
                }
            }
        }

    }

    return JSON.parse(JSON.stringify(possibleVisualizers));
}