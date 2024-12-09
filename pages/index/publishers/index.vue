<template>
    <div class="px-6 py-10">
        <h3 class="font-bold text-xl mb-6">Quản lý nhà xuất bản</h3>

        <a-table :columns="columns" :data-source="data ? data?.data : []" :loading="loading" bordered>
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'avatar'">
                    <a-image :width="100" :src="record.avatar" />
                </template>

                <template v-if="column.dataIndex === 'action'">
                    <div class="flex gap-2">
                        <a-button type="primary" @click="navigateTo('/authors/' + record.id)">Xem</a-button>
                        <a-button @click="handleOpenUpdateModal(record as IPublisher)">Sửa</a-button>
                        <a-popconfirm title="Are you sure delete this task?" ok-text="Yes" cancel-text="No"
                            @confirm="handleDelete(record.id)">
                            <a-button type="link" danger>Xóa</a-button>
                        </a-popconfirm>
                    </div>
                </template>
            </template>

            <template #title>
                <div>
                    <a-button type="primary" @click="handleOpenCreateModal">Thêm mới</a-button>
                    <div class="my-4 flex items-center gap-2">
                        <h6 class=" text-base
                            font-medium">Danh sách nhà xuất bản</h6>
                        <Icon class="text-lg cursor-pointer" @click="handleRefresh()"
                            name="i-mingcute-refresh-2-fill" />
                    </div>

                    <div class="flex gap-x-10">
                        <div class="">
                            <a-input-search v-model:value="search" placeholder="Tìm kiếm nhà xuất bản" style="width: 300px"
                                enter-button @search="() => {
                                    loading = true;
                                    query.search.name = search;
                                }" />
                        </div>
                    </div>
                </div>

            </template>
        </a-table>
    </div>

    <PublishersCreate v-if="isCreateModalOpen" :open="isCreateModalOpen" @close="handleCancelCreateModal"
        @refresh="refresh" />

    <PublishersUpdate v-if="isUpdateModalOpen" :publisher="publisherSelected" :open="isUpdateModalOpen"
        @close="handleCancelUpdateModal" @refresh="refresh" />

</template>

<script setup lang="ts">
import type { IPublisher } from '~/interfaces/publisher';
import type { IResponsePagination } from '~/interfaces/response';

const loading = ref(false);

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Tên nhà xuất bản',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Ảnh đại diện',
        dataIndex: 'avatar',
        key: 'avatar',
    },
    {
        title: 'Mô tả',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: 'Hành động',
        dataIndex: 'action',
        key: 'action',
    },
];
const authStore = useAuthStore();

const accessToken = computed(() => authStore.accessToken);

const search = ref('');

const query = reactive({
    paginate: 10,
    page: 1,
    search: {
        name: '',
    },
});

const { data, refresh } = await useFetch<IResponsePagination<IPublisher[]>>('/api/publishers', {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${accessToken.value}`
    },
    baseURL: useRuntimeConfig().public.baseURLAPI,
    query,
    onResponse: () => {
        loading.value = false;
    }
});

const handleRefresh = () => {
    loading.value = true;
    search.value = '';
    query.search.name = '';
    refresh();
}

const publisherSelected = ref<IPublisher>();

//update nhà xuất bản
const isUpdateModalOpen = ref(false);
const handleCancelUpdateModal = () => isUpdateModalOpen.value = false;

const handleOpenUpdateModal = (author: IPublisher) => {
    publisherSelected.value = author;
    isUpdateModalOpen.value = true;
}

//thêm nhà xuất bản

const isCreateModalOpen = ref(false);
const handleOpenCreateModal = () => isCreateModalOpen.value = true;
const handleCancelCreateModal = () => isCreateModalOpen.value = false;

//xóa nhà xuất bản

const handleDelete = async (id: number) => {
    await $fetch(`/api/publishers/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${accessToken.value}`
        },
        baseURL: useRuntimeConfig().public.baseURLAPI,
        onResponse: ({ response }) => {
            if (response.ok) {
                message.success('Xóa nhà xuất bản thành công');
                refresh();
            } else {
                message.error('Xóa nhà xuất bản thất bại');
            }
        }
    });
} 
</script>

<style scoped></style>