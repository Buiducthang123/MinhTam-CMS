<template>
    <a-modal :open="props.open" @cancel="emit('close')" @ok="handleCreate">
        <template #title>
            <h3 class="font-medium text-center text-xl">Thêm tác giả</h3>
        </template>
        <template #default>
            <div class="flex justify-center my-6">
                <UploadImg @handle-change-image="handleChangeAvatar">
                    <template #main>
                        <NuxtImg v-if="formCreate.avatar" :src="formCreate.avatar" alt="Avatar" class="w-24 h-24 object-cover cursor-pointer rounded-full" />
                        <NuxtImg v-else src="https://via.placeholder.com/150" alt="Avatar" class="w-24 h-24 object-cover cursor-pointer rounded-full" />
                    </template>
                </UploadImg>
            </div>
            <a-form :model="formCreate" ref="formRef" layout="vertical">
                <a-form-item label="Họ và tên: " name="name"
                    :rules="[
                        { required: true, message: 'Họ và tên không được để trống' },
                        { max: 255, message: 'Họ và tên không được vượt quá 255 ký tự' }
                    ]"
                >
                    <a-input v-model:value="formCreate.name" />
                </a-form-item>
                <a-form-item label="Mô tả: " name="description">
                    <a-textarea :rows="4" v-model:value="formCreate.description" />
                </a-form-item>
            </a-form>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import type { IAuthor } from '~/interfaces/author';

const props = defineProps<{
    open: boolean;
}>();

const emit = defineEmits(['close', 'refresh']);

const authStore = useAuthStore();

const accessToken = computed(() => authStore.accessToken);

interface IFormCreate {
    name: string;
    description: string;
    avatar: string;
}

const formRef = ref();

const formCreate = reactive<IFormCreate>({
    name: '',
    description: '',
    avatar: '',
});

const handleCreate = async () => {
    await formRef.value.validate();

    await $fetch<IAuthor>('/api/authors', {
        method: 'post',
        headers: {
            Authorization: 'Bearer ' + accessToken.value,
        },
        baseURL: useRuntimeConfig().public.baseURLAPI,
        body: formCreate,
        onResponse: ({ response }) => {
            if (response.ok) {
                message.success('Thêm tác giả thành công');
                emit('refresh');
            } else {
                message.error('Thêm tác giả thất bại');
            }

            emit('close');
        }
    });
};

const handleChangeAvatar = (avatar: string) => {
    formCreate.avatar = avatar;
};
</script>

<style scoped></style>