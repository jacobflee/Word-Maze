export class API {
    async getGameData() {
        try {
            const url = '/api/get_game_data';
            const response = await fetch(url);
            const data = await response.json();
            if (!response.ok) throw Error(data.message);
            return data;
        } catch (error) {
            console.error(error);
        }
    }
    
    async setUserOnline(username) {
        try {
            const url = `/api/user_online`;
            const params = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            };
            const response = await fetch(url, params);
            const data = await response.json();
            if (!response.ok) throw Error(data.message);
            return data;
        } catch (error) {
            console.error(error);
        }
    }
    
    async setUserOffline(username) {
        try {
            const url = `/api/user_offline`
            const params = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            };
            const response = await fetch(url, params);
            const data = await response.json();
            if (!response.ok) throw Error(data.message);
            return data;
        } catch (error) {
            console.error(error);
        }
    }
    
    async getOnlineUsers() {
        try {
            const url = `/api/get_online_users`;
            const response = await fetch(url);
            const data = await response.json();
            if (!response.ok) throw Error(data.message);
            return data;
        } catch (error) {
            console.error(error);
        }
    }
    
    async initiateMatch(username1, username2) {
        try {
            const url = `/api/initiate_match`;
            const params = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username1, username2 }),
            };
            const response = await fetch(url, params);
            const data = await response.json();
            if (!response.ok) throw Error(data.message);
            return data;
        } catch (error) {
            console.error(error);
        }
    }
}