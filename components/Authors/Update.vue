<template>
    <a-modal :open="props.open" @cancel="emit('close')" @ok="handleUpdate">
        <template #title>
            <h3 class="font-medium text-center text-xl">Cập nhật tác giả</h3>
        </template>
        <template #default>
            <div v-if="props.author">
                <div class="flex justify-center my-6">
                    <UploadImg @handle-change-image="handleChangeAvatar">
                        <template #main>
                            <NuxtImg :src="formUpdate.avatar" alt="Avatar" class="w-24 h-24 object-cover cursor-pointer rounded-full" />
                        </template>
                    </UploadImg>
                </div>
                <a-form :model="formUpdate" ref="formRef" layout="vertical">
                    <a-form-item label="Họ và tên: " name="name"
                        :rules="[
                            { required: true, message: 'Họ và tên không được để trống' },
                            { max: 255, message: 'Họ và tên không được vượt quá 255 ký tự' }
                            ]"
                    >
                        <a-input v-model:value="formUpdate.name" />
                    </a-form-item>
                    <a-form-item label="Mô tả: " name="description">
                        <a-textarea :rows="4" v-model:value="formUpdate.description" />
                    </a-form-item>
                </a-form>
            </div>
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import type { IAuthor } from '~/interfaces/author';

const props = defineProps<{
    author: IAuthor|undefined;
    open: boolean;
}>();

const emit = defineEmits(['close','refresh']);

const authStore = useAuthStore();

const accessToken = computed(() => authStore.accessToken);

interface IFormUpdate {
    name: string;
    description: string;
    avatar: string;
}

const formRef = ref();

const formUpdate = reactive<IFormUpdate>({
    name: props.author?.name ?? '',
    description: props.author?.description ?? '',
    avatar: props.author?.avatar ?? '',
});

const handleUpdate = async () => {
    await formRef.value.validate();

    await $fetch<IAuthor>('/api/authors/' + props.author?.id, {
        method: 'patch',
        headers: {
            Authorization: 'Bearer ' + accessToken.value,
        },
        baseURL: useRuntimeConfig().public.baseURLAPI,
        body: formUpdate,
        onResponse: ({response}) =>{
            if(response.ok){
                message.success('Cập nhật tác giả thành công');
                emit('refresh');
            }
            else{
                message.error('Cập nhật tác giả thất bại');
            }

            emit('close');
        }
    });

    
};

const handleChangeAvatar = (avatar: string) => {
    formUpdate.avatar = avatar;
};
</script>

<style scoped></style>