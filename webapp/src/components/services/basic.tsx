'use client';

import React from 'react';

import RosDynamicForm from './form/serviceFormGenerator';

export default function BasicService(props: { name: string, type: string, details: any }) {

    const { name, type, details } = props;

    return (
        <div className="d-flex flex-column" style={{ height: "100%" }}>
            <h2>{name}</h2>
            <p>{type}</p>
            <div>
                <RosDynamicForm name={name} type={type} schema={details.request} />
            </div>
        </div>
    );
}
