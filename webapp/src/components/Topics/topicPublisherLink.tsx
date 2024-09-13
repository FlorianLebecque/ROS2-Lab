import IDynamicComponent from "@/utils/interfaces/IDynamicComponent";
import { IVisualizerDefinition } from "./topicVisualizerLink";

// Path relative to src/components/DynamicFactory.tsx
export const publishers: Map<string, IVisualizerDefinition> = new Map([
    [
        "cmd_vel",
        {
            id: "cmd_vel",
            path: "./Topics/publisher/cmd_vel/JoystickCmdVel",
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
        "cmd_vel_keyboard",
        {
            id: "cmd_vel_keyboard",
            path: "./Topics/publisher/cmd_vel/KeyboardCmdVel",
            name: "Keyboard ZQSD",
            params: {

            },
            description: "Simple Keyboard controller",
            types: ["geometry_msgs/msg/Twist"],
            topics: ["*"]
        },
    ],
    [
        "cmd_vel_forward_x",
        {
            id: "cmd_vel_forward_x",
            path: "./Topics/publisher/cmd_vel/JoystickCmdVel",
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
            path: "./Topics/publisher/cmd_vel/JoystickCmdVel",
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
    ],
    [
        "cmd_vel_button_zero",
        {
            id: "cmd_vel_button_zero",
            path: "./Topics/publisher/cmd_vel/ButtonCmdVelZero",
            name: "Button Zero",
            description: "Button when pressed publishes zero velocity",
            types: ["geometry_msgs/msg/Twist"],
            topics: ["*"]
        },
    ],
    [
        "string_publisher",
        {
            id: "string_publisher",
            path: "./Topics/publisher/string/StringPublisher",
            name: "String Publisher",
            description: "Publishes a string",
            types: ["std_msgs/msg/String"],
            topics: ["*"]
        },
    ],
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