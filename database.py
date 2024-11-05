from contextlib import contextmanager
import sqlite3


class Database:
    def __init__(self, db_path='database.db'):
        self.db_path = db_path
        self.create_table()


    @contextmanager
    def get_cur(self):
        con = sqlite3.connect(self.db_path)
        try:
            cur = con.cursor()
            yield cur
            con.commit()
        finally:
            con.close()


    #................CREATE................#

    def create_table(self):
        with self.get_cur() as cur:
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS users (
                    user_id INTEGER PRIMARY KEY,
                    user_name TEXT UNIQUE,
                    online_status BOOLEAN,
                    friend_match_query INTEGER,
                    random_match_query BOOLEAN
                )
                """
            )


    def create_new_user(self, user_name):
        with self.get_cur() as cur:
            try:
                cur.execute(
                    """
                    INSERT INTO users
                    VALUES (
                        NULL,
                        :user_name,
                        TRUE,
                        FALSE,
                        FALSE
                    )
                    """,
                    {
                        "user_name": user_name,
                    },
                )
                return {
                    'user_id': cur.lastrowid,
                }
            except sqlite3.IntegrityError:
                return {
                    'error': 'username is already taken',
                }
            

    #................UPDATE................#
    
    def update_user_name(self, user_id, user_name):
        with self.get_cur() as cur:
            try:
                cur.execute(
                    """
                    UPDATE users
                    SET user_name = :user_name
                    WHERE user_id = :user_id
                    """,
                    {
                        'user_id': user_id,
                        'user_name': user_name,
                    }
                )
            except sqlite3.IntegrityError:
                return {
                    'error': 'username is already taken',
                }
            
    
    def update_online_status(self, user_id, online_status):
        with self.get_cur() as cur:
            cur.execute(
                """
                UPDATE users
                SET online_status = :online_status
                WHERE user_id = :user_id
                """,
                {
                    'user_id': user_id,
                    'online_status': online_status,
                }
            )
    

    def update_friend_match_query(self, user_id, friend_match_query):
        with self.get_cur() as cur:
            cur.execute(
                """
                UPDATE users
                SET friend_match_query = :friend_match_query
                WHERE user_id = :user_id
                """,
                {
                    'user_id': user_id,
                    'friend_match_query': friend_match_query,
                }
            )


    def update_random_match_query(self, user_id, random_match_query):
        with self.get_cur() as cur:
            cur.execute(
                """
                UPDATE users
                SET random_match_query = :random_match_query
                WHERE user_id = :user_id
                """,
                {
                    'user_id': user_id,
                    'random_match_query': random_match_query,
                }
            )
            

    #................READ................#

    def fetch_user_id(self, user_name):
        with self.get_cur() as cur:
            cur.execute(
                """
                SELECT user_id
                FROM users
                WHERE user_name = :user_name
                """,
                {
                    'user_name': user_name,
                }
            )
            user_id = cur.fetchone()
            if user_id:
                return {
                    'user_id': user_id[0],
                }
            else:
                return {
                    'error': 'username not found',
                }