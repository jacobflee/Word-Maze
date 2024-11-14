export class Storage {
    getArray(key) {
        return JSON.parse(localStorage.getItem(key)) ?? []
    }

    setArray(key, array) {
        localStorage.setItem(key, JSON.stringify(array));
    }
    
    getUser() {
        return {
            name: localStorage.getItem('userName'),
            id: localStorage.getItem('userId'),
            friends: {
                order: this.getArray('friendsOrder'),
                ids: new Set(this.getArray('friendsIds')),
                names: new Set(this.getArray('friendsNames')),
            }
        }
    }

    setUserId(userId) {
        localStorage.setItem('userId', userId);
    }

    setUserName(userName) {
        localStorage.setItem('userName', userName);
    }

    setFriends(friends) {
        this.setArray('friendsOrder', [...friends.order]);
        this.setArray('friendsIds', [...friends.ids]);
        this.setArray('friendsNames', [...friends.names]);
    }

    setFriendsOrder(order) {
        this.setArray('friendsOrder', [...order]);
    }
}