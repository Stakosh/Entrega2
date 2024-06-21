import csv
import bcrypt
from extensions import db
from models import Carrera, Course, Schedule, Student, CREDENCIAL, Enrollment

def read_users_from_csv(file_path):
    users = []
    with open(file_path, mode='r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            users.append({
                'rut': row['rut'],
                'first_name': row['first_name'],
                'last_name': row['last_name'],
                'email': row['email'],
                'password': row['password'],
                'tipo_acceso': row['tipo_acceso'],
                'carrera': row['carrera'] if row['carrera'] else None
            })
    return users



def parse_courses_file(file_path):
    courses = []
    with open(file_path, mode='r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            courses.append({
                'id': int(row['id']),
                'course_id': row['course_id'],
                'name': row['nombre'],
                'carrera': row['carrera'],
                'semestre': int(row['semestre']),
                'profesor': row['profesor']
            })
    return courses

def initialize_courses_and_careers(courses_data):
    for course in courses_data:
        carrera_name = course['carrera']
        carrera = Carrera.query.filter_by(name=carrera_name).first()
        if not carrera:
            carrera = Carrera(name=carrera_name)
            db.session.add(carrera)
            db.session.commit()
        
        existing_course = Course.query.filter_by(sigla_curso=course['course_id']).first()
        if not existing_course:
            new_course = Course(
                sigla_curso=course['course_id'],
                name=course['name'],
                carrera_id=carrera.id,
                semestre=course['semestre'],
                profesor=course['profesor']
            )
            db.session.add(new_course)
    db.session.commit()

def parse_schedules_file(file_path):
    schedules = []
    with open(file_path, mode='r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            schedules.append({
                'id': int(row['id']),
                'course_id': row['course_id'],
                'dia': row['dia'],
                'hora_inicio': row['hora_inicio'],
                'hora_fin': row['hora_fin'],
                'sala': row['sala']
            })
    return schedules

def initialize_schedules(schedules_data):
    for schedule in schedules_data:
        course = Course.query.filter_by(sigla_curso=schedule['course_id']).first()
        if course:
            new_schedule = Schedule(
                course_id=course.id,
                dia=schedule['dia'],
                hora_inicio=schedule['hora_inicio'],
                hora_fin=schedule['hora_fin'],
                sala=schedule['sala']
            )
            db.session.add(new_schedule)
    db.session.commit()

def create_students_from_credencial():
    credenciales = CREDENCIAL.query.filter_by(tipo_acceso='alumno').all()
    for credencial in credenciales:
        try:
            # Verificar si el estudiante ya existe
            existing_student = Student.query.filter_by(rut=credencial.rut).first()
            if not existing_student:
                student = Student(
                    credencial_id=credencial.id,
                    rut=credencial.rut,
                    first_name=credencial.first_name,
                    last_name=credencial.last_name,
                    carrera=credencial.carrera,
                    semestre_que_cursa=1  # Ajuste según el requerimiento
                )
                db.session.add(student)
            else:
                print(f"El estudiante con RUT {credencial.rut} ya existe.")
        except Exception as e:
            print(f"Error al crear el estudiante con RUT {credencial.rut}: {e}")
    db.session.commit()


def assign_courses_to_students():
    students = Student.query.all()
    for student in students:
        courses = Course.query.join(Carrera).filter(Carrera.name == student.carrera).all()
        for course in courses:
            existing_enrollment = Enrollment.query.filter_by(student_id=student.id, course_id=course.id).first()
            if not existing_enrollment:
                enrollment = Enrollment(student_id=student.id, course_id=course.id)
                db.session.add(enrollment)
            else:
                print(f"El estudiante {student.first_name} {student.last_name} ya está inscrito en el curso {course.name}.")
    db.session.commit()