'use client';

import React from 'react';
import Chart from 'chart.js/auto';
import { useData } from '../../topicProvider/topicProvider';
import { useEffect, useRef } from 'react';

export default function PulseRaw(props: { name: string }) {

    const { name } = props;
    const { data } = useData();

    /*
        data = [
            pulses[
                neg[],  //int
                pos[],  //int
            ]
        ]
    */

    if (!data[data.length - 1]) return (<div>Waiting for data...</div>);
    const current_pulse = data[data.length - 1].ros.pulses;

    if (!current_pulse) return (<div>Waiting for data...</div>);
    if (!current_pulse[0]) return (<div>Waiting for data...</div>);

    // use chart.js to display the pulse data in a line chart with two lines for positive and negative pulses
    // use ref to get the canvas element

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const chartRef = useRef<Chart>();

    useEffect(() => {

        if (!current_pulse) return;

        if (canvasRef.current) {
            const ctx = canvasRef.current.getContext('2d');
            if (ctx) {
                if (chartRef.current) {

                    for (let i = 0; i < current_pulse.length; i++) {
                        chartRef.current.data.datasets[i * 2].data = current_pulse[i].neg;
                        chartRef.current.data.datasets[i * 2 + 1].data = current_pulse[i].pos;
                    }

                    chartRef.current.update();
                    chartRef.current.resize();

                } else {


                    const datasets = [];
                    for (let i = 0; i < current_pulse.length; i++) {

                        // generate color base on the number of pulses
                        //   neg -> blue gradient from light to dark
                        //   pos -> red gradient from light to dark

                        let neg_color = 75 + (i * 50) % 192;
                        let pos_color = 192 - (i * 50) % 192;

                        let neg_rgb = 'rgb(75, 192, ' + neg_color.toString() + ')';
                        let pos_rgb = 'rgb(192, 75, ' + pos_color.toString() + ')';

                        datasets.push({
                            label: 'Negative Pulse' + i.toString(),
                            data: current_pulse[i].neg,
                            fill: false,
                            borderColor: neg_rgb,
                            tension: 0
                        });

                        datasets.push({
                            label: 'Positive Pulse' + i.toString(),
                            data: current_pulse[i].pos,
                            fill: false,
                            borderColor: pos_rgb,
                            tension: 0
                        });
                    }

                    chartRef.current = new Chart(ctx, {
                        type: 'line',
                        data: {
                            labels: Array.from({ length: 110 }, (_, i) => i.toString()),
                            datasets: datasets
                        },
                        options: {
                            animation: false,
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'index'
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Intensity'
                                    },
                                    beginAtZero: true,
                                    max: 40000,
                                    min: -40000
                                }
                            },
                            plugins: {
                                title: {
                                    display: true,
                                    text: 'Pulse Raw Data'
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

    }, [current_pulse]);

    return (
        <div>
            <canvas ref={canvasRef} />
        </div>
    );
}
