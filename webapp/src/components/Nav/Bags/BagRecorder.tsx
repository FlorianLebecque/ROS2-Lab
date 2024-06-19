import Bag from "@/components/Bags/Bag";
import { useRosWeb } from "@/components/RosContext";
import BagAPI, { IBagApiResponse } from "@/utils/BagApi";
import IBagInfo from "@/utils/interfaces/IBagInfo";
import { useEffect, useState } from "react";



export default function BagRecoder() {

    const rosWeb = useRosWeb();

    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [topics, setTopics] = useState<string[]>([]);
    const [recordings, setRecordings] = useState<string[]>([]);
    const [bags, setBags] = useState<IBagInfo[]>([]);
    const [filter, setFilter] = useState<string>("");

    useEffect(() => {
        const fetchTopics = async () => {
            const topics_from_ws = await rosWeb.GetTopicsList();

            let finalTopics: string[] = topics_from_ws;

            console.log(filter);

            if (filter !== "") {
                finalTopics.filter((topic) => {
                    return topic.includes(filter);
                });
            }

            setTopics(finalTopics);
        }

        const fetchRecordingBags = async () => {
            const bags_from_api = await BagAPI.getBags();
            let final_bags = bags_from_api;

            final_bags = bags_from_api.filter((bag) => {
                return bag.status === "recording";
            });

            setBags(final_bags);
        }

        fetchTopics();
        fetchRecordingBags();

        const topicInterval = setInterval(() => {
            fetchTopics();
        }, 2000);


        return () => {
            clearInterval(topicInterval);
        }

    }, [filter, recordings]);

    const onFilterChange = (e: any) => {
        setFilter(e.target.value);
    }

    const onRecordClick = async () => {
        if (selectedTopics.length === 0) {
            alert("Please select at least one topic to record");
            return;
        }

        const bagName = (document.getElementById("bag-name") as HTMLInputElement).value;

        if (bagName === "") {
            alert("Please enter a bag name");
            return;
        }

        const result = await BagAPI.record(bagName, selectedTopics);

        if (result === false) {
            alert("Failed to record bag");
            return;
        }


        if ("code" in result) {
            if (result.code !== 0) {
                alert(result.message);
                return;
            }
        } else {
            // clear the input
            (document.getElementById("bag-name") as HTMLInputElement).value = "";

            // clear checkboxes
            const checkboxes = document.querySelectorAll(".form-check-input");
            checkboxes.forEach((checkbox) => {
                (checkbox as HTMLInputElement).checked = false;
            });

            // clear filter input
            (document.getElementById("filter-topic") as HTMLInputElement).value = "";


            setRecordings([...recordings, result.bagName]);
        }
    }

    const onTopicChange = (e: any) => {
        const topic = e.target.id;
        const checked = e.target.checked;

        if (checked) {
            setSelectedTopics([...selectedTopics, topic]);
        } else {
            setSelectedTopics(selectedTopics.filter((t) => t !== topic));
        }
    }

    return (
        <div>
            <h1>Bag Recorder</h1>

            <div className="input-group mb-3">
                <div className="form-floating">
                    <input type="text" className="form-control" id="bag-name" placeholder="Bag name" />
                    <label htmlFor="bag-name">Bag name</label>
                </div>
                <button onClick={onRecordClick} className="btn btn-outline-danger" type="button">Record</button>
            </div>
            <div>
                <h2>Topics</h2>
                <div className="form-floating mb-3">
                    <input onChange={onFilterChange} type="text" className="form-control" id="filter-topic" placeholder="Filter topic name" />
                    <label htmlFor="filter-topic">Filter topic name</label>
                </div>
                <div className="d-flex flex-column gap-3 p-3" style={{ height: "30rem", overflowY: "auto" }}>
                    {topics.map((topic) => {
                        return (
                            <div key={topic} className="form-check">
                                <input onChange={onTopicChange} className="form-check-input" type="checkbox" value="" id={topic} />
                                <label className="form-check-label" htmlFor={topic}>
                                    {topic}
                                </label>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div>
                <h2>Recordings</h2>
                <div className="d-flex flex-column gap-3 p-3" style={{ height: "30rem", overflowY: "auto" }}>
                    {bags.map((bag) => {
                        return (
                            <Bag key={bag.bagName} bag={bag} />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

