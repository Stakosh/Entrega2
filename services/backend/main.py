import time
import bcrypt
from models import db
from config import app
from flask import request, jsonify
from models import UniversityCredential
import logging
#hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Configurar el nivel de logging
logging.basicConfig(level=logging.DEBUG,
                    format='%(asctime)s %(levelname)s %(message)s',
                    handlers=[
                        logging.FileHandler("app.log"),
                        logging.StreamHandler()
                    ])

logger = logging.getLogger(__name__)


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




@app.route("/create_contact", methods=["POST"])
def create_UniversityCredential():
    
    student_id = request.json.get("studenId")
    first_name = request.json.get("firstName")
    last_name = request.json.get("lastName")
    email = request.json.get("email")
    password = request.json.get("password")

    if not first_name or student_id or not first_name or not last_name or not email or not password:
        return ( jsonify({"message": "Rellenar todos los campos porfavor"}),
                400,
            )
    new_alumno = UniversityCredential(student_id= student_id,first_name=first_name, last_name=last_name, email=email,password=password)
    try:
        db.session.add(new_alumno)
        db.session.commit()
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
    return jsonify({"message":"User Created, Celebracion!!"}), 201




@app.route("/update_contact/int:user_id", methods=["PATCH"])
def update_alumno(user_id):
    alumno = UniversityCredential.query.get(user_id)

    if not alumno:
        return jsonify({"message": "User not found"}), 400
    
    data = request.json
    alumno.student_id = data.get("studentId", alumno.student_id)
    alumno.first_name = data.get("firstName",alumno.first_name)
    alumno.last_name = data.get("lastName", alumno.last_name)
    alumno.email = data.get("email", alumno.email)
    alumno.password = data.get("password", alumno.password)

    db.session.commit()

    return jsonify({"message": "Usuario MODIFICADO exitosamente"}), 200



def initialize_default_user():
    if not UniversityCredential.query.first():  # Checks if any users exist
        hashed_password = bcrypt.hashpw('queso'.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        default_user = UniversityCredential(
            student_id='20.723.182-7',
            first_name='Javiera',
            last_name='Soto',
            email='queso@queso.cl',
            password=hashed_password
        )
        db.session.add(default_user)
        db.session.commit()
        print("Default user created.")




with app.app_context():
    time.sleep(5)
    db.create_all()
    app.run(debug=True)


if __name__ == '__main__':
    app.run(debug=True, port=5000)