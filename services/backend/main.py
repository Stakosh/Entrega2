from datetime import datetime, timedelta
from flask_restx import Api, Resource, Namespace, fields
from flask import request, jsonify, Flask
from app2.config import DevelopmentConfig

from flask.cli import FlaskGroup
from flask_cors import CORS

from parse_courses import parse_courses_file, initialize_courses_and_careers, parse_schedules_file, initialize_schedules, create_students_from_credencial,assign_courses_to_students
from extensions import db
from models import *
#enroll_students_in_courses,
import bcrypt
import jwt
import os
import time

app = Flask(__name__)
app.config.from_object(DevelopmentConfig)

# Inicializa la extensión de base de datos
db.init_app(app)

# Configuración de CORS
CORS(app, resources={r"/api/*": {
    "origins": ["http://localhost:3000"],
    "methods": ["GET", "POST", "PATCH", "DELETE"],
    "allow_headers": ["Authorization", "Content-Type"],
    "supports_credentials": True,
    "max_age": 3600
}})


# Configuración de la API
api = Api(app, version="1.0", title="APIs", doc="/docs/")

# Namespace para operaciones relacionadas con alumnos
student_ns = Namespace('students', description='Operaciones relacionadas con alumnos')

# Modelo para creación y actualización de alumnos
student_model = student_ns.model('Student', {
    'rut': fields.String(required=True, description='RUT del estudiante'),  # Cambiado a rut
    'first_name': fields.String(required=True, description='Nombre del estudiante'),
    'last_name': fields.String(required=True, description='Apellido del estudiante'),
    'email': fields.String(required=True, description='Correo electrónico del estudiante'),
    'password': fields.String(required=True, description='Contraseña del estudiante'),
    'tipo_acceso': fields.String(required=True, description='Tipo de acceso (admin, profesor, alumno)'),
})

# Generación y verificación de tokens JWT
def generate_token(user_id):
    payload = {
        'exp': datetime.utcnow() + timedelta(days=1),
        'iat': datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(payload, app.config['SECRET_KEY'], algorithm='HS256')

def token_required(f):
    def decorator(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        if not token:
            return jsonify({"message": "Token is missing"}), 403
        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = CREDENCIAL.query.get(data['sub'])
        except:
            return jsonify({"message": "Token is invalid"}), 403
        return f(current_user, *args, **kwargs)
    decorator.__name__ = f.__name__
    return decorator





#################################################################### RUTAS USUARIO ####################################################################################
# para login de un alumno
@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return '', 200  # Responde exitosamente a las solicitudes OPTIONS para CORS

    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = CREDENCIAL.query.filter_by(email=email).first()

    if not user or not bcrypt.checkpw(password.encode('utf-8'), user.password.encode('utf-8')):
        return jsonify({"error": "Invalid credentials"}), 401

    token = generate_token(user.id)
    
    # Verificar si el usuario es un estudiante
    if user.tipo_acceso == 'alumno':
        student = Student.query.filter_by(credencial_id=user.id).first()
        student_data = {
            "id": student.id,
            "rut": student.rut,
            "first_name": student.first_name,
            "last_name": student.last_name,
            "carrera": student.carrera,
            "semestre_que_cursa": student.semestre_que_cursa
        }
    else:
        student_data = None

    return jsonify({"token": token, "message": "Login successful", "user": {"id": user.id, "email": user.email, "tipo_acceso": user.tipo_acceso}, "student_data": student_data}), 200





@app.route('/api/check-access', methods=['POST'])
def check_access():
    data = request.json
    email = data.get('email')
    user = CREDENCIAL.query.filter_by(email=email).first()
    if user:
        return jsonify({'access_type': user.tipo_acceso}), 200
    else:
        return jsonify({'error': 'User not found'}), 404





#para cambio de clave, primero se valide el usuario
@app.route('/api/validate-user', methods=['POST'])
def validate_user():
    data = request.get_json()
    name = data.get('name')
    rut = data.get('rut')

    user = CREDENCIAL.query.filter_by(first_name=name, rut=rut).first()
    if user:
        return jsonify({"message": "User validated successfully", "user_id": user.id}), 200
    else:
        return jsonify({"error": "Invalid name or RUT"}), 400









#cambio de clave luego de validacion
@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    user_id = data.get('user_id')
    new_password = data.get('newPassword')

    user = CREDENCIAL.query.get(user_id)
    if user:
        hashed_password = bcrypt.hashpw(new_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        user.password = hashed_password
        db.session.commit()
        return jsonify({"message": "Password reset successful"}), 200
    else:
        return jsonify({"error": "User not found"}), 400




# Endpoint para crear un nuevo alumno
@student_ns.route('/creacion-nuevo-alumno')
class CreateStudent(Resource):
    @student_ns.expect(student_model)
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        rut = data.get('rut')

        if not email or not password or not rut:
            return {"error": "Email, password, and RUT are required"}, 400

        if CREDENCIAL.query.filter_by(email=email).first():
            return {"error": "User already exists"}, 409

        if CREDENCIAL.query.filter_by(rut=rut).first():
            return {"error": "RUT already exists"}, 409

        if not self.validate_rut_format(rut):
            return {"error": "Invalid RUT format"}, 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        new_student = CREDENCIAL(
            rut=rut,
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            email=email,
            password=hashed_password,
            tipo_acceso=data.get('tipo_acceso')
        )
        db.session.add(new_student)
        db.session.commit()

        return {"message": "User registered successfully"}, 201

    def validate_rut_format(self, rut):
        import re
        return bool(re.match(r"^\d{1,3}(?:\.\d{3})*-[\dkK]$", rut))




# Resource para buscar un alumno
@student_ns.route('/buscar-alumno/<int:user_id>')
class SearchStudent(Resource):
    def get(self, user_id):
        student = CREDENCIAL.query.get(user_id)
        if not student:
            return {"message": "User not found"}, 400
        
        return {
            "rut": student.rut,
            "first_name": student.first_name,
            "last_name": student.last_name,
            "email": student.email,
            "tipo_acceso": student.tipo_acceso
        }, 200
    
#################################################################### FIN RUTAS USUARIO ####################################################################################




#################################################################### RUTAS CURSOS ####################################################################################

# Endpoint to enroll a student or professor in a course
@student_ns.route('/enroll')
class EnrollCourse(Resource):
    @token_required
    def post(self, current_user):
        if current_user.tipo_acceso != 'admin':
            return {"error": "Admin access required"}, 403

        data = request.get_json()
        rut = data.get('rut')
        course_id = data.get('course_id')

        if not rut or not course_id:
            return {"error": "RUT and Course ID are required"}, 400

        user = CREDENCIAL.query.filter_by(rut=rut).first()
        if not user or user.tipo_acceso == 'admin':
            return {"error": "User not found or invalid user type"}, 404

        course = Course.query.get(course_id)
        if not course:
            return {"error": "Course not found"}, 404

        enrollment = Enrollment(rut=rut, course_id=course_id)
        db.session.add(enrollment)
        db.session.commit()

        return {"message": "Enrolled in course successfully"}, 201



#################################################################### FIN RUTAS CURSOS ####################################################################################


 ########################## RUTAS JUSTIFICACIONES ##########################

# Ruta para obtener asignaturas del semestre actual del estudiante
@app.route('/api/estudiante/<int:student_id>/asignaturas', methods=['GET'])
def get_asignaturas_estudiante(student_id):
    # Obtener las asignaturas en las que está inscrito el estudiante
    asignaturas = db.session.query(Course).join(Enrollment).filter(
        Enrollment.student_id == student_id
    ).all()
    
    asignaturas_json = [asignatura.to_json() for asignatura in asignaturas]
    return jsonify(asignaturas_json)




# API Endpoint para justificar
@app.route('/api/justificacion', methods=['POST'])
def create_justificacion():
    data = request.form  # Cambiamos a request.form para manejar FormData
    student_id = data.get('student_id')
    fecha_desde = data.get('fechaDesde')
    fecha_hasta = data.get('fechaHasta')
    razones = data.get('razones')

    if not student_id or not fecha_desde or not fecha_hasta or not razones:
        return jsonify({'error': 'Missing required fields'}), 400

    try:
        fecha_desde = datetime.strptime(fecha_desde, '%Y-%m-%d').date()
        fecha_hasta = datetime.strptime(fecha_hasta, '%Y-%m-%d').date()
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400

    archivos = []
    for key in request.files:
        archivo = request.files[key]
        archivo.save(f"ruta/a/guardar/{archivo.filename}")
        archivos.append(archivo.filename)

    asignaturas_ids = [data.get(f'asignatura{index}') for index in range(len(data)) if data.get(f'asignatura{index}')]

    new_justificacion = Justificacion(
        student_id=student_id,
        fecha_desde=fecha_desde,
        fecha_hasta=fecha_hasta,
        razones=razones,
        archivos=",".join(archivos),
        asignaturas=",".join(asignaturas_ids)
    )

    db.session.add(new_justificacion)
    db.session.commit()

    return jsonify(new_justificacion.to_json()), 201




#################################################################### RUTAS ASISTENCIA ####################################################################################

# Namespace for Attendance
attendance_ns = Namespace('attendance', description='Attendance operations')

# Model for marking attendance
attendance_model = attendance_ns.model('Attendance', {
    'rut': fields.String(required=True, description='RUT of the student'),
    'course_id': fields.Integer(required=True, description='Course ID'),
    'date': fields.Date(required=True, description='Date of attendance'),
    'present': fields.Boolean(required=True, description='Presence status')
})






#################################################################### RUTAS ASISTENCIA ####################################################################################




# Creación de usuarios para testing, usuarios universales en CREDENCIALES
def initialize_default_users():
    if not CREDENCIAL.query.first():
        users = [
            {
                'rut': '207231827',
                'first_name': 'Javiera',
                'last_name': 'Soto',
                'email': 'javi@correo.cl',
                'password': 'queso',
                'tipo_acceso': 'alumno',
                'carrera': 'INFORMATICA'
            },
            {
                'rut': '196543210',
                'first_name': 'Ignacio',
                'last_name': 'Zuñiga',
                'email': 'nachito@correo.cl',
                'password': 'nachito',
                'tipo_acceso': 'alumno',
                'carrera': 'INDUSTRIAL'
            },
            {
                'rut': '181234567',
                'first_name': 'Constanza',
                'last_name': 'Contreras',
                'email': 'cony@correo.cl',
                'password': 'cony',
                'tipo_acceso': 'alumno',
                'carrera': 'ENERGIA'
            },
            {
                'rut': '1',
                'first_name': 'Admin',
                'last_name': 'Admin',
                'email': 'admin@correo.cl',
                'password': 'admin',
                'tipo_acceso': 'admin'
            },
            {
                'rut': '2',
                'first_name': 'Profesor',
                'last_name': 'Profesor',
                'email': 'profe@correo.cl',
                'password': 'profe',
                'tipo_acceso': 'profesor'
            }
        ]

        for user_data in users:
            hashed_password = bcrypt.hashpw(user_data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            user = CREDENCIAL(
                rut=user_data['rut'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                email=user_data['email'],
                password=hashed_password,
                tipo_acceso=user_data['tipo_acceso'],
                carrera=user_data.get('carrera')  # Añadir la carrera si está disponible
            )
            db.session.add(user)
            db.session.commit()




# Setup CORS
CORS(app)

# Create the database and tables if they don't exist
with app.app_context():
    time.sleep(10)  # Espera para asegurarse de que la base de datos esté lista
    db.create_all()
    print("se crearon modelos de la db")
    initialize_default_users()
    print("se crearon usuarios en CREDENCIAL")
    courses_data = parse_courses_file('/app/data/asignaturas.csv')
    initialize_courses_and_careers(courses_data)
    print("se crearon carreras")
    schedules_data = parse_schedules_file('/app/data/horarios.csv')
    initialize_schedules(schedules_data)
    print("se crearon horarios")
    create_students_from_credencial()
    assign_courses_to_students()
    #enroll_students_in_courses()

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')