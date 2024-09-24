import 'bootstrap/dist/css/bootstrap.css'
import "./globals.css";

import type { Metadata } from "next";

import Nav from '../components/Nav/Nav';
import Status from "../components/Utils/Status/Status";
import Wrapper from '@/components/WrapperContext';

export const metadata: Metadata = {
    title: "ROS2 Labs",
    description: "...",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <link rel="icon" href="/favicon.svg" />
            </head>
            <body>
                <Wrapper>
                    <Nav />
                    {children}
                    <Status />
                </Wrapper>
            </body>
        </html>
    );
}
