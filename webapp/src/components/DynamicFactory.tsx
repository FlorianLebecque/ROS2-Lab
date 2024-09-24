
"use client";
//import loadable from '@loadable/component';
import { Suspense } from 'react';
import { ErrorBoundary } from "react-error-boundary";
import Spinner from '@/components/Utils/Spinner/Spinner';
import IDynamicComponent from '@/utils/interfaces/IDynamicComponent';
import dynamic from 'next/dynamic';

const DynamicFactory = (dynamicComponent?: IDynamicComponent) => {


    if (!dynamicComponent) return (<div>Dynamic component not found</div>);

    const dynamicComponentPath = dynamicComponent.path;
    //const dynamicComponentPath = "./interfaces/test";


    const VisualizerComponent = dynamic(() => import(`${dynamicComponentPath}`), { ssr: false });

    return (
        <ErrorBoundary
            fallback={
                <div>
                    <h1>Something went wrong!</h1>
                    <p>Component: {dynamicComponentPath}</p>
                    <pre>
                        {JSON.stringify(dynamicComponent, null, 2)}
                    </pre>
                </div>
            }
        >

            <VisualizerComponent {...dynamicComponent.params} />
        </ErrorBoundary>
    );

}

export default DynamicFactory;