<template>
    <div class="px-6 py-10">
        <h3 class="font-bold text-xl mb-6">Quản lý xuất nhập sách</h3>
        <a-table bordered :columns="columns" :data-source="bookTransactionsData?.data" :row-key="(record) => record.id"
            :pagination="false">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'book'">
                    <span>{{ record.book?.title }}</span>
                </template>

                <template v-if="column.dataIndex === 'date'">
                    <span>{{ dayjs(record.date).format('DD/MM/YYYY') }}</span>
                </template>

                <template v-if="column.dataIndex === 'price'">
                    <span>{{ formatCurrency(record.price) }}</span>
                </template>

                <template v-if="column.dataIndex === 'type'">
                    <a-tag>{{ BookTransactionTypeText[record.status as BookTransactionType] }}</a-tag>
                </template>

                <template v-if="column.dataIndex === 'status'">
                    <a-tag>{{ BookTransactionStatusText[record.status as BookTransactionStatus] }}</a-tag>
                </template>

                <template v-if="column.dataIndex === 'total'">
                    <span>{{ formatCurrency(record.price * record.quantity) }}</span>
                </template>

                <template v-if="column.dataIndex === 'action'">
                    <div class="flex gap-2">
                        <a-button @click="navigateTo('/book-transactions/' + record.id + '/edit')">Sửa</a-button>
                        <a-popconfirm
                            title="Bạn có chắc chắn muốn xóa, nó có thể ảnh hưởng tới danh mục và sản phẩm cũng sẽ bị xóa"
                            ok-text="Có" cancel-text="Không">
                            <a-button type="link" danger>Xóa</a-button>
                        </a-popconfirm>
                    </div>
                </template>
            </template>

            <template #expandedRowRender="{ record }">
                <div class="flex flex-nowrap gap-8 p-4 bg-gray-100 rounded-lg">
                    <div class="w-1/2">
                        <p class="mb-2"><span class="font-semibold">Tên sách:</span> {{ record.book?.title }}</p>
                        <p class="mb-2"><span class="font-semibold">Tác giả:</span> {{
                            record.book?.authors?.map((author: IAuthor) => author.name).join(', ') }}</p>
                        <p class="mb-2"><span class="font-semibold">ID nhà xuất bản:</span> {{
                            record.book?.publisher?.id
                            }}</p>
                        <p class="mb-2"><span class="font-semibold">Nhà xuất bản:</span> {{ record.book?.publisher?.name
                            }}</p>
                        <p class="mb-2"><span class="font-semibold">ISBN:</span> {{ record.book?.ISBN }}</p>
                        <p class="mb-2"><span class="font-semibold text-wrap">Mô tả:</span> {{ record.book?.description
                            }}</p>
                        <p class="mb-2"><span class="font-semibold">Số trang:</span> {{ record.book?.pages }}</p>
                        <p class="mb-2"><span class="font-semibold">Kích thước:</span> {{ record.book?.dimension_length
                            }} x {{ record.book?.dimension_width }}</p>
                        <p class="mb-2"><span class="font-semibold">Trọng lượng:</span> {{ record.book?.weight }} kg</p>
                    </div>
                    <div class="w-1/2">
                        <p class="mb-2"><span class="font-semibold">Số lượng:</span> {{ record.quantity }}</p>
                        <p class="mb-2"><span class="font-semibold">Loại giao dịch:</span> {{
                            BookTransactionTypeText[record.type as BookTransactionType] }}</p>
                        <p class="mb-2"><span class="font-semibold">Giá:</span> {{ record.price }}</p>
                        <p class="mb-2"><span class="font-semibold">Ghi chú:</span> {{ record.note }}</p>
                        <p class="mb-2"><span class="font-semibold">Ngày giao dịch:</span> {{ record.date }}</p>
                        <p class="mb-2"><span class="font-semibold">Trạng thái:</span> {{
                            BookTransactionStatusText[record.status as BookTransactionStatus] }}</p>
                    </div>
                </div>
            </template>

            <template #title>
                <div>
                    <a-button type="primary" @click="navigateTo('/book-transactions/create')">Thêm mới</a-button>
                    <div class="my-4 flex items-center gap-2">
                        <h6 class=" text-base font-medium">Danh sách các giao dịch nhập xuất sách</h6>
                        <Icon class="text-lg cursor-pointer" @click="handleRefresh" name="i-mingcute-refresh-2-fill" />
                    </div>
                    <div class="mt-8 flex gap-10">
                        <a-input-search v-model:value="bookName" placeholder="Tìm kiếm theo tên sách"
                            style="width: 200px" @search="query.search.bookName = bookName" />

                        <div class="flex items-center">
                            <span class="block mr-4">Lọc theo trạng thái: </span>
                            <a-select v-model:value="query.filters.status" style="width: 130px">
                                <a-select-option value="all">Tất cả</a-select-option>
                                <a-select-option value="pending">{{
                                    BookTransactionStatusText[BookTransactionStatus.PENDING]
                                }}</a-select-option>
                                <a-select-option value="cancel">{{
                                    BookTransactionStatusText[BookTransactionStatus.CANCEL]
                                }}</a-select-option>
                                <a-select-option value="success">{{
                                    BookTransactionStatusText[BookTransactionStatus.SUCCESS]
                                }}</a-select-option>
                            </a-select>
                        </div>
                        <div class="flex items-center">
                            <span class="block mr-4">Sắp xếp theo: </span>
                            <a-select v-model:value="query.filters.latest" style="width: 150px">
                                <a-select-option value="new">Mới nhất</a-select-option>
                                <a-select-option value="old">Cũ nhất</a-select-option>
                                <a-select-option value="today">Hôm nay</a-select-option>
                                <a-select-option value="week">Tuần này</a-select-option>
                                <a-select-option value="month">Tháng này</a-select-option>
                                <a-select-option value="year">Năm nay</a-select-option>
                            </a-select>
                        </div>
                        <!--  
                            <a-select v-model:value="query.filters.price" style="width: 200px;">
                                <a-select-option value="all">Tất cả giá</a-select-option>
                                <a-select-option value="low">Giá từ thấp đến cao </a-select-option>
                                <a-select-option value="high">Giá từ cao đến thấp</a-select-option>
                            </a-select>
                        -->
                        <div class="flex items-center">
                            <span class="block mr-4">Lọc theo loại: </span>
                            <a-select v-model:value="query.filters.type" style="width: 200px;">
                                <a-select-option value="all">Tất cả các loại</a-select-option>
                                <a-select-option value="import">{{ BookTransactionTypeText[BookTransactionType.IMPORT]
                                    }}</a-select-option>
                                <a-select-option value="export">{{ BookTransactionTypeText[BookTransactionType.EXPORT]
                                    }}</a-select-option>
                            </a-select>
                        </div>
                    </div>
                </div>
            </template>

            <template #footer>
                <div class="flex justify-end w-full">
                    <a-pagination v-model:current="query.page" :total="bookTransactionsData?.total" show-less-items />
                </div>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { BookTransactionStatus, BookTransactionStatusText, BookTransactionType, BookTransactionTypeText } from '~/enums/bookTransaction.enum';
import type { IAuthor } from '~/interfaces/author';
import type { IBookTransaction } from '~/interfaces/bookTransactions';
import type { IResponsePagination } from '~/interfaces/response';


const authStore = useAuthStore()

const accessToken = computed(() => authStore.accessToken)

const bookName = ref('')

const query = reactive({
    paginate: 10,
    page: 1,
    'with[]': ['book', 'book.authors', 'book.publisher'],
    filters: {
        status: 'all',
        latest: 'new',
        price: 'all',
        type: 'all',
    },
    search: {
        bookName: '',
    },
})

const { data: bookTransactionsData, error } = await useFetch<IResponsePagination<IBookTransaction[]>>('/api/book-transactions', {
    baseURL: useRuntimeConfig().public.baseURLAPI,
    headers: {
        Authorization: `Bearer ${accessToken.value}`
    },
    query
})

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 100,
    },
    {
        title: 'Tên sách',
        dataIndex: 'book',
        key: 'book',
    },
    {
        title: 'Số lượng',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: 'Loại giao dịch',
        dataIndex: 'type',
        key: 'type',
    },
    {
        title: 'Giá',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'date',
        key: 'date',
    },
    {
        title: 'Tổng tiền',
        dataIndex: 'total',
        key: 'total',
    },
    {
        title: 'Hành động',
        dataIndex: 'action',
        key: 'action',
    },
]

const handleRefresh = () => {
    query.page = 1
    bookName.value = ''
    query.search.bookName = ''
    query.filters.status = 'all'
    query.filters.latest = 'new'
    query.filters.price = 'all'
    query.filters.type = 'all'
}

const formatCurrency = (value: number) => {
    if (typeof value === 'string') {
        value = parseFloat(value);
    }
    let formattedValue = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    // Thay thế dấu . thành ,
    formattedValue = formattedValue.replace('.', ',');
    return formattedValue;
};
</script>

<style scoped></style>