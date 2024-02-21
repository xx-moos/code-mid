<template>
    <div class="bg-base">
        <div class="item">
            <div>
                <div class="content">
                    <i class="dot-left"></i>
                    <i class="dot-right"></i>

                    <div class="flex items-center justify-between">
                        <div class="number">
                            <span>订单号：</span>
                            <span>23898979898381924</span>
                        </div>
                        <div class="copy">复制</div>
                    </div>
                    <div class="flex good">
                        <img
                            src="./../../img/bg.png"
                            alt=""
                        />

                        <p class="overflow-hidden text-nowrap break-all pro-title">
                            抖音商品名ABC Reading VIP双年卡
                            VIP双年卡VIP双年卡VIP双年卡VIP双年卡VIP双年卡VIP双年卡VIP双年卡VIP双年卡VIP双年卡VIP双年卡VIP双年卡
                        </p>
                    </div>
                </div>
                <div class="footer">
                    <p class="title">兑换码</p>
                    <p class="code">VTKJVSXQKY8JNUH1</p>
                    <div class="time">
                        <p><span>15</span>时<span>15</span>分<span>15</span>秒后失效</p>
                        &nbsp;
                        <div class="copy">复制</div>
                    </div>
                    <p class="tip">为保障兑换码的安全，请在有效时间内兑换</p>
                </div>
                <img
                    class="ribbon"
                    src="./../../img/unredeemed.png"
                />
            </div>
        </div>
    </div>

    <div class="bottom">
        <div class="phone-wrap">
            <IphoneCard />
        </div>

        <div class="bottom-info">
            <img
                src="./../../img/read.png"
                alt=""
            />
        </div>
    </div>
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

            width: 94.2%;

            // margin: 45px 14px 0;

            overflow: hidden;
            margin-bottom: 10px;
            padding-left: 2px;
            position: relative;

            & > div {
                background: #fff;
                border-radius: 5px;
            }
            .dot-left {
                bottom: -6px;
                left: -6px;
            }
            .dot-right {
                bottom: -6px;
                right: -6px;
            }

            .content {
                border-bottom: 2px dotted #e7e7e7;
                position: relative;
                z-index: 2;
                padding: 12px 16px 20px;

                .number {
                    font-size: 16px;
                    color: #333333;
                }

                .good {
                    margin-top: 12px;

                    img {
                        margin-right: 16px;
                        width: 98px;
                        height: 98px;
                    }

                    .pro-title {
                        display: -webkit-box;
                        -webkit-line-clamp: 2;
                        -webkit-box-orient: vertical;

                        height: 48px;

                        margin-top: 10px;

                        font-size: 16px;
                        font-weight: 600;
                        color: #333333;
                    }
                }
            }

            .footer {
                text-align: center;

                padding-bottom: 14px;

                .title {
                    margin-top: 18px;
                    font-size: 16px;
                    color: #818181;
                }

                .code {
                    margin-top: 4px;
                    font-size: 25px;
                    font-weight: 600;
                }

                .time {
                    margin-top: 4px;
                    font-size: 16px;
                    font-family: HarmonyOS_Sans;
                    color: #101010;
                    display: flex;

                    justify-content: center;
                    align-items: center;

                    span {
                        color: #ff7609;
                    }
                }

                .tip {
                    font-size: 12px;
                    margin-top: 5px;
                    color: #818181;
                }
            }
            .ribbon {
                width: 96px;
                height: 95px;
                position: absolute;
                right: 0px;
                top: 38%;
                z-index: 99;
            }
        }
        .item .dot-left,
        .item .dot-right {
            display: block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: #fce09b;
            position: absolute;
            z-index: 999;
        }
    }

    .bottom {
        background: #f4f4f4;
        // background: red;
        overflow: hidden;

        padding-bottom: 60px;

        .phone-wrap {
            margin: 42px 12px 0;
        }
    }

    .bottom-info {
        margin: 30px 12px 0;
        overflow: hidden;
    }
</style>
