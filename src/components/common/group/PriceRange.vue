<template>
    <div v-if="list && list.length">
        <div
            v-for="item in list.slice().sort((a, b) => a.limit - b.limit)"
            :key="item.limit">
            <div
                v-if="item.limit == 1"
                class="group">
                <span class="number">原价</span>
                <span class="amount"></span>
                <span class="price">{{ item.price }}</span>
            </div>
            <div
                v-else
                class="group">
                <span class="number">{{ item.limit }}人团</span>
                <span
                    class="amount"
                    :style="{width: getAmountWidth(list.length - (item.limit - 1), list.length)}"></span>
                <span class="price bright-color">¥{{ item.price }}</span>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            list: {
                type: Array,
                default: () => [],
            }
        },
        methods: {
            getAmountWidth (num, total) {
                let width = (num / total).toFixed(2) * 0.7;
                return `${parseInt(width * 100)}%`;
            }
        },
    }
</script>
<style lang="less" scoped>
    .group {
        position: relative;
        margin: 10px 0;
        overflow: hidden;

        .bright-color {
            color: #0cadb5;
        }

        .number {
            display: inline-block;
            width: 60px;
            text-align: right;
        }

        .amount {
            display: inline-block;
            margin: 0 5px;
            width: 65%;
            height: 10px;
            background: #86d6da;
        }

        .price {
            display: inline-block;
        }
    }

    @media screen and (min-device-width: 375px) {
        .group {
            .amount {
                width: 65%;
            }
        }
    }

    @media screen and (min-device-width: 414px) {
        .group {
            .amount {
                width: 70%;
            }
        }
    }

    @media screen and (min-device-width: 585px) {
        .group {
            .amount {
                width: 80%;
            }
        }
    }
</style>
