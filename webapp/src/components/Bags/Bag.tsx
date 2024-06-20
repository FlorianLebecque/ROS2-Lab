import IBagInfo from "@/utils/interfaces/IBagInfo";
import Accordion from 'react-bootstrap/Accordion';
import ListGroup from 'react-bootstrap/ListGroup';

import BagAPI, { IBagApiResponse } from "@/utils/BagApi";

import { bytesToSize } from "@/utils/Utils";

interface IBagProps {
    bag: IBagInfo,
    className?: string
}

export default function Bag({ bag, className }: IBagProps) {

    const onDeleteBtnClick = async (e: any) => {

        // prevent bubbling
        e.stopPropagation();

        // ask user for confirmation
        const confirmed = window.confirm("Are you sure you want to delete this bag? this action is irreversible");
        if (!confirmed) {
            return;
        }

        const result = await BagAPI.deleteBag(bag.bagName);

        if (result === false) {
            alert("Failed to delete bag");
            return;
        }

        if (result.code !== 0) {
            alert(result.message);
            return;
        }

        // remove this element from the DOM
        const element = e.target.closest(".accordion-item");

        if (element) {
            element.remove();
        }

    }

    const onPlayBtnClick = async (e: any) => {
        // prevent bubbling
        e.stopPropagation();

        // ask user for confirmation
        const confirmed = window.confirm("Are you sure you want to play this bag?");
        if (!confirmed) {
            return;
        }

        const result = await BagAPI.playBag(bag.bagName);

        if (result === false) {
            alert("Failed to play bag");
            return;
        }

        if (result.code !== 0) {
            alert(result.message);
            return;
        }

        bag.status = "playing";
    }

    const onStopRecordingBtnClick = async (e: any) => {
        // prevent bubbling
        e.stopPropagation();

        // ask user for confirmation
        const confirmed = window.confirm("Are you sure you want to stop recording this bag?");
        if (!confirmed) {
            return;
        }

        const result = await BagAPI.stopRecording(bag.bagName);

        if (result === false) {
            alert("Failed to stop recording");
            return;
        }

        if (result.code !== 0) {
            alert(result.message);
            return;
        }

        bag.status = "stopped";
    }

    const onDownloadBtnClick = async (e: any) => {
        e.stopPropagation();
        BagAPI.downloadBag(bag.bagName);

    }

    return (
        <div className={className}>
            <Accordion>
                <Accordion.Item eventKey="0">
                    <Accordion.Header>
                        <div className="d-flex flex-wrap justify-content-between w-100 gap-3 me-3">
                            <h2>{bag.bagName}</h2>
                            <div className="d-flex gap-3 align-items-center">
                                <p className="m-0">{bag.startDate || "No date information yet"}</p>
                                <p className="m-0">{formatDuration(bag.durationSeconde || 0)}</p>
                                <p className="m-0">{bag.status}</p>
                            </div>
                            {bag.status !== "recording" &&
                                < div className="d-flex gap-3">



                                    <a onClick={onDeleteBtnClick} className="btn btn-outline-danger">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                        </svg>
                                    </a>
                                    <a onClick={onDownloadBtnClick} className="btn btn-outline-success">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-download" viewBox="0 0 16 16">
                                            <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
                                            <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
                                        </svg>
                                    </a>
                                    <a onClick={onPlayBtnClick} className="btn btn-outline-success">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-play-fill" viewBox="0 0 16 16">
                                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
                                        </svg>
                                    </a>
                                </div>
                            }
                            {bag.status === "recording" &&
                                <div className="d-flex gap-3">
                                    <a onClick={onStopRecordingBtnClick} className="btn btn-outline-danger">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-stop" viewBox="0 0 16 16">
                                            <path d="M3.5 5A1.5 1.5 0 0 1 5 3.5h6A1.5 1.5 0 0 1 12.5 5v6a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 11zM5 4.5a.5.5 0 0 0-.5.5v6a.5.5 0 0 0 .5.5h6a.5.5 0 0 0 .5-.5V5a.5.5 0 0 0-.5-.5z" />
                                        </svg>
                                    </a>
                                </div>
                            }
                        </div>
                    </Accordion.Header>
                    <Accordion.Body>
                        <ListGroup className="mb-3">
                            <ListGroup.Item>{bag.status}</ListGroup.Item>
                            <ListGroup.Item>{bytesToSize(bag.size) || 0}</ListGroup.Item>
                        </ListGroup>

                        <Accordion>
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Metadata</Accordion.Header>
                                <Accordion.Body>
                                    <pre>
                                        {JSON.stringify(bag.metadata, null, 2)}
                                    </pre>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div >
    );

    function formatDuration(duration: number): string {
        const hours = Math.floor(duration / 3600);
        const minutes = Math.floor((duration % 3600) / 60);
        const seconds = (duration % 60).toFixed(2);

        // only show minutes if there are any
        if (hours === 0 && minutes === 0) {
            return `${seconds}s`;
        }

        // only show hours if there are any
        if (hours === 0) {
            return `${minutes}m ${seconds}s`;
        }

        return `${hours}h ${minutes}m ${seconds}s`;
    }
}