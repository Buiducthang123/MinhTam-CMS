<template>
    <div class="px-6 py-10">
        <div class="text-xl font-medium mb-6 flex items-center cursor-pointer" @click="navigateTo('/books')">
            <Icon name="i-material-symbols-arrow-back-ios"></Icon>
            <span> Quay lại danh sách sách</span>
        </div>
        <div v-if="book">
            <h3 class="font-bold text-2xl mb-6">{{ book.title }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <a-image :src="book.cover_image" alt="Book Cover" class="w-full h-auto rounded-lg shadow-md" />
                </div>
                <div>
                    <p><span class="font-semibold">ISBN:</span> {{ book.ISBN }}</p>
                    <p><span class="font-semibold">Danh mục:</span> {{ book?.category?.name }}</p>
                    <p><span class="font-semibold">Nhà xuất bản:</span> {{ book?.publisher?.name }}</p>
                    <p><span class="font-semibold">Giá:</span> {{ formatCurrency(book.price) }}</p>
                    <p><span class="font-semibold">Giảm giá:</span> {{ book.discount }}%</p>
                    <p><span class="font-semibold">Số trang:</span> {{ book.pages }}</p>
                    <p><span class="font-semibold">Kích thước:</span> {{ book.dimension_length }} x {{
                        book.dimension_width
                        }} cm</p>
                    <p><span class="font-semibold">Trọng lượng:</span> {{ book.weight }} kg</p>
                    <p><span class="font-semibold">Trạng thái:</span> <a-tag :color="book.is_sale ? 'green' : 'red'">{{
                        book.is_sale ? 'Đang bán' : 'Ngừng bán' }}</a-tag></p>
                    <p><span class="font-semibold">Mô tả:</span></p>
                    <div v-html="book?.description" class="prose"></div>
                </div>
            </div>

            <div class="mt-6">
                <h4 class="font-semibold text-xl mb-4">Ảnh minh họa thêm</h4>
                <ul class="grid grid-cols-12 gap-4">
                    <li v-for="(item, index) in book.thumbnail" :key="index" class="col-span-3" >
                        <a-image :src="item" alt="Thumbnail" class="w-32 h-32 rounded-lg shadow-md" />
                    </li>
                </ul>
            </div>

            <div class="mt-6">
                <h4 class="font-semibold text-xl mb-4">Tác giả</h4>
                <div v-if="book.authors && book?.authors.length > 0" class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div v-for="author in book.authors" :key="author.id" class="flex items-center gap-4">
                        <a-image :src="author.avatar" />
                        <div>
                            <p class="font-medium">{{ author.name }}</p>
                            <p class="text-sm text-gray-600">{{ author.description }}</p>
                        </div>
                    </div>
                </div>
                <p v-else class="text-red-500">Chưa có tác giả</p>
            </div>

            <div class="mt-6">
                <h4 class="font-semibold text-xl mb-4">Nhà xuất bản</h4>
                <div class="flex gap-10">
                    <a-image class="max-w-80" :src="book.publisher?.avatar" />
                   <div>
                        <p class="font-medium">{{ book.publisher?.name }}</p>
                        <p class="text-sm text-gray-600">{{ book.publisher?.description }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import type { IBook } from '~/interfaces/book';
import { formatCurrency } from '~/utils/currency';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const accessToken = computed(() => authStore.accessToken);

const query = reactive({
    'with[]': ['authors', 'publisher', 'category'],
});

const { data: book } = await useFetch<IBook>(`api/books/${route.params.id}`, {
    baseURL: useRuntimeConfig().public.baseURLAPI,
    headers: {
        Authorization: `Bearer ${accessToken.value}`
    },
    query,
});

const navigateTo = (path: string) => {
    router.push(path);
};
</script>

<style scoped>
.prose {
    max-width: none;
}
</style>