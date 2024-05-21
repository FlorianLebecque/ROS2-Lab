'use client';

import React from 'react';
import Chart from 'chart.js/auto';
import { useData } from '../../topicProvider/topicProvider';
import { useEffect, useRef } from 'react';

export default function DiodeTemp(props: { name: string }) {

    const { name } = props;
    const { data } = useData();

    /*

    */

    if (!data[data.length - 1]) return (<div>Waiting for data...</div>);
    // use chart.js to display the pulse data in a line chart with two lines for positive and negative pulses
    // use ref to get the canvas element

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart>();

    useEffect(() => {

        if (!data) return;

        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                if (chartRef.current) {

                    let temps = [];
                    let times = [];
                    for (let i = 0; i < data.length; i++) {
                        let temp = data[i].ros.data;    //"Temperatur: 771" -> 771
                        temp = temp.split(" ")[1];
                        temp = parseInt(temp);
                        temps.push(temp);

                        let time = data[i].time;
                        time = time.split(" ")[1];
                        times.push(time);
                    }

                    chartRef.current.data.labels = times;
                    chartRef.current.data.datasets[0].data = temps;

                    chartRef.current.update();
                    chartRef.current.resize();

                } else {

                    chartRef.current = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: Array.from({ length: 110 }, (_, i) => i.toString()),
                            datasets: [
                                {
                                    label: 'Diode Temp',
                                    data: [],
                                    borderColor: 'rgb(255, 99, 132)',
                                    tension: 0.1
                                }
                            ]
                        },
                        options: {
                            animation: false,
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'time'
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Temperature'
                                    },
                                    beginAtZero: true,
                                    max: 1000,
                                    min: -1000
                                }
                            },
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Temperature Data'
                                },
                                legend: {
                                    display: false,
                                }
                            }
                        }
                    });
                }

            }
        }

    }, [data]);

    return (
        <div>
            <canvas ref={canvasRef} />
        </div>
    );
}
