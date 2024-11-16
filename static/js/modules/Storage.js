export class Storage {
    getArray(key) {
        return JSON.parse(localStorage.getItem(key)) ?? []
    }

    setArray(key, array) {
        localStorage.setItem(key, JSON.stringify(array));
    }
    
    getUser() {
        const order = this.getArray('friends');
        const names = new Set(order.map((friend) => friend.name));
        const ids = new Set(order.map((friend) => friend.id));
        return {
            name: localStorage.getItem('name'),
            id: localStorage.getItem('id'),
            friends: { order, ids, names },
        }
    }

    setUserId(userId) {
        localStorage.setItem('id', userId);
    }

    setUserName(userName) {
        localStorage.setItem('name', userName);
    }

    setFriendsOrder(order) {
        this.setArray('friends', [...order]);
    }
}