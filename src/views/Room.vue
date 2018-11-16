<template>
    <div>
        <div v-if="!gameOver">
            <div class="bg-dark text-white">
                <p class="text-white">Currently playing: </p>
                {{ players[indexCurrentPlayer].username }}
            </div>
            <p class="waiting" v-if="initialized === false">Waiting for opponent
                <span>
                    <div class="loader">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                    </div>
                </span>
            </p>
            <div v-if="isCurrentlyPlaying">
                <label for="">PREDICTION</label>
                <input type="text" v-model="prediction" class="form-control">
                <button class="btn btn-primary" @click="setPrediction">Submit</button>
            </div>
            <div v-if="predictionSet">
                <label for="">INPUT THUMB</label>
                <input type="text" v-model="inputThumb" class="form-control">
                <button class="btn btn-primary" @click="setInputThumb">Submit</button>
            </div>
            {{ predictionSet }}
        </div>
        <div v-if="gameOver">
            
        </div>
        <div v-if="winner">

        </div>
    </div>
</template>

<script>
import database from '../fire'

export default {
    name: 'room',
    data() {
        return {
            initialized: false,
            winner: false,
            gameOver: false,
            player1: '',
            player2: '',
            player1Info: '',
            player2Info: '',
            me: '',
            room: '',
            userId: '',
            indexCurrentPlayer: 0,
            players: [],
            playersId: [],
            isCurrentlyPlaying: false,
            prediction: 0,
            currentPlayer: '',
            predictionSet: false,
            inputThumb: 0,
            counter: 0,
            currentPlayerId: '',
            compared: false
        }
    },
    methods: {
        getAllPlayers: function() {
            return new Promise ((resolve, reject) => {
                let self = this;
                let ref = database.ref('room/' + this.room + '/users');
                ref.once('value', function(snapshot) {
                    let users = snapshot.val();

                    let player = Object.keys(users);
                    let playerinfos = Object.values(users);

                    self.players = playerinfos;
                    self.playersId = player;
                    console.log('player infos', self.players);
                    resolve()
                });
            })
            
        },  
        checkTurnPlayer: function() {
            return new Promise ((resolve, reject) => {
                let self = this;
                let ref = database.ref('room/' + self.room + '/turnPlayer')
                let refId = database.ref('room/' + self.room + '/turnPlayerId')
                // ref.update(self.players[self.currentPlayer].username);
                // ref.on('value', function(snapshot) {
                //     let value = snapshot.val();
                //     console.log('turn player', value);
                // })

                ref.set(self.players[self.indexCurrentPlayer].username); 

                refId.set(self.playersId[self.indexCurrentPlayer]);
                
                refId.once('value', function(snapshot) {
                    self.currentPlayerId = snapshot.val();
                })

                console.log('current id', self.currentPlayerId)
            
                ref.once('value', function(snapshot) {
                    self.currentPlayer = snapshot.val();
                })

                console.log('self current', self.currentPlayer);
                if (self.currentPlayer === localStorage.getItem('username')) {
                    self.isCurrentlyPlaying = true;
                }

                resolve()
            })
            
            
        },
        setPrediction: function() {
            let self = this;
            let userId = localStorage.getItem('userId')
            let ref = database.ref('room/' + self.room + '/users/' + userId + '/prediction');

            ref.set(self.prediction);

            let refPrediction = database.ref('room/' + self.room + '/predictionSet');
            refPrediction.set(true);

            self.predictionSet = true;            
        },
        setInputThumb: function() {
            let self = this;
            let userId = localStorage.getItem('userId');
            let ref = database.ref('room/' + self.room + '/users/' + userId + '/inputThumb');

            ref.set(self.inputThumb);
            
            let refInput = database.ref('room/' + self.room + '/users/' + userId + '/isThumbSet');
            refInput.set(true);

            let refReady = database.ref('room/' + self.room + '/readyThumbs');
            refReady.once('value', function(snapshot) {
                let amount = snapshot.val();
                refReady.set(amount + 1);
            })
        },
        nextTurn: function() {
            if (this.indexCurrentPlayer === 0) {
                this.indexCurrentPlayer = 1;
            } else if (this.indexCurrentPlayer === 1) {
                this.indexCurrentPlayer = 0;
            }
        },
        checkAllUsers: function() {
            let currentRoom = localStorage.getItem('room');
            let userId = localStorage.getItem('userId');
            this.room = currentRoom;
            this.userId = userId;
            
            let thumbRoom = database.ref('room/' + this.room);
            let self = this;
            thumbRoom.on('value', function(snapshot) {
                let arrUsers = snapshot.val().users;
                if (Object.keys(arrUsers).length === 2) {
                    self.player1 = Object.keys(arrUsers)[0];
                    self.player1Info = Object.values(arrUsers)[0];
                    self.player2 = Object.keys(arrUsers)[1];
                    self.player2Info = Object.values(arrUsers)[1];
                    
                    if (self.player1 === localStorage.getItem('userId')) {
                        self.me = self.player1Info;
                    } else {
                        self.me = self.player2Info;
                    }

                    self.initialize();
                }
            });
        },
        initialize: function() {
            let self = this;
            this.initialized = true;
            this.checkTurnPlayer();
        },
        backToLobby: function() {
            localStorage.removeItem('room');
            localStorage.removeItem('userId');
            let ref = database.ref('room/' + this.room);
            ref.set({});
            this.$router.push('/');
        },
        checkPrediction: function() {
            let self = this;
            let ref =  database.ref('room/' + self.room + '/users');
            let total = 0;
            ref.once('value', function(snapshot) {
                let users = snapshot.val();
                console.log('users', users);
                let arr_users = Object.values(users);
                console.log('arr', arr_users);    
                
                for (let i = 0; i < arr_users.length; i++) {
                    total += Number(arr_users[i].inputThumb);
                }
            });
            console.log('total', total);

            let refCurrentUser = database.ref('room/' + self.room + '/users/' + self.currentPlayerId);

            refCurrentUser.once('value', function(snapshot) {
                let value = snapshot.val().prediction;
                console.log('value current', value);
                // console.log('hais', self.currentPlayerId);
                if (total === Number(value)) {
                    console.log('bener')
                } else {
                    console.log('salah')
                }
            })
        }
    },
    mounted() {
        let self = this;
        this.checkAllUsers();
        this.getAllPlayers()
            .then(() => {
                this.checkTurnPlayer()
                .then(() => {
                    let ref = database.ref('room/' + self.room + '/predictionSet');
                    ref.on('value', function(snapshot) {
                        console.log('hai', snapshot.val())
                        if (self.counter === 0) {
                            self.predictionSet = false;
                            self.counter++;
                        } else {
                            self.predictionSet = true;
                        }
                        console.log('hai 2', snapshot.val())
                    });

                    let refReady = database.ref('room/' + self.room + '/readyThumbs');
                    refReady.on('value', function(snapshot) {
                        if (snapshot.val() >= 2) {
                            self.checkPrediction()

                        }
                    })
                })
            })
    },
    created() {
        // let self = this;
        // let ref = database.ref('room/' + localStorage.getItem('room') + '/users')
        // ref.on('value', function(snapshot) {
        //     var changed = snapshot.val();
        //     if (localStorage.getItem('userId') === Object.keys(changed)[0]) {
        //         if (Object.values(changed)[0].status === 'loser') {
        //             self.gameOver = true;
        //         } else if (Object.values(changed)[0].status === 'winner') {
        //             self.winner = true;
        //         }
        //     } else if (localStorage.getItem('userId') === Object.keys(changed)[1]) {
        //         if (Object.values(changed)[1].status === 'loser') {
        //             self.gameOver = true;
        //         } else if (Object.val(changed)[1].status === 'winner') {
        //             self.winner = true;
        //         }
        //     }
        // });        
    }
}
</script>

<style>
.waiting {
  margin-top: 20px;
  color: #e6e6e6;
  font-size: larger;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dot {
  width: 10px;
  height: 10px;
  background: #fff;
  border-radius: 100%;
  margin: auto 3px;
  display: inline-block;
  animation: slide 1s infinite;
}
.dot:nth-child(1) {
  animation-delay: 0.1s;
  background: white(#3ac, 50);
}
.dot:nth-child(2) {
  animation-delay: 0.2s;
  background: white(#3ac, 100);
}
.dot:nth-child(3) {
  animation-delay: 0.3s;
  background: white(#3ac, 150);
}

@-moz-keyframes slide {
  0% {transform: scale(1);}
  50% {opacity: 0.3; transform: scale(1.2);}
  100% {transform: scale(1);}
}
@-webkit-keyframes slide {
  0% {transform: scale(1);}
  50% {opacity: 0.3; transform: scale(1.2);}
  100% {transform: scale(1);}
}
@-o-keyframes slide {
  0% {transform: scale(1);}
  50% {opacity: 0.3; transform: scale(1.2);}
  100% {transform: scale(1);}
}
@keyframes slide {
  0% {transform: scale(1);}
  50% {opacity: 0.3; transform: scale(1.2);}
  100% {transform: scale(1);}
}
</style>