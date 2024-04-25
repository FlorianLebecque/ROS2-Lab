import { services_description } from '@/js/interfaces/iservices';
import React, { useState, useEffect } from 'react';
import GetFieldsFromTypeDef from './serviceFieldsGenerator';


const RosDynamicForm = ({ schema }: { schema: services_description }) => {
    const [formData, setFormData] = useState({}); // State for form data
    const [formElements, setFormElements] = useState<JSX.Element[] | any>([]); // State for generated form elements

    useEffect(() => {

        if (!schema || !schema.typedefs || !schema.typedefs.length) {
            console.warn('Invalid schema provided to DynamicForm');
            return;
        }

        const elements = GetFieldsFromTypeDef(schema, schema.typedefs[0], handleChange);//generateFormElements(fieldnames, fieldtypes);

        setFormData([]);
        setFormElements(elements || []); // Initialize with an empty array

    }, [schema]); // Re-render on schema change

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        console.log('Form data:', formData);
    };


    return (
        <form className='mt-3' onSubmit={handleSubmit}>
            {formElements}
            <button className='btn btn-primary' type="submit">Call</button>
        </form>
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