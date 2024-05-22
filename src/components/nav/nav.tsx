'use client';

import { usePathname } from 'next/navigation';
import style from './nav.module.css';
import Link from 'next/link'
import { useEffect } from 'react';

export default function Nav() {

    const pathname = usePathname();
    const first = pathname.split("/")[1];


    const ToggleDialog = () => {
        const dialog = document.getElementById('settings-dialog') as HTMLDialogElement;
        dialog.showModal();
    }

    useEffect(() => {
        // close dialog when clicking outside
        document.addEventListener('click', (e) => {
            const dialog = document.getElementById('settings-dialog') as HTMLDialogElement;
            if (e.target == dialog) {
                dialog.close();
            }
        });

        return () => {
            // cleanup event listener
            document.removeEventListener('click', (e) => {
                const dialog = document.getElementById('settings-dialog') as HTMLDialogElement;
                if (e.target == dialog) {
                    dialog.close();
                }
            });
        };
    }, []);

    return (
        <div>
            <nav className="navbar navbar-light bg-light p-3 mb-3 shade">
                <Link className={first == "" ? style.active : ""} href="/">Home</Link>
                <button className='btn btn-outline-primary' onClick={ToggleDialog} >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-sliders" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z" />
                    </svg>
                </button>
            </nav>
            <dialog className='border p-3 shade rounded' id="settings-dialog">
                <h1>Settings</h1>
                <div>
                    <div className='input-group mb-3'>
                        <button className='btn btn-outline-primary' >Export to JSON</button>
                    </div>

                    <div className="input-group mb-3">
                        <label className="input-group-text">Import</label>
                        <input type="file" className="form-control" id="inputGroupFile01" />
                    </div>
                </div>
            </dialog>
        </div>

    );
}