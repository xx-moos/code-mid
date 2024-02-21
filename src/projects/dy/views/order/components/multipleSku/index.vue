<template>
    <div class="bg-base">asdasdasd asdasdasd asdas</div>
</template>

<script setup>
    import IphoneCard from "@projects/dy/components/IphoneCard.vue";
</script>

<style lang="less" scoped>
    .bg-base {
        position: relative;

        background: url("./../../img/bg.png");
        background-size: cover;
        height: 317px;

        .copy {
            width: 42px;
            height: 18px;
            line-height: 18px;
            border-radius: 9px;
            border: 1px solid #ff7609;

            font-size: 12px;
            color: #ff7609;
            text-align: center;
        }

        .item {
            position: absolute;
            top: 30px;
            left: 10px;
        }
    }
</style>
