from sqlalchemy.types import Enum
from extensions import db


class CREDENCIAL(db.Model):
    __tablename__ = 'CREDENCIAL'
    id = db.Column(db.Integer, primary_key=True)
    rut = db.Column(db.String(100), unique=True)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(200))
    tipo_acceso = db.Column(Enum('admin', 'profesor', 'alumno', name='tipo_acceso'), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "rut": self.rut,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "password": self.password,
            "tipo_acceso": self.tipo_acceso
        }



class CursoCarrera(db.Model):
    __tablename__ = 'CursoCarrera'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    director = db.Column(db.String(255), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)

class Asignatura(db.Model):
    __tablename__ = 'Asignaturas'
    id = db.Column(db.Integer, primary_key=True)
    id_curso = db.Column(db.Integer, db.ForeignKey('CursoCarrera.id'), nullable=False)
    nombre = db.Column(db.String(255), nullable=False)
    descripcion = db.Column(db.Text, nullable=True)

class Usuario(db.Model):
    __tablename__ = 'Usuarios'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    apellido = db.Column(db.String(255), nullable=False)
    correo = db.Column(db.String(255), unique=True, nullable=False)
    contrasena = db.Column(db.String(255), nullable=False)
    acceso = db.Column(Enum('alumno', 'profesor', 'admin', name='tipo_acceso'), nullable=False)
    rut = db.Column(db.String(20), unique=True, nullable=False)

class PreferAlimentaria(db.Model):
    __tablename__ = 'PreferAlimentarias'
    id_alumno = db.Column(db.Integer, db.ForeignKey('Usuarios.id'), primary_key=True)
    celiaco = db.Column(db.Boolean, nullable=False)
    intolerante = db.Column(db.Boolean, nullable=False)
    otros = db.Column(db.Text, nullable=True)

class Encuesta(db.Model):
    __tablename__ = 'Encuestas'
    id = db.Column(db.Integer, primary_key=True)
    id_curso = db.Column(db.Integer, db.ForeignKey('CursoCarrera.id'), nullable=False)
    id_alumno = db.Column(db.Integer, db.ForeignKey('Usuarios.id'), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)
    fecha_realizacion = db.Column(db.Date, nullable=False)
    completado = db.Column(db.Boolean, nullable=False)

class Pregunta(db.Model):
    __tablename__ = 'Preguntas'
    id = db.Column(db.Integer, primary_key=True)
    id_encuesta = db.Column(db.Integer, db.ForeignKey('Encuestas.id'), nullable=False)
    pregunta = db.Column(db.Text, nullable=False)

class Profesor(db.Model):
    __tablename__ = 'Profesores'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(255), nullable=False)
    apellido = db.Column(db.String(255), nullable=False)
    correo = db.Column(db.String(255), unique=True, nullable=False)
    rut = db.Column(db.String(20), unique=True, nullable=False)

class ProfesorAsignatura(db.Model):
    __tablename__ = 'ProfesorAsignatura'
    id = db.Column(db.Integer, primary_key=True)
    id_asignatura = db.Column(db.Integer, db.ForeignKey('Asignaturas.id'), nullable=False)
    id_profesor = db.Column(db.Integer, db.ForeignKey('Profesores.id'), nullable=False)

class Clase(db.Model):
    __tablename__ = 'Clases'
    id = db.Column(db.Integer, primary_key=True)
    id_asignatura = db.Column(db.Integer, db.ForeignKey('Asignaturas.id'), nullable=False)
    id_profesor = db.Column(db.Integer, db.ForeignKey('Profesores.id'), nullable=False)
    nombre_clase = db.Column(db.String(255), nullable=False)
    fecha = db.Column(db.Date, nullable=False)
    hora_inicio = db.Column(db.Time, nullable=False)
    hora_fin = db.Column(db.Time, nullable=False)
    ubicacion = db.Column(db.String(255), nullable=False)
    codigo_qr = db.Column(db.String(255), nullable=False)

class Asistencia(db.Model):
    __tablename__ = 'Asistencias'
    id = db.Column(db.Integer, primary_key=True)
    id_clase = db.Column(db.Integer, db.ForeignKey('Clases.id'), nullable=False)
    id_alumno = db.Column(db.Integer, db.ForeignKey('Usuarios.id'), nullable=False)
    fecha_asistencia = db.Column(db.Date, nullable=False)
    confirmado = db.Column(db.Boolean, nullable=False)
    correo = db.Column(db.String(255), nullable=False)

class Recordatorio(db.Model):
    __tablename__ = 'Recordatorios'
    id = db.Column(db.Integer, primary_key=True)
    id_clase = db.Column(db.Integer, db.ForeignKey('Clases.id'), nullable=False)
    tipo = db.Column(db.String(50), nullable=False)
    fecha_envio = db.Column(db.Date, nullable=False)
    mensaje = db.Column(db.Text, nullable=False)
    presencial = db.Column(db.Boolean, nullable=False)
    online = db.Column(db.Boolean, nullable=False)

class Justificacion(db.Model):
    __tablename__ = 'Justificaciones'
    id = db.Column(db.Integer, primary_key=True)
    id_alumno = db.Column(db.Integer, db.ForeignKey('Usuarios.id'), nullable=False)
    certificado = db.Column(db.Text, nullable=False)
    estado = db.Column(Enum('aprobada', 'rechazada', 'pendiente', name='estado_justificacion'), nullable=False)
    fecha_envio = db.Column(db.Date, nullable=False)
    fecha_revision = db.Column(db.Date, nullable=False)

class Alumno(db.Model):
    __tablename__ = 'Alumnos'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('Usuarios.id'), nullable=False)
    id_curso = db.Column(db.Integer, db.ForeignKey('CursoCarrera.id'), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "id_curso": self.id_curso
        }

class Course(db.Model):
    __tablename__ = 'course'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))

class Enrollment(db.Model):
    __tablename__ = 'enrollment'
    id = db.Column(db.Integer, primary_key=True)
    rut = db.Column(db.String(20), db.ForeignKey('CREDENCIAL.rut'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)

class Attendance(db.Model):
    __tablename__ = 'attendance'
    id = db.Column(db.Integer, primary_key=True)
    rut = db.Column(db.String(100), db.ForeignKey('CREDENCIAL.rut'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    present = db.Column(db.Boolean, nullable=False)

    def to_dict(self):
        return {
            'rut': self.rut,
            'course_id': self.course_id,
            'date': self.date.isoformat(),
            'present': self.present
        }
