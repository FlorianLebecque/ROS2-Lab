import React, { useEffect, useRef, ReactNode } from "react";

interface ScrollContainerProps {
    children: ReactNode;
}

const ScrollContainer = ({ children }: ScrollContainerProps) => {
    const outerDiv = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Initial scroll to the bottom
        const scroll = () => {
            if (outerDiv.current) {
                const { scrollHeight, clientHeight } = outerDiv.current;
                outerDiv.current.scrollTo({
                    top: scrollHeight - clientHeight,
                    left: 0,
                    behavior: "auto"
                });
            }
        };

        scroll();
    }, []);

    useEffect(() => {
        // Scroll smoothly on change of children
        if (outerDiv.current) {
            const { scrollHeight, clientHeight } = outerDiv.current;
            outerDiv.current.scrollTo({
                top: scrollHeight - clientHeight,
                left: 0,
                behavior: "smooth"
            });
        }
    }, [children]);

    return (
        <div
            ref={outerDiv}
            style={{
                position: "relative",
                height: "100%",
                overflow: "auto",
                boxSizing: "border-box" // Ensure padding and borders are included in the height calculation
            }}
        >
            <div
                style={{
                    position: "relative",
                    boxSizing: "border-box" // Consistency in box-sizing
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default ScrollContainer;