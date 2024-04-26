import { useRosWeb } from "@/components/RosContext";
import Spinner from "@/components/spinner/Spinner";
import { Suspense, useEffect, useState } from "react";

const ResquestForm = (props: any) => {
    const { schema, current_typeDef, name, type } = props;
    const rosWeb = useRosWeb();

    const [result, setResult] = useState<any>(null); // State for service call result

    useEffect(() => {

        const service_array = name.split('/');
        const service_get_parameters = service_array.slice(0, service_array.length - 1).join('/') + '/list_parameters';

        const GetParameterList = async () => {
            const current_result = await rosWeb.CallService(service_get_parameters, "rcl_interfaces/srv/DescribeParameters", {});

            setResult(current_result);
        }

        GetParameterList();

        return () => {
            // Cleanup
            setResult(null);
        }

    }, [schema]); // Re-render on schema change

    const AddElements = (event: any) => {
        if (event) {
            event.preventDefault();
        }

        let div_container = document.getElementById('container');

        let div = document.createElement('div');
        let id = document.getElementsByTagName('div').length.toString();
        div.id = id;
        div.className = 'input-group mb-3';

        let button = document.createElement('button');
        button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16"><path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8"/></svg >';
        button.className = 'btn btn-danger';
        button.onclick = () => RemoveElement(id);

        let label = document.createElement('span');
        label.innerHTML = 'Name';
        label.className = 'input-group-text';

        let input = document.createElement('input');
        input.type = 'text';
        input.name = 'names[]';
        input.className = 'form-control';
        input.autocomplete = 'off';
        input.placeholder = "Type to search...";
        input.setAttribute("list", "datalistOptions");

        div.appendChild(button);
        div.appendChild(label);
        div.appendChild(input);

        div_container?.appendChild(div);
    }

    const RemoveElement = (id: string) => {
        let div = document.getElementById(id);

        if (div) {
            div.remove();
        }
    }

    return (
        <Suspense fallback={<Spinner />}>
            <datalist id="datalistOptions">
                {result && result.result.names.map((element: any, index: number) => {
                    return <option key={index} value={element} />
                })}
            </datalist>

            <button className="btn btn-success mb-3" onClick={AddElements}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
            </button>
            <div id="container">
                <div id="0" className="input-group mb-3">
                    <button className="btn btn-danger" onClick={() => RemoveElement("0")}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-dash" viewBox="0 0 16 16"><path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" /></svg >
                    </button>
                    <span className="input-group-text">Name</span>
                    <input placeholder="Type to search..." list="datalistOptions" type="text" name="names[]" className="form-control" autoComplete="off" />
                </div>
            </div>
        </Suspense>
    );
}

export default ResquestForm;

/*
{"schema":{"typedefs":[{"type":"rcl_interfaces/DescribeParameters_Request","fieldnames":["_names"],"fieldtypes":["string"],"fieldarraylen":[0],"examples":["[]"],"constnames":["SLOT_TYPES","names"],"constvalues":["(<rosidl_parser.definition.UnboundedSequence object at 0xffff8eba0a00>,)","[]"]}]},"current_typeDef":{"type":"rcl_interfaces/DescribeParameters_Request","fieldnames":["_names"],"fieldtypes":["string"],"fieldarraylen":[0],"examples":["[]"],"constnames":["SLOT_TYPES","names"],"constvalues":["(<rosidl_parser.definition.UnboundedSequence object at 0xffff8eba0a00>,)","[]"]}}
*/