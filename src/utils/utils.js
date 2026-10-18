import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

export function formatNumber(value) {
    return Number(value || 0).toLocaleString('en-US', {
        maximumFractionDigits: 2
    })
}

export function formatMoney(value) {
    return Number(value || 0).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

export function formatDateTime(value) {
    if (!value) return '--'

    return String(value).replace('T', ' ').slice(0, 19)
}

// 创建 Markdown 渲染实例
const md = new MarkdownIt({
    // 禁止直接解析原始 HTML，降低 XSS 风险
    html: false,
    // 自动识别链接
    linkify: true,
    // 普通换行转换为 <br>
    breaks: true,
    // 代码块高亮
    highlight(code, language) {
        if (language && hljs.getLanguage(language)) {
            try {
                const highlightedCode = hljs.highlight(code, {
                    language,
                    ignoreIllegals: true
                }).value

                return `<pre class="hljs"><code>${highlightedCode}</code></pre>`
            } catch (error) {
                // 高亮失败时使用普通代码块
            }
        }

        // 未指定语言或不支持的语言，转义后输出
        return `<pre class="hljs"><code>${md.utils.escapeHtml(code)}</code></pre>`
    }
})

// 导出 Markdown 渲染方法
export function renderMarkdown(content) {
    return md.render(content || '')
}
