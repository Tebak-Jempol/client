<template>
    <div id="rooms">
        <div class= "container">
            <div class="row">
                <room-card @click="chooseRoom(single)" v-for="(single, index) in roomList" :key="index" :link="single"></room-card>   
            </div>
        </div>
    </div>
</template>

<script>
    import database from '../assets/config'
    import RoomCard from '@/components/RoomCard.vue'
    export default{
        data(){
            return {
                showRoom: false,
                roomList: []
            }
        },
        components : {
            RoomCard
        },
        methods: {
            getAllRoom: function() {
                let self = this;
                database.ref('room/').once('value', function(snapshot) {
                    console.log('get all rooms', snapshot.val());
                    let result = snapshot.val();
                    self.roomList = Object.keys(result);
                    let values = Object.values(result)
                    console.log(values)
                });
            },
        }
        created(){
            this.getAllRoom();
        }
    }
</script>