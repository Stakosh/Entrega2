import csv
import bcrypt
from extensions import db
from models import Carrera, Course, Schedule, Student, CREDENCIAL, Enrollment, Teacher, Admin, Attendance, ClassAttendance, DietaryPreference
import csv
import bcrypt
from datetime import datetime, timedelta
import random

def initialize_default_users():
    if not CREDENCIAL.query.first():
        users = [
            {
                'rut': '207231827',
                'first_name': 'Javiera',
                'last_name': 'Soto',
                'email': 'javi@correo.cl',
                'password': 'queso',
                'tipo_acceso': 'alumno',
                'carrera': 'INFORMATICA'
            },
            {
                'rut': '196543210',
                'first_name': 'Ignacio',
                'last_name': 'Zuñiga',
                'email': 'nachito@correo.cl',
                'password': 'sushi',
                'tipo_acceso': 'alumno',
                'carrera': 'INDUSTRIAL'
            },
            {
                'rut': '181234567',
                'first_name': 'Constanza',
                'last_name': 'Contreras',
                'email': 'cony@correo.cl',
                'password': 'cony',
                'tipo_acceso': 'alumno',
                'carrera': 'ENERGIA'
            },
            {
                'rut': '1',
                'first_name': 'Admin',
                'last_name': 'Admin',
                'email': 'admin@correo.cl',
                'password': 'admin',
                'tipo_acceso': 'admin'
            },
            {
                'rut': '2',
                'first_name': 'Gabriel',
                'last_name': 'Torres',
                'email': 'profe@correo.cl',
                'password': 'profe',
                'tipo_acceso': 'profesor'
            },
            {
                'rut': '3',
                'first_name': 'Eduardo',
                'last_name': 'Gutiérrez',
                'email': 'eduardo@correo.cl',
                'password': 'eduardo',
                'tipo_acceso': 'profesor'
            },
            {
                'rut': '4',
                'first_name': 'Ricardo',
                'last_name': 'Fernández',
                'email': 'ricardo@correo.cl',
                'password': 'ricardo',
                'tipo_acceso': 'profesor'
            },
            {
                'rut': '5',
                'first_name': 'Mario',
                'last_name': 'Castillo',
                'email': 'mario@correo.cl',
                'password': 'mario',
                'tipo_acceso': 'profesor'
            },
            {
                'rut': '6',
                'first_name': 'Laura',
                'last_name': 'Ortega',
                'email': 'laura@correo.cl',
                'password': 'laura',
                'tipo_acceso': 'profesor'
            },
            {
                'rut': '7',
                'first_name': 'Eduardo',
                'last_name': 'Morales',
                'email': 'emorales@correo.cl',
                'password': 'emorales',
                'tipo_acceso': 'profesor'
            },
            {
                'rut': '8',
                'first_name': 'David',
                'last_name': 'Rojas',
                'email': 'david@correo.cl',
                'password': 'david',
                'tipo_acceso': 'profesor'
            },
            {
                'rut': '465977649',
                'first_name': 'Tamara',
                'last_name': 'Dinamarca',
                'email': 'doritosazules123@gmail.cl',
                'password': 'dorito',
                'tipo_acceso': 'admin'
            }
        ]
        
        for user in users:
            hashed_password = bcrypt.hashpw(user['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            new_user = CREDENCIAL(
                rut=user['rut'],
                first_name=user['first_name'],
                last_name=user['last_name'],
                email=user['email'],
                password=hashed_password,
                tipo_acceso=user['tipo_acceso'],
                carrera=user.get('carrera')
            )
            db.session.add(new_user)
            db.session.commit()

            if user['tipo_acceso'] == 'admin':
                new_admin = Admin(
                    credencial_id=new_user.id,
                    rut=user['rut'],
                    first_name=user['first_name'],
                    last_name=user['last_name']
                )
                db.session.add(new_admin)
                db.session.commit()




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
        
        teacher_name = course['profesor']
        first_name, last_name = teacher_name.split(' ', 1)
        teacher = Teacher.query.filter_by(first_name=first_name, last_name=last_name).first()
        if not teacher:
            credencial = CREDENCIAL.query.filter_by(first_name=first_name, last_name=last_name, tipo_acceso='profesor').first()
            if not credencial:
                print(f"Profesor {teacher_name} no encontrado en CREDENCIAL. Saltando curso {course['course_id']}")
                continue
            teacher = Teacher(
                credencial_id=credencial.id,
                first_name=first_name,
                last_name=last_name,
                rut=credencial.rut
            )
            db.session.add(teacher)
            db.session.commit()
        
        existing_course = Course.query.filter_by(sigla_curso=course['course_id']).first()
        if not existing_course:
            new_course = Course(
                sigla_curso=course['course_id'],
                name=course['name'],
                carrera_id=carrera.id,
                semestre=course['semestre'],
                teacher_id=teacher.id
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
                    semestre_que_cursa=4,  # Ajuste según el requerimiento
                    EncuestaAlimentaria=False  # Asegúrate de inicializar como False
                )
                print(f"El estudiante con RUT {credencial.rut} fue creado exitosamente.")
                db.session.add(student)
            else:
                print(f"El estudiante con RUT {credencial.rut} ya existe.")
        except Exception as e:
            print(f"Error al crear el estudiante con RUT {credencial.rut}: {e}")
    db.session.commit()

def assign_courses_to_students():
    students = Student.query.all()
    for student in students:
        # Filtrar los cursos por carrera y semestre actual del estudiante
        courses = Course.query.join(Carrera).filter(
            Carrera.name == student.carrera,
            Course.semestre == student.semestre_que_cursa
        ).all()
        
        for course in courses:
            # Verificar si ya está inscrito en el curso
            existing_enrollment = Enrollment.query.filter_by(student_id=student.id, course_id=course.id).first()
            if not existing_enrollment:
                if course.semestre == student.semestre_que_cursa:
                    enrollment = Enrollment(student_id=student.id, course_id=course.id)
                    db.session.add(enrollment)
                    print(f"La asignatura {course.name} fue inscrita para el estudiante {student.first_name} {student.last_name}.")
                else:
                    print(f"La asignatura {course.name} no corresponde al semestre que cursa el estudiante {student.first_name} {student.last_name}.")
            else:
                print(f"El estudiante {student.first_name} {student.last_name} ya está inscrito en el curso {course.name}.")
    
    db.session.commit()




def generate_class_dates(start_date, end_date, weekdays, n):
    """Genera n fechas aleatorias entre start_date y end_date que coincidan con los días de la semana especificados."""
    delta = end_date - start_date
    valid_dates = [start_date + timedelta(days=i) for i in range(delta.days + 1) if (start_date + timedelta(days=i)).weekday() in weekdays]

    if n > len(valid_dates):
        raise ValueError("No hay suficientes días en el rango dado para generar las fechas deseadas.")

    return random.sample(valid_dates, n)

def assign_attendance_to_students():
    print("Asignando asistencia a los estudiantes...")
    start_date = datetime.strptime('2024-03-01', '%Y-%m-%d').date()
    end_date = datetime.strptime('2024-06-30', '%Y-%m-%d').date()
    
    students = Student.query.all()
    for student in students:
        print(f"Procesando estudiante: {student.first_name} {student.last_name}")
        enrollments = Enrollment.query.filter_by(student_id=student.id).all()
        for enrollment in enrollments:
            course_id = enrollment.course_id
            print(f" - Curso ID: {course_id}")
            schedules = Schedule.query.filter_by(course_id=course_id).all()
            weekdays = {schedule.dia for schedule in schedules}
            weekday_map = {'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3, 'Friday': 4, 'Saturday': 5, 'Sunday': 6}
            class_days = [weekday_map[day] for day in weekdays if day in weekday_map]

            if class_days:
                attendance_dates = generate_class_dates(start_date, end_date, class_days, len(class_days) * 4)
                
                for date in attendance_dates:
                    existing_attendance = Attendance.query.filter_by(enrollment_id=enrollment.id, date=date).first()
                    if not existing_attendance:
                        status = random.choice(['present', 'absent'])
                        attendance = Attendance(
                            enrollment_id=enrollment.id,
                            date=date,
                            status=status
                        )
                        db.session.add(attendance)
                        print(f"Asistencia {status} registrada para el estudiante {student.first_name} {student.last_name} en el curso {course_id} el {date}.")
                    else:
                        print(f"Asistencia ya existe para el estudiante {student.first_name} {student.last_name} en el curso {course_id} el {date}.")
    db.session.commit()
    print("Asignación de asistencia completada.")

def assign_class_attendance_to_students():
    print("Asignando asistencia de clases a los estudiantes...")
    start_date = datetime.strptime('2024-03-01', '%Y-%m-%d').date()
    end_date = datetime.strptime('2024-06-30', '%Y-%m-%d').date()

    students = Student.query.all()
    for student in students:
        print(f"Procesando estudiante: {student.first_name} {student.last_name}")
        enrollments = Enrollment.query.filter_by(student_id=student.id).all()
        for enrollment in enrollments:
            course_id = enrollment.course_id
            print(f" - Curso ID: {course_id}")
            schedules = Schedule.query.filter_by(course_id=course_id).all()
            weekdays = {schedule.dia for schedule in schedules}
            weekday_map = {'Monday': 0, 'Tuesday': 1, 'Wednesday': 2, 'Thursday': 3, 'Friday': 4, 'Saturday': 5, 'Sunday': 6}
            class_days = [weekday_map[day] for day in weekdays if day in weekday_map]

            if class_days:
                attendance_dates = generate_class_dates(start_date, end_date, class_days, len(class_days) * 4)

                for date in attendance_dates:
                    existing_class_attendance = ClassAttendance.query.filter_by(enrollment_id=enrollment.id, date=date).first()
                    if not existing_class_attendance:
                        modalidad = random.choice(['presencial', 'online'])
                        class_attendance = ClassAttendance(
                            enrollment_id=enrollment.id,
                            date=date,
                            modalidad=modalidad,
                            confirmed=True
                        )
                        db.session.add(class_attendance)
                        print(f"Asistencia {modalidad} registrada para el estudiante {student.first_name} {student.last_name} en el curso {course_id} el {date}.")
                    else:
                        print(f"Asistencia ya existe para el estudiante {student.first_name} {student.last_name} en el curso {course_id} el {date}.")
    db.session.commit()
    print("Asignación de asistencia de clases completada.")

def create_fake_students_and_data():
    fake_students = [
        {
            'rut': '999999901',
            'first_name': 'Juan',
            'last_name': 'Perez',
            'email': 'falso1@correo.cl',
            'password': 'juan',
            'tipo_acceso': 'alumno',
            'carrera': 'INFORMATICA'
        },
        {
            'rut': '999999902',
            'first_name': 'Daniela',
            'last_name': 'Gutierrez',
            'email': 'falso2@correo.cl',
            'password': 'dani',
            'tipo_acceso': 'alumno',
            'carrera': 'INDUSTRIAL'
        },
        {
            'rut': '999999903',
            'first_name': 'Josefina',
            'last_name': 'Oyanader',
            'email': 'falso3@correo.cl',
            'password': 'jose',
            'tipo_acceso': 'alumno',
            'carrera': 'ENERGIA'
        },
        {
            'rut': '999999904',
            'first_name': 'Nicolas',
            'last_name': 'Soto',
            'email': 'falso4@correo.cl',
            'password': 'nico',
            'tipo_acceso': 'alumno',
            'carrera': 'INFORMATICA'
        }
    ]

    students = []

    for user in fake_students:
        existing_user = CREDENCIAL.query.filter_by(rut=user['rut']).first()
        if existing_user:
            print(f"User with rut {user['rut']} already exists.")
            new_user = existing_user
        else:
            hashed_password = bcrypt.hashpw(user['password'].encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            new_user = CREDENCIAL(
                rut=user['rut'],
                first_name=user['first_name'],
                last_name=user['last_name'],
                email=user['email'],
                password=hashed_password,
                tipo_acceso=user['tipo_acceso'],
                carrera=user.get('carrera')
            )
            db.session.add(new_user)
            db.session.commit()

        existing_student = Student.query.filter_by(credencial_id=new_user.id).first()
        if existing_student:
            print(f"Student with credencial_id {new_user.id} already exists.")
            student = existing_student
        else:
            student = Student(
                credencial_id=new_user.id,
                rut=user['rut'],
                first_name=user['first_name'],
                last_name=user['last_name'],
                carrera=user['carrera'],
                semestre_que_cursa=4,
                EncuestaAlimentaria=random.choice([True, False])
            )
            db.session.add(student)
            db.session.commit()
        students.append(student)

    # Crear preferencias dietéticas para los estudiantes que participaron en la encuesta
    for student in students:
        if student.EncuestaAlimentaria:
            preference = DietaryPreference(
                student_id=student.id,
                vegano=random.choice([True, False]),
                celiaco=random.choice([True, False]),
                diabetico_tipo1=random.choice([True, False]),
                diabetico_tipo2=random.choice([True, False]),
                alergico=random.choice([True, False]),
                vegetariano=random.choice([True, False]),
                otra="Otra preferencia" if random.choice([True, False]) else None
            )
            db.session.add(preference)
            db.session.commit()

    # Asignar cursos y asistencia al estudiante
    assign_courses_to_students()
    assign_attendance_to_students()
    assign_class_attendance_to_students()

def parse_attendance_file(file_path):
    with open(file_path, mode='r', encoding='utf-8') as file:
        csv_reader = csv.DictReader(file)
        
        for row in csv_reader:
            enrollment_id = int(row['enrollment_id'])
            date = datetime.strptime(row['date'], '%Y-%m-%d').date()
            status = row['status']
            
            # Verificar si el registro de asistencia ya existe
            existing_attendance = Attendance.query.filter_by(enrollment_id=enrollment_id, date=date).first()
            
            if not existing_attendance:
                # Verificar si la inscripción existe
                enrollment = Enrollment.query.get(enrollment_id)
                if enrollment:
                    attendance = Attendance(
                        enrollment_id=enrollment_id,
                        date=date,
                        status=status
                    )
                    db.session.add(attendance)
                    print(f"Asistencia {status} registrada para la inscripción {enrollment_id} en la fecha {date}.")
                else:
                    print(f"Inscripción con ID {enrollment_id} no encontrada. Saltando registro.")
            else:
                print(f"Asistencia ya existe para la inscripción {enrollment_id} en la fecha {date}. Saltando registro existente.")
        
        db.session.commit()
        print("Registros de asistencia importados con éxito.")