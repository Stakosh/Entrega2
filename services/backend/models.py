from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum, Date, Integer, String, Boolean, Column
db = SQLAlchemy()

class CREDENCIAL(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rut = db.Column(db.String(100), unique=True)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(200))
    tipo_acceso = db.Column(Enum('admin', 'profesor', 'alumno', name='tipo_acceso'), nullable=False)
    carrera = db.Column(db.String(100), nullable=True)  # Campo para almacenar la carrera

    def to_json(self):
        return {
            "id": self.id,
            "rut": self.rut,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "password": self.password,
            "tipo_acceso": self.tipo_acceso,
            "carrera": self.carrera
        }

class Carrera(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "name": self.name
        }
    


    
class Student(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    credencial_id = db.Column(db.Integer, db.ForeignKey('CREDENCIAL.id'), nullable=False)
    credencial = db.relationship('CREDENCIAL', backref=db.backref('students', lazy=True))
    rut = db.Column(db.String(100), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    carrera = db.Column(db.String(100), nullable=False)
    semestre_que_cursa = db.Column(db.Integer, nullable=False)
    dietary_preferences = db.relationship('DietaryPreference', backref='student', lazy=True)
    EncuestaAlimentaria = db.Column(db.Boolean, nullable=False, default=False)

    def to_json(self):
        return {
            "id": self.id,
            "credencial_id": self.credencial_id,
            "rut": self.rut,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "carrera": self.carrera,
            "semestre_que_cursa": self.semestre_que_cursa,
            "EncuestaAlimentaria" : self.EncuestaAlimentaria
        }
    

class Teacher(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    credencial_id = db.Column(db.Integer, db.ForeignKey('CREDENCIAL.id'), nullable=False)
    credencial = db.relationship('CREDENCIAL', backref=db.backref('teachers', lazy=True))
    rut = db.Column(db.String(100), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "credencial_id": self.credencial_id,
            "rut": self.rut,
            "first_name": self.first_name,
            "last_name": self.last_name
        }


class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    credencial_id = db.Column(db.Integer, db.ForeignKey('CREDENCIAL.id'), nullable=False)
    credencial = db.relationship('CREDENCIAL', backref=db.backref('admins', lazy=True))
    rut = db.Column(db.String(100), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "credencial_id": self.credencial_id,
            "rut": self.rut,
            "first_name": self.first_name,
            "last_name": self.last_name
        }


class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sigla_curso = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    carrera_id = db.Column(db.Integer, db.ForeignKey('carrera.id'), nullable=False)
    semestre = db.Column(db.Integer, nullable=False)
    teacher_id = db.Column(db.Integer, db.ForeignKey('teacher.id'), nullable=False)
    carrera = db.relationship('Carrera', backref=db.backref('courses', lazy=True))
    teacher = db.relationship('Teacher', backref=db.backref('courses', lazy=True))

    def to_json(self):
        return {
            "id": self.id,
            "sigla_curso": self.sigla_curso,
            "name": self.name,
            "carrera_id": self.carrera_id,
            "semestre": self.semestre,
            "teacher_id": self.teacher_id,
            "carrera": self.carrera.name,
            "teacher": self.teacher.first_name + " " + self.teacher.last_name
        }
    


    
class Schedule(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    dia = db.Column(db.String(50), nullable=False)  # E.g., "Lunes"
    hora_inicio = db.Column(db.String(50), nullable=False)  # E.g., "08:00"
    hora_fin = db.Column(db.String(50), nullable=False)  # E.g., "09:30"
    sala = db.Column(db.String(50), nullable=False)  # E.g., "Sala 101"

    course = db.relationship('Course', backref=db.backref('schedules', lazy=True))

    def to_json(self):
        return {
            "id": self.id,
            "course_id": self.course_id,
            "dia": self.dia,
            "hora_inicio": self.hora_inicio,
            "hora_fin": self.hora_fin,
            "sala": self.sala
        }


class Enrollment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)
    student = db.relationship('Student', backref=db.backref('enrollments', lazy=True))
    course = db.relationship('Course', backref=db.backref('enrollments', lazy=True))

    def to_json(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "course_id": self.course_id,
            "student": self.student.first_name + " " + self.student.last_name,
            "course": self.course.name
        }


class Attendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    enrollment_id = db.Column(db.Integer, db.ForeignKey('enrollment.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)
    status = db.Column(Enum('present', 'absent', 'late', name='attendance_status'), nullable=False)
    enrollment = db.relationship('Enrollment', backref=db.backref('attendances', lazy=True))

    def to_json(self):
        return {
            "id": self.id,
            "enrollment_id": self.enrollment_id,
            "date": self.date.strftime('%Y-%m-%d'),
            "status": self.status,
            "student": self.enrollment.student.first_name + " " + self.enrollment.student.last_name,
            "course": self.enrollment.course.name
        }


justificacion_asignaturas = db.Table('justificacion_asignaturas',
    db.Column('justificacion_id', db.Integer, db.ForeignKey('justificacion.id'), primary_key=True),
    db.Column('course_id', db.Integer, db.ForeignKey('course.id'), primary_key=True)
)



class Justificacion(db.Model):
    id = Column(Integer, primary_key=True)
    student_id = Column(Integer, db.ForeignKey('student.id'), nullable=False)
    fecha_desde = Column(Date, nullable=False)
    fecha_hasta = Column(Date, nullable=False)
    razones = Column(String(500), nullable=False)
    archivos = Column(String(200))  # Assuming you store file paths
    # Añadir relación many-to-many con asignaturas
    asignaturas = db.relationship('Course', secondary='justificacion_asignaturas', backref=db.backref('justificaciones', lazy=True))
    # Añadir el campo status con los valores enum y un valor por defecto
    status = Column(Enum('pendiente', 'aprobada', 'rechazada', name='status_types'), default='pendiente', nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "fecha_desde": self.fecha_desde.strftime('%Y-%m-%d'),
            "fecha_hasta": self.fecha_hasta.strftime('%Y-%m-%d'),
            "razones": self.razones,
            "archivos": self.archivos,
            "status": self.status,
            "asignaturas": [asignatura.name for asignatura in self.asignaturas]
        }




class DietaryPreference(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    vegano = db.Column(db.Boolean, nullable=False, default=False)
    celiaco = db.Column(db.Boolean, nullable=False, default=False)
    diabetico_tipo1 = db.Column(db.Boolean, nullable=False, default=False)
    diabetico_tipo2 = db.Column(db.Boolean, nullable=False, default=False)
    alergico = db.Column(db.Boolean, nullable=False, default=False)
    vegetariano = db.Column(db.Boolean, nullable=False, default=False)
    otra = db.Column(db.String, nullable=True)  # Campo para almacenar información adicional

    def to_json(self):
        return {
            "id": self.id,
            "vegano": self.vegano,
            "celiaco": self.celiaco,
            "diabetico_tipo1": self.diabetico_tipo1,
            "diabetico_tipo2": self.diabetico_tipo2,
            "alergico": self.alergico,
            "otra": self.otra,
            "vegetariano": self.vegetariano
        }


class ClassAttendance(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    enrollment_id = db.Column(db.Integer, db.ForeignKey('enrollment.id'), nullable=False)
    date = db.Column(db.Date, nullable=False)  # La fecha de la clase específica
    modalidad = db.Column(Enum('presencial', 'online', name='modalidad_types'), nullable=False)  # Modalidad elegida para esa clase
    confirmed = db.Column(db.Boolean, default=False, nullable=False)  # Si el estudiante ha confirmado su asistencia para esa clase
    enrollment = db.relationship('Enrollment', backref=db.backref('class_attendances', lazy=True))

    def to_json(self):
        return {
            "id": self.id,
            "enrollment_id": self.enrollment_id,
            "date": self.date.strftime('%Y-%m-%d'),
            "modalidad": self.modalidad,
            "confirmed": self.confirmed
        }