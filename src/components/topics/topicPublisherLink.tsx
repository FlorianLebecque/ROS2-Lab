import IDynamicComponent from "@/utils/interfaces/iDynamicComponent";
import { IVisualizerDefinition } from "./topicVisualizerLink";
import { map } from "leaflet";


// Path relative to src/components/DynamicFactory.tsx
export const publishers: Map<string, IVisualizerDefinition> = new Map([
    [
        "cmd_vel",
        {
            id: "cmd_vel",
            path: "./topics/publisher/cmd_vel/cmd_vel",
            name: "Joystick 2D differential drive",
            params: {
                lock_x: false,
                lock_y: false,
                map_x_to: "angular.z",
                map_y_to: "linear.x",
                factor_x: -1,
                factor_y: 1
            },
            description: "Simple Joystick controller",
            types: ["geometry_msgs/msg/Twist"],
            topics: ["*"]
        },
    ],
    [
        "cmd_vel_forward_x",
        {
            id: "cmd_vel_forward_x",
            path: "./topics/publisher/cmd_vel/cmd_vel",
            name: "Joystick Verticl forward",
            params: {
                lock_x: true,
                lock_y: false,
                map_x_to: "none",
                map_y_to: "linear.x",
                factor_x: 0,
                factor_y: 1
            },
            description: "Simple Joystick controller",
            types: ["geometry_msgs/msg/Twist"],
            topics: ["*"]
        },
    ],
    [
        "cmd_vel_angular_z",
        {
            id: "cmd_vel_angular_z",
            path: "./topics/publisher/cmd_vel/cmd_vel",
            name: "Joystick Horizontal rotation",
            params: {
                lock_x: false,
                lock_y: true,
                map_x_to: "angular.z",
                map_y_to: "none",
                factor_x: -1,
                factor_y: 0
            },
            description: "Simple Joystick controller",
            types: ["geometry_msgs/msg/Twist"],
            topics: ["*"]
        },
    ]
]);

export function TopicPublishersLink(topicName: string, topicType: string): IVisualizerDefinition[] {

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

    for (let v of publishers.values()) {

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