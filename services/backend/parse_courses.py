import csv
from extensions import db
from models import Carrera, Course, Schedule, Student, CREDENCIAL, Enrollment

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

def assign_courses_to_students():
    students = Student.query.all()
    for student in students:
        carrera = Carrera.query.filter_by(name=student.carrera_name).first()
        if carrera:
            courses = Course.query.filter_by(carrera_id=carrera.id).all()
            for course in courses:
                student.courses.append(course)
    db.session.commit()

def enroll_students_in_courses():
    students = Student.query.all()
    for student in students:
        carrera = Carrera.query.filter_by(name=student.carrera_name).first()
        if carrera:
            courses = Course.query.filter_by(carrera_id=carrera.id, semestre=student.semestre_que_cursa).all()
            for course in courses:
                enrollment = Enrollment(student_id=student.id, course_id=course.id)
                db.session.add(enrollment)
    db.session.commit()
