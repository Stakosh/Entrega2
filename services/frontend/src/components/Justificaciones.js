import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Form, FormControl, FormGroup, Container, Row, Col, DropdownButton, Dropdown } from 'react-bootstrap';
import ImgFondo from '../img/foto-fondo2.jpg';

function Justificaciones() {
    const [fechaDesde, setFechaDesde] = useState('');
    const [fechaHasta, setFechaHasta] = useState('');
    const [razones, setRazones] = useState('');
    const [archivos, setArchivos] = useState([]);
    const [asignaturas, setAsignaturas] = useState([]);
    const [asignaturasSeleccionadas, setAsignaturasSeleccionadas] = useState([]);

    // Simulando obtener las asignaturas del estudiante desde el backend
    useEffect(() => {
        // Aquí debes hacer la solicitud HTTP para obtener las asignaturas del estudiante
        // Supongamos que obtienes las asignaturas como un array de objetos:
        const asignaturasFromBackend = [
            { id: 1, nombre: 'TICS311: ESTRUCTURAS DE DATOS Y ALGORITMOS' },
            { id: 2, nombre: 'TICS411: MINERÍA DE DATOS' },
            { id: 3, nombre: 'TICS420: PROGRAMACIÓN PROFESIONAL' },
            { id: 4, nombre: 'ING421: GESTIÓN DE OPERACIONES' },
            { id: 5, nombre: 'IND423: ORGANIZACIÓN INDUSTRIAL' },
            // ... otras asignaturas
        ];
        setAsignaturas(asignaturasFromBackend);
    }, []); // Vacío para que se ejecute solo una vez al cargar el componente

    const handleFechaDesdeChange = (e) => {
        setFechaDesde(e.target.value);
    };

    const handleFechaHastaChange = (e) => {
        setFechaHasta(e.target.value);
    };

    const handleRazonesChange = (e) => {
        setRazones(e.target.value);
    };

    const handleArchivoChange = (e) => {
        const files = e.target.files;
        setArchivos(files);
    };

    const handleAsignaturaSeleccionada = (asignatura) => {
        // Comprobamos si la asignatura ya está seleccionada
        if (!asignaturasSeleccionadas.some((asig) => asig.id === asignatura.id)) {
            setAsignaturasSeleccionadas([...asignaturasSeleccionadas, asignatura]);
        }
    };

    const handleSeleccionarTodas = () => {
        setAsignaturasSeleccionadas([...asignaturas]);
    };

    const handleQuitarAsignatura = (asignatura) => {
        const nuevasAsignaturas = asignaturasSeleccionadas.filter((asig) => asig.id !== asignatura.id);
        setAsignaturasSeleccionadas(nuevasAsignaturas);
    };

    const generarJustificacion = () => {
        // Log de nivel DEBUG
        console.debug('Generando justificación...');
        // Aquí puedes realizar cualquier acción con las fechas seleccionadas,
        // razones de ausencia y archivos adjuntos, así como las asignaturas seleccionadas.
        console.log('Fecha Desde:', fechaDesde);
        console.log('Fecha Hasta:', fechaHasta);
        console.log('Razones:', razones);
        console.log('Archivos:', archivos);
        console.log('Asignaturas Seleccionadas:', asignaturasSeleccionadas);

        // Log de nivel INFO
        console.info('Justificación generada con éxito.');

        // Log de nivel ERROR (simulado para demostración)
        console.error('Ha ocurrido un error al generar la justificación.');
    };

    return (
        <div
            style={{
                backgroundImage: `url(${ImgFondo})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center top',
                height: '100vh',
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Container>
                {/* Paso 1: Rango de fechas a justificar */}
            <Row style={{  marginTop: '100px'}}> 
                    <Col>
                        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <h3 style={{ color: '#38B6FF', fontSize: '1.5em' }}>PASO 1: </h3>
                            <h3 style={{ color: 'white', fontSize: '1.5em', marginLeft: '10px' }}>RANGO DE FECHAS A JUSTIFICAR:</h3>
                        </div>
                    </Col>
                </Row>
                <Row>
                    {/* Formulario para la selección de fechas */}
                    <Col>
                        <Form>
                            <Row>
                                <Col>
                                    <Form.Group controlId="fechaDesde">
                                        <Form.Label style={{ color: 'white' }}>Desde:</Form.Label>
                                        <Form.Control type="date" value={fechaDesde} onChange={handleFechaDesdeChange} />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId="fechaHasta">
                                        <Form.Label style={{ color: 'white' }}>Hasta:</Form.Label>
                                        <Form.Control type="date" value={fechaHasta} onChange={handleFechaHastaChange} />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Form>
                    </Col>
                </Row>

                {/* Paso 2: Indique la/s asignatura/s */}
                <Row style={{ marginBottom: '15px', marginTop: '15px' }}>
                    <Col>
                        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <h3 style={{ color: '#38B6FF', fontSize: '1.5em' }}>PASO 2: </h3>
                            <h3 style={{ color: 'white', fontSize: '1.5em', marginLeft: '10px' }}>INDIQUE LA/S ASIGNATURA/S:</h3>
                        </div>
                    </Col>
                </Row>
                <Row>
                    {/* Menú desplegable de asignaturas */}
                    <Col>
                        <DropdownButton id="dropdown-asignaturas" title="Seleccionar Asignatura">
                            <Dropdown.Item onClick={handleSeleccionarTodas}>Seleccionar Todas</Dropdown.Item>
                            {asignaturas.map((asignatura) => (
                                <Dropdown.Item key={asignatura.id} onClick={() => handleAsignaturaSeleccionada(asignatura)}>
                                    {asignatura.nombre}
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </Col>
                </Row>

                {/* Lista de asignaturas seleccionadas  */}
                <Row style={{ marginBottom: '30px' }}>
                    <Col>
                        {asignaturasSeleccionadas.length > 0 && (
                            <div style={{backgroundColor: 'rgba(255, 255, 255, 0.8)', padding: '10px', marginBottom: '10px' }}>
                                <h3 style={{ color: 'black', marginBottom: '5px', fontSize: '1.5em' }}>Asignaturas Seleccionadas:</h3>
                                {asignaturasSeleccionadas.map((asignatura) => (
                                    <span key={asignatura.id}>
                                        <Button variant="light" style={{ marginRight: '5px', marginBottom: '5px' }}>
                                            {asignatura.nombre}
                                        </Button>
                                        <Button variant="danger" size="sm" onClick={() => handleQuitarAsignatura(asignatura)}>Quitar</Button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </Col>
                </Row>

                {/* Paso 3: Coméntenos sus razones */}
                <Row style={{ marginBottom: '15px', marginTop: '15px'}}>
                    <Col>
                        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <h3 style={{ color: '#38B6FF', fontSize: '1.5em' }}>PASO 3: </h3>
                            <h3 style={{ color: 'white', fontSize: '1.5em', marginLeft: '10px' }}>COMÉNTENOS SUS RAZONES:</h3>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form>
                            <FormGroup controlId="razones">
                                <FormControl as="textarea" rows={5} maxLength={500} value={razones} onChange={handleRazonesChange} placeholder="Comente sus razones aquí (máximo 500 palabras)" />
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>

                {/* Paso 4: Adjunte sus Documentos */}
                <Row style={{ marginBottom: '15px', marginTop: '15px' }}>
                    <Col>
                        <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.7)', padding: '10px', marginBottom: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <h3 style={{ color: '#38B6FF', fontSize: '1.5em' }}>PASO 4: </h3>
                            <h3 style={{ color: 'white', fontSize: '1.5em', marginLeft: '10px'}}>ADJUNTE SUS DOCUMENTOS:</h3>
                        </div>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Form>
                            <FormGroup controlId="archivos">
                                <FormControl type="file" multiple onChange={handleArchivoChange} />
                            </FormGroup>
                        </Form>
                    </Col>
                </Row>

                {/* Botón para generar justificación */}
                <Row>
                    <Col style={{ textAlign: 'center', marginTop: '30px' }}>
                        <Button variant="primary" onClick={generarJustificacion}>Enviar</Button>
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Justificaciones;