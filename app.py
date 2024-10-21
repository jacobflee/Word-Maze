import flask
from flask import request, jsonify, render_template
import random
import string
import time
import json
import os


app = flask.Flask(__name__)

# In-memory storage
online_users = set()
pending_matches = {}
active_matches = {}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/get_game_data", methods=["GET"])
def get_gameboard():
    directory = 'static/jsons'
    filename = random.choice(os.listdir(directory))
    gameData = json.load(open(os.path.join(directory, filename)))
    return gameData


# @app.route("/get_online_users", methods=["GET"])
# def get_online_users():
#     return jsonify(list(online_users))


# @app.route("/user_online", methods=["POST"])
# def user_online():
#     username = request.json.get("username")
#     if not username:
#         return jsonify({"status": "error", "message": "Username is required"}), 400
#     online_users.add(username)
#     return jsonify({"status": "success", "message": f"{username} is now online"})


# @app.route("/user_offline", methods=["POST"])
# def user_offline():
#     username = request.json.get("username")
#     if not username:
#         return jsonify({"status": "error", "message": "Username is required"}), 400
#     online_users.discard(username)
#     return jsonify({"status": "success", "message": f"{username} is now offline"})


# @app.route("/initiate_match", methods=["POST"])
# def initiate_match():
#     username1 = request.json.get("username1")
#     username2 = request.json.get("username2")

#     if not username1 or not username2:
#         error = jsonify({"status": "error", "message": "Both usernames are required"})
#         return (error ,400)

#     if username2 in pending_matches and username1 in pending_matches[username2]:
#         # Match found, create a new game
#         gameboard = generate_gameboard()
#         active_matches[(username1, username2)] = gameboard
#         del pending_matches[username2]
#         return jsonify(
#             {"status": "success", "message": "Match started", "gameboard": gameboard}
#         )
#     else:
#         # Add to pending matches
#         if username1 not in pending_matches:
#             pending_matches[username1] = set()
#         pending_matches[username1].add(username2)

#         # Wait for a match (timeout after 30 seconds)
#         start_time = time.time()
#         while time.time() - start_time < 30:
#             if (username1, username2) in active_matches:
#                 return jsonify(
#                     {
#                         "status": "success",
#                         "message": "Match started",
#                         "gameboard": active_matches[(username1, username2)],
#                     }
#                 )
#             time.sleep(1)

#         # Timeout occurred
#         pending_matches[username1].discard(username2)
#         if not pending_matches[username1]:
#             del pending_matches[username1]
#         return jsonify({"status": "error", "message": "Match timeout"}), 408


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)