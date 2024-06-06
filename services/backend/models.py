from sqlalchemy.types import Enum
from extensions import db

class CREDENCIAL(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    student_id = db.Column(db.String(100))
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    email = db.Column(db.String(100), unique=True)
    password = db.Column(db.String(200))
    tipo_acceso = db.Column(Enum('admin', 'profesor', 'alumno', name='tipo_acceso'), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "first_name": self.first_name,
            "last_name": self.last_name,
            "email": self.email,
            "password": self.password,
            "tipo_acceso": self.tipo_acceso
        }
