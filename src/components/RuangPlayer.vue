<template>
    <div class="about">
        <div>
            <img src="@/assets/jempolTrue.gif" style="width: 200px; height:auto;" v-if="jempolTrue" />
            <img src="@/assets/jempol1.gif" style="width: 200px; height:auto;" v-if="jempol1" />
            <img src="@/assets/jempol2.gif" style="width: 200px; height:auto;" v-if="jempol2" />
            <img src="@/assets/jempol0.gif" style="width: 200px; height:auto;" v-if="jempol0" />
        </div>
        <div class="footer">
            <button @click="jempol1 = false; jempol2 = false; jempol0 = true; jempolTrue = false; dataJempol=0; addInput">0</button>
            <button @click="jempol1 = true; jempol2 = false; jempol0 = false; jempolTrue = false; dataJempol=1; addInput">1</button>
            <button @click="jempol1 = false; jempol2 = true; jempol0 = false; jempolTrue = false; dataJempol=2; addInput">2</button>
            
        </div>
    </div>
</template>

<script>
export default {
    name: 'RuangPlayer',
    data: function() {
        return {
            jempolTrue: false,
            jempol1: false,
            jempol2: false,
            jempol0: true,
            dataJempol : 0
        };
    },
    methods: {
        addInput(){
            this.$emit('send-jempol', this.dataJempol)
            console.log(this.dataJempol)
        }
    }
}
</script>

<style scoped>
    .about{
        position: relative;
        border: 7px solid; width: 250px; height: 250px;
    }
    .footer{
        position: absolute;
        bottom: 5px;
        text-align: center;
        width: 100%;
    }
</style>

