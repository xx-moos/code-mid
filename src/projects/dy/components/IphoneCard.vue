<template>
    <div class="phone">
        <van-field
            v-model="tel"
            type="tel"
            label=""
            placeholder="手机号"
        />

        <p>此手机号将作为权益的使用手机号</p>

        <van-field
            v-model="sms"
            center
            clearable
            label=""
            placeholder="请输入短信验证码"
        >
            <template #button>
                <span>发送验证码</span>
            </template>
        </van-field>

        <van-button
            class="sub-btn"
            type="primary"
            block
            >立即兑换</van-button
        >

        <van-checkbox
            class="sub-check"
            v-model="checked"
            shape="square"
            >勾选表示您已同意
            <span>《服务条款》</span>
            和
            <span>《隐私政策》</span>
        </van-checkbox>
    </div>
</template>

<script setup>
    const activeName = ref("second");

    const handleClick = (tab, event) => {
        console.log(tab, event);
    };
</script>

<style lang="less" scoped>
    .phone {
        background: #fff;
        border-radius: 6px;
        padding: 20px 16px 26px;
        overflow: hidden;

        p {
            font-size: 12px;
            color: #818181;
            padding: 10px 0;
            padding-left: 14px;
        }

        :deep(.van-cell) {
            padding: 0;
            border: none;
            box-shadow: none;

            &:after {
                content: none;
            }
        }

        :deep(.van-field__button) {
            color: #ff7609;
            font-size: 16px;
            border: none;
            box-shadow: none;
        }

        :deep(.van-field__control) {
            background: #f5f5f5;
            border-radius: 8px;
            height: 45px;
            padding-left: 14px;
            font-size: 16px;
        }

        .sub-btn {
            border: none;
            margin-top: 18px;
            border-radius: 24px;
            background: linear-gradient(90deg, #ff7e34 0%, #ff5c34 100%);

            height: 45px;
            font-size: 20px;
            font-weight: 600;
        }

        .sub-check {
            margin-top: 16px;
            padding-left: 20px;
            font-size: 12px;
            font-weight: 400;
            color: #101010;
            span {
                color: #ff7609;
            }
        }
    }
</style>
