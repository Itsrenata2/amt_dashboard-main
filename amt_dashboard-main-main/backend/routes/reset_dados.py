from flask import Blueprint, jsonify
from config import get_db_connection

reset_bp = Blueprint('reset', __name__)

@reset_bp.route('/reset_dados', methods=['POST'])
def reset_dados():
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        # Limpar a tabela
        cursor.execute("TRUNCATE TABLE coleta_residuos;")
        conn.commit()

        return jsonify({'message': 'Tabela de dados resetada com sucesso.'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()
