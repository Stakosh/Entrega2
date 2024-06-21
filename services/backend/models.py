from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Enum, Date, Integer, String, Boolean

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

    def to_json(self):
        return {
            "id": self.id,
            "credencial_id": self.credencial_id,
            "rut": self.rut,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "carrera": self.carrera,
            "semestre_que_cursa": self.semestre_que_cursa
        }

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    sigla_curso = db.Column(db.String(20), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    carrera_id = db.Column(db.Integer, db.ForeignKey('carrera.id'), nullable=False)
    semestre = db.Column(db.Integer, nullable=False)
    profesor = db.Column(db.String(100), nullable=False)
    carrera = db.relationship('Carrera', backref=db.backref('courses', lazy=True))

    def to_json(self):
        return {
            "id": self.id,
            "sigla_curso": self.sigla_curso,
            "name": self.name,
            "carrera_id": self.carrera_id,
            "semestre": self.semestre,
            "profesor": self.profesor,
            "carrera": self.carrera.name
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

class Justificacion(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    enrollment_id = db.Column(db.Integer, db.ForeignKey('enrollment.id'), nullable=False)
    fecha_desde = db.Column(db.Date, nullable=False)
    fecha_hasta = db.Column(db.Date, nullable=False)
    razones = db.Column(db.String(500), nullable=False)
    archivos = db.Column(db.String(200))  # Assuming you store file paths

    student = db.relationship('Student', backref=db.backref('justificaciones', lazy=True))
    enrollment = db.relationship('Enrollment', backref=db.backref('justificaciones', lazy=True))

    def to_json(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "enrollment_id": self.enrollment_id,
            "fecha_desde": self.fecha_desde.strftime('%Y-%m-%d'),
            "fecha_hasta": self.fecha_hasta.strftime('%Y-%m-%d'),
            "razones": self.razones,
            "archivos": self.archivos,
            "student": self.student.first_name + " " + self.student.last_name,
            "course": self.enrollment.course.name
        }

class DietaryPreference(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.Integer, db.ForeignKey('student.id'), nullable=False)
    vegano = db.Column(Boolean, nullable=False, default=False)
    celiaco = db.Column(Boolean, nullable=False, default=False)
    student = db.relationship('Student', backref=db.backref('dietary_preferences', lazy=True))

    def to_json(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "vegano": self.vegano,
            "celiaco": self.celiaco
        }