export async function getGameData() {
    try {
        const url = '/get_game_data';
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) throw Error(data.message);
        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function setUserOnline(username) {
    try {
        const url = `/user_online`;
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

export async function setUserOffline(username) {
    try {
        const url = `/user_offline`
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

export async function getOnlineUsers() {
    try {
        const url = `/get_online_users`;
        const response = await fetch(url);
        const data = await response.json();
        if (!response.ok) throw Error(data.message);
        return data;
    } catch (error) {
        console.error(error);
    }
}

export async function initiateMatch(username1, username2) {
    try {
        const url = `/initiate_match`;
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