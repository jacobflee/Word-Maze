export class API {
    constructor(model) {
        this.model = model;
    }


    /*................CREATE................*/

    async createNewUser(userName) {
        const url = '/create_new_user';
        const params = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName }),
        };
        const response = await fetch(url, params);
        if (response.ok) {
            return await response.json()
        } else {
            console.error(response);
        }
    }


    /*................UPATE................*/

    async updateUserName(userName) {
        const userId = this.model.user.id;
        const url = '/update_user_name';
        const params = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, userName }),
        };
        const response = await fetch(url, params);
        if (response.ok) {
            return await response.json()
        } else {
            console.error(response);
        }
    }

    async updateOnlineStatus(onlineStatus) {
        const userId = this.model.user.id;
        const url = '/update_online_status';
        const params = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, onlineStatus }),
        };
        const response = await fetch(url, params);
        if (response.ok) {
            return await response.json()
        } else {
            console.error(response);
        }
    }

    async updateRandomMatchQuery(randomMatchQuery) {
        const userId = this.model.user.id;
        const url = '/update_random_search_query';
        const params = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, randomMatchQuery }),
        };
        const response = await fetch(url, params);
        if (response.ok) {
            return await response.json()
        } else {
            console.error(response);
        }
    }

    async updateFriendMatchQuery(friendMatchQuery) {
        const userId = this.model.user.id;
        const url = '/update_friend_search_query';
        const params = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, friendMatchQuery }),
        };
        const response = await fetch(url, params);
        if (response.ok) {
            return await response.json()
        } else {
            console.error(response);
        }
    }


    /*................READ................*/

    async fetchNewGameData() {
        const url = '/fetch_new_game_data';
        const response = await fetch(url);
        if (response.ok) {
            return await response.json()
        } else {
            console.error(response);
        }
    }

    async fetchUserId(userName) {
        const url = '/fetch_user_id';
        const params = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName }),
        };
        const response = await fetch(url, params);
        if (response.ok) {
            return await response.json()
        } else {
            console.error(response);
        }
    }
}