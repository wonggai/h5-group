<template>
    <div class="select-popup">
        <van-cell
            :title="title"
            :value="_value"
            :value-class="`${value? 'blackColor' : 'grayColor'}`"
            style="padding: 10px 0;"
            is-link
            @click="openPopup"/>
        <van-popup
            v-model="visible"
            :overlay="true"
            position="bottom">
            <van-picker
                :columns="list"
                :title="title"
                :value-key="labelKey"
                :default-index="defaultIndex"
                show-toolbar
                @cancel="onCancel"
                @confirm="onConfirm"
                @change="onChange"/>
        </van-popup>
    </div>
</template>

<script>
    export default {
        props: {
            title: {
                type: String,
                default: '',
            },
            placeholder: {
                type: String,
                default: '',
            },
            defaultList: {
                type: Array,
                default: () => [],
            },
            dictCode: {
                type: String,
                default: undefined,
            },
            valueKey: {
                type: String,
                default: undefined,
            },
            labelKey: {
                type: String,
                default: undefined,
            },
            value: {
                type: [String, Number],
                default: undefined,
            },
            disabled: {
                type: Boolean,
                default: false,
            }
        },
        data () {
            return {
                visible: false,
            }
        },
        computed: {
            _value () {
                return this.value ? this.transValueToName(this.value) : this.placeholder ? this.placeholder : `请选择${this.title}`;
            },
            list () {
                if (this.defaultList && this.defaultList.length) {
                    return this.defaultList;
                } else {
                    return this.dict.data[this.dictCode];
                }
            },
            defaultIndex () {
                let { valueKey, value, list } = this;
                let defaultIndex = (list || []).findIndex(t => t[valueKey] == value)
                return defaultIndex > 0 ? defaultIndex : 0;
            },
        },
        watch: {
        },
        created () {
        },
        methods: {
            openPopup () {
                !this.disabled && (this.visible = true);
            },
            onCancel () {
                this.visible = false;
            },
            onConfirm (val) {
                let itemValue = val[this.valueKey];
                this.$emit('input', itemValue);
                this.onChange(val);
                this.onCancel();
            },
            onChange (val) {
                this.$emit('change', val);
            },
            transValueToName (val) {
                let { valueKey, labelKey } = this;
                let dict = (this.list || []).filter(item => item[valueKey] == val)[0];
                return dict && dict[labelKey];
            },
        }
    }
</script>

<style lang="less" scoped>
    .select-popup {
        margin: 0 15px;
        border-bottom: 1px solid #eaeaea;
    }

    .grayColor {
        color: #969799;
    }

    .blackColor {
        color: #000;
    }
</style>
