import { services_description } from '@/js/interfaces/iservices';
import React, { useState, useEffect, useRef } from 'react';
import GetFieldsFromTypeDef from './serviceFieldsGenerator';
import { useRosWeb } from '@/components/RosContext';


const RosDynamicForm = ({ schema, type, name }: { schema: services_description, type: string, name: string }) => {
    const [formElements, setFormElements] = useState<JSX.Element[] | any>([]); // State for generated form elements
    const [result, setResult] = useState<any>(null); // State for service call result
    const formRef = useRef(null);
    const rosWeb = useRosWeb();

    useEffect(() => {

        if (!schema || !schema.typedefs || !schema.typedefs.length) {
            console.warn('Invalid schema provided to DynamicForm');
            return;
        }

        const elements = GetFieldsFromTypeDef(schema, schema.typedefs[0], name, type);//generateFormElements(fieldnames, fieldtypes);

        setFormElements(elements || []); // Initialize with an empty array

        return () => {
            // Cleanup
            setResult(null);
        }

    }, [schema]); // Re-render on schema change

    const getFormDataFromId = (formId: string) => {
        // Ensure the form exists before accessing elements to avoid errors
        if (!formRef.current) {
            console.warn(`Form with ID "${formId}" not found.`);
            return {};
        }

        // Create an object to store form data
        // Ensure the form exists before accessing elements to avoid errors
        if (!formRef.current) {
            console.warn(`Form with ID "${formId}" not found.`);
            return {};
        }

        // Iterate through form elements using FormData API for better compatibility
        const formData: { [key: string]: any } = {}; // Add index signature to allow indexing with a string key

        // Iterate through form elements
        for (const element of formRef.current.elements) {
            if (element instanceof HTMLInputElement || element instanceof HTMLSelectElement) {
                const key = element.name;
                const dataType = element.dataset.type;

                // Handle data types based on attribute
                let value: any;
                switch (dataType) {
                    case 'number':
                        value = parseFloat(element.value);

                        if (isNaN(value)) {
                            console.warn(`Invalid uint32 value for field "${key}"`);
                            value = 0; // Or handle it differently (e.g., throw error)
                        }
                        break;
                    case 'string':
                        value = element.value;
                        break;
                    case 'bool':
                        if (element instanceof HTMLInputElement) {
                            value = element.checked;
                        } else {
                            console.warn(`Invalid element type for field "${key}"`);
                            value = false; // Or handle it differently (e.g., throw error)
                        }
                        break;
                    case 'double':
                        value = parseFloat(element.value);
                        if (isNaN(value)) {
                            console.warn(`Invalid double value for field "${key}"`);
                            value = 0.0; // Or handle it differently (e.g., throw error)
                        }
                        break;
                    default:
                        value = element.value;
                        console.warn(`Unknown data type "${dataType}" for field "${key}"`);
                }

                // Handle array-like names (e.g., "names[]")
                if (key.endsWith('[]')) {
                    const baseKey = key.slice(0, -2); // Remove "[]" from the key
                    formData[baseKey] = formData[baseKey] || []; // Initialize as array if not present
                    formData[baseKey].push(value);
                } else {
                    formData[key] = value;
                }
            }
        }

        return formData;
    }

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        const data = getFormDataFromId('myFormId'); // Replace with your actual form ID

        console.log('Form data:', data);

        let result = await rosWeb.CallService(name, type, data);

        console.log(result);

        setResult(result);

        // Send data for processing (e.g., API call, state update)
    };

    return (
        <div>
            <form ref={formRef} id="serviceForm" className='mt-3 mb-3' onSubmit={handleSubmit}>
                {formElements}
                <button className='btn btn-primary btn-lg' type="submit">Call</button>
            </form>
            <div>
                {result && <pre>{JSON.stringify(result, null, 2)}</pre> || null}
            </div>
        </div>
    );
};

export default RosDynamicForm;

/*
{
  "typedefs": [
    {
      "type": "rcl_interfaces/DescribeParameters_Request",
      "fieldnames": [
        "_names"
      ],
      "fieldtypes": [
        "string"
      ],
      "fieldarraylen": [
        0
      ],
      "examples": [
        "[]"
      ],
      "constnames": [
        "SLOT_TYPES",
        "names"
      ],
      "constvalues": [
        "(<rosidl_parser.definition.UnboundedSequence object at 0xffff9b2e0a00>,)",
        "[]"
      ]
    }
  ]
}




{
  "typedefs": [
    
    {
      "type": "rcl_interfaces/SetParameters_Request",
      "fieldnames": [
        "_parameters"
      ],
      "fieldtypes": [
        "rcl_interfaces/Parameter"
      ],
      "fieldarraylen": [
        0
      ],
      "examples": [
        "[]"
      ],
      "constnames": [
        "SLOT_TYPES",
        "parameters"
      ],
      "constvalues": [
        "(<rosidl_parser.definition.UnboundedSequence object at 0xffffb3ce35e0>,)",
        "[]"
      ]
    },

    {
      "type": "rcl_interfaces/Parameter",
      "fieldnames": [
        "_name",
        "_value"
      ],
      "fieldtypes": [
        "string",
        "rcl_interfaces/ParameterValue"
      ],
      "fieldarraylen": [
        -1,
        -1
      ],
      "examples": [
        "",
        "{}"
      ],
      "constnames": [
        "SLOT_TYPES",
        "name",
        "value"
      ],
      "constvalues": [
        "(<rosidl_parser.definition.UnboundedString object at 0xffffb55fec20>, <rosidl_parser.definition.NamespacedType object at 0xffffb5306260>)",
        "",
        "rcl_interfaces.msg.ParameterValue(type=0, bool_value=False, integer_value=0, double_value=0.0, string_value='', byte_array_value=[], bool_array_value=[], integer_array_value=[], double_array_value=[], string_array_value=[])"
      ]
    },

    {
      "type": "rcl_interfaces/ParameterValue",
      "fieldnames": [
        "_type",
        "_bool_value",
        "_integer_value",
        "_double_value",
        "_string_value",
        "_byte_array_value",
        "_bool_array_value",
        "_integer_array_value",
        "_double_array_value",
        "_string_array_value"
      ],
      "fieldtypes": [
        "uint8",
        "boolean",
        "int64",
        "double",
        "string",
        "octet",
        "boolean",
        "int64",
        "double",
        "string"
      ],
      "fieldarraylen": [
        -1,
        -1,
        -1,
        -1,
        -1,
        0,
        0,
        0,
        0,
        0
      ],
      "examples": [
        "0",
        "False",
        "0",
        "0.0",
        "",
        "[]",
        "[]",
        "[]",
        "[]",
        "[]"
      ],
      "constnames": [
        "SLOT_TYPES",
        "bool_array_value",
        "bool_value",
        "byte_array_value",
        "double_array_value",
        "double_value",
        "integer_array_value",
        "integer_value",
        "string_array_value",
        "string_value",
        "type"
      ],
      "constvalues": [
        "(<rosidl_parser.definition.BasicType object at 0xffffb5328bb0>, <rosidl_parser.definition.BasicType object at 0xffffb5328be0>, <rosidl_parser.definition.BasicType object at 0xffffb5328c10>, <rosidl_parser.definition.BasicType object at 0xffffb5328c40>, <rosidl_parser.definition.UnboundedString object at 0xffffb55fee60>, <rosidl_parser.definition.UnboundedSequence object at 0xffffb5328ca0>, <rosidl_parser.definition.UnboundedSequence object at 0xffffb5328d00>, <rosidl_parser.definition.UnboundedSequence object at 0xffffb5328d60>, <rosidl_parser.definition.UnboundedSequence object at 0xffffb5328dc0>, <rosidl_parser.definition.UnboundedSequence object at 0xffffb5328df0>)",
        "[]",
        "False",
        "[]",
        "array('d')",
        "0.0",
        "array('q')",
        "0",
        "[]",
        "",
        "0"
      ]
    }
  ]
}

*/