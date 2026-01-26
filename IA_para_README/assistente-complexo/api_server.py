from flask import Flask, request, jsonify
from consulta_contexto import run_query

app = Flask(__name__)


@app.route('/oraculo', methods=['POST'])
def query_context():
    """
    Recebe uma pergunta via POST, executa a função run_query de consulta_contexto
    e retorna o resultado.
    """
    data = request.get_json()
    if not data or 'consulta' not in data:
        return jsonify({"error": "A 'consulta' é obrigatória no corpo da requisição"}), 400
    try:
        result = run_query(data['consulta'])
        return jsonify({"response": result})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001)
