'use client';

import React from 'react';
import Chart from 'chart.js/auto';
import { useData } from '../../topicProvider/topicProvider';
import { useEffect, useRef } from 'react';

// return an 'rgb(rrr,ggg,bbb)' string based on the input string
const StringToRGB = (inputString: string) => {
    // Hash the input string with improved distribution
    let hash = 0;
    for (let i = 0; i < inputString.length; i++) {
        const charCode = inputString.charCodeAt(i);
        hash = (hash ^ charCode) * 19; // Bitwise XOR and multiplication for better distribution
    }

    // Extract red, green, and blue components with more variation
    const rgbValues = [
        Math.abs(hash % (256 * 1.3)) % 256, // Use modulo with a larger factor for wider range
        Math.abs((hash * 2) % (256 * 1.7)) % 256, // Multiply by 2 and use a larger factor
        Math.abs((hash * 3) % (256 * 2.3)) % 256 // Multiply by 3 and use a larger factor
    ];

    // Return RGB string
    return `rgb(${rgbValues.join(",")})`;
}


export default function BasicGraph(props: { name: string, dataset: string, title: string, min: number, max: number }) {

    const { name } = props;
    const { data } = useData();

    /*
        {
            "header": {
                "stamp": {
                    "sec": 1716464925,
                    "nanosec": 205498969
                },
                "frame_id": "imu_link"
            },
            "orientation": {
                "x": 0.009194226539437557,
                "y": -0.0006690249049031842,
                "z": 0.9390314762476476,
                "w": 0.3437075867946207
            },
            "orientation_covariance": [
                0.01,
                0,
                0,
                0,
                0.01,
                0,
                0,
                0,
                0.01
            ],
            "angular_velocity": {
                "x": 0.009440377354621887,
                "y": -0.0009491894161328673,
                "z": 0.0006035732221789658
            },
            "angular_velocity_covariance": [
                0.01,
                0,
                0,
                0,
                0.01,
                0,
                0,
                0,
                0.01
            ],
            "linear_acceleration": {
                "x": -0.08117734155196953,
                "y": -0.11251254612207806,
                "z": 9.816385942942707
            },
            "linear_acceleration_covariance": [
                0.01,
                0,
                0,
                0,
                0.01,
                0,
                0,
                0,
                0.01
            ]
        }
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

                    let times = [];

                    let datasets_data = new Map<string, number[]>();    // subkey, data
                    let last_data = data[data.length - 1].ros;
                    let objectKeys = Object.keys(last_data[props.dataset]);

                    for (let subkey of objectKeys) {
                        datasets_data.set(subkey, []);
                    }

                    // update the chart with the new data
                    for (let i = 0; i < data.length; i++) {
                        let ros = data[i].ros;

                        for (let subkey of objectKeys) {
                            let data = ros[props.dataset][subkey];
                            let subkeyData = datasets_data.get(subkey);
                            if (subkeyData) {
                                subkeyData.push(data);
                            }
                        }

                        times.push(ros.header.stamp.sec);
                    }

                    for (let dataset of chartRef.current.data.datasets) {
                        let subkey = dataset.label;
                        if (!subkey) continue;
                        let subkeyData = datasets_data.get(subkey);
                        if (subkeyData) {
                            dataset.data = subkeyData;
                        }
                    }

                    chartRef.current.data.labels = times;

                    chartRef.current.update();
                    chartRef.current.resize();

                } else {


                    let datasets: any[] = [];
                    let last_data = data[data.length - 1].ros;

                    let objectKeys = Object.keys(last_data[props.dataset]);

                    for (let i = 0; i < objectKeys.length; i++) {
                        let key = objectKeys[i];
                        let data = last_data[props.dataset][key];
                        let data_array = [data];
                        datasets.push({
                            label: key,
                            data: data_array,
                            borderColor: StringToRGB(key),
                            tension: 0.3
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
                                        text: 'time'
                                    }
                                },
                                y: {
                                    beginAtZero: true,
                                    max: props.max,
                                    min: props.min
                                }
                            },
                            plugins: {
                                title: {
                                    display: true,
                                    text: props.title
                                },
                                legend: {
                                    display: true,
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
