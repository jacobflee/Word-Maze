import flask
import database
import random
import json
import os


# ................INIT................#

app = flask.Flask(__name__)
db = database.Database()


# ................RENDER................#


@app.route("/")
def index():
    return flask.render_template("index.html")


# ................CREATE................#


@app.route("/create_new_user", methods=["POST"])
def create_new_user():
    user_name = flask.request.json.get("userName")
    data = db.create_new_user(user_name)
    return flask.jsonify(data)


# ................UPDATE................#


@app.route("/update_user_name", methods=["POST"])
def update_user_name():
    user_id = flask.request.json.get("userId")
    user_name = flask.request.json.get("userName")
    data = db.update_user_name(user_id, user_name)
    return flask.jsonify(data)


@app.route("/update_online_status", methods=["POST"])
def update_online_status():
    user_id = flask.request.json.get("userId")
    online_status = flask.request.json.get("onlineStatus")
    data = db.update_online_status(user_id, online_status)
    return flask.jsonify(data)


@app.route("/update_friend_match_query", methods=["POST"])
def update_friend_match_query():
    user_id = flask.request.json.get("userId")
    friend_match_query = flask.request.json.get("friendMatchQuery")
    data = db.update_friend_match_query(user_id, friend_match_query)
    return flask.jsonify(data)


@app.route("/update_random_match_query", methods=["POST"])
def update_random_match_query():
    user_id = flask.request.json.get("userId")
    random_match_query = flask.request.json.get("randomMatchQuery")
    data = db.update_random_match_query(user_id, random_match_query)
    return flask.jsonify(data)


# ................READ................#


@app.route("/fetch_new_game_data")
def fetch_new_game_data():
    directory = "static/assets/jsons"
    filenames = os.listdir(directory)
    filename = random.choice(filenames)
    filepath = os.path.join(directory, filename)
    file = open(filepath)
    data = json.load(file)
    return flask.jsonify(data)


@app.route("/fetch_user_id", methods=["POST"])
def fetch_user_id():
    user_name = flask.request.json.get("userName")
    data = db.fetch_user_id(user_name)
    return flask.jsonify(data)


# ................RUN................#

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
