import React, { useState } from 'react';
import { Container, InputGroup, FormControl, Button, Row, Col } from 'react-bootstrap';
import { QRCodeCanvas as QRCode } from 'qrcode.react';

const ObtenerQR = () => {
    const [inputText, setInputText] = useState('');
    const [qrValue, setQrValue] = useState('');

    const handleInputChange = (event) => {
        setInputText(event.target.value);
    };

    const generateQRCode = () => {
        setQrValue(inputText);
    };

    return (
        <Container className="mt-4">
            <Row className="justify-content-md-center">
                <Col xs={12} md={6}>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Ingrese texto o URL"
                            aria-label="Ingrese texto o URL"
                            aria-describedby="basic-addon2"
                            onChange={handleInputChange}
                            value={inputText}
                        />
                        <Button variant="outline-secondary" onClick={generateQRCode}>
                            Generar QR
                        </Button>
                    </InputGroup>
                </Col>
            </Row>
            <Row className="justify-content-md-center">
                <Col xs={12} md={6} className="text-center">
                    {qrValue && (
                        <QRCode value={qrValue} size={256} level={"H"} includeMargin={true} />
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default ObtenerQR;
