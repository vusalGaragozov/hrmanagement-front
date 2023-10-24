import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DropdownButton, Dropdown } from 'react-bootstrap';

/* global google */

const EBITDAChart = () => {
    const [selectedEntity, setSelectedEntity] = useState('');
    const [entities, setEntities] = useState([]);
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchEntities = async () => {
            const response = await fetch('http://localhost:3001/api/ebitda');
            const json = await response.json();
            const entitySet = new Set(json.map(item => item.Entity));
            setEntities(Array.from(entitySet));
        };

        fetchEntities();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetch(`http://localhost:3001/api/ebitda?entity=${selectedEntity}`);
            const json = await response.json();
            setData(json);
        };

        fetchData();
    }, [selectedEntity]);

    useEffect(() => {
        if (data && data.length > 0) {
            const chartData = [['Label', 'Planned', 'Actual']];
            data.forEach((item) => {
                if (item.Entity === selectedEntity) {
                    chartData.push([item.label, item.Planned, item.Actual]);
                }
            });

            const options = {
                title: '2023 8 months EBITDA variance',
                legend: { position: 'top' },
                vAxis: { title: 'Value' },
                hAxis: { title: 'Label' },
                seriesType: 'bars',
                series: { 0: { type: 'bars' }, 1: { type: 'bars' } },
                fontFamily: 'Blinker'
            };

            // Load Google Charts library and draw the chart
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(() => {
                const chart = new google.visualization.ComboChart(document.getElementById('ebitda-chart-1'));
                chart.draw(google.visualization.arrayToDataTable(chartData), options);
            });
        } else {
            // No entity selected
            const chartData = [['Label', 'Planned', 'Actual'], ['No entity selected', 0, 0]];
            const options = {
                title: '2023 8 months EBITDA variance',
                legend: { position: 'top' },
                vAxis: { title: 'Value' },
                hAxis: { title: 'Label' },
                seriesType: 'bars',
                series: { 0: { type: 'bars' }, 1: { type: 'bars' } },
                fontFamily: 'Blinker'
            };

            // Load Google Charts library and draw the chart
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(() => {
                const chart = new google.visualization.ComboChart(document.getElementById('ebitda-chart-1'));
                chart.draw(google.visualization.arrayToDataTable(chartData), options);
            });
        }
    }, [data, selectedEntity]);

    useEffect(() => {
        if (data && data.length > 0) {
            const chartData = [['Label', 'Planned', 'Actual']];
            data.forEach((item) => {
                if (item.Entity === selectedEntity) {
                    chartData.push([item.label, item.Planned, item.Actual]);
                }
            });

            const options = {
                title: '2023 8 months EBITDA variance',
                legend: { position: 'top' },
                vAxis: { title: 'Value' },
                hAxis: { title: 'Label' },
                seriesType: 'bars',
                series: { 0: { type: 'bars' }, 1: { type: 'bars' } },
                fontFamily: 'Blinker'
            };

            // Load Google Charts library and draw the chart
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(() => {
                const chart = new google.visualization.ComboChart(document.getElementById('ebitda-chart-2'));
                chart.draw(google.visualization.arrayToDataTable(chartData), options);
            });
        } else {
            // No entity selected
            const chartData = [['Label', 'Planned', 'Actual'], ['No entity selected', 0, 0]];
            const options = {
                title: '2023 8 months EBITDA variance',
                legend: { position: 'top' },
                vAxis: { title: 'Value' },
                hAxis: { title: 'Label' },
                seriesType: 'bars',
                series: { 0: { type: 'bars' }, 1: { type: 'bars' } },
                fontFamily: 'Blinker'
            };

            // Load Google Charts library and draw the chart
            google.charts.load('current', { packages: ['corechart'] });
            google.charts.setOnLoadCallback(() => {
                const chart = new google.visualization.ComboChart(document.getElementById('ebitda-chart-2'));
                chart.draw(google.visualization.arrayToDataTable(chartData), options);
            });
        }
    }, [data, selectedEntity]);

    const handleEntityChange = (event) => {
        setSelectedEntity(event.target.value);
    };

    return (
        <div className="row d-flex">
            <div className="col-12 bg-light rounded-top" style={{fontFamily: "Blinker"}}>
                <DropdownButton id="entity-select" title={selectedEntity || '--Select Entity--'} onSelect={setSelectedEntity}>
                    {entities.map(entity => (
                        <Dropdown.Item key={entity} eventKey={entity}>{entity}</Dropdown.Item>
                    ))}
                </DropdownButton>
            </div>
            <div className="col-md-6">
                <div className="row">
                    <div className="col-md-12 rounded" style={{border: "1px solid grey", margin: "10px 10px 10px 0"}}>
                        <div className="bg-white rounded-bottom" style={{height: "300px"}}>
                            <div id="ebitda-chart-1" style={{height: "100%"}} />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="row">
                    <div className="col-md-12 rounded" style={{border: "1px solid grey", margin: "10px 0 10px 10px"}}>
                        <div className="bg-white rounded-bottom" style={{height: "300px"}}>
                            <div id="ebitda-chart-2" style={{height: "100%"}} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EBITDAChart;
