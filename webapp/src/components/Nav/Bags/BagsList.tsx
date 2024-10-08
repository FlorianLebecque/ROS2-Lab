import { useEffect, useState } from "react";
import IBagInfo from "@/utils/interfaces/IBagInfo";
import BagAPI from "@/utils/BagApi";
import Bag from "@/components/Bags/Bag";



export default function BagsList() {
    const [bags, setBags] = useState<IBagInfo[]>([]);

    const [from, setFrom] = useState<string>(getMondayLastWeek());

    function getMondayLastWeek() {
        const today = new Date();
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1) - 7;
        const mondayLastWeek = new Date(today.setDate(diff));
        return mondayLastWeek.toISOString().split('T')[0];
    }
    const [to, setTo] = useState<string>(new Date().toISOString().split('T')[0]);
    const [filter, setFilter] = useState<string>("");
    const [refresh, setRefresh] = useState<boolean>(false);

    useEffect(() => {
        const fetchBags = async () => {
            console.log("Fetching bags");

            try {

                const bags_from_api = await BagAPI.getBags();
                let final_bags: IBagInfo[] = bags_from_api;

                if (filter !== "") {
                    final_bags = bags_from_api.filter((bag) => {
                        return bag.bagName.includes(filter);
                    });
                }

                if (from !== "") {
                    final_bags = final_bags.filter((bag) => {

                        if (bag.startDate === undefined || bag.startDate === null) {
                            return true;
                        }
                        // convert to date
                        const bagDate = new Date(bag.startDate);
                        bagDate.setHours(23, 59, 59, 999);
                        const fromDate = new Date(from);
                        fromDate.setHours(0, 0, 0, 0);

                        return bagDate >= fromDate;
                    });
                }

                if (to !== "") {
                    final_bags = final_bags.filter((bag) => {

                        if (bag.startDate === undefined || bag.startDate === null) {
                            return true;
                        }
                        // convert to date
                        const bagDate = new Date(bag.startDate);
                        bagDate.setHours(0, 0, 0, 0);
                        // to is end of the day
                        const toDate = new Date(to);
                        toDate.setHours(23, 59, 59, 999);

                        return bagDate <= toDate;
                    });
                }

                // sort by date
                final_bags.sort((a, b) => {
                    if (a.startDate === undefined || a.startDate === null) {
                        return -1;
                    }
                    if (b.startDate === undefined || b.startDate === null) {
                        return 1;
                    }
                    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
                });

                setBags(final_bags);

            } catch (error) {
                console.error("Error fetching bags:", error);
            }
        }

        fetchBags();

        const bagInterval = setInterval(() => {
            //fetchBags();
        }, 10000)

        return () => {
            clearInterval(bagInterval);
        };
    }, [from, to, filter, refresh]);

    const onFilterChange = (e: any) => {
        setFilter(e.target.value);
    }

    const onFromChange = (e: any) => {
        setFrom(e.target.value);
    }

    const onToChange = (e: any) => {
        setTo(e.target.value);
    }

    const onRefreshClick = () => {
        setRefresh(!refresh);
    }

    return (
        <div className='mt-3'>
            <div className="input-group mb-3">
                <span className="input-group-text">Filters</span>
                <div className="form-floating">
                    <input onChange={onFilterChange} type="text" className="form-control" id={"filter-bags"} placeholder="Type to filter bags" />
                    <label htmlFor="filter-bags">Type to filter bags</label>
                </div>
                <span className="input-group-text">From</span>
                <input type="date" defaultValue={from} onChange={onFromChange} className="form-control" />
                <span className="input-group-text">To</span>
                <input type="date" defaultValue={to} onChange={onToChange} className="form-control" />
                <button onClick={onRefreshClick} className="btn btn-outline-secondary" type="button">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-clockwise" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z" />
                        <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                    </svg>
                </button>
            </div>
            <div className="d-flex flex-column gap-3">
                {bags.map((bag) => {
                    return (
                        <Bag key={bag.bagName} bag={bag} />
                    );
                })}
            </div>
        </div>
    );
}