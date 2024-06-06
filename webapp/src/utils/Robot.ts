import {RosWebSingleton} from './RosWeb';

export default class Robot{

    rosWeb : RosWebSingleton;
    nodes : string[] = [];
    name : string;

    constructor(rosWeb : RosWebSingleton, name : string){
        this.rosWeb = rosWeb;
        this.name = name;
    }

    AddNode(node : string){
        this.nodes.push(node);
    }

}