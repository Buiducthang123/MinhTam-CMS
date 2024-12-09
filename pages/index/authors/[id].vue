<template>
    <div class="px-6 py-10">
        <div class="flex gap-2 items-center mb-10">
            <Icon name="i-material-symbols-arrow-back-ios" class="cursor-pointer px-3" @click="navigateTo('/authors')" />
            <h3 class="font-bold text-xl">Chi tiết tác giả</h3>
        </div>
        <div v-if="data?.data">
            <div class="flex items-center mb-6">
                <NuxtImg :src="data.data.avatar" alt="Avatar" class="w-24 h-24 object-cover rounded-full mr-4" />
                <h4 class="text-2xl font-bold">{{ data.data.name }}</h4>
            </div>
            <div class="flex flex-col gap-2 mb-6">
                <span class="font-bold">Mô tả</span>
                <p>{{ data.data.description }}</p>
            </div>
            <h4 class="text-xl font-bold mb-4">Các tác phẩm</h4>
            <div v-for="book in data.data.books" :key="book.id" class="mb-6">
                <div  class="mb-4 flex flex-wrap gap-8">
                    <!--
                        <a-card hoverable class="w-1/5" v-for="edition in book.book_editions" :key="edition.id">
                        <template #cover>
                            <NuxtImg :src="edition.cover_image" alt="Cover" class="w-full h-48 object-cover" />
                        </template>
                        <a-card-meta>
                            <template #title>{{ edition. }}</template>    
                            <template #description>www.instagram.com</template>
                        </a-card-meta>
                    </a-card>
                    -->
                </div>
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import type { IAuthor } from '~/interfaces/author';
import type { IResponse } from '~/interfaces/response';

const route = useRoute();
const authStore = useAuthStore();
const accessToken = computed(() => authStore.accessToken);

const { data } = await useFetch<IResponse<IAuthor>>('/api/authors/' + route.params.id, {
    method: 'GET',
    headers: {
        Authorization: 'Bearer ' + accessToken.value,
    },
    baseURL: useRuntimeConfig().public.baseURLAPI,
    query: {
        with: ['books']
    }
});

</script>

<style scoped></style>