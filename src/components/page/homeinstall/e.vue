<template>
    <div>
        <div class="text-head">信息栏</div>
        <div class="text">
        <span class="content">起 点 时 间：</span><span class="content">{{ timeRanges[0] }}</span></div>
        <div class="text"><span class="content">终 点 时 间：</span><span class="content">{{ timeRanges[1] }}</span></div>
        <div class="text"><span class="content">放 电 时 长：</span><span class="content">{{duration}}</span></div>
        <div class="text"><span class="content">放 电 次 数：</span><span class="content">{{sampleCount}}</span></div>
        <div class="text"><span class="content">数据最大值：</span><span class="content">{{strengthMax}} mV</span></div>
        <div class="text">
            <span class="content">Y  轴 单 位：</span>
            <el-radio-group v-model="yAxisUnit" @change="selectedUnit">
                <el-radio class="radio" label="mV">mV</el-radio>
                <el-radio class="radio" label="dBW">dBW</el-radio>
            </el-radio-group>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        timeRanges: {
            type: Array,
            default: () => []
        },
        sampleCount:Number,
        strengthMax:Number,
    },
    data() {
        return {
            yAxisUnit: 'mV'
        }
    },
    computed: {
        duration({timeRanges}) {
            if(timeRanges.length < 2) return 0
            let start = timeRanges[0]
            let end = timeRanges[1]
            start = start.split(':').map(el => +el)
            end = end.split(':').map(el => +el)
            start = start[0] * 60 + start[1]
            end = end[0] * 60 + end[1]
            let duration = end - start
            return `${~~(duration / 60)}:${duration % 60}`
        }
    },
    methods: {
        selectedUnit(val) {
            this.$emit('selectedUnit', val)
        }
    }
}
</script>

<style scoped>
.text-head {
    font-size: 20px;
    font-weight: 400;
    color: #0A244C;
}

.text {
    display: flex;
    align-items: center;
    height: 50px;
}
.border {
    width: 462px;
    height: 1px;
    background: #E6E6E6;
}
.content {
    font-size: 16px;
    font-weight: 400;
    color: #666;
    margin-right: 16px;
}
.radio {
    font-size: 18px;
    color: #606266;
}
</style>