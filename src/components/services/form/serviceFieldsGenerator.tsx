import Spinner from '@/components/spinner/Spinner';
import { services_description } from '@/js/interfaces/iservices';
import { Suspense } from 'react';
import loadable from '@loadable/component';
import { ErrorBoundary } from "react-error-boundary";

function TypeTranslator(type: string): string {
    // convert all number primitive types to number
    const number_type = [
        "int",
        "int8",
        "int16",
        "int32",
        "int64",
        "uint",
        "uint8",
        "uint16",
        "uint32",
        "uint64",
        "flaot",
        "float16",
        "float32",
        "float64",
        "double",
        "byte",
        "char",
        "octet",
    ];

    const bool_type = [
        "bool",
        "boolean"
    ];

    if (number_type.includes(type)) {
        return "number";
    }

    if (bool_type.includes(type)) {
        return "bool";
    }

    return type;
}

const GetComponentPathForServiceType = (fieldtype: string): string | null => {
    const pathSegments = fieldtype.split('/'); // Split the serviceType into segments

    // Construct the component path by joining segments and adding ".tsx" extension
    let componentPath = `./types/${pathSegments.join('/')}`;
    if (pathSegments.length == 1) {
        componentPath = `./types/${pathSegments[0]}`;
    }

    return componentPath; // Return the resolved path for dynamic import

}

const GetFieldsFromTypeDef = (schema: services_description, current_typeDef: any, name: string, type: string) => {

    let fieldtype = TypeTranslator(current_typeDef.type);

    /**
     *  fieldtype : rcl_interfaces/DescribeParameters_Request
     * 
     *  component folder : /types/rcl_interfaces/DescribeParameters_Request.tsx
     * 
     *  Try to find a component in the types folder and subfolder based on the fieldtype
     */

    // const comp = "./types/string";
    const componentPath = GetComponentPathForServiceType(fieldtype);


    const DynamicComponent = loadable(() => import(`${componentPath}`), {
        fallback: <Spinner />, // Display the Spinner component while loading
    });
    const props = {
        name: name,
        type: type,
        schema: schema,
        current_typeDef: current_typeDef,
    };

    return (
        <ErrorBoundary
            fallback={
                <div>
                    <h1>Something went wrong!</h1>
                    <p>Component: {componentPath}</p>
                    <pre>
                        {JSON.stringify(props, null, 2)}
                    </pre>
                </div>
            }
        >
            <Suspense fallback={<Spinner />}>
                <DynamicComponent {...props} />
            </Suspense>
        </ErrorBoundary>
    );


}

export default GetFieldsFromTypeDef;