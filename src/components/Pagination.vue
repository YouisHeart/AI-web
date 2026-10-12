<template>
    <div class="pagination-container">
        <div class="pagination-info">
            <span class="pagination-info__label">TOTAL USERS</span>
            <span class="pagination-info__count">{{ total }}</span>
            <span class="pagination-info__unit">条数据</span>
        </div>

        <el-pagination v-model:current-page="currentPageModel" v-model:page-size="pageSizeModel" :total="total"
            :page-sizes="pageSizes" :layout="layout" :background="false" :disabled="disabled"
            :hide-on-single-page="false" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    currentPage: {
        type: Number,
        default: 1
    },
    pageSize: {
        type: Number,
        default: 10
    },
    total: {
        type: Number,
        default: 0
    },
    pageSizes: {
        type: Array,
        default: () => [10, 20, 50, 100]
    },
    layout: {
        type: String,
        default: 'sizes, prev, pager, next, jumper'
    },
    disabled: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits([
    'update:currentPage',
    'update:pageSize',
    'size-change',
    'current-change'
])

const currentPageModel = computed({
    get: () => props.currentPage,
    set: value => emit('update:currentPage', value)
})

const pageSizeModel = computed({
    get: () => props.pageSize,
    set: value => emit('update:pageSize', value)
})

function handleSizeChange(size) {
    emit('size-change', size)
}

function handleCurrentChange(page) {
    emit('current-change', page)
}
</script>

<style scoped lang="scss">
.pagination-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    min-height: 76px;
    padding: 16px 24px;
    border-top: 1px solid rgba(72, 152, 192, 0.15);
    background: rgba(6, 19, 32, 0.5);
    box-sizing: border-box;

    .pagination-info {
        display: flex;
        align-items: baseline;
        gap: 8px;
        white-space: nowrap;

        &__label {
            color: #53788f;
            font-size: 10px;
            letter-spacing: 1px;
        }

        &__count {
            color: #43d9f3;
            font-size: 20px;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
        }

        &__unit {
            color: #7897aa;
            font-size: 12px;
        }
    }

    :deep(.el-pagination) {
        --el-pagination-font-size: 12px;
        --el-pagination-bg-color: transparent;
        --el-pagination-text-color: #8eafc3;
        --el-pagination-button-color: #a3c3d5;
        --el-pagination-button-bg-color: #10283c;
        --el-pagination-hover-color: #42d9f2;
        --el-pagination-button-disabled-bg-color: #0b1a29;
        --el-pagination-button-disabled-color: #40586a;

        gap: 5px;
    }

    :deep(.el-pagination .btn-prev),
    :deep(.el-pagination .btn-next) {
        min-width: 30px;
        height: 30px;
        border: 1px solid rgba(72, 152, 192, 0.18);
        border-radius: 6px;
    }

    :deep(.el-pagination .el-pager li) {
        min-width: 30px;
        height: 30px;
        margin: 0 2px;
        border: 1px solid transparent;
        border-radius: 6px;
        background: transparent;
        transition: all 0.2s;
    }

    :deep(.el-pagination .el-pager li:hover) {
        color: #45d9f3;
        border-color: rgba(69, 217, 243, 0.3);
        background: rgba(69, 217, 243, 0.08);
    }

    :deep(.el-pagination .el-pager li.is-active) {
        color: #071b2a;
        border-color: #42d9f2;
        background: #42d9f2;
        font-weight: 700;
        box-shadow: 0 0 12px rgba(66, 217, 242, 0.15);
    }

    :deep(.el-pagination .el-select__wrapper) {
        min-height: 30px;
        border: 1px solid rgba(72, 152, 192, 0.2);
        border-radius: 6px;
        background: #10283c;
        box-shadow: none;
    }

    :deep(.el-pagination .el-select__selected-item),
    :deep(.el-pagination .el-input__inner) {
        color: #a3c3d5;
    }

    :deep(.el-pagination .el-input__wrapper) {
        min-height: 30px;
        border: 1px solid rgba(72, 152, 192, 0.2);
        border-radius: 6px;
        background: #10283c;
        box-shadow: none;
    }

    :deep(.el-pagination .el-pagination__jump) {
        color: #7897aa;
    }

    :deep(.el-pagination .el-pagination__editor) {
        margin: 0 5px;
    }
}

@media (max-width: 768px) {
    .pagination-container {
        justify-content: center;
        padding: 16px 12px;

        .pagination-info {
            width: 100%;
            justify-content: center;
        }

        :deep(.el-pagination) {
            justify-content: center;
            flex-wrap: wrap;
            row-gap: 10px;
        }
    }
}
</style>
