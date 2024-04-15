const ROSLIB = require('roslib');
import AAI from './AsyncInterface';


export class RosWeb{

    static instance : RosWebSingleton;

    static Instance() : RosWebSingleton{

        if(RosWeb.instance == null){
            RosWeb.instance = new RosWebSingleton();
        }

        return RosWeb.instance;
    }

    constructor(){
        throw new Error("Use RosWeb.Instance() instead of new RosWeb()");
    }
}

export class RosWebSingleton{

    ros : any;
    connected : boolean = false;
    connectionHandlers: ((connected: boolean) => void)[] = [];
    is_reconnecting : boolean = false;

    id : number = 0;

    constructor(){
        console.log("RosWeb constructor");

        this.id = Math.floor(Math.random() * 1000);

        //Only connect if we are in the frontend (client side)
        if(typeof window !== 'undefined'){
            this.connect();
        }else{
            console.log("Not connecting to ROS, we are in the backend");
        }
    }

    connect() {

        console.log( this.id + ' Init ROS...');
        if(this.ros != null){
            console.log("Closing existing connection");
            this.ros.close();
        }

        console.log("Connecting to ROS...");
        this.ros = new ROSLIB.Ros({
            url : 'ws://localhost:9090'
        });

        this.ros.on('connection', () => this.handleConnection());
        this.ros.on('error', (error:any) => this.handleError(error));
        this.ros.on('close', () => this.handleClose());
    }

    disconnect() {
        if (this.ros && this.ros.isConnected) {
            this.ros.close();
        }
    }

    handleConnection() {
        this.connected = true;

        console.log("Calling connection handler");

        console.log(this.id);

        this.connectionHandlers.forEach((handler) => {
            console.log(handler.name);
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

    subscribeToConnection(handler :any) {
        this.connectionHandlers.push(handler);
    }

    unsubscribeFromConnection(handler: any) {
        this.connectionHandlers = this.connectionHandlers.filter(h => h !== handler);
    }

    reconnect() {
        if(this.is_reconnecting){
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
        try {
            const nodes = await AAI.Execute(this.ros.getNodes, this.ros);

            return nodes[0];

        } catch (error) {
            console.error("Error fetching nodes:", error);
            return []; // or handle the error accordingly
        }
    }

    async GetNodeDetails(node : string) {

        const details_array = await AAI.Execute(this.ros.getNodeDetails, this.ros, node);

        return {
            subscribers: details_array[0],
            topics: details_array[1],
            services: details_array[2]
        }
    }

    SubscribeToTopic(topic: string, callback: (message: any) => void) {
        const topic_listeners = new ROSLIB.Topic({
            ros: this.ros,
            name: topic,
        });

        topic_listeners.subscribe(callback);

        return topic_listeners;
    }


}