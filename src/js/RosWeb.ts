const ROSLIB = require('roslib');
import Robot from './Robot';
import { NodeDetail } from './interfaces/inodes';
import { TopicDetail } from './interfaces/itopics';




export class RosWeb {

    static instance: RosWebSingleton;

    static Instance(): RosWebSingleton {

        if (RosWeb.instance == null) {
            RosWeb.instance = new RosWebSingleton();
        }

        return RosWeb.instance;
    }

    constructor() {
        throw new Error("Use RosWeb.Instance() instead of new RosWeb()");
    }
}

export class RosWebSingleton {

    ros: any;
    connected: boolean = false;
    connectionHandlers: ((connected: boolean) => void)[] = [];
    is_reconnecting: boolean = false;

    id: number = 0;

    constructor() {
        this.id = Math.floor(Math.random() * 1000);

        //Only connect if we are in the frontend (client side)
        if (typeof window !== 'undefined') {
            this.connect();
        } else {
            console.log("Not connecting to ROS, we are in the backend");
        }
    }

    connect() {

        console.log(this.id + ' Init ROS...');
        if (this.ros != null) {
            console.log("Closing existing connection");
            this.ros.close();
        }

        let host = window.location.origin;  // remove the http:// and the port if exists
        host = host.replace("http://", "");
        host = host.replace("https://", "");

        //remove the port
        let host_split = host.split(":");
        host = host_split[0];

        console.log("Connecting to ROS...");
        this.ros = new ROSLIB.Ros({
            url: 'ws://' + host + ':9090'
        });

        this.ros.on('connection', () => this.handleConnection());
        this.ros.on('error', (error: any) => this.handleError(error));
        this.ros.on('close', () => this.handleClose());
    }

    disconnect() {
        if (this.ros && this.ros.isConnected) {
            this.ros.close();
        }
    }

    handleConnection() {
        this.connected = true;

        this.connectionHandlers.forEach((handler) => {
            handler(true);
        });
    }

    handleError(error: any) {
        this.connected = false;
        console.error('Error connecting to websocket server:', error);
        this.connectionHandlers.forEach(handler => handler(false));

        this.reconnect();
    }

    handleClose() {
        this.connected = false;
        this.connectionHandlers.forEach(handler => handler(false));
        this.reconnect();
    }

    subscribeToConnection(handler: any) {
        this.connectionHandlers.push(handler);
    }

    unsubscribeFromConnection(handler: any) {
        this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
    }

    reconnect() {
        if (this.is_reconnecting) {
            console.log("Already reconnecting");
            return;
        }
        console.log("Reconnecting...");
        this.is_reconnecting = true;
        setTimeout(() => {
            this.connect();
            this.is_reconnecting = false;
        }, 1000);
    }

    async GetNodesList() {
        return new Promise<string[]>((resolve, reject) => {
            this.ros.getNodes((nodes: string[]) => {
                resolve(nodes);
            }, (error: any) => {
                reject(error);
            });
        });
    }

    async NodeExist(node: string): Promise<boolean> {

        let node_list: any = await this.GetNodesList();

        if (node_list.includes(node)) {
            return true;
        }

        return false;
    }

    async GetNodeDetails(node: string): Promise<NodeDetail> {

        if (!await this.NodeExist(node)) {
            return {
                subscribers: [],
                topics: [],
                services: []
            };
        }

        return new Promise((resolve, reject) => {
            this.ros.getNodeDetails(node, (sub: string[], topics: string[], ser: string[]) => {
                resolve({
                    subscribers: sub,
                    topics: topics,
                    services: ser
                });
            }, (error: any) => {
                reject(error);
            });
        });
    }

    async GetTopicType(topic: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.ros.getTopicType(topic, (type: string) => {
                resolve(type);
            }, (error: any) => {
                reject(error);
            });
        });
    }

    async GetServiceType(service: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.ros.getServiceType(service, (type: string) => {
                resolve(type);
            }, (error: any) => {
                reject(error);
            });
        });
    }

    async GetServiceRequestDetails(service_type: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.ros.getServiceRequestDetails(service_type, (details: string[]) => {
                resolve(details);
            }, (error: any) => {
                reject(error);
            });
        });
    }

    async GetServiceResponseDetails(service_type: string): Promise<string[]> {
        return new Promise((resolve, reject) => {
            this.ros.getServiceResponseDetails(service_type, (details: string[]) => {
                resolve(details);
            }, (error: any) => {
                reject(error);
            });
        });
    }

    SubscribeToTopic(topic: string, callback: (message: any) => void) {
        const topic_listeners = new ROSLIB.Topic({
            ros: this.ros,
            name: topic,
        });

        topic_listeners.subscribe(callback);

        return topic_listeners;
    }

    async GetRobotsList() {
        const nodes = await this.GetNodesList();

        //check every nodes and sort them by namespace
        // node -> /robot1/...  -> namespace -> robot1 node -> /...
        // node -> /robot2/...  -> namespace -> robot2 node -> /...
        // node -> /...         -> namespace -> ND     node -> /...

        let robots = new Map<string, Robot>();

        for (let node of nodes) {

            //check if the nodes has a namespace
            let node_split = node.split("/");

            if (node_split.length > 2) {

                let robot_name = node_split[1];

                if (!robots.has(robot_name)) {
                    robots.set(robot_name, new Robot(this, robot_name));
                }

                robots.get(robot_name)?.AddNode(node);

            }
        }

        return Array.from(robots.values());
    }

}