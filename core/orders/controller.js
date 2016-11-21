function OrdersCtrl($state) {
    this.itemsGridScopeProvider = {
        gridRowClick: function(rowItem) {
            console.log("go into order");
            $state.go("index.order")
        }
    };

    this.ordersGridOptions = {
        enableSorting: true,
        enableFiltering: true,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        noUnselect: true,
        columnDefs: [
            {name: 'Номер', width: '20%'},
            {name: 'Дата', width: '20%'},
            {name: 'Автор', width: '20%'},
            {name: 'Контрагент', width: '20%'},
            {name: 'Сумма', width: '20%', enableFiltering: false}
        ],
        appScopeProvider: this.itemsGridScopeProvider,
        rowTemplate: '<div ng-dblclick="grid.appScope.gridRowClick(row)" ' +
        'ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" ' +
        'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>'
    };

    //TODO for preview only
    var data = {
        "Номер": "12345",
        "Дата": "23.05.16",
        "Автор": "Отвертка крестовая",
        "Контрагент": "OOO Руби бабло",
        "Сумма": 200
    };

    this.ordersGridOptions.data = [];
    for (var i = 0; i < 200; i++) {
        this.ordersGridOptions.data.push(angular.copy(data))
    }
}

angular
    .module('ordering')
    .controller('OrdersCtrl', OrdersCtrl);