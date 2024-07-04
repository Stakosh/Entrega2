from flask import Blueprint, request, jsonify
from models import Justificacion, db
from mail_utils import enviar_correo

justificacion_bp = Blueprint('justificacion_bp', __name__)

@justificacion_bp.route('/api/justificacion/<int:id>/aprobar', methods=['PATCH'])
def aprobar_justificacion(id):
    justificacion = Justificacion.query.get_or_404(id)
    justificacion.estado = 'aprobada'
    db.session.commit()

    # Enviar correo electrónico al estudiante
    enviar_correo(justificacion.student.email, 'Justificación Aprobada', 'Tu justificación ha sido aprobada.')

    return jsonify(justificacion.to_json()), 200

@justificacion_bp.route('/api/justificacion/<int:id>/rechazar', methods=['PATCH'])
def rechazar_justificacion(id):
    justificacion = Justificacion.query.get_or_404(id)
    justificacion.estado = 'rechazada'
    db.session.commit()

    # Enviar correo electrónico al estudiante
    enviar_correo(justificacion.student.email, 'Justificación Rechazada', 'Tu justificación ha sido rechazada.')

    return jsonify(justificacion.to_json()), 200
