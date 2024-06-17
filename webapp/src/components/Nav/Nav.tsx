'use client';

import { usePathname } from 'next/navigation';
import style from './Nav.module.css';
import Link from 'next/link'
import { useEffect } from 'react';
import { useSettings } from '@/utils/SettingsProvider';
import SettingsDialog from './Dialogs/SettingsDialog';
import { useNavButtons } from './NavButtonsProvider';

export default function Nav() {

    const pathname = usePathname();
    const first = pathname.split("/")[1];

    const { buttons } = useNavButtons();



    return (
        <div>
            <nav className="navbar navbar-light bg-light p-3 mb-3 shade">
                <Link className={first == "" ? style.active : ""} href="/">Home</Link>

                {buttons && buttons.map((button, index) => {
                    return (
                        <div key={index} className={style.navButton}>
                            {button}
                        </div>
                    );
                })}

            </nav>

            <SettingsDialog />
        </div>

    );
}