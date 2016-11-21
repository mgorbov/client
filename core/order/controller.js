function OrderCtrl() {
    this.orderItemsGridOptions = {
        enableSorting: true,
        columnDefs: [
            {name: 'Код', width: '10%'},
            {name: 'Артикул', width: '10%'},
            {name: 'Наименование', width: '50%'},
            {name: 'Количество', width: '10%'},
            {name: 'Цена', width: '10%'},
            {name: 'Сумма', width: '10%'}
        ]
    }
}
