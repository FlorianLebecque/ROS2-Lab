
"use client";
//import loadable from '@loadable/component';
import { Suspense } from 'react';
import { ErrorBoundary } from "react-error-boundary";
import Spinner from '@/components/spinner/Spinner';
import IDynamicComponent from '@/js/interfaces/iDynamicComponent';
import dynamic from 'next/dynamic';

const DynamicFactory = (dynamicComponent?: IDynamicComponent) => {


    if (!dynamicComponent) return (<div>Dynamic component not found</div>);

    const dynamicComponentPath = dynamicComponent.path;
    //const dynamicComponentPath = "./interfaces/test";


    const VisualizerComponent = dynamic(() => import(`${dynamicComponentPath}`), {
        loading: () => <Spinner />,
    });

    //const VisualizerComponent = loadable(() => import(`${dynamicComponentPath}`));

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
            <Suspense fallback={<Spinner />}>
                <VisualizerComponent {...dynamicComponent.params} />
            </Suspense>
        </ErrorBoundary>
    );

}

export default DynamicFactory;