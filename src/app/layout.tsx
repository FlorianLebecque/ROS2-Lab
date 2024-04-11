import 'bootstrap/dist/css/bootstrap.css'
import "./globals.css";

import type { Metadata } from "next";

import Nav from '../components/nav/nav';
import Status from "../components/status/status";
import Wrapper from '@/components/WrapperContext';

export const metadata: Metadata = {
    title: "SummitXL Labs",
    description: "...",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
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
