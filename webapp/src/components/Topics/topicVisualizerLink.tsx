import IDynamicComponent from "@/utils/interfaces/IDynamicComponent";


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
            path: "./Topics/visualizer/basic/basic",
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
            path: "./Topics/visualizer/basic/basic",
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
            path: "./Topics/visualizer/gps/Rtk",
            name: "GPS RTK",
            description: "GPS RTK visualizer, display GPS RTK data",
            types: ["sensor_msgs/msg/NavSatFix"],
            topics: ["*"]
        }
    ],
    [
        "gpsRTKList",
        {
            id: "gpsRTKList",
            path: "./Topics/visualizer/gps/RtkList",
            name: "GPS RTK List",
            description: "GPS RTK List visualizer, display marker for all positions",
            types: ["sensor_msgs/msg/NavSatFix"],
            topics: ["*"]
        }
    ],
    [
        "gpsRTKListBomb",
        {
            id: "gpsRTKListBomb",
            path: "./Topics/visualizer/gps/RtkListBomb",
            name: "GPS RTK Bomb List",
            description: "GPS RTK List visualizer, display bomb marker",
            types: ["sensor_msgs/msg/NavSatFix"],
            topics: ["*"]
        }
    ],
    [
        "gpsRTKPath",
        {
            id: "gpsRTKPath",
            path: "./Topics/visualizer/gps/RtkPath",
            name: "GPS RTK Path",
            description: "GPS RTK path visualizer, display path",
            types: ["sensor_msgs/msg/NavSatFix"],
            topics: ["*"]
        }
    ],
    [
        "gpsRTKHeat",
        {
            id: "gpsRTKHeat",
            path: "./Topics/visualizer/gps/RtkHeat",
            name: "GPS RTK Heatmap",
            description: "GPS RTK Heatmap visualizer, display heatmap for all positions",
            types: ["sensor_msgs/msg/NavSatFix"],
            topics: ["*"]
        }
    ],
    [
        "gpsRTKFootPrint",
        {
            id: "gpsRTKFootPrint",
            path: "./Topics/visualizer/gps/RtkFootPrint",
            name: "GPS RTK FootPrint",
            description: "GPS RTK FootPrint visualizer, display foot print",
            types: ["sensor_msgs/msg/NavSatFix"],
            topics: ["*"],
            params: {
                title: "GPS RTK FootPrint",
                position_topic: "/robotaa/fix",
                emi_avg_topic: "/robotaa/emi/pulse/avg"
            }
        }
    ],
    [
        "gpsRTKMultiAdaptive",
        {
            id: "gpsRTKMultiAdaptive",
            path: "./Topics/visualizer/gps/RtkMultiTopic",
            name: "Detection - Adaptive Threshold",
            description: "Display path, bomb and detection hit",
            types: ["sensor_msgs/msg/NavSatFix"],
            params: {
                title: "Detection - Adaptive Threshold",
                position_topic: "/robotaa/fix",
                detection_topic: "/emi/fix/detection/adaptive_threshold",
                emi_avg_topic: "/robotaa/emi/pulse/avg"
            },
            topics: ["*"]
        }
    ],
    [
        "gpsRTKMultiDerivative",
        {
            id: "gpsRTKMultiDerivative",
            path: "./Topics/visualizer/gps/RtkMultiTopic",
            name: "Detection - Derivative",
            description: "Display path, bomb and detection hit",
            types: ["sensor_msgs/msg/NavSatFix"],
            params: {
                title: "Detection - Derivative",
                position_topic: "/robotaa/fix",
                detection_topic: "/emi/fix/detection/derivative"
            },
            topics: ["*"]
        }
    ],
    [
        "gpsRTKMultiDerivativeBand",
        {
            id: "gpsRTKMultiDerivativeBand",
            path: "./Topics/visualizer/gps/RtkMultiTopic",
            name: "Detection - Derivative Band",
            description: "Display path, bomb and detection hit",
            types: ["sensor_msgs/msg/NavSatFix"],
            params: {
                title: "Detection - Derivative Band",
                position_topic: "/robotaa/fix",
                detection_topic: "/emi/fix/detection/derivative_band"
            },
            topics: ["*"]
        }
    ],
    [
        "gpsRTKHeat",
        {
            id: "gpsRTKHeatFiltered",
            path: "./Topics/visualizer/gps/RtkHeatFiltered",
            name: "GPS RTK Filtered Heatmap",
            description: "GPS RTK Heatmap visualizer, display heatmap for positions filtered by distance",
            types: ["sensor_msgs/msg/NavSatFix"],
            topics: ["*"]
        }
    ],
    [
        "pointCloud",
        {
            id: "pointCloud",
            path: "./Topics/visualizer/image/pointCloud",
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
            path: "./Topics/visualizer/odom/odom3D",
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
            path: "./Topics/visualizer/imu/imu3D",
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
            path: "./Topics/visualizer/basic/basicGraph",
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
            path: "./Topics/visualizer/basic/basicGraph",
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
            path: "./Topics/visualizer/basic/basicGraph",
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
            path: "./Topics/visualizer/basic/basicGraph",
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
        "numberGraph",
        {
            id: "numberGraph",
            path: "./Topics/visualizer/basic/basicGraph",
            params: {
                dataset: "data",
                title: "Number",
                min: 0,
                max: 0,
                single: true
            },
            name: "Line graph",
            description: "Number visualizer, display number data",
            types: ["std_msgs/msg/Float32"],
            topics: ["*"]
        }
    ],
    [
        "battery",
        {
            id: "battery",
            path: "./Topics/visualizer/basic/basicGraph",
            params: {
                dataset: "data",
                title: "Battery Voltage",
                min: 0,
                max: 100,
                single: true
            },
            name: "Battery Voltage",
            description: "Battery Voltage visualizer, display battery voltage data",
            types: ["*"],
            topics: ["/voltage"]
        }
    ],
    [
        "battery_level",
        {
            id: "battery_level",
            path: "./Topics/visualizer/basic/basicProgress",
            params: {
                dataset: "data",
                title: "Battery Voltage",
                max: 100,
            },
            name: "Battery Voltage indicator",
            description: "Battery Voltage visualizer, display battery voltage data",
            types: ["*"],
            topics: ["/voltage"]
        }
    ],
    [
        "emiPulse",
        {
            id: "emiPulse",
            path: "./Topics/visualizer/emi/pulse",
            name: "IME Pulse",
            description: "IME Pulse visualizer, display IME pulse data",
            types: ["vmc4_msgs/msg/PulseRaw"],
            topics: ["*"]
        }
    ],
    [
        "imeDiode",
        {
            id: "imeDiode",
            path: "./Topics/visualizer/emi/diode",
            name: "IME Diode Temp",
            description: "IME Diode Temp visualizer, display IME diode temperature data",
            types: ["std_msgs/msg/String"],
            topics: ["ime/diode/adc/temperature"]
        }
    ],
    [
        "jpeg",
        {
            id: "jpeg",
            path: "./Topics/visualizer/image/jpeg",
            name: "Video Display JPEG",
            description: "Video Display JPEG visualizer, display video stream in JPEG format",
            types: ["sensor_msgs/msg/CompressedImage"],
            topics: ["*"]
        }
    ],
    [
        "webRTCImage",
        {
            id: "webRTCImage",
            path: "./Topics/visualizer/image/rawWebRTC",
            name: "Video Display over WebRTC",
            description: "Video Display JPEG visualizer, display video stream in JPEG format",
            types: ["sensor_msgs/msg/CompressedImage"],
            topics: ["*"]
        }
    ],
    [
        "uncompressed",
        {
            id: "uncompressed",
            path: "./Topics/visualizer/image/uncompressed",
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