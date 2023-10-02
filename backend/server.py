from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import delta

cache = {}
app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/')
def hello_world():
    return 'Hello World'

@app.route('/query', methods = ['POST'])
@cross_origin()
def query():
    data = request.json
    prompt = data['prompt']
    request_url = data['url']

    response = {}

    if ('url' not in cache) or ('url' in cache and request_url !=  cache['url']):
      cache['index'] = delta.build_index(url=request_url).as_query_engine()
      cache['url'] = request_url

    gpt_response = cache['index'].query(prompt)
    response['response'] = gpt_response.response
    response['url'] = cache['url']
    response['status'] = True
    return jsonify(response)


if __name__ == '__main__':
    app.run()

