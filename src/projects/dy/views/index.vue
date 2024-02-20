<!--
 * @Author: Shber
 * @Date: 2024-01-26 12:02:03
 * @LastEditors: Shber
 * @LastEditTime: 2024-01-26 16:48:02
 * @Description: 
-->
<template>
    <h3>这是首页323</h3>

    <van-swipe
        class="goods-swipe"
        :autoplay="3000"
    >
        <van-swipe-item
            v-for="thumb in thumbs"
            :key="thumb"
        >
            <img :src="thumb" />
        </van-swipe-item>
    </van-swipe>
</template>

<script setup>
    const thumbs = [
        "https://img.yzcdn.cn/public_files/2017/10/24/e5a5a02309a41f9f5def56684808d9ae.jpeg",
        "https://img.yzcdn.cn/public_files/2017/10/24/1791ba14088f9c2be8c610d0a6cc0f93.jpeg",
    ];
</script>

<style lang="scss" scoped></style>
