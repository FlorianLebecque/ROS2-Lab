'use client';

import React from 'react';

export default function BasicService(props: { name: string, type: string, details: any }) {

    const { name, type, details } = props;

    return (
        <div className="d-flex flex-column" style={{ height: "100%" }}>
            <h2>{name}</h2>
            <p>{type}</p>
            <pre>
                {JSON.stringify(details.request, null, 2)}
            </pre>
            <pre>
                {JSON.stringify(details.response, null, 2)}
            </pre>
        </div>
    );
}
