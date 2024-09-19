
import React from 'react';
import Chart from 'chart.js/auto';

import { useEffect, useRef } from 'react';

import { useData } from '@/components/Topics/multiTopicProvider';


export default function MultiGraph(props: { topics: Map<string, string>, colors: Map<string, string> }) {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart>();

    const { data } = useData();

    const createChart = () => {

        if (canvasRef.current == null) {
            return;
        }

        const ctx = canvasRef.current.getContext('2d');
        if (ctx == null) {
            return;
        }

        const labels = Array.from(data.keys());
        const datasets = Array.from(data.values()).map((data, index) => {
            return {
                label: labels[index],
                data: data.map((item) => {
                    return {
                        x: item.time,
                        y: item.ros.data,
                    };
                }) as { x: number; y: any }[],
                borderColor: props.colors.get(labels[index]),
                fill: false,
                tension: 0.3
            };
        });


        // create a new chart
        chartRef.current = new Chart(ctx, {
            type: 'line',
            data: {
                datasets: datasets,
            },
            options: {
                animation: false,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                    },
                },
            },
        });


    }

    const updateChart = () => {
        if (chartRef.current == null) {
            return;
        }

        const newData = Array.from(data.values());

        chartRef.current.data.datasets.forEach((dataset, index) => {
            dataset.data = newData[index].map((item) => {
                return {
                    x: item.time,
                    y: item.ros.data,
                };
            }) as { x: number; y: any }[];
        });

        chartRef.current.update();

    }

    useEffect(() => {

        // check if data (Map) is empty
        if (data.size !== props.topics.size) {
            return;
        }


        if (canvasRef.current == null) {
            return;
        }


        if (chartRef.current == null) {
            createChart();
        }

        updateChart();



    }, [data]);


    return (
        <canvas ref={canvasRef} />
    );
}
