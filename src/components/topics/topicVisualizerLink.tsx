import IDynamicComponent from "@/js/interfaces/iDynamicComponent";


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
            path: "./topics/Display/basicDisplay/basicDisplay",
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
            path: "./topics/Display/basicDisplay/basicDisplay",
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
        "imudata",
        {
            id: "imudata",
            path: "./topics/Display/imu_data/imu_data",
            name: "IMU Data",
            description: "IMU Data visualizer, display IMU data in 3D",
            types: ["sensor_msgs/msg/Imu"],
            topics: ["*"]
        }
    ],
    [
        "imepulse",
        {
            id: "imepulse",
            path: "./topics/Display/ime/PulseRaw",
            name: "IME Pulse",
            description: "IME Pulse visualizer, display IME pulse data",
            types: ["vmc4_msgs/msg/PulseRaw"],
            topics: ["ime_pulse_raw"]
        }
    ],
    [
        "imediodetemp",
        {
            id: "imediodetemp",
            path: "./topics/Display/ime/DiodeTemp",
            name: "IME Diode Temp",
            description: "IME Diode Temp visualizer, display IME diode temperature data",
            types: ["std_msgs/msg/String"],
            topics: ["ime_diode_adc_temperatur"]
        }
    ],
    [
        "videoDisplayJPEG",
        {
            id: "videoDisplayJPEG",
            path: "./topics/Display/videoDisplay/videoDisplay",
            name: "Video Display JPEG",
            description: "Video Display JPEG visualizer, display video stream in JPEG format",
            types: ["sensor_msgs/msg/CompressedImage", "sensor_msgs/msg/Image"],
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

    return possibleVisualizers;
}