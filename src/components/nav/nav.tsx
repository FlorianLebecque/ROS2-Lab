'use client';

import { usePathname } from 'next/navigation';
import style from './nav.module.css';
import Link from 'next/link'

export default function Nav() {

    const pathname = usePathname();
    const first = pathname.split("/")[1];

    return (
        <nav className="navbar navbar-light bg-light p-3 mb-3 shade">
            <Link className={first == "" ? style.active : ""} href="/">Home</Link>
            <Link className={first == "diagnostic" ? style.active : ""} href="/diagnostic">Nodes</Link>
            <Link className={first == "waypoint" ? style.active : ""} href="/">Waypoint</Link>
            <Link className={first == "about" ? style.active : ""} href="/about">About</Link>
        </nav>
    );
}