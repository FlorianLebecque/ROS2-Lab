'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';

import Style from './RobotCart.module.css';

export default function RobotCart(props: { name: string }) {
    const { name } = props;

    return (
        <div className={"card shade " + Style.RobotCart} style={{ width: '18rem' }}>
            <Link href={"/" + name}>
                <img src={`https://api.dicebear.com/9.x/bottts-neutral/svg?seed=${name}&eyes=eva,frame1,frame2,glow,robocop,round,roundFrame01,roundFrame02,sensor,shade01&mouth=bite,diagram,grill01,grill02,grill03,square01,square02`} />
                <div className="card-body">
                    <h5 className="card-title">{name}</h5>
                </div>
            </Link>
        </div>
    );
}