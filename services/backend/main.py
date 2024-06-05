from datetime import datetime, timedelta
from flask_restx import Api, Resource, Namespace, fields
from flask import request, jsonify, Flask
from app2.config import DevelopmentConfig

from flask.cli import FlaskGroup
from flask_cors import CORS


from extensions import db
from models import CREDENCIAL

import bcrypt
<<<<<<< HEAD
from models import db
from config import app
from flask import request, jsonify
from models import UniversityCredential
import logging
#hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
=======
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
>>>>>>> javi-backend

# prueba
# Configurar el nivel de logging
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s %(levelname)s %(message)s',
                    handlers=[
                        logging.FileHandler("app.log"),
                        logging.StreamHandler()
                    ])

logger = logging.getLogger(__name__)


<<<<<<< HEAD
#para probar, no funciona, cors o algo mas, por investigar
@app.route("/", methods=["GET"])
def login():
    logger.debug("Iniciando endpoint de login")  # Log de nivel DEBUG
    try:
        alumnos = UniversityCredential.query.all()
        logger.info("Se obtuvieron con éxito, todos los estudiantes de la base de datos.")  # Log de nivel INFO
        json_alumnos = list(map(lambda x: x.to_json(), alumnos))
        return jsonify({"alumnos": json_alumnos}), 200
    except Exception as e:
        logger.error("Error al recuperar estudiantes de la base de datos", exc_info=True)  # Log de nivel ERROR
        return jsonify({"error": "Internal Server Error"}), 500
=======

# Namespace para operaciones relacionadas con alumnos
student_ns = Namespace('students', description='Operaciones relacionadas con alumnos')

# Modelo para creación y actualización de alumnos
student_model = student_ns.model('Student', {
    'student_id': fields.String(required=True, description='ID del estudiante'),
    'first_name': fields.String(required=True, description='Nombre del estudiante'),
    'last_name': fields.String(required=True, description='Apellido del estudiante'),
    'email': fields.String(required=True, description='Correo electrónico del estudiante'),
    'password': fields.String(required=True, description='Contraseña del estudiante'),
    'tipo_acceso': fields.String(required=True, description='Tipo de acceso (admin, profesor, alumno)'),
})
>>>>>>> javi-backend






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




################## RUTAS ############################
# para login de un alumno
@student_ns.route('/login')
class LoginStudent(Resource):
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return {"error": "Email and password are required"}, 400

        student = CREDENCIAL.query.filter_by(email=email).first()

        if not student or not bcrypt.checkpw(password.encode('utf-8'), student.password.encode('utf-8')):
            return {"error": "Invalid credentials"}, 401

        token = generate_token(student.id)
        return {"token": token, "message": "Login successful"}, 200

# para crear un nuevo alumno
@student_ns.route('/creacion-nuevo-alumno')
class CreateStudent(Resource):
    @student_ns.expect(student_model)
    def post(self):
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return {"error": "Email and password are required"}, 400

        if CREDENCIAL.query.filter_by(email=email).first():
            return {"error": "User already exists"}, 409

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        new_student = CREDENCIAL(
            student_id=data.get('student_id'),
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            email=email,
            password=hashed_password,
            tipo_acceso=data.get('tipo_acceso')
        )
        db.session.add(new_student)
        db.session.commit()

        return {"message": "User registered successfully"}, 201

# Resource para editar un alumno
@student_ns.route('/editar-alumno/<int:user_id>')
class EditStudent(Resource):
    @student_ns.expect(student_model)
    def patch(self, user_id):
        student = CREDENCIAL.query.get(user_id)
        if not student:
            return {"message": "User not found"}, 400
        
        data = request.json
        student.student_id = data.get("student_id", student.student_id)
        student.first_name = data.get("first_name", student.first_name)
        student.last_name = data.get("last_name", student.last_name)
        student.email = data.get("email", student.email)
        student.password = data.get("password", student.password)
        student.tipo_acceso = data.get("tipo_acceso", student.tipo_acceso)

        db.session.commit()
        return {"message": "User updated successfully"}, 200

# Resource para eliminar un alumno
@student_ns.route('/eliminar-alumno/<int:user_id>')
class DeleteStudent(Resource):
    def delete(self, user_id):
        student = CREDENCIAL.query.get(user_id)
        if not student:
            return {"message": "User not found"}, 400
        
        db.session.delete(student)
        db.session.commit()
        return {"message": "User deleted successfully"}, 200

# Resource para buscar un alumno
@student_ns.route('/buscar-alumno/<int:user_id>')
class SearchStudent(Resource):
    def get(self, user_id):
        student = CREDENCIAL.query.get(user_id)
        if not student:
            return {"message": "User not found"}, 400
        
        return {
            "student_id": student.student_id,
            "first_name": student.first_name,
            "last_name": student.last_name,
            "email": student.email,
            "tipo_acceso": student.tipo_acceso
        }, 200
    

@app.route('/api/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    name = data.get('name')
    rut = data.get('rut')
    new_password = data.get('newPassword')

    if not name or not rut or not new_password:
        return jsonify    

# Agregar el namespace a la API
api.add_namespace(student_ns, path='/api')

################## FIN RUTAS ############################

# creacion usuario para testing
def initialize_default_users():
    if not CREDENCIAL.query.first():
        users = [
            {
                'student_id': '20.723.182-7',
                'first_name': 'Javiera',
                'last_name': 'Soto',
                'email': 'javi@correo.cl',
                'password': 'queso',
                'tipo_acceso': 'alumno'
            },
            {
                'student_id': '19.654.321-0',
                'first_name': 'Nachito',
                'last_name': 'Zuñiga',
                'email': 'nachito@correo.cl',
                'password': 'Nachito',
                'tipo_acceso': 'admin'
            },
            {
                'student_id': '18.123.456-7',
                'first_name': 'Cony',
                'last_name': 'Contreras',
                'email': 'cony@correo.cl',
                'password': 'Cony',
                'tipo_acceso': 'admin'
            }
        ]

        for user_data in users:
            hashed_password = bcrypt.hashpw(user_data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            user = CREDENCIAL(
                student_id=user_data['student_id'],
                first_name=user_data['first_name'],
                last_name=user_data['last_name'],
                email=user_data['email'],
                password=hashed_password,
                tipo_acceso=user_data['tipo_acceso']
            )
            db.session.add(user)
        db.session.commit()

# Setup CORS
CORS(app)

# Create the database and tables if they don't exist
time.sleep(10)
with app.app_context():
    db.create_all()
<<<<<<< HEAD
    app.run(debug=True)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
=======

if __name__ == "__main__":
    with app.app_context():
        time.sleep(12)  # Asegúrate de que la base de datos esté lista
        db.create_all()
        initialize_default_users() #crea a los 3 usuarios por default 
        app.run(debug=True, host='0.0.0.0')
>>>>>>> javi-backend
