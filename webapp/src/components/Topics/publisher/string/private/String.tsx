import { usePublisher } from "@/components/Topics/topicPublisher";

export default function String(props: { topicName: string }) {

    const { publish } = usePublisher();

    const onBtnClick = () => {
        const input = document.getElementById("floatingInput") as HTMLInputElement;

        publish({ data: input.value });

        input.value = "";
    }

    const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onBtnClick();
        }
    }

    return (
        <div className="p-3" style={{ height: "100%" }}>
            <div className="input-group mb-3">
                <div onKeyDown={onKeyDown} className="form-floating">
                    <input type="text" className="form-control" id="floatingInput" placeholder="Type your command" />
                    <label htmlFor="floatingInput">Type your command</label>
                </div>
                <button onClick={onBtnClick} className="btn btn-outline-primary" type="button" id="button-addon2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-send" viewBox="0 0 16 16">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                    </svg>
                </button>
            </div>
        </div>
    )
}