import React, {useEffect, useState} from 'react';
import Plot from 'react-plotly.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Col, Form, Button} from 'react-bootstrap';

const App = () => {

    const [n, setN] = useState(2)
    const [a, setA] = useState(0.003)
    const [d, setD] = useState(0.008)
    const [lambda, setLambda] = useState(1000)
    const [phi, setPhi] = useState(0.001)

    const [i, setI] = useState()
    const [x, setX] = useState()


    const handleNChange = (e) => {
        setN(parseFloat(e.target.value))
    }

    const handleDChange = (e) => {
        setD(parseFloat(e.target.value))
    }

    const handleAChange = (e) => {
        setA(parseFloat(e.target.value))
    }

    const handleLambdaChange = (e) => {
        setLambda(parseFloat(e.target.value))
    }

    const handlePhiChange = (e) => {
        setPhi(parseFloat(e.target.value))
    }

    const checkForms = () => {
        if (lambda === '') {
            alert('Введите длину волны')
            return false
        }
        if (n === '') {
            alert('Введите количество щелей')
            return false
        }
        if (a === '') {
            alert('Введите размер щели')
            return false
        }
        if (d === '') {
            alert('Введите период решетки')
            return false
        }
        if (phi === '') {
            alert('Введите границы угла дифракции')
            return false
        }

        if (lambda <= 0) {
            alert('Длина волны должна быть > 0')
            return false
        }
        if (n <= 0 || !Number.isInteger(n)) {
            alert('Количество щелей должно быть > 0 и целым числом')
            return false
        }
        if (a <= 0) {
            alert('Размер щели должен быть > 0')
            return false
        }
        if (d <= 0 || d < a) {
            alert('Период решетки должен быть > 0 и не меньше размера щели')
            return false
        }
        if (phi <= 0) {
            alert('Границы угла дифракции должны быть > 0')
            return false
        }

        return true
    }

    const handlePlotUpdate = () => {
        if (!checkForms()) {
            return
        }

        const step = phi * 2 / 1000

        const newX = Array.from(
            {length: 1000},
            (_, index) => index * step - phi
        )

        const newI = newX.map(phii =>
            Math.pow(Math.sin(Math.PI * a * Math.sin(phii) / (lambda * Math.pow(10, -9))), 2) *
            Math.pow(Math.sin(n * Math.PI * d * Math.sin(phii) / (lambda * Math.pow(10, -9))), 2) /
            Math.pow(Math.PI * a * Math.sin(phii) / (lambda * Math.pow(10, -9)), 2) /
            Math.pow(Math.sin(Math.PI * d * Math.sin(phii) / (lambda * Math.pow(10, -9))), 2)
        )

        setX(newX)
        setI(newI)
    }

    useEffect(() => {
        handlePlotUpdate()
    }, [])

    return (
        <div className={"container-fluid"}>
            <h1>Визуализация дифракционной картины от решетки.</h1>
            <Row>
                <Col xs={12} md={3}>
                    <Form>
                        <div style={{marginBottom: '10px', marginTop: '70px'}}>
                            <Form.Group controlId="lambda">
                                <Form.Label>Длина волны, λ (нм)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={lambda}
                                    onChange={handleLambdaChange}
                                />
                            </Form.Group>
                        </div>
                        <div style={{marginBottom: '10px'}}>
                            <Form.Group controlId="n">
                                <Form.Label>Количество щелей, N</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={n}
                                    onChange={handleNChange}
                                />
                            </Form.Group>
                        </div>
                        <div style={{marginBottom: '10px'}}>
                            <Form.Group controlId="a">
                                <Form.Label>Размер щели, a (м)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={a}
                                    onChange={handleAChange}
                                />
                            </Form.Group>
                        </div>
                        <div style={{marginBottom: '10px'}}>
                            <Form.Group controlId="d">
                                <Form.Label>Период решетки, d (м)</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={d}
                                    onChange={handleDChange}
                                />
                            </Form.Group>
                        </div>
                        <div style={{marginBottom: '10px'}}>
                            <Form.Group controlId="phi">
                                <Form.Label>Границы угла дифракции, φ</Form.Label>
                                <Form.Control
                                    type="number"
                                    value={phi}
                                    onChange={handlePhiChange}
                                />
                            </Form.Group>
                        </div>
                        <div>
                            <Button variant="primary" onClick={handlePlotUpdate}>Построить</Button>
                        </div>
                    </Form>
                </Col>
                <Col xs={12} md={9}>
                    <Plot
                        data={[
                            {
                                x: x,
                                y: i,
                                type: 'scatter',
                                mode: 'lines',
                                name: '',
                                line: {color: 'orange'}
                            }
                        ]}
                        layout={{
                            width: '1200',
                            height: '600',
                            xaxis: {title: 'Угол дифракции, рад'},
                            yaxis: {title: 'Интенсивность, Вт/м²'},
                        }}
                    />
                </Col>
            </Row>
        </div>
    )
}

export default App