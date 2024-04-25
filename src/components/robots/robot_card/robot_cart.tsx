'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function RobotCart(props: { name: string }) {
    const { name } = props;

    return (
        <div className="card shade" style={{ width: '18rem' }}>
            <div className="card-body">
                <h5 className="card-title">{name}</h5>
                <Link href={"/waypoint/" + name} className="btn btn-primary">Navigate</Link>
            </div>
        </div>
    );
}