<template>
    <div class="about">
        <h1>Ruang Player</h1>
        <div class="container">
            <div class="row" align="center">
                <div class="col-sm col-6"><RuangPlayer /></div>
                <div class="col-sm col-6"><RuangPlayer /></div>
            </div>
            <div class="row" align="center">
                <div class="col-sm-12"><RuangPlayer /></div>
            </div>
        </div>
    </div>
</template>

<script>
import RuangPlayer from '@/components/RuangPlayer.vue'

export default {
    name: 'About',
    components: {
        RuangPlayer,
    },
}
</script>
