'use client';

import { RosWebProvider } from '@/components/RosContext';
import { Suspense } from 'react';
import Spinner from './Utils/Spinner/Spinner';
import { SettingsProvider } from '@/utils/SettingsProvider';

export default function Wrapper(props: { children: any }) {
    const { children } = props;

    return (
        <SettingsProvider>
            <RosWebProvider>
                <Suspense fallback={<Spinner />}>
                    {children}
                </Suspense>
            </RosWebProvider>
        </SettingsProvider>
    );
}