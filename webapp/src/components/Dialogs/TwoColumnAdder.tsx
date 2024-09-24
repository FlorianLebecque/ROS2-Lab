'use client';

import React, { useEffect, useState } from 'react';

import { useDashboard } from '../Dashboard/DashboardContext';
import IDynamicComponent from '@/utils/interfaces/iDynamicComponent';

export default function TwoColumnAdderDialog(props: { dialog_id: string, title: string, robot: string, allow_custom_element: boolean, elementGetter: () => Promise<string[]>, componentGetter: (element: string) => Promise<IDynamicComponent[]>, dynamicComponentParamsSetter: (element: string, params: any) => Promise<any> }) {

    const robot = props.robot;

    const [elements, setElements] = useState<string[]>([]);

    const [elementFilterInput, setElementFilterInput] = useState<string>(""); // Add this line

    const [activeComponentId, setActiveComponentId] = useState(null as string | null);
    const [possibleDynamicComponent, setPossibleDynamicComponent] = useState<IDynamicComponent[]>([]);

    const { layout, setLayout, boxes, setBoxes, nextBoxId, setNextBoxId } = useDashboard();

    useEffect(() => {

        const fetchElement = async () => {
            try {
                const temps_elements: string[] = await props.elementGetter();

                const temps_elements_robot = temps_elements.filter(element => element.startsWith("/" + robot));
                const temps_elements_robot_other = temps_elements.filter(element => !element.startsWith("/" + robot));

                const filtered_element_robot = temps_elements_robot.filter(element => element.includes(elementFilterInput));
                const filtered_element_other = temps_elements_robot_other.filter(element => element.includes(elementFilterInput));

                setElements([...filtered_element_robot, ...filtered_element_other]);

            } catch (error) {
                console.error("Error fetching element:", error);
            }
        };

        fetchElement();

        const interval = setInterval(() => {
            fetchElement();
        }, 2000);

        return () => { clearInterval(interval); }

    }, [robot, elementFilterInput]);

    useEffect(() => {
        // close dialog when clicking outside
        document.addEventListener('click', (e) => {
            const dialog = document.getElementById(props.dialog_id) as HTMLDialogElement;
            if (e.target == dialog) {
                dialog.close();
            }
        });

        return () => {
            // cleanup event listener
            document.removeEventListener('click', (e) => {
                const dialog = document.getElementById(props.dialog_id) as HTMLDialogElement;
                if (e.target == dialog) {
                    dialog.close();
                }
            });
        };
    }, []);

    const onElementFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setElementFilterInput(e.target.value);
    }

    const getElementClass = (element: string) => {
        return element.includes(robot) ? "btn btn-outline-success" : "btn btn-outline-secondary";
    }

    const getTextAlign = (element: string) => {
        return element.includes(robot) ? "left" : "right";
    }

    const handleCustomElement = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value !== "") {
            handleElementClick(e.target.value);
        }
    }

    const handleElementClick = async (element: string) => {
        SetActiveClass(element);
        setActiveComponentId(element);

        setPossibleDynamicComponent(await props.componentGetter(element));
    };

    const SetActiveClass = (id: string) => {

        let old_button = document.getElementById(props.dialog_id + activeComponentId!);
        let button = document.getElementById(props.dialog_id + id);

        if (old_button) {
            old_button.classList.remove("active");
        }

        if (button) {
            button.classList.add("active");
        }

    }

    const handleAddClick = async (e: any) => {

        // disable the button
        e.target.disabled = true;
        await AddVisualizers();
        e.target.disabled = false;

    }

    const AddVisualizers = async () => {

        if (!activeComponentId) {
            console.log("No element selected");
            return;
        };

        let element = activeComponentId;

        let visualizers = document.querySelectorAll('input[type="checkbox"]');
        let checkedVisualizers = Array.from(visualizers).filter(visualizer => (visualizer as HTMLInputElement).checked);

        let nextId = nextBoxId;
        let newLayout = layout;

        for (let i = 0; i < checkedVisualizers.length; i++) {
            let selectect_DComponent_id = (checkedVisualizers[i] as HTMLInputElement).id.replace(props.dialog_id, "");
            let dynamicComponentDefinition = possibleDynamicComponent.find(dynamicComponentDefinition => dynamicComponentDefinition.id == selectect_DComponent_id);

            if (dynamicComponentDefinition) {
                const visualizerBox = {
                    i: `box${nextId}`,
                    x: 0,
                    y: 0, // puts it at the bottom
                    w: 2,
                    h: 4,
                };

                if (dynamicComponentDefinition.params === undefined) {
                    dynamicComponentDefinition.params = {};
                }

                dynamicComponentDefinition.params = await props.dynamicComponentParamsSetter(element, dynamicComponentDefinition.params);

                if (dynamicComponentDefinition.params !== undefined && dynamicComponentDefinition.params.title !== undefined) {
                    element = dynamicComponentDefinition.params.title + " - " + element;
                }

                const newBoxContent = {
                    title: element,
                    contentDef: {
                        id: dynamicComponentDefinition.id,
                        path: dynamicComponentDefinition.path,
                        name: dynamicComponentDefinition.name,
                        description: dynamicComponentDefinition.description,
                        params: dynamicComponentDefinition.params
                    }
                };

                newLayout.push(visualizerBox);
                boxes.set(visualizerBox.i, newBoxContent);
                nextId++
            }
        }


        setBoxes(new Map(boxes));
        setLayout(newLayout);
        setNextBoxId(nextId); // Increment the ID for the next box

        const dialog = document.getElementById(props.dialog_id) as HTMLDialogElement;
        dialog.close();
    }

    return (
        <dialog id={props.dialog_id} className='border p-3 shade rounded'>
            <h1>{props.title}</h1>
            <div className='row mt-3'>

                <div className='col'>
                    <div className="form-floating mb-3">
                        <input autoComplete='off' onChange={onElementFilterChange} type="text" className="form-control" id="ElementFilter" placeholder="Type to filter elements" />
                        <label htmlFor="ElementFilter">Type to filter elements</label>
                    </div>
                    <div className='d-flex flex-column gap-1' style={{ maxHeight: "40dvh", overflow: "auto" }}>
                        {props.allow_custom_element &&
                            <>
                                <div className="form-floating mb-3">
                                    <input onChange={handleCustomElement} type="text" className="form-control" id="customElement" placeholder="Enter custom element" />
                                    <label htmlFor="customElement">Custom element</label>
                                </div>
                            </>
                        }

                        {elements.map(element => (
                            <button onClick={() => handleElementClick(element)} key={props.dialog_id + element} id={props.dialog_id + element} className={getElementClass(element)} style={{ textAlign: getTextAlign(element) }}>{element}</button>
                        ))}
                    </div>
                </div>

                <div className='col'>
                    <div className="form-floating mb-3">
                        <input readOnly={true} type="text" className="form-control" id="visualizerFilter" placeholder="Type to filter visualizer" />
                        <label htmlFor="visualizerFilter">Type to filter visualizer</label>
                    </div>
                    <div className='d-flex flex-column gap-1' style={{ maxHeight: "40dvh", overflow: "auto" }}>
                        {possibleDynamicComponent.map(visualizer => (
                            <div key={props.dialog_id + visualizer.id + "-container"}>
                                <input type="checkbox" className="btn-check" key={props.dialog_id + visualizer.id} id={props.dialog_id + visualizer.id} />
                                <label className="btn btn-outline-primary" style={{ width: "100%" }} htmlFor={props.dialog_id + visualizer.id}>{visualizer.name}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className='mt-3 d-flex flex-row-reverse'>
                <button onClick={handleAddClick} className='btn btn-primary' style={{ width: "5rem" }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-lg" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                    </svg>
                </button>
            </div>

        </dialog>
    );
}
