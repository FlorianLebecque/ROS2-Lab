import { services_description } from "@/utils/interfaces/iservices";

const ResquestForm = (props: any) => {
    const { schema, current_typeDef } = props;

    const AddElements = (event: any) => {
        event.preventDefault();

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
        label.innerHTML = 'Prefixe';
        label.className = 'input-group-text';

        let input = document.createElement('input');
        input.type = 'text';
        input.name = 'prefixes[]';
        input.className = 'form-control';
        input.autocomplete = 'off';

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
        <div>
            <div className="input-group mb-3">
                <span className="input-group-text">Depth</span>
                <input type="number" data-type="number" defaultValue={1} className="form-control" name="depth" autoComplete="off" />
            </div>
            <button className="btn btn-success mb-3" onClick={AddElements}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                </svg>
            </button>
            <div id="container">

            </div>
        </div>
    );
}

export default ResquestForm;

/*
{"schema":{"typedefs":[{"type":"rcl_interfaces/DescribeParameters_Request","fieldnames":["_names"],"fieldtypes":["string"],"fieldarraylen":[0],"examples":["[]"],"constnames":["SLOT_TYPES","names"],"constvalues":["(<rosidl_parser.definition.UnboundedSequence object at 0xffff8eba0a00>,)","[]"]}]},"current_typeDef":{"type":"rcl_interfaces/DescribeParameters_Request","fieldnames":["_names"],"fieldtypes":["string"],"fieldarraylen":[0],"examples":["[]"],"constnames":["SLOT_TYPES","names"],"constvalues":["(<rosidl_parser.definition.UnboundedSequence object at 0xffff8eba0a00>,)","[]"]}}
*/