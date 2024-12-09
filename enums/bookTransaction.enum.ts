export enum BookTransactionStatus {
    PENDING = 1, // Chờ xác nhận
    SUCCESS = 2, // Thành công
    CANCEL = 3, // Hủy
}

export const BookTransactionStatusText: Record<BookTransactionStatus, string> = {
    [BookTransactionStatus.PENDING]: 'Chờ xác nhận',
    [BookTransactionStatus.SUCCESS]: 'Thành công',
    [BookTransactionStatus.CANCEL]: 'Hủy',
}

export enum BookTransactionType {
    IMPORT = 1, // Nhập sách
    EXPORT = 2, // Xuất sách
}

export const BookTransactionTypeText: Record<BookTransactionType, string> = {
    [BookTransactionType.IMPORT]: 'Nhập sách',
    [BookTransactionType.EXPORT]: 'Xuất sách',
}