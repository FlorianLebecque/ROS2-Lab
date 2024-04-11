export default function Spinner() {

    return (
        <div className="d-flex justify-content-center" style={{ gridRow: '2' }}>
            <div className="spinner-grow" role="status" style={{ height: '10em', width: '10em' }}>
                <span className="visually-hidden">Loading...</span>
            </div>
        </div >
    );
}