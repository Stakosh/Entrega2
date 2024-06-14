
# models.py
from sqlalchemy.types import Enum
from extensions import db

class CREDENCIAL(db.Model):
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

class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(200))

class Enrollment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    rut = db.Column(db.String(20), db.ForeignKey('CREDENCIAL.rut'), nullable=False)
    course_id = db.Column(db.Integer, db.ForeignKey('course.id'), nullable=False)

class Attendance(db.Model):
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
