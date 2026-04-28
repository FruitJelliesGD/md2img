<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="visible"
        class="fixed inset-0 z-40 flex items-center justify-center"
        @click.self="$emit('close')"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/50"></div>

        <!-- Modal -->
        <div
          class="relative w-full max-w-3xl max-h-[85vh] overflow-auto rounded-xl shadow-2xl mx-4"
          :class="theme === 'dark' ? 'bg-gray-900 text-gray-200' : 'bg-white text-gray-800'"
        >
          <!-- Header -->
          <div
            class="sticky top-0 flex items-center justify-between px-6 py-4 border-b backdrop-blur-sm"
            :class="theme === 'dark' ? 'border-gray-700 bg-gray-900/90' : 'border-gray-200 bg-white/90'"
          >
            <h2 class="text-xl font-bold">API 文档</h2>
            <button
              @click="$emit('close')"
              class="text-2xl leading-none hover:opacity-70 transition-opacity"
            >
              &times;
            </button>
          </div>

          <!-- Content -->
          <div class="px-6 py-4 space-y-6 text-sm leading-relaxed">
            <!-- Endpoint -->
            <section>
              <h3 class="text-lg font-semibold mb-2">接口端点</h3>
              <div
                class="px-4 py-2 rounded-lg font-mono text-sm"
                :class="theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'"
              >
                <span class="text-green-500 font-bold">POST</span>
                <span class="ml-2">/api/convert</span>
              </div>
            </section>

            <!-- Headers -->
            <section>
              <h3 class="text-lg font-semibold mb-2">请求头</h3>
              <div
                class="px-4 py-2 rounded-lg font-mono text-sm"
                :class="theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'"
              >
                <div>Content-Type: application/json</div>
                <div v-if="authHint" class="text-yellow-500 mt-1">
                  {{ "Authorization: Bearer <API_KEY>" }}
                </div>
              </div>
            </section>

            <!-- Request Body -->
            <section>
              <h3 class="text-lg font-semibold mb-2">请求体 (JSON)</h3>
              <div class="overflow-x-auto">
                <table class="w-full text-sm border-collapse">
                  <thead>
                    <tr
                      :class="theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'"
                    >
                      <th class="px-3 py-2 text-left border">字段</th>
                      <th class="px-3 py-2 text-left border">类型</th>
                      <th class="px-3 py-2 text-left border">必填</th>
                      <th class="px-3 py-2 text-left border">默认值</th>
                      <th class="px-3 py-2 text-left border">说明</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td class="px-3 py-2 border font-mono">markdown</td>
                      <td class="px-3 py-2 border">string</td>
                      <td class="px-3 py-2 border text-green-500 font-bold">是</td>
                      <td class="px-3 py-2 border">-</td>
                      <td class="px-3 py-2 border">Markdown 内容</td>
                    </tr>
                    <tr>
                      <td class="px-3 py-2 border font-mono">theme</td>
                      <td class="px-3 py-2 border">string</td>
                      <td class="px-3 py-2 border">否</td>
                      <td class="px-3 py-2 border">"light"</td>
                      <td class="px-3 py-2 border">"light" | "dark"</td>
                    </tr>
                    <tr>
                      <td class="px-3 py-2 border font-mono">format</td>
                      <td class="px-3 py-2 border">string</td>
                      <td class="px-3 py-2 border">否</td>
                      <td class="px-3 py-2 border">"png"</td>
                      <td class="px-3 py-2 border">"png" | "jpeg" | "webp"</td>
                    </tr>
                    <tr>
                      <td class="px-3 py-2 border font-mono">width</td>
                      <td class="px-3 py-2 border">number</td>
                      <td class="px-3 py-2 border">否</td>
                      <td class="px-3 py-2 border">800</td>
                      <td class="px-3 py-2 border">图片宽度 (100-4096)</td>
                    </tr>
                    <tr>
                      <td class="px-3 py-2 border font-mono">quality</td>
                      <td class="px-3 py-2 border">number</td>
                      <td class="px-3 py-2 border">否</td>
                      <td class="px-3 py-2 border">0.92</td>
                      <td class="px-3 py-2 border">质量 (0-1)，仅 JPEG/WebP</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <!-- Response -->
            <section>
              <h3 class="text-lg font-semibold mb-2">响应</h3>
              <p class="mb-2">成功：<span class="text-green-500 font-mono">200 OK</span>，返回图片二进制数据</p>
              <p>Content-Type: <code class="px-1 rounded" :class="theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'">image/png | image/jpeg | image/webp</code></p>
            </section>

            <!-- Examples -->
            <section>
              <h3 class="text-lg font-semibold mb-2">示例</h3>

              <h4 class="font-semibold mb-1">cURL</h4>
              <pre
                class="px-4 py-3 rounded-lg text-xs overflow-x-auto mb-4"
                :class="theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'"
              ><code>curl -X POST http://localhost:3000/api/convert \
  -H "Content-Type: application/json" \
  -d '{"markdown": "# Hello\n\nThis is **bold** text.", "theme": "light", "format": "png", "width": 800}' \
  --output output.png</code></pre>

              <h4 class="font-semibold mb-1">JavaScript</h4>
              <pre
                class="px-4 py-3 rounded-lg text-xs overflow-x-auto mb-4"
                :class="theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'"
              ><code>const response = await fetch('http://localhost:3000/api/convert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    markdown: '# Hello\n\nThis is **bold** text.',
    theme: 'light',
    format: 'png',
    width: 800,
  }),
});
const blob = await response.blob();
const url = URL.createObjectURL(blob);
// Use url for download or display</code></pre>

              <h4 class="font-semibold mb-1">Python</h4>
              <pre
                class="px-4 py-3 rounded-lg text-xs overflow-x-auto"
                :class="theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'"
              ><code>import requests

response = requests.post(
    'http://localhost:3000/api/convert',
    json={
        'markdown': '# Hello\n\nThis is **bold** text.',
        'theme': 'light',
        'format': 'png',
        'width': 800,
    }
)
with open('output.png', 'wb') as f:
    f.write(response.content)</code></pre>
            </section>

            <!-- Quota -->
            <section>
              <h3 class="text-lg font-semibold mb-2">配额限制</h3>
              <p v-if="quotaHint">
                当前服务已启用速率限制。超出限制将返回
                <code class="px-1 rounded" :class="theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'">429 Too Many Requests</code>。
              </p>
              <p v-else>当前服务未启用速率限制。</p>
            </section>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
defineProps<{
  visible: boolean;
  theme: "light" | "dark";
  authHint?: boolean;
  quotaHint?: boolean;
}>();

defineEmits<{
  (e: "close"): void;
}>();
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>