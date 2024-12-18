<template>
    <div class="px-6 py-10">
        <div class="text-xl font-medium mb-6 flex items-center cursor-pointer" @click="navigateTo('/books')">
            <Icon name="i-material-symbols-arrow-back-ios"></Icon>
            <span> Quay lại danh sách sách</span>
        </div>
        <h3 class="font-bold text-2xl mb-6">Chỉnh sửa sách</h3>
        <a-form :model="formUpdate" :rules="rules" ref="formRef" layout="vertical" @finish="handleUpdate">
            <a-form-item label="Tên sách" name="title" required>
                <a-input v-model:value="formUpdate.title" />
            </a-form-item>


            <a-form-item label="Ảnh bìa" name="cover_image" required>
                <a-image v-if="formUpdate.cover_image" :src="formUpdate.cover_image" alt="Cover Image"
                    class="max-w-52 h-auto rounded-lg shadow-md mb-6" />
                <span v-else class="text-red-500">Chưa có ảnh bìa</span>
                <UploadImg v-model="formUpdate.cover_image" @handle-change-image="handleUploadCoverImage">
                    <template #main>
                        <a-button type="primary">Chọn ảnh</a-button>
                    </template>
                </UploadImg>
            </a-form-item>

            <a-form-item label="Ảnh minh họa thêm" name="thumbnail" required>
                <ul class="flex gap-4 mb-4">
                    <li v-for="(item, index) in formUpdate.thumbnail" :key="index" class=" relative">
                        <NuxtImg :src="item" alt="Thumbnail"
                            class="rounded-lg shadow-md w-56 max-w-56 h-56 object-cover" />
                        <div class="absolute top-2 right-2 flex gap-2">
                            <a-dropdown>
                                <a class="ant-dropdown-link" @click="e => e.preventDefault()">
                                    <a-button size="small">Lựa chọn</a-button>
                                </a>
                                <template #overlay>
                                    <a-menu>
                                        <a-menu-item @click="moveLeft(index)" :disabled="index === 0">← Di chuyển sang
                                            trái</a-menu-item>
                                        <a-menu-item @click="moveRight(index)"
                                            :disabled="!formUpdate.thumbnail || index === formUpdate.thumbnail.length - 1">→
                                            Di chuyển sang phải</a-menu-item>
                                        <a-menu-item @click="viewImage(item)">Xem</a-menu-item>
                                        <a-menu-item @click="removeImage(index)" danger>Xóa</a-menu-item>
                                    </a-menu>
                                </template>
                            </a-dropdown>
                        </div>
                    </li>
                </ul>
                <UploadImg v-model="formUpdate.thumbnail" @handle-change-image="handleAddThumbnail">
                    <template #main>
                        <a-button type="primary">Thêm ảnh minh họa</a-button>
                    </template>
                </UploadImg>
            </a-form-item>

            <a-form-item label="Đường dẫn duy nhất ( slug )" name="slug" required>
                <a-input v-model:value="formUpdate.slug" />
            </a-form-item>

            <a-form-item label="ISBN" name="ISBN" required>
                <a-input v-model:value="formUpdate.ISBN" />
            </a-form-item>

            <a-form-item label="Danh mục" name="category_id" required>
                <a-select v-model:value="formUpdate.category_id" placeholder="Chọn danh mục">
                    <a-select-option v-for="category in categories" :key="category.id" :value="category.id">
                        {{ category.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="Nhà xuất bản" name="publisher_id" required>
                <a-select v-model:value="formUpdate.publisher_id" placeholder="Chọn nhà xuất bản">
                    <a-select-option v-for="publisher in publishers" :key="publisher.id" :value="publisher.id">
                        {{ publisher.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="Tác giả" name="authors" required>
                <a-select v-model:value="formUpdate.authors" mode="multiple" placeholder="Chọn tác giả">
                    <a-select-option v-for="author in authors" :key="author.id" :value="author.id">
                        {{ author.name }}
                    </a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="Giá" name="price" required>
                <a-input-number v-model:value="formUpdate.price" class="w-full"
                    :formatter="value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')"
                    :parser="value => value.replace(/\$\s?|(,*)/g, '')" />
            </a-form-item>

            <a-form-item label="Giảm giá %" name="discount" required>
                <a-input-number v-model:value="formUpdate.discount" class="w-full" min="0" max="100" />
            </a-form-item>

            <a-form-item label="Số trang" name="pages" required>
                <a-input-number v-model:value="formUpdate.pages" class="w-full" min="1" />
            </a-form-item>

            <div class="flex gap-4">
                <a-form-item label="Chiều dài ( cm )" name="dimension_length" required>
                    <a-input-number v-model:value="formUpdate.dimension_length" class="w-full" placeholder="Dài" />
                </a-form-item>
                <a-form-item label="Chiều rộng ( cm )" name="dimension_width" required>
                    <a-input-number v-model:value="formUpdate.dimension_width" class="w-full" placeholder="Rộng" />
                </a-form-item>
            </div>

            <div class="flex gap-4">
                <a-form-item label="Trọng lượng (kg)" name="weight" required>
                    <a-input-number v-model:value="formUpdate.weight" class="w-full" min="0" step="0.01"
                        placeholder="Trọng lượng" />
                </a-form-item>

                <a-form-item label="Độ dày (cm)" name="height" required>
                    <a-input-number v-model:value="formUpdate.height" class="w-full" min="0" step="0.01"
                        placeholder="Độ dày" />
                </a-form-item>
            </div>

            <a-form-item label="Trạng thái bán" name="is_sale" required>
                <a-select v-model:value="formUpdate.is_sale" placeholder="Chọn trạng thái">
                    <a-select-option :value="1">Đang bán</a-select-option>
                    <a-select-option :value="0">Ngừng bán</a-select-option>
                </a-select>
            </a-form-item>

            <a-form-item label="Mô tả ngắn" name="short_description" required>
                <CkEditor v-model="formUpdate.short_description" />
            </a-form-item>

            <a-form-item label="Mô tả" name="description" required>
                <CkEditor v-model="formUpdate.description" />
            </a-form-item>

            <a-form-item>
                <a-button type="primary" html-type="submit">Lưu lại</a-button>
            </a-form-item>
        </a-form>

        <a-modal v-model:visible="isModalVisible" title="Xem ảnh" @ok="handleOk" @cancel="handleCancel">
            <NuxtImg :src="currentImage ?? ''" alt="Thumbnail" class="w-full h-auto rounded-lg shadow-md" />
        </a-modal>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import type { IBook } from '~/interfaces/book';
import type { ICategory } from '~/interfaces/category';
import type { IPublisher } from '~/interfaces/publisher';
import type { Rule } from 'ant-design-vue/es/form';
import type { IAuthor } from '~/interfaces/author';

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

const { data: categories } = await useFetch<ICategory[]>('api/categories', {
    baseURL: useRuntimeConfig().public.baseURLAPI,
    headers: {
        Authorization: `Bearer ${accessToken.value}`
    },
    lazy: true
});

const { data: publishers } = await useFetch<IPublisher[]>('api/publishers', {
    baseURL: useRuntimeConfig().public.baseURLAPI,
    headers: {
        Authorization: `Bearer ${accessToken.value}`
    },
    lazy: true
});

const { data: authors } = await useFetch<IAuthor[]>('api/authors', {
    baseURL: useRuntimeConfig().public.baseURLAPI,
    headers: {
        Authorization: `Bearer ${accessToken.value}`
    },
    lazy: true
});

const formUpdate = reactive({
    title: book.value?.title,
    ISBN: book.value?.ISBN,
    slug: book.value?.slug,
    cover_image: book.value?.cover_image,
    thumbnail: book.value?.thumbnail,
    category_id: book.value?.category_id,
    publisher_id: book.value?.publisher_id,
    authors: book.value?.authors ? book.value.authors.map(author => author.id) : [],
    price: book.value?.price,
    discount: book.value?.discount,
    pages: book.value?.pages,
    dimension_length: book.value?.dimension_length,
    dimension_width: book.value?.dimension_width,
    weight: book.value?.weight,
    height: book.value?.height,
    short_description: book.value?.short_description,
    is_sale: book.value?.is_sale,
    description: book.value?.description,
});

const formRef = ref();

const rules: Record<string, Rule[]> = {
    title: [{ required: true, message: 'Vui lòng nhập tên sách', trigger: 'blur' }],
    slug: [
        { required: true, message: 'Vui lòng nhập slug', trigger: 'blur' },
        { pattern: /^[a-z0-9-]+$/, message: 'Slug không hợp lệ', trigger: 'blur' }
    ],
    ISBN: [{ required: true, message: 'Vui lòng nhập ISBN', trigger: 'blur' }],
    category_id: [{ required: true, message: 'Vui lòng chọn danh mục', trigger: 'change' }],
    publisher_id: [{ required: true, message: 'Vui lòng chọn nhà xuất bản', trigger: 'change' }],
    price: [
        { required: true, message: 'Vui lòng nhập giá', trigger: 'blur' },
        { min: 0, message: '% Giá phải lớn hơn 0', trigger: 'blur' },
        { max: 100, message: '% Giá phải nhỏ hơn 100', trigger: 'blur' }
    ],
    discount: [{ required: true, message: 'Vui lòng nhập giảm giá', trigger: 'blur' }],
    pages: [{ required: true, message: 'Vui lòng nhập số trang', trigger: 'blur' }],
    dimension_length: [{ required: true, message: 'Vui lòng nhập chiều dài', trigger: 'blur' }],
    dimension_width: [{ required: true, message: 'Vui lòng nhập chiều rộng', trigger: 'blur' }],
    weight: [{ required: true, message: 'Vui lòng nhập trọng lượng', trigger: 'blur' }],
    is_sale: [{ required: true, message: 'Vui lòng chọn trạng thái bán', trigger: 'change' }],
    description: [{ required: true, message: 'Vui lòng nhập mô tả', trigger: 'blur' }],
};

const handleUpdate = async () => {
    await formRef.value.validate();
    await $fetch(`/api/books/${route.params.id}`, {
        baseURL: useRuntimeConfig().public.baseURLAPI,
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${accessToken.value}`
        },
        body: formUpdate
    });
    router.push('/books');
};

const handleUploadCoverImage = (url: string) => {
    formUpdate.cover_image = url;
};

const isModalVisible = ref(false);
const currentImage = ref<string | null>(null);

const moveLeft = (index: number) => {
    if (index > 0 && formUpdate.thumbnail) {
        const temp = formUpdate.thumbnail[index - 1];
        formUpdate.thumbnail[index - 1] = formUpdate.thumbnail[index];
        formUpdate.thumbnail[index] = temp;
    }
};

const moveRight = (index: number) => {
    if (formUpdate.thumbnail && index < formUpdate.thumbnail.length - 1) {
        const temp = formUpdate.thumbnail[index + 1];
        formUpdate.thumbnail[index + 1] = formUpdate.thumbnail[index];
        formUpdate.thumbnail[index] = temp;
    }
};

const removeImage = (index: number) => {
    if (formUpdate.thumbnail) {
        formUpdate.thumbnail.splice(index, 1);
    }
};

const viewImage = (url: string) => {
    currentImage.value = url;
    isModalVisible.value = true;
};

const handleOk = () => {
    isModalVisible.value = false;
};

const handleCancel = () => {
    isModalVisible.value = false;
};

const handleAddThumbnail = (url: string) => {
    if (!formUpdate.thumbnail) {
        formUpdate.thumbnail = [];
    }

    //kiểm tra xem ảnh có phải kiểu đã convert từ blob sang base64 không
    if (url.includes('data:image')) {
        return;
    }
    formUpdate.thumbnail.push(url);
};
</script>

<style scoped></style>