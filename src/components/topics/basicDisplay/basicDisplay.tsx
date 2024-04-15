'use client';


export default function ControlBar(props: { name: string }) {

    return (
        <div style={{ height: "100%", overflowY: "auto" }}>
            <div>
                {data.map((message, index) => {
                    return (
                        <div key={index}>
                            <p>{message.time}</p>
                            <hr />
                            <pre>{JSON.stringify(message.ros, null, 2)}</pre>
                        </div>
                    );
                })}
            </div>
        </div >
    );
}
