'use client';

import { usePathname } from 'next/navigation';
import style from './Nav.module.css';
import Link from 'next/link'
import { useEffect } from 'react';
import { useSettings } from '@/utils/SettingsProvider';
import SettingsDialog from './Dialogs/SettingsDialog';
import { useNavButtons, IButton } from './NavButtonsProvider';

export default function Nav() {

    const pathname = usePathname();
    const first = pathname.split("/")[1];

    const { buttons } = useNavButtons();

    // Ensure buttons have a defined priority
    const sortedButtons = buttons ? (
        Array.from(buttons.values()).sort((a: IButton, b: IButton) => {
            return a.priority - b.priority;
        })
    ) : [];

    return (
        <div>
            <SettingsDialog />
            <nav className="navbar navbar-light bg-light p-3 mb-3 shade">
                <Link className={first == "" ? style.active : ""} href="/">Home</Link>

                <div className='d-flex gap-3'>
                    {sortedButtons.map((button, index) => (
                        <div key={index}>
                            {button.button}
                        </div>
                    ))}
                </div>
            </nav>
        </div>
    );
}