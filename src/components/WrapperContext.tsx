'use client';

import { RosWebProvider } from '@/components/RosContext';
import { Suspense } from 'react';
import Spinner from './spinner/Spinner';

export default function Wrapper(props: { children: any }) {
    const { children } = props;

    return (
        <RosWebProvider>
            <Suspense fallback={<Spinner />}>
                {children}
            </Suspense>
        </RosWebProvider>
    );
}