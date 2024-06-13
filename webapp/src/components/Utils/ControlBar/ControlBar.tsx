
'use client';

import { useData } from "../../Topics/topicProvider";

export default function ControlBar(props: { topicName: string, topicType: string }) {

    // use context to get the data
    const { data, setData, pause, setPause } = useData();


    // handle clear
    const handleClear = () => {
        setData([]);
    };

    const handePause = () => {
        setPause(!pause);
    }


    return (
        <div className='d-flex flex-wrap align-items-center justify-content-between mb-3'>
            <p>{props.topicName}</p>
            <p>{props.topicType}</p>



            <div className="d-flex gap-3 align-items-center">

                <div className="btn-group" role="group" aria-label="Basic outlined example">

                    <button onClick={() => { handePause() }} className='btn btn-outline-primary'>
                        {!pause && <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-pause" viewBox="0 0 16 16">
                            <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5" />
                        </svg>}

                        {pause && <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-caret-right-fill" viewBox="0 0 16 16">
                            <path d="m12.14 8.753-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                        </svg>}
                    </button>

                    <div className="input-group-text">{data.length}/100</div>

                    <button onClick={() => { handleClear() }} className='btn btn-outline-danger'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}
