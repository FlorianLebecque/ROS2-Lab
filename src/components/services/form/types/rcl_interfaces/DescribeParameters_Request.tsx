import { services_description } from "@/js/interfaces/iservices";

const ResquestForm = (schema: services_description, current_typeDef: any, handleChange: any) => {

    return (
        <pre>{JSON.stringify(schema)}</pre>
    );
}

export default ResquestForm;