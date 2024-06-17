import { IServices } from "@/utils/interfaces/IServices";

const StringField = ({ fieldname, fieldtype, schema, handleChange }: { fieldname: string, fieldtype: string, schema: IServices, handleChange: any }) => {
    return (
        <div className="input-group mb-3" key={fieldname}>
            <span className="input-group-text">{fieldname}</span>
            <input
                className="form-control"
                autoComplete="off"
                type="text" // Convert string type to text input
                id={fieldname}
                name={fieldname}
                defaultValue={''} // Set initial value from state
                onChange={handleChange}
            />
        </div>
    );
}

export default StringField;