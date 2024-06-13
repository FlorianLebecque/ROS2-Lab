import IBagInfo from "./interfaces/IBagInfo";

export default class BagAPI {
    static PORT = 8000

    static IP = () => {
        if (typeof window === 'undefined') {
            return "";
        }
        let host = window.location.origin;
        let host_split = host.split(":");
        // http + : + //host
        return host_split[0] + ":" + host_split[1];
    }

    static GATEWAY = BagAPI.IP() + ":" + BagAPI.PORT;

    static async getBags(): Promise<IBagInfo[]> {

        if (typeof window === 'undefined') {
            return [];
        }


        const response = await fetch(`${BagAPI.GATEWAY}/bag_info`);
        const data = await response.json();

        if (!response.ok) {
            console.error("Failed to get bags from API");
            return [];
        }

        // if empty, return empty array
        if (data.length === 0) {
            return [];
        }

        // check if data is not an empty object
        if (Object.keys(data).length === 0 && data.constructor === Object) {
            return [];
        }

        // convert to an array of IBagInfo
        /*
            {
                "50": {
                    "bag_name": "test2",
                    "topics": [
                        "/robot/robotnik_base_control/cmd_vel"
                    ],
                    "pid": 50,
                    "status": "stopped"
                },
                "71": {
                    "bag_name": "testvel",
                    "topics": [
                        "/robot/robotnik_base_control/cmd_vel"
                    ],
                    "pid": 71,
                    "status": "stopped"
                }
            }
        */

        let bags: IBagInfo[] = [];

        for (let key in data) {
            bags.push({
                bag_name: data[key].bag_name,
                topics: data[key].topics,
                pid: data[key].pid,
                status: data[key].status
            } as IBagInfo)
        }

        return bags;

    }
}