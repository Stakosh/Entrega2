from datetime import datetime, timedelta
from flask_restx import Api, Resource, Namespace, fields
from flask import request, jsonify, Flask
from werkzeug.utils import secure_filename
from app2.config import DevelopmentConfig

from flask_jwt_extended import  jwt_required
from flask.cli import FlaskGroup
from flask_cors import CORS

from parse_courses import parse_courses_file, initialize_courses_and_careers, parse_schedules_file, initialize_schedules, create_students_from_credencial,assign_courses_to_students, initialize_default_users
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


# Configuración de la carpeta de subida de archivos (justificaciones)
UPLOAD_FOLDER = os.getenv('UPLOAD_FOLDER', 'uploads')  # Obtener de la variable de entorno o usar 'uploads' por defecto
os.makedirs(UPLOAD_FOLDER, exist_ok=True)  # Crear la carpeta si no existe
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER  # Configurar la carpeta de subidas en Flask



# Configuración de la API
api = Api(app, version="1.0", title="APIs", doc="/docs/")


# Setup CORS
CORS(app)


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



##### Generación y verificación de tokens JWT ####
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

######################## RUTAS USUARIO (generales) ####################################################################################

# API Endpoint para ruta para login 
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
    
    # Datos del estudiante
    student_data = None
    if user.tipo_acceso == 'alumno':
        student = Student.query.filter_by(credencial_id=user.id).first()
        if student:
            student_data = {
                "id": student.id,
                "rut": student.rut,
                "first_name": student.first_name,
                "last_name": student.last_name,
                "carrera": student.carrera,
                "semestre_que_cursa": student.semestre_que_cursa
            }

    # Datos del profesor
    teacher_data = None
    if user.tipo_acceso == 'profesor':
        teacher = Teacher.query.filter_by(credencial_id=user.id).first()
        if teacher:
            teacher_data = {
                "id": teacher.id,
                "rut": teacher.rut,
                "first_name": teacher.first_name,
                "last_name": teacher.last_name
            }

    # Datos del administrador
    admin_data = None
    if user.tipo_acceso == 'admin':
        admin = Admin.query.filter_by(credencial_id=user.id).first()
        if admin:
            admin_data = {
                "id": admin.id,
                "rut": admin.rut,
                "first_name": admin.first_name,
                "last_name": admin.last_name
            }

    return jsonify({
        "token": token,
        "message": "Login successful",
        "user": {
            "id": user.id,
            "email": user.email,
            "name": user.first_name,
            "tipo_acceso": user.tipo_acceso
        },
        "student_data": student_data,
        "teacher_data": teacher_data,
        "admin_data": admin_data
    }), 200



# API Endpointcheck para tipo de acceso
@app.route('/api/check-access', methods=['POST'])
def check_access():
    data = request.json
    email = data.get('email')
    user = CREDENCIAL.query.filter_by(email=email).first()
    if user:
        return jsonify({'access_type': user.tipo_acceso}), 200
    else:
        return jsonify({'error': 'User not found'}), 404
    



# API Endpoint para cambio de clave, primero se valida el usuario
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
    



# API Endpoint para cambio de clave, una vez que la validacion sea realizada
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
    



# API Endpoint para crear un nuevo alumno / solo para admin
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
    



# API Endpoint para buscar un alumno 
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
    



@app.route('/api/estudiante/<int:student_id>/horario', methods=['GET'])
def get_horario_estudiante(student_id):
    horario = db.session.query(Schedule).join(Course).join(Enrollment).filter(
        Enrollment.student_id == student_id,
        Enrollment.course_id == Course.id,
        Schedule.course_id == Course.id
    ).all()
    
    horario_json = [clase.to_json() for clase in horario]
    return jsonify(horario_json)



######################## RUTAS CURSOS ####################################################################################

# API Endpoint para inscribir a alumnos o profesores a cursos
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






######################## RUTAS JUSTIFICACIONES ##########################################################

# API Endpoint para encontrar asignaturas del estudiante
@app.route('/api/estudiante/<int:student_id>/asignaturas', methods=['GET'])
def get_asignaturas_estudiante(student_id):
    print(f"Fetching subjects for student_id: {student_id}")  # Añadir registro de consola
    asignaturas = db.session.query(Course).join(Enrollment).filter(
        Enrollment.student_id == student_id
    ).all()
    
    asignaturas_json = [asignatura.to_json() for asignatura in asignaturas]
    return jsonify(asignaturas_json)



# API Endpoint para enviar justificaciones
@app.route('/api/justificacion', methods=['POST'])
def create_justificacion():
    data = request.form  # Utiliza request.form para manejar datos que incluyan archivos
    student_id = data.get('student_id')
    fecha_desde = data.get('fechaDesde')
    fecha_hasta = data.get('fechaHasta')
    razones = data.get('razones')
    initial_status = 'pendiente'  # Estado inicial de la justificación

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
        filename = secure_filename(archivo.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        try:
            archivo.save(file_path)
            archivos.append(filename)
        except Exception as e:
            return jsonify({'error': f'Error saving file: {e}'}), 500

    asignaturas_ids = [data.get(f'asignatura{index}') for index in range(len(data)) if data.get(f'asignatura{index}')]

    # Obtén los objetos Course correspondientes a los IDs
    asignaturas = Course.query.filter(Course.id.in_(asignaturas_ids)).all()

    new_justificacion = Justificacion(
        student_id=student_id,
        fecha_desde=fecha_desde,
        fecha_hasta=fecha_hasta,
        razones=razones,
        archivos=",".join(archivos),
        status=initial_status  # Añadir el estado inicial
    )
    
    # Añadir asignaturas a la justificación
    new_justificacion.asignaturas.extend(asignaturas)

    db.session.add(new_justificacion)
    db.session.commit()

    return jsonify(new_justificacion.to_json()), 201


######################## RUTAS ASISTENCIA ####################################################################################

@app.route('/api/attendances', methods=['GET'])
@jwt_required()
def get_attendances():
    current_user_id = get_jwt_identity()  # Asumiendo que el ID del usuario se guarda en el token JWT
    student = Student.query.filter_by(credencial_id=current_user_id).first()

    if not student:
        return jsonify({'message': 'Student not found'}), 404

    enrollments = Enrollment.query.filter_by(student_id=student.id).all()
    attendances = []
    for enrollment in enrollments:
        attendance_records = Attendance.query.filter_by(enrollment_id=enrollment.id).all()
        for record in attendance_records:
            attendances.append(record.to_json())

    return jsonify(attendances), 200



@app.route('/register_attendance', methods=['POST'])
@jwt_required()
def register_attendance():
    data = request.get_json()
    student_id = data['student_id']
    course_id = data['course_id']
    date = data['date']
    status = data['status']

    # Verifica la existencia del estudiante y el curso
    student = Student.query.get(student_id)
    course = Course.query.get(course_id)
    if not student or not course:
        return jsonify({'message': 'Student or course not found'}), 404

    # Verifica la inscripción
    enrollment = Enrollment.query.filter_by(student_id=student_id, course_id=course_id).first()
    if not enrollment:
        return jsonify({'message': 'Enrollment does not exist'}), 404

    # Registra o actualiza la asistencia
    attendance = Attendance.query.filter_by(enrollment_id=enrollment.id, date=date).first()
    if attendance:
        attendance.status = status
    else:
        attendance = Attendance(enrollment_id=enrollment.id, date=date, status=status)
        db.session.add(attendance)

    db.session.commit()
    return jsonify({'message': 'Attendance registered successfully'}), 200








############################## RUTAS ADMIN ###############################################################################################################################################


@app.route('/api/justificaciones/pendientes', methods=['GET'])
def get_justificaciones_pendientes():
    try:
        # Supongamos que Justificacion es tu modelo de SQLAlchemy
        pendientes = Justificacion.query.filter_by(status='pendiente').all()
        return jsonify([justificacion.to_json() for justificacion in pendientes]), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/api/justificacion/<int:id>/aprobar', methods=['PATCH'])
def aprobar_justificacion(id):
    justificacion = Justificacion.query.get(id)
    if justificacion:
        justificacion.status = 'aprobada'
        db.session.commit()
        return jsonify({'message': 'Justificación aprobada'}), 200
    else:
        return jsonify({'message': 'Justificación no encontrada'}), 404



@app.route('/api/justificacion/<int:id>/rechazar', methods=['PATCH'])
def rechazar_justificacion(id):
    justificacion = Justificacion.query.get(id)
    if justificacion:
        justificacion.status = 'rechazada'
        db.session.commit()
        return jsonify({'message': 'Justificación rechazada'}), 200
    else:
        return jsonify({'message': 'Justificación no encontrada'}), 404
    



##################  

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

if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')