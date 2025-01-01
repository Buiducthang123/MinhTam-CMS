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
                    <p><span class="font-semibold">Giá bán hiện tại:</span> {{ formatCurrency(book.price * (1 -
                        book.discount / 100)) }}</p>
                    <p><span class="font-semibold">Số trang:</span> {{ book.pages }}</p>
                    <p><span class="font-semibold">Kích thước:</span> {{ book.dimension_length }} x {{
                        book.dimension_width }} cm</p>
                    <p><span class="font-semibold">Độ dày:</span> {{ book?.height }} cm</p>
                    <p><span class="font-semibold">Trọng lượng:</span> {{ book.weight }} kg</p>
                    <p><span class="font-semibold">Trạng thái:</span> <a-tag :color="book.is_sale ? 'green' : 'red'">{{
                        book.is_sale ? 'Đang bán' : 'Ngừng bán' }}</a-tag></p>
                </div>
            </div>
            <div class="mt-10">
                <p><span class="font-semibold">Mô tả ngắn:</span></p>
                <div v-html="book?.short_description" class="prose"></div>
                <p><span class="font-semibold">Mô tả:</span></p>
                <div v-html="book?.description" class="prose"></div>
            </div>

            <div class="mt-6" v-if="book.thumbnail && book.thumbnail?.length > 0">
                <h4 class="font-semibold text-xl mb-4">Ảnh minh họa thêm</h4>
                <ul class="grid grid-cols-12 gap-4">
                    <li v-for="(item, index) in book.thumbnail" :key="index" class="col-span-3">
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

            <div class="mt-6">
                <h6 class="text-xl font-bold">Chiết khấu áp dụng cho bán buôn</h6>
                <!-- Thêm chiết khấu cho khách hàng bán buôn -->
                <div v-if="book?.discount_tiers && book?.discount_tiers.length > 0">
                    <div class="mt-6">
                        <a-button type="primary" @click="addRow">Thêm hàng</a-button>
                        <a-table :columns="discountTiersColumns" :data-source="book.discount_tiers" bordered
                            :row-key="record => record.id">
                            <template #bodyCell="{ column, text, record }">
                                <template
                                    v-if="column.dataIndex && ['minimum_quantity', 'price'].includes(column.dataIndex as string)">
                                    <div>
                                        <a-input-number v-if="editableData[record.id]" :formatter="value =>
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value =>
                                                value.replace(/\$\s?|(,*)/g, '')"
                                            v-model:value="editableData[record.id][column.dataIndex as string]"
                                            style="margin: -5px 0" />
                                        <template v-else>
                                            <template v-if="column.dataIndex === 'minimum_quantity'">
                                                {{ text }}
                                            </template>
                                            <template v-else>
                                                {{ formatCurrency(text as number) }}
                                            </template>
                                        </template>
                                    </div>
                                </template>
                                <template v-if="column.dataIndex === 'operation'">
                                    <div class="editable-row-operations">
                                        <span v-if="editableData[record.id]">
                                            <div class="flex gap-6 items-center">
                                                <a-popconfirm title="Chắc chắn lưu?" @confirm="save(record.id)">
                                                    <a-button type="primary" class="">Lưu</a-button>
                                                </a-popconfirm>
                                                <a-popconfirm title="Chắc chắn hủy?" @confirm="cancel(record.id)">
                                                    <a>Hủy</a>
                                                </a-popconfirm>
                                            </div>
                                        </span>
                                        <span v-else>
                                            <a @click="edit(record.id)">Sửa</a>
                                        </span>
                                    </div>
                                </template>
                            </template>
                        </a-table>
                    </div>

                </div>
                <div v-else class="mt-10">
                    <a-empty description="Chưa có chiết khấu nào áp dụng cho sản phẩm này" />
                    <div class="text-center mt-6">
                        <DiscountTiersCreateModal :book_id="book.id" @handle-refresh="refresh" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import type { IBook, IDiscountTier } from '~/interfaces/book';
import { formatCurrency } from '~/utils/currency';
import type { UnwrapRef } from 'vue';
import { cloneDeep } from 'lodash';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const accessToken = computed(() => authStore.accessToken);

const query = reactive({
    'with[]': ['authors', 'publisher', 'category', 'discountTiers'],
});

const { data: book, refresh } = await useFetch<IBook>(`api/books/${route.params.id}`, {
    baseURL: useRuntimeConfig().public.baseURLAPI,
    headers: {
        Authorization: `Bearer ${accessToken.value}`
    },
    query,
});

const navigateTo = (path: string) => {
    router.push(path);
};

const discountTiersColumns = [
    {
        title: 'Mua tối thiểu',
        dataIndex: 'minimum_quantity',
        width: '25%',
    },
    {
        title: 'Giá bán áp dụng (VNĐ)/sách',
        dataIndex: 'price',
        width: '25%',
    },
    {
        title: 'Hành động',
        dataIndex: 'operation',
    },
];

interface DataItem {
    id: number;
    book_id: number;
    minimum_quantity: number;
    price: number;
    [key: string]: any;
}

const dataSource = ref<any>(book.value ? book.value.discount_tiers : []);
const editableData: UnwrapRef<Record<string, DataItem | any>> = reactive({});

const edit = (id: number | string) => {
    editableData[id] = cloneDeep(dataSource.value?.filter((item: IDiscountTier) => Number(id) === item.id)[0]);
    console.log(editableData[id]);

};

const save = async (id: string) => {
    const item = dataSource.value?.find((item: IDiscountTier) => item.id === Number(id));
    if (item) {
        Object.assign(item, editableData[id]);
    }
    delete editableData[id];

    item.book_id = book.value?.id;

    await $fetch('/api/discount-tiers', {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken.value}`
        },
        baseURL: useRuntimeConfig().public.baseURLAPI,
        onResponse: ({ response }) => {
            if (response.ok) {
                message.success('Lưu thành công');
            }
            else {
                message.error('Lưu thất bại');
            }
        }
    });

};

const cancel = (id: string) => {
    delete editableData[id];
};

const addRow = () => {
    let newId = Math.floor(Math.random() * 10000);
    //Kieemr tra xem id co ton tai chua trong dataSource
    while (dataSource.value.some((item: IDiscountTier) => item.id === newId)) {
        newId = Math.floor(Math.random() * 10000);
    }
    dataSource.value.push({
        id: newId,
        minimum_quantity: 0,
        price: 0,
    });
    edit(newId);
};


</script>

<style scoped>
.prose {
    max-width: none;
}

.editable-row-operations a {
    margin-right: 8px;
}
</style>