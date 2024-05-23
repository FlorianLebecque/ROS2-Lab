'use client';

import BasicDisplay from '@/components/topics/Display/basicDisplay/basicDisplay';

export default function ThreadHandleDisplay(props: { name: string }) {

    const { name } = props;

    return (
        <BasicDisplay name={name} list={true} />
    );
}
