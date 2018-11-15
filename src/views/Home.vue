<template>
    <div class="home">
        <div class="mt-4 mb-5 d-flex align-items-center justify-content-center mr-5">
            <div class="display-3">The Bloody Hangman</div>
        </div>
        <div class="alert mb-0 container col-7" id="alert-subtitle">
            <h3 id="subtitle">Interested to try a thrilling hangman game? Immediately make a room below!</h3>
        </div>
        <div class="d-flex justify-content-center align-items-center mb-4 col-9 m-auto p-3 rounded" id="divroom">
            <div class="mr-5 d-flex align-items-center">
                <div class="lead mr-5">Playing Rooms</div> 
                <i class="fas fa-arrow-circle-right"></i>
            </div>
            <div class="ml- mr-5" id="listroom" v-if="roomList.length > 0">
                <div id="oneroom" @click="chooseRoom(single)" v-for="(single, index) in roomList" :key="index"> {{single}}</div>
            </div>
            <div class="col-6">
                <form @submit.prevent="setRoom">
                    <input type="text" class="form-control" placeholder="Room" v-model="room"><br>
                    <button class="btn btn-outline-dark" id="btn-room">Enter Room</button>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import database from '../assets/config';

export default {
    name: 'home',
    data() {
        return {
            room: '',
            roomList: []
        }
    },
    methods: {
        chooseRoom: function(chosenRoom) {
            this.room = chosenRoom;
        },
        setRoom: function() {
            let self = this;
            if (self.room) {
                let thumbRoom = database.ref('room/' + self.room);
                thumbRoom.once('value', function(snapshot) {
                    let result = snapshot.val();
                    console.log('check room', result);
                    if (!result) {
                        database.ref('room/' + self.room).set({
                            name: self.room
                        })
                            .then(response => {
                                console.log('set room name', response);
                                localStorage.setItem('room', self.room);
                                self.$router.push('login');
                            })
                            .catch(function(err) {
                                console.log('Set Room Name Error: ', err);
                            });
                    } else {
                        let roomUsers = result.users;
                        if (roomUsers && Object.keys(roomUsers).length >= 3) {
                            localStorage.removeItem('room');
                            alert('Full Room. Please choose another!')
                        } else {
                            localStorage.setItem('room', self.room);
                            self.$router.push('login');
                        }
                    }
                });
            }
        },
        getAllRoom: function() {
            let self = this;
            database.ref('room/').once('value', function(snapshot) {
                console.log('get all rooms', snapshot.val());
                let result = snapshot.val();
                self.roomList = Object.keys(result);
            });
        }
    },
    created() {
        this.getAllRoom();
    }
}
</script>

<style scoped>
input, button {
  width: 100%;
  text-align: center;
}

#oneroom:hover {
  background-color: #003366;
  cursor: pointer;
}

#divroom {
  background-color: rgb(134, 5, 5);
  color: white;
}

#btn-room {
  background-color: black;
  border: none !important;
  color: white;
}

#btn-room:hover {
  background-color: #ffa500;
  border: none !important;
  color: white;
}

ul, li {
  list-style: none;
}
</style>