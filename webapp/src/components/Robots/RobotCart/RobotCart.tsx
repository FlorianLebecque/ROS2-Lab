'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import Style from './RobotCart.module.css';

export default function RobotCart(props: { name: string }) {
    const { name } = props;

    return (
        <div className={"card shade " + Style.RobotCart} style={{ width: '18rem' }}>
            <Link href={"/" + name} className="">
                <img src={"https://api.dicebear.com/9.x/bottts-neutral/svg?seed=" + name} />
                <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                </div>
            </Link>
        </div>
    );
}