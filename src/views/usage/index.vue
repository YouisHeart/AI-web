<template>
    <div class="ai-usage-page">
        <!-- 顶部科技背景 -->
        <div class="ambient ambient-one"></div>
        <div class="ambient ambient-two"></div>

        <main class="dashboard">
            <!-- 页面标题 -->
            <header class="page-header">
                <div class="brand-area">
                    <div class="brand-icon">
                        <el-icon>
                            <Monitor />
                        </el-icon>
                    </div>
                    <div>
                        <div class="eyebrow">AI INTELLIGENCE CENTER / 01</div>
                        <h1>AI 算力监控中心</h1>
                        <p class="page-description">
                            DEEPSEEK API · 用量分析与资源监控
                        </p>
                    </div>
                </div>

                <div class="header-status">
                    <span class="status-dot"></span>
                    <span>数据监控中</span>
                    <span class="header-divider"></span>
                    <span class="system-version">SYSTEM ONLINE</span>
                </div>
            </header>

            <!-- 账户信息 -->
            <section class="section-block">
                <div class="section-heading">
                    <div>
                        <span class="section-index">01 / ACCOUNT</span>
                        <h2>账户资源</h2>
                    </div>
                    <span class="update-time">
                        <el-icon>
                            <Refresh />
                        </el-icon>
                        {{ lastUpdated }}
                    </span>
                </div>

                <div class="account-grid">
                    <div class="glass-card balance-card">
                        <div class="card-topline">
                            <span class="card-label">账户可用余额</span>
                            <el-tag size="small" effect="dark" type="success">
                                {{ account.isAvailable ? '余额充足' : '余额不足' }}
                            </el-tag>
                        </div>

                        <div class="metric-value">
                            <span class="currency">¥</span>
                            {{ formatMoney(account.balance) }}
                            <span class="metric-unit">CNY</span>
                        </div>

                        <div class="balance-bottom">
                            <span>账户剩余可用额度</span>
                        </div>
                        <div class="card-glow"></div>
                    </div>

                    <div class="glass-card">
                        <div class="card-topline">
                            <span class="card-label">累计消费金额</span>
                            <el-icon class="card-icon">
                                <Coin />
                            </el-icon>
                        </div>
                        <div class="metric-value">
                            <span class="currency">¥</span>
                            {{ formatMoney(summary.totalCost) }}
                            <span class="metric-unit">CNY</span>
                        </div>
                        <div class="metric-footnote">
                            <span class="footnote-dot"></span>
                            <span>当前筛选周期内累计消费</span>
                        </div>
                    </div>
                </div>
            </section>

            <!-- 筛选工具栏 -->
            <section class="filter-bar">
                <div class="filter-left">
                    <div class="filter-control">
                        <span class="filter-label">时间范围</span>
                        <el-date-picker v-model="dateRange" type="daterange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期" format="YYYY-MM-DD"
                            value-format="YYYY-MM-DD" :clearable="true" class="cyber-date-picker" />
                    </div>

                    <div class="filter-control">
                        <span class="filter-label">模型</span>
                        <el-select v-model="selectedModel" class="cyber-select">
                            <el-option label="全部模型" value="all" />
                            <el-option v-for="modelName in allModelOptions" :key="modelName" :label="modelName"
                                :value="modelName" />
                        </el-select>
                    </div>

                    <el-button class="text-button" text @click="resetFilters">
                        重置筛选
                    </el-button>
                </div>
            </section>

            <!-- 核心指标 -->
            <section class="metric-grid">
                <div v-for="(item, index) in metricCards" :key="item.label" class="glass-card metric-card"
                    :style="{ '--card-index': index }">
                    <div class="metric-card-header">
                        <span class="card-label">{{ item.label }}</span>
                        <div class="metric-icon" :class="item.color">
                            <el-icon>
                                <component :is="item.icon" />
                            </el-icon>
                        </div>
                    </div>

                    <div class="metric-value">
                        <template v-if="item.type === 'money'">¥</template>
                        <CountTo :value="item.value" :decimals="item.decimals ?? 0" />
                        <span v-if="item.unit" class="metric-unit">
                            {{ item.unit }}
                        </span>
                    </div>

                    <div class="metric-footnote">
                        <span class="footnote-dot"></span>
                        {{ item.description }}
                    </div>
                    <div class="metric-line"></div>
                </div>
            </section>

            <!-- 消费趋势 -->
            <section class="glass-card chart-card main-chart-card">
                <div class="chart-header">
                    <div>
                        <span class="section-index">02 / USAGE ANALYTICS</span>
                        <h2>消费趋势分析</h2>
                        <p class="chart-description">API 消费金额 · 按时间维度统计</p>
                    </div>

                    <el-radio-group v-model="trendDimension" class="cyber-radio" size="small">
                        <el-radio-button value="hour">小时</el-radio-button>
                        <el-radio-button value="day">日期</el-radio-button>
                    </el-radio-group>
                </div>

                <div class="chart-summary">
                    <span class="chart-summary-label">TOTAL COST</span>
                    <span class="chart-summary-value">
                        ¥{{ formatMoney(summary.totalCost) }}
                    </span>
                </div>
                <div ref="costChartRef" class="chart-container main-chart"></div>
            </section>

            <!-- 模型统计 -->
            <section class="section-block model-section">
                <div class="section-heading">
                    <div>
                        <span class="section-index">03 / MODEL TELEMETRY</span>
                        <h2>模型运行统计</h2>
                    </div>
                    <span class="model-count">
                        {{ filteredRecords.length }} 条统计记录
                    </span>
                </div>

                <div class="model-chart-grid">
                    <div class="glass-card chart-card">
                        <div class="chart-header">
                            <div>
                                <h3>API 请求次数</h3>
                                <p class="chart-description">REQUEST FREQUENCY</p>
                            </div>
                            <el-icon class="chart-heading-icon">
                                <DataLine />
                            </el-icon>
                        </div>
                        <div ref="requestChartRef" class="chart-container"></div>
                    </div>

                    <div class="glass-card chart-card">
                        <div class="chart-header">
                            <div>
                                <h3>Token 消耗量</h3>
                                <p class="chart-description">TOKEN THROUGHPUT</p>
                            </div>
                            <el-icon class="chart-heading-icon">
                                <Cpu />
                            </el-icon>
                        </div>
                        <div ref="tokenChartRef" class="chart-container"></div>
                    </div>
                </div>
            </section>

            <!-- 模型明细 -->
            <section class="glass-card detail-card">
                <div class="chart-header detail-header">
                    <div>
                        <span class="section-index">04 / MODEL BREAKDOWN</span>
                        <h2>模型用量明细</h2>
                    </div>
                </div>

                <el-table :data="displayModelStats" class="cyber-table" :empty-text="'暂无符合条件的数据'" style="width: 100%">
                    <el-table-column prop="model" label="模型名称" min-width="180">
                        <template #default="{ row }">
                            <div class="model-name">
                                <span class="model-status"></span>
                                {{ row.model }}
                            </div>
                        </template>
                    </el-table-column>

                    <el-table-column label="请求次数" min-width="120">
                        <template #default="{ row }">
                            {{ formatNumber(row.requests) }}
                        </template>
                    </el-table-column>

                    <el-table-column label="Token 总量" min-width="160">
                        <template #default="{ row }">
                            {{ formatNumber(row.tokens) }}
                        </template>
                    </el-table-column>

                    <el-table-column label="消费金额" min-width="140">
                        <template #default="{ row }">
                            <span class="table-cost">
                                ¥{{ formatMoney(row.cost) }}
                            </span>
                        </template>
                    </el-table-column>

                    <el-table-column label="平均单次消费" min-width="150">
                        <template #default="{ row }">
                            ¥{{ formatMoney(row.requests ? row.cost / row.requests : 0) }}
                        </template>
                    </el-table-column>
                </el-table>
            </section>

            <footer class="page-footer">
                <span>AI COMPUTE MONITORING SYSTEM</span>
                <span>POWERED BY DEEPSEEK API</span>
            </footer>
        </main>
    </div>
</template>

<script setup>
import {
    ref,
    reactive,
    computed,
    watch,
    nextTick,
    onMounted,
    onBeforeUnmount
} from 'vue'

import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import { formatNumber, formatDateTime, formatMoney } from '@/utils/utils'

import {
    Monitor,
    Refresh,
    Coin,
    Download,
    DataLine,
    Cpu,
    Connection,
    ArrowUp
} from '@element-plus/icons-vue'

import { getUsageDashboard } from '@/api/ai'
import CountTo from '@/components/CountTo.vue'

// ==================== 页面状态 ====================

// 后端没有返回余额字段，暂时保留原来的默认值
const account = reactive({
    balance: 3.92,
    isAvailable: true
})

const lastUpdated = ref('--')
const selectedModel = ref('all')
const trendDimension = ref('hour')
const dateRange = ref([])

// 后端原始数据
const overview = ref({
    totalPromptTokens: 0,      // 输入 Token 总量
    totalCompletionTokens: 0,  // 输出 Token 总量
    totalTokens: 0,             // 输入 + 输出 Token 总量
    totalRequests: 0,           // API 总请求次数
    successRequests: 0,         // 请求成功次数
    failedRequests: 0,          // 请求失败次数
    successRate: 0,             // 请求成功率（百分比，例如 88.89 表示 88.89%）
    avgResponseTime: 0,         // 平均响应时间（毫秒 ms）
    totalCost: 0                // 累计消费金额（人民币 CNY）
})

const trend = ref([])
const modelStats = ref([])
// 独立保存所有模型名称
const allModelOptions = ref([])
const statusStats = ref([])
const recentRecords = ref([])

// ECharts DOM
const costChartRef = ref(null)
const requestChartRef = ref(null)
const tokenChartRef = ref(null)

let costChart
let requestChart
let tokenChart
let resizeObserver

// 避免多个请求同时返回时，旧数据覆盖新数据
let requestSequence = 0

// ==================== 筛选后的数据 ====================

// trend 的时间字段为 timeLabel，消费字段为 totalCost
const filteredRecords = computed(() => {
    return trend.value
        .filter(item => {
            if (!dateRange.value?.length) return true

            const date = String(item.timeLabel || '').slice(0, 10)

            return date >= dateRange.value[0] &&
                date <= dateRange.value[1]
        })
        .map(item => ({
            time: formatDateTime(item.timeLabel),
            date: String(item.timeLabel || '').slice(0, 10),
            requests: Number(item.requestCount || 0),
            tokens: Number(item.totalTokens || 0),
            cost: Number(item.totalCost || 0)
        }))
})

// 当前筛选周期内的统计值
// 时间范围筛选时，根据趋势数据重新计算
// 未选择时间范围时，优先使用后端 overview 汇总值
const summary = computed(() => {
    if (!dateRange.value?.length) {
        return {
            totalCost: Number(overview.value.totalCost || 0),
            requests: Number(overview.value.totalRequests || 0),
            tokens: Number(overview.value.totalTokens || 0)
        }
    }

    return filteredRecords.value.reduce(
        (result, item) => {
            result.totalCost += item.cost
            result.requests += item.requests
            result.tokens += item.tokens

            return result
        },
        {
            totalCost: 0,
            requests: 0,
            tokens: 0
        }
    )
})

// ==================== 核心指标卡片 ====================

const metricCards = computed(() => [
    {
        label: '累计消费金额',
        value: summary.value.totalCost,
        type: 'money',
        unit: 'CNY',
        icon: Coin,
        color: 'orange',
        description: '当前统计周期累计支出'
    },
    {
        label: 'API 请求次数',
        value: summary.value.requests,
        type: 'number',
        unit: '次',
        icon: Connection,
        color: 'blue',
        description: 'AI 接口请求总量'
    },
    {
        label: 'Token 总消耗',
        value: summary.value.tokens,
        type: 'number',
        unit: 'TOKENS',
        icon: Cpu,
        color: 'cyan',
        description: '输入与输出 Token 合计'
    },
    {
        label: '请求成功率',
        value: Number(overview.value.successRate || 0),
        type: 'number',
        unit: '%',
        icon: DataLine,
        color: 'blue',
        description: `成功 ${formatNumber(overview.value.successRequests)} 次`
    },
    {
        label: '平均响应时间',
        value: Number(overview.value.avgResponseTime || 0),
        type: 'number',
        unit: 'ms',
        icon: Monitor,
        color: 'cyan',
        description: '接口平均响应耗时'
    },
    {
        label: '失败请求次数',
        value: Number(overview.value.failedRequests || 0),
        type: 'number',
        unit: '次',
        icon: Connection,
        color: 'orange',
        description: '当前统计数据中的失败请求'
    }
])

// ==================== 模型明细 ====================

// 将后端 modelStats 转换成模板使用的字段
const displayModelStats = computed(() => {
    return modelStats.value
        .filter(item => {
            return selectedModel.value === 'all' ||
                item.modelName === selectedModel.value
        })
        .map(item => ({
            model: item.modelName,
            requests: Number(item.requestCount || 0),
            tokens: Number(item.totalTokens || 0),
            promptTokens: Number(item.promptTokens || 0),
            completionTokens: Number(item.completionTokens || 0),
            cost: Number(item.totalCost || 0),
            avgResponseTime: Number(item.avgResponseTime || 0)
        }))
})

// ==================== 筛选操作 ====================

function resetFilters() {
    dateRange.value = []
    selectedModel.value = 'all'
}

// ==================== ECharts 基础配置 ====================

function makeBaseOption() {
    return {
        backgroundColor: 'transparent',
        animationDuration: 700,
        animationEasing: 'cubicOut',

        grid: {
            top: 35,
            left: 50,
            right: 22,
            bottom: 35,
            containLabel: true
        },

        tooltip: {
            trigger: 'axis',
            backgroundColor: 'rgba(5, 19, 34, .96)',
            borderColor: 'rgba(0, 229, 255, .45)',
            textStyle: {
                color: '#d9faff'
            },
            axisPointer: {
                type: 'line',
                lineStyle: {
                    color: '#00e5ff',
                    type: 'dashed'
                }
            }
        },

        xAxis: {
            type: 'category',
            boundaryGap: true,
            axisLine: {
                lineStyle: {
                    color: '#244256'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#829caf',
                margin: 14
            },
            data: []
        },

        yAxis: {
            type: 'value',
            min: 0,
            splitLine: {
                lineStyle: {
                    color: 'rgba(95, 144, 174, .14)',
                    type: 'dashed'
                }
            },
            axisLabel: {
                color: '#829caf'
            },
            axisLine: {
                show: false
            }
        },

        series: []
    }
}

// ==================== 趋势图数据处理 ====================

function getChartData() {
    const list = filteredRecords.value

    return {
        labels: list.map(item => {
            // 日期模式显示日期，小时模式显示日期+小时
            if (trendDimension.value === 'day') {
                return item.date
            }

            return item.time.length >= 16
                ? item.time.slice(5, 16)
                : item.time
        }),

        costs: list.map(item => item.cost),
        requests: list.map(item => item.requests),
        tokens: list.map(item => item.tokens)
    }
}

// ==================== 渲染全部图表 ====================

function renderCharts() {
    if (!costChart || !requestChart || !tokenChart) return

    const chartData = getChartData()
    const base = makeBaseOption()

    // 消费趋势
    costChart.setOption({
        ...base,

        tooltip: {
            ...base.tooltip,
            valueFormatter: value => `¥${formatMoney(value)}`
        },

        yAxis: {
            ...base.yAxis,
            axisLabel: {
                color: '#829caf',
                formatter: value => `¥${value}`
            }
        },

        xAxis: {
            ...base.xAxis,
            data: chartData.labels
        },

        series: [{
            name: '消费金额',
            type: 'bar',
            barMaxWidth: 24,
            data: chartData.costs,

            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#00f5ff' },
                    { offset: 1, color: '#0878ff' }
                ]),
                borderRadius: [5, 5, 0, 0],
                shadowBlur: 12,
                shadowColor: 'rgba(0, 229, 255, .22)'
            }
        }]
    }, true)

    // 请求次数
    requestChart.setOption({
        ...base,

        tooltip: {
            ...base.tooltip,
            valueFormatter: value => `${formatNumber(value)} 次`
        },

        xAxis: {
            ...base.xAxis,
            data: chartData.labels
        },

        yAxis: {
            ...base.yAxis,
            minInterval: 1
        },

        series: [{
            name: '请求次数',
            type: 'line',
            smooth: true,
            showSymbol: true,
            symbolSize: 6,
            data: chartData.requests,

            lineStyle: {
                color: '#388cff',
                width: 2
            },

            itemStyle: {
                color: '#4bb7ff'
            },

            areaStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: 'rgba(56, 140, 255, .34)' },
                    { offset: 1, color: 'rgba(56, 140, 255, 0)' }
                ])
            }
        }]
    }, true)

    // Token 消耗量
    tokenChart.setOption({
        ...base,

        tooltip: {
            ...base.tooltip,
            valueFormatter: value => `${formatNumber(value)} Tokens`
        },

        xAxis: {
            ...base.xAxis,
            data: chartData.labels
        },

        yAxis: {
            ...base.yAxis,
            axisLabel: {
                color: '#829caf',
                formatter: value => {
                    if (value >= 1000000) {
                        return `${value / 1000000} M`
                    }

                    if (value >= 1000) {
                        return `${value / 1000} K`
                    }

                    return value
                }
            }
        },

        series: [{
            name: 'Token',
            type: 'bar',
            barMaxWidth: 24,
            data: chartData.tokens,

            itemStyle: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#7af4ff' },
                    { offset: 1, color: '#1689cf' }
                ]),
                borderRadius: [4, 4, 0, 0]
            }
        }]
    }, true)
}

// ==================== 请求后端数据 ====================

async function loadUsageData() {
    const currentSequence = ++requestSequence

    try {
        const params = {
            model: selectedModel.value === 'all'
                ? undefined
                : selectedModel.value,

            startDate: dateRange.value?.[0] || undefined,
            endDate: dateRange.value?.[1] || undefined
        }

        const res = await getUsageDashboard(params)

        const data = res.data
        overview.value = {
            totalPromptTokens: Number(data.overview?.totalPromptTokens || 0),
            totalCompletionTokens: Number(data.overview?.totalCompletionTokens || 0),
            totalTokens: Number(data.overview?.totalTokens || 0),
            totalRequests: Number(data.overview?.totalRequests || 0),
            successRequests: Number(data.overview?.successRequests || 0),
            failedRequests: Number(data.overview?.failedRequests || 0),
            successRate: Number(data.overview?.successRate || 0),
            avgResponseTime: Number(data.overview?.avgResponseTime || 0),
            totalCost: Number(data.overview?.totalCost || 0)
        }

        trend.value = Array.isArray(data.trend)
            ? data.trend
            : []

        if (allModelOptions.value.length === 0 && Array.isArray(data.modelStats)) {
            allModelOptions.value = [
                ...new Set(
                    data.modelStats
                        .map(item => item.modelName)
                        .filter(Boolean)
                )
            ]
        }

        modelStats.value = Array.isArray(data.modelStats)
            ? data.modelStats
            : []

        statusStats.value = Array.isArray(data.statusStats)
            ? data.statusStats
            : []

        recentRecords.value = Array.isArray(data.recentRecords)
            ? data.recentRecords
            : []

        lastUpdated.value = new Date().toLocaleString('zh-CN', {
            hour12: false
        })

        await nextTick()
        renderCharts()
    } catch (error) {
        if (currentSequence !== requestSequence) return

        console.error('加载用量统计失败：', error)
        ElMessage.error(
            error?.message || '用量统计加载失败，请检查后端接口'
        )
    }
}

// ==================== 监听筛选条件 ====================

// 切换模型、日期时重新请求后端
watch(
    [selectedModel, dateRange],
    () => {
        loadUsageData()
    },
    { deep: true }
)

// 切换小时/日期维度只重新绘制图表，不重复请求
watch(
    trendDimension,
    async () => {
        await nextTick()
        renderCharts()
    }
)

// ==================== 页面初始化 ====================

onMounted(async () => {
    await nextTick()

    costChart = echarts.init(costChartRef.value)
    requestChart = echarts.init(requestChartRef.value)
    tokenChart = echarts.init(tokenChartRef.value)

    resizeObserver = new ResizeObserver(() => {
        costChart?.resize()
        requestChart?.resize()
        tokenChart?.resize()
    })

    resizeObserver.observe(costChartRef.value)
    resizeObserver.observe(requestChartRef.value)
    resizeObserver.observe(tokenChartRef.value)

    await loadUsageData()
})

onBeforeUnmount(() => {
    requestSequence++

    resizeObserver?.disconnect()

    costChart?.dispose()
    requestChart?.dispose()
    tokenChart?.dispose()
})
</script>

<style scoped>
.ai-usage-page {
    --cyan: #00e5ff;
    --blue: #388cff;
    --text-primary: #e6f6ff;
    --text-secondary: #829caf;
    --panel: rgba(9, 24, 41, 0.86);
    --border: rgba(74, 157, 198, 0.2);

    position: relative;
    isolation: isolate;
    color: var(--text-primary);
    background:
        radial-gradient(ellipse at 50% -15%, rgba(0, 130, 210, .18), transparent 55%),
        linear-gradient(145deg, #040b14 0%, #071321 50%, #030912 100%);
    font-family: Inter, "PingFang SC", "Microsoft YaHei", sans-serif;
}

.ai-usage-page::before {
    position: absolute;
    z-index: -1;
    inset: 0;
    content: "";
    pointer-events: none;
    background-image:
        linear-gradient(rgba(0, 208, 255, .025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(0, 208, 255, .025) 1px, transparent 1px);
    background-size: 38px 38px;
    mask-image: linear-gradient(to bottom, black, transparent 85%);
}

.ambient {
    position: absolute;
    z-index: -1;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    filter: blur(110px);
    opacity: .12;
    pointer-events: none;
}

.ambient-one {
    top: 250px;
    left: -280px;
    background: #0077ff;
}

.ambient-two {
    top: 700px;
    right: -300px;
    background: #00e5ff;
}

.dashboard {
    position: relative;
    width: min(100% - 64px, 1440px);
    margin: 0 auto;
    padding: 38px 0 24px;
}

.page-header,
.brand-area,
.header-status,
.section-heading,
.card-topline,
.balance-bottom,
.filter-bar,
.filter-left,
.filter-control,
.metric-card-header,
.chart-header,
.chart-summary,
.page-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.page-header {
    gap: 24px;
    padding-bottom: 30px;
    border-bottom: 1px solid var(--border);
}

.brand-area {
    justify-content: flex-start;
    gap: 18px;
}

.brand-icon,
.metric-icon {
    display: grid;
    flex-shrink: 0;
    place-items: center;
}

.brand-icon {
    width: 56px;
    height: 56px;
    color: var(--cyan);
    font-size: 27px;
    border: 1px solid rgba(0, 229, 255, .45);
    border-radius: 15px;
    background: linear-gradient(145deg, rgba(0, 229, 255, .12), rgba(0, 110, 255, .04));
    box-shadow: inset 0 0 18px rgba(0, 229, 255, .06), 0 0 25px rgba(0, 229, 255, .08);
}

.eyebrow,
.section-index {
    color: var(--cyan);
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 2px;
}

.page-header h1 {
    margin: 8px 0 5px;
    font-size: clamp(24px, 2.2vw, 32px);
    font-weight: 650;
    letter-spacing: 1px;
}

.page-description,
.chart-description {
    margin: 0;
    color: var(--text-secondary);
    font-size: 12px;
    letter-spacing: .4px;
}

.header-status {
    justify-content: flex-end;
    gap: 10px;
    color: #8cebd9;
    font-size: 12px;
    white-space: nowrap;
}

.status-dot,
.footnote-dot,
.model-status {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #29e6ba;
    box-shadow: 0 0 10px rgba(41, 230, 186, .65);
}

.header-divider {
    height: 16px;
    border-left: 1px solid var(--border);
}

.system-version {
    color: var(--text-secondary);
    font-size: 10px;
    letter-spacing: 1px;
}

.section-block {
    margin-top: 30px;
}

.section-heading {
    margin-bottom: 16px;
}

.section-heading h2,
.chart-header h2 {
    margin: 7px 0 0;
    font-size: 19px;
    font-weight: 600;
}

.update-time,
.model-count {
    display: flex;
    align-items: center;
    gap: 7px;
    color: var(--text-secondary);
    font-size: 12px;
}

.account-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
}

.glass-card {
    position: relative;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 15px;
    background: linear-gradient(135deg, rgba(13, 33, 52, .94), rgba(7, 19, 34, .91));
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, .025), 0 10px 32px rgba(0, 0, 0, .12);
    transition: border-color .25s, transform .25s, box-shadow .25s;
}

.glass-card:hover {
    border-color: rgba(0, 229, 255, .4);
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, .03), 0 10px 35px rgba(0, 150, 255, .06);
}

.account-grid>.glass-card {
    min-height: 172px;
    padding: 22px 25px;
}

.balance-card {
    border-color: rgba(0, 229, 255, .25);
}

.card-topline {
    justify-content: flex-start;
    gap: 12px;
}

.card-label {
    color: #a7bdce;
    font-size: 13px;
}

.card-icon {
    margin-left: auto;
    color: var(--cyan);
    font-size: 20px;
}

.metric-value {
    margin-top: 16px;
    color: #f0faff;
    font-size: clamp(26px, 2.4vw, 35px);
    font-weight: 650;
    font-variant-numeric: tabular-nums;
    letter-spacing: -.8px;
}

.currency {
    margin-right: 3px;
    color: var(--cyan);
    font-size: .72em;
}

.metric-unit {
    margin-left: 7px;
    color: #718da3;
    font-size: 12px;
    font-weight: 400;
    letter-spacing: .5px;
}

.balance-bottom {
    margin-top: 17px;
    color: var(--text-secondary);
    font-size: 11px;
}

.card-glow {
    position: absolute;
    top: -100px;
    right: -100px;
    width: 220px;
    height: 220px;
    border-radius: 50%;
    background: rgba(0, 229, 255, .045);
    filter: blur(20px);
    pointer-events: none;
}

.metric-footnote {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 14px;
    color: var(--text-secondary);
    font-size: 11px;
}

.footnote-dot {
    width: 5px;
    height: 5px;
    background: #00d8ff;
    box-shadow: 0 0 7px rgba(0, 216, 255, .6);
}

.filter-bar {
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 30px;
    padding: 15px 0;
    border-top: 1px solid var(--border);
    border-bottom: 1px solid var(--border);
}

.filter-left {
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 12px;
}

.filter-control {
    justify-content: flex-start;
    gap: 12px;
    padding: 7px 12px;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: rgba(10, 28, 44, .75);
}

.filter-label {
    color: var(--text-secondary);
    font-size: 12px;
    white-space: nowrap;
}

.filter-bar :deep(.el-input__wrapper),
.filter-bar :deep(.el-select__wrapper) {
    background: transparent;
    box-shadow: none;
}

.filter-bar :deep(.el-input__inner),
.filter-bar :deep(.el-range-input),
.filter-bar :deep(.el-select__selected-item),
.filter-bar :deep(.el-range-separator) {
    color: var(--text-primary);
    font-size: 12px;
}

.filter-bar :deep(.el-range-input::placeholder) {
    color: #607d92;
}

.cyber-date-picker {
    width: 255px;
}

.cyber-select {
    width: 135px;
}

.cyber-button {
    color: #04131f;
    border: 1px solid #00e5ff;
    background: linear-gradient(110deg, #00e5ff, #72cfff);
    font-weight: 650;
    box-shadow: 0 0 18px rgba(0, 229, 255, .12);
}

.cyber-button:hover {
    color: #04131f;
    border-color: #8cf5ff;
    background: #8cf5ff;
}

.metric-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 18px;
    margin-top: 22px;
}

.metric-card {
    min-width: 0;
    padding: 22px;
    animation: rise-in .5s both;
    animation-delay: calc(var(--card-index) * 80ms);
}

.metric-card-header {
    gap: 12px;
}

.metric-icon {
    width: 34px;
    height: 34px;
    border: 1px solid currentColor;
    border-radius: 9px;
    font-size: 17px;
}

.metric-icon.orange {
    color: #ff985c;
    background: rgba(255, 152, 92, .09);
}

.metric-icon.blue {
    color: #56a8ff;
    background: rgba(86, 168, 255, .09);
}

.metric-icon.cyan {
    color: var(--cyan);
    background: rgba(0, 229, 255, .08);
}

.metric-line {
    width: 100%;
    height: 2px;
    margin-top: 20px;
    background: linear-gradient(90deg, var(--cyan), rgba(0, 229, 255, 0));
    opacity: .5;
}

.chart-card {
    padding: 23px;
}

.main-chart-card {
    margin-top: 22px;
    padding: 25px 26px 12px;
}

.chart-header {
    align-items: flex-start;
    gap: 18px;
}

.chart-header h3 {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
}

.chart-header .chart-description {
    margin-top: 9px;
}

.chart-summary {
    justify-content: flex-start;
    gap: 14px;
    margin-top: 24px;
}

.chart-summary-label {
    color: var(--text-secondary);
    font-size: 10px;
    letter-spacing: 1.5px;
}

.chart-summary-value {
    color: var(--cyan);
    font-size: 23px;
    font-weight: 650;
}

.chart-container {
    width: 100%;
    height: 270px;
    margin-top: 12px;
}

.main-chart {
    height: 410px;
}

.cyber-radio {
    padding: 4px;
    border: 1px solid var(--border);
    border-radius: 9px;
    background: rgba(5, 17, 29, .8);
}

.cyber-radio :deep(.el-radio-button__inner) {
    color: #829caf;
    border: 0;
    border-radius: 6px !important;
    background: transparent;
    box-shadow: none !important;
}

.cyber-radio :deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
    color: #03141f;
    background: var(--cyan);
    box-shadow: 0 0 15px rgba(0, 229, 255, .16) !important;
}

.model-section {
    margin-top: 34px;
}

.model-chart-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
}

.chart-heading-icon {
    color: var(--cyan);
    font-size: 20px;
}

.detail-card {
    margin-top: 22px;
    padding: 24px;
}

.detail-header {
    margin-bottom: 24px;
}

.model-name {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
}

.model-status {
    width: 6px;
    height: 6px;
    background: var(--cyan);
    box-shadow: 0 0 9px rgba(0, 229, 255, .6);
}

.table-cost {
    color: var(--cyan);
    font-weight: 600;
}

.cyber-table {
    --el-table-bg-color: transparent;
    --el-table-tr-bg-color: transparent;
    --el-table-header-bg-color: rgba(14, 38, 57, .8);
    --el-table-row-hover-bg-color: rgba(0, 229, 255, .045);
    --el-table-border-color: rgba(74, 157, 198, .14);
    --el-table-text-color: #c0d5e4;
    --el-table-header-text-color: #8baabe;
    --el-fill-color-lighter: rgba(0, 229, 255, .04);
}

.cyber-table :deep(th.el-table__cell) {
    height: 46px;
    font-size: 12px;
    font-weight: 500;
}

.cyber-table :deep(td.el-table__cell) {
    height: 54px;
    font-size: 12px;
}

.cyber-table :deep(.el-table__inner-wrapper::before) {
    background: var(--border);
}

.page-footer {
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 24px;
    padding: 20px 0 8px;
    border-top: 1px solid var(--border);
    color: #506b7e;
    font-size: 10px;
    letter-spacing: 1.3px;
}

@keyframes rise-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 900px) {
    .dashboard {
        width: calc(100% - 36px);
        padding-top: 25px;
    }

    .header-status {
        display: none;
    }

    .metric-grid {
        grid-template-columns: 1fr 1fr;
    }

    .metric-card:last-child {
        grid-column: 1 / -1;
    }

    .filter-bar {
        align-items: flex-start;
    }

    .filter-left {
        width: 100%;
    }

    .model-chart-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 560px) {
    .dashboard {
        width: calc(100% - 24px);
        padding-top: 20px;
    }

    .brand-icon {
        width: 44px;
        height: 44px;
        font-size: 22px;
    }

    .brand-area {
        gap: 12px;
    }

    .page-header {
        padding-bottom: 22px;
    }

    .page-description {
        font-size: 10px;
    }

    .account-grid,
    .metric-grid {
        grid-template-columns: 1fr;
        gap: 12px;
    }

    .metric-card:last-child {
        grid-column: auto;
    }

    .account-grid>.glass-card {
        min-height: 150px;
        padding: 19px;
    }

    .metric-card {
        padding: 19px;
    }

    .filter-left {
        align-items: stretch;
        flex-direction: column;
    }

    .filter-control {
        width: 100%;
        box-sizing: border-box;
    }

    .cyber-date-picker {
        min-width: 0;
        flex: 1;
        width: 100%;
    }

    .cyber-select {
        flex: 1;
    }

    .filter-bar {
        align-items: stretch;
    }

    .filter-bar>.cyber-button {
        align-self: flex-start;
    }

    .main-chart-card,
    .chart-card,
    .detail-card {
        padding: 18px 14px;
    }

    .chart-container {
        height: 235px;
    }

    .section-heading h2,
    .chart-header h2 {
        font-size: 17px;
    }

    .chart-summary-value {
        font-size: 20px;
    }

    .page-footer {
        align-items: flex-start;
        flex-direction: column;
    }
}
</style>