"""
write me a python flask app to be deployed on either (render or koyeb) that does the following things:
1) upon an api call to get a gameboard, returns a json with a string of 16 random capital letters
2) upon an api call to tell the server that username is online, the flask app adds the username to the set of online usernames
3) upon an api call to tell the server that username is offline, the flask app removes the username from the set of online usernames
4) upon an api call to get the set of users, returns the set of online usernames
5) upon an api call to initiate a multiplayer match with username1 from username2, the flask app checks
    if username2 has initiated a multiplayer match with username1, then send both a gameboard
    else wait until username2 initiates a multiplayer match with username1
"""

import flask
from flask import request, jsonify, render_template
import random
import string
import time


app = flask.Flask(__name__)

# In-memory storage
online_users = set()
pending_matches = {}
active_matches = {}


@app.route('/')
def index():
    return render_template('index.html')


@app.route("/get_gameboard", methods=["GET"])
def get_gameboard():
    gameData = {
        "board": [
		["R", "A", "E", "R"],
		["E", "T", "I", "G"],
		["S", "T", "I", "N"],
		["A", "L", "U", "C"]
	],
        "words": {
            3: ["CUT", "CIT", "CIG", "UTA", "UTS", "UTE", "UNI", "LAS", "LAT", "LIT", "LIG", "LIN", "LUN", "ALS", "ALT", "ALU", "NUT", "NIL", "NIT", "NIE", "TAS", "TUI", "TUN", "SER", "SEA", "SET", "SAT", "SAL", "GIT", "GIE", "GIN", "GET", "GER", "GNU", "ITS", "ITA", "IRE", "ING", "TET", "TES", "TAR", "TAE", "TAI", "TEA", "TEG", "TIE", "TIL", "TIT", "TIG", "TIN", "TIC", "ERA", "EST", "RIT", "RIA", "RIG", "RIN", "REG", "REI", "ETA", "EAR", "EAT", "ERG", "ART", "ARE", "AIT", "AIR", "AIN", "ATS", "ATE", "ATT", "RAI", "RAT", "RET", "RES"],
            4: ["CULT", "CUTS", "CUTE", "CUIT", "CITS", "CITE", "UTAS", "UTES", "UNIT", "UNCI", "LASE", "LAST", "LATS", "LATE", "LATI", "LATU", "LITU", "LITS", "LITE", "LING", "LUTE", "LUIT", "LUNG", "ASEA", "ALTS", "ALIT", "NUTS", "NILS", "NITS", "NITE", "INIA", "TASE", "TALI", "TEAT", "TETE", "TUNG", "SERA", "SEAR", "SEAT", "SETA", "SETT", "STAR", "STET", "STIE", "STIR", "STUN", "SLAT", "SLIT", "SLUT", "SATE", "SATI", "SALT", "GILA", "GILT", "GITS", "GITE", "GETS", "GETA", "GEAR", "GEAT", "GEIT", "GRIT", "GRIN", "ITAS", "TETS", "TEST", "TRET", "TRES", "TAES", "TARE", "TAIT", "TAIG", "TAIN", "TEAR", "TEIN", "TIAR", "TIER", "TIRE", "TILS", "TILT", "TITS", "TITE", "TITI", "TIGE", "TING", "ETAS", "ETUI", "RITS", "RITE", "RITT", "RING", "REAR", "REIN", "ETIC", "EATS", "ARTS", "ARTI", "ARET", "ARES", "AITU", "AITS", "ATES", "RAIT", "RAIN", "RATS", "RATE", "RETE", "RETS", "REST"],
            5: ["CULTS", "CULTI", "CUTER", "CUTES", "CUTIE", "CUTIN", "CUITS", "CUING", "CUNIT", "CITAL", "CITES", "CITER", "UTTER", "UNITS", "UNITE", "UNGET", "LASER", "LATER", "LATTE", "LITAS", "LITES", "LITRE", "LITAI", "LITER", "LIGER", "LUTER", "LUTEA", "LUTES", "LUNGI", "LUNGE", "ASTER", "ASTIR", "ASTUN", "ATTAR", "ALTER", "ALIGN", "NITES", "NITRE", "NITER", "NIGER", "TASER", "TASTE", "TERTS", "TEATS", "TETRA", "TESTE", "TITRE", "TUNIC", "SERAI", "SETAE", "SETAL", "STRAE", "STARE", "STAIR", "STAIG", "STAIN", "STEIN", "STILT", "STEAR", "STIRE", "STING", "STUNG", "SLATE", "SLING", "SLUIT", "SLUNG", "SATIN", "SALIC", "SALUT", "GILAS", "GILTS", "GITES", "GEARE", "GEATS", "GEITS", "GRITS", "GREAT", "GREIN", "INULA", "INCUT", "TERAI", "TESTA", "TESLA", "TRAIT", "TRAIN", "TRETS", "TREST", "TARES", "TAITS", "TILTS", "TITER", "TIGER", "TINGE", "ESTER", "RITES", "RITTS", "REIGN", "ETTIN", "EATER", "ERING", "ARTIC", "ARETE", "ARETS", "ARETT", "ATILT", "ATIGI", "ATTIC", "RAITA", "RAITS", "RATES", "RATER", "REATE", "RETIA", "RETIE", "RESAT"],
            6: ["CULTER", "CUTEST", "CUTTER", "CUTLAS", "CUITER", "CUNITS", "CITALS", "CITING", "ULSTER", "UNITAL", "UNITES", "UNITER", "UNGILT", "UNGETS", "UNGEAR", "LASTER", "LATEST", "LATTES", "LATTER", "LATTIN", "LITEST", "LITRES", "LITING", "LITTER", "LINIER", "LINGER", "LUTITE", "LUTING", "LUNIER", "LUNGIE", "LUNGER", "LUCITE", "ASTARE", "ASTERT", "ATTAIN", "NUTTER", "NITRES", "TASTER", "TERTIA", "TESTAE", "TESTER", "TITRES", "TUNIER", "SEATER", "SETTER", "STRAIT", "STRAIN", "STEARE", "STINGE", "SLATER", "SLUING", "SATIRE", "SATING", "SALTER", "SALTIE", "SALUTE", "GITTIN", "GETTER", "GEARES", "GREATS", "ITALIC", "IGNITE", "INULAS", "INCULT", "INCUTS", "INCITE", "TRAITS", "TAEING", "TEAING", "TITULI", "TILTER", "TINIER", "RITTER", "RETEAR", "RETEST", "REATES", "REGILT", "REITER", "EATING", "ARTIER", "ARTIGI", "ARETTS", "AIGRET", "ATTIRE", "RAITAS", "RATITE", "RATING", "RETAIN", "RETIRE", "RESTER"],
            7: ["CULTIER", "CUTTIER", "CUTTING", "LASTING", "LIGNITE", "LINGIER", "LUTITES", "LUCITES", "ASTERIA", "ALUNITE", "NUTTIER", "NITTIER", "TASTIER", "TASTING", "SEATING", "SETTING", "STILTER", "STALING", "STINGER", "SLATTER", "SLATIER", "SLATING", "SLITTER", "SLINGER", "SATIATE", "SALTIER", "SALTIRE", "SALTING", "SALUTER", "SALUING", "GRITTER", "GREATER", "ITERATE", "IGNITES", "IGNITER", "INULASE", "INCITES", "INCITER", "TESTIER", "TESTING", "TERGITE", "TITLING", "TILTING", "RITTING", "RETRAIT", "RETRAIN", "ETTLING", "ERINITE", "AIGRETS", "ATRETIC", "RAITING", "RATITES", "RATTIER", "RATTING", "RATTLIN", "RETASTE", "RETTING", "RESTIER", "RESTING"],
            8: ["UTTERING", "LITERATE", "LITERATI", "LIGNITES", "ALUNITES", "SETTLING", "STILTIER", "STILTING", "STINGIER", "SLATTING", "SLITTIER", "SLITTING", "SLINGIER", "SLUTTIER", "SATINIER", "SALUTING", "GREATEST", "TERGITES", "TITULING", "RINGETTE", "RETRAITS", "RETRAITE", "REIGNITE", "REINCITE", "ERINITES", "ARETTING", "AIGRETTE", "RATTLING", "RETINULA", "RETINITE", "RETICULA"],
            9: ["CUITERING", "LITTERING", "ASTERTING", "ALITERATE", "SETTERING", "STRAITING", "SATIATING", "ITERATING", "RINGETTES", "RETESTING", "RETRAITES", "RETINITES", "REIGNITES", "REINCITES", "AIGRETTES", "RETITLING", "RETASTING", "RETINULAS", "RESLATING"],
            10: ["SLATTERING", "RETICULATE", "ARTICULATE", "RESALUTING"],
            11: ["RETICULATES", "REITERATING", "ARTICULATES"],
            12: ["REARTICULATE", "ARTICULATING", "RETICULATING"],
            13: ["REARTICULATES"],
            14: ["REARTICULATING"],
        }
    }
    gameData = jsonify(gameData)
    return gameData


@app.route("/get_online_users", methods=["GET"])
def get_online_users():
    return jsonify(list(online_users))


@app.route("/user_online", methods=["POST"])
def user_online():
    username = request.json.get("username")
    if not username:
        return jsonify({"status": "error", "message": "Username is required"}), 400
    online_users.add(username)
    return jsonify({"status": "success", "message": f"{username} is now online"})


@app.route("/user_offline", methods=["POST"])
def user_offline():
    username = request.json.get("username")
    if not username:
        return jsonify({"status": "error", "message": "Username is required"}), 400
    online_users.discard(username)
    return jsonify({"status": "success", "message": f"{username} is now offline"})


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
    app.run(host='0.0.0.0', port=8000, debug=True)