import IBagInfo from "./interfaces/IBagInfo";

export interface IBagApiResponse {
    code: number,
    message: string,
}

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
            console.error("Cannot fetch bags from server, window is undefined");
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
            console.log("No bags found")
            return [];
        }

        // check if data is not an empty object
        if (Object.keys(data).length === 0 && data.constructor === Object) {
            console.log("No bags found in data object")
            return [];
        }

        let bags: IBagInfo[] = [];

        for (let key in data) {
            bags.push({
                bagName: data[key].bagName,
                metadata: data[key].metadata,
                pid: data[key].pid,
                status: data[key].status,
                size: data[key].size,
                startDate: data[key].startDate,
                durationSeconde: data[key].durationSeconde
            } as IBagInfo)
        }

        return bags;

    }


    static async deleteBag(bagName: string): Promise<IBagApiResponse | false> {

        if (typeof window === 'undefined') {
            console.error("Cannot delete bag from server, window is undefined");
            return false;
        }

        const response = await fetch(`${BagAPI.GATEWAY}/delete_bag/${bagName}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            console.error("Failed to delete bag from API");
            return false;
        }

        const data = await response.json();

        return data;
    }

    static async playBag(bagName: string): Promise<IBagApiResponse | false> {

        if (typeof window === 'undefined') {
            console.error("Cannot play bag from server, window is undefined");
            return false;
        }

        const response = await fetch(`${BagAPI.GATEWAY}/play_bag/${bagName}`, {
            method: 'GET'
        });

        if (!response.ok) {
            console.error("Failed to play bag from API");
            return false;
        }

        const data = await response.json();

        return data;
    }

    static async record(bagName: string, topics: string[]): Promise<IBagApiResponse | IBagInfo | false> {
        if (typeof window === 'undefined') {
            console.error("Cannot record bag from server, window is undefined");
            return false;
        }

        const response = await fetch(`${BagAPI.GATEWAY}/start_bag/${bagName}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(topics)
        });

        if (!response.ok) {
            console.error("Failed to record bag from API");
            return false;
        }

        const data = await response.json();

        return data;
    }

    static async stopRecording(bagName: string): Promise<IBagApiResponse | false> {
        if (typeof window === 'undefined') {
            console.error("Cannot stop recording from server, window is undefined");
            return false;
        }

        const response = await fetch(`${BagAPI.GATEWAY}/stop_bag/${bagName}`, {
            method: 'GET'
        });

        if (!response.ok) {
            console.error("Failed to stop recording from API");
            return false;
        }

        const data = await response.json();

        return data;

    }

    static async downloadBag(bagName: string) {

        // download the bag file from the server
        if (typeof window === 'undefined') {
            console.error("Cannot download bag from server, window is undefined");
            return false;
        }

        const response = await fetch(`${BagAPI.GATEWAY}/download_bag/${bagName}`, {
            method: 'GET'
        });

        if (!response.ok) {
            console.error("Failed to download bag from API");
            return false;
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // set the filename
        a.download = bagName + ".zip";
        a.click();
        window.URL.revokeObjectURL(url);

        return true;
    }
}