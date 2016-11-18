/**
 * MainCtrl - controller
 */
function MainCtrl() {

}

function ItemsCtrl($timeout) {

    configureItemGrid(this);
    configureCategoryGrid(this);
    configureCartGrid(this, $timeout);

    //TODO for preview only
    var data = {
        "Код": "12345",
        "Артикул": "54321",
        "Наименование": "Отвертка крестовая",
        "Цена": 100,
        "Остаток": 200,
        "Сумма": 500
    };

    this.itemsGridOptions.data = [];
    for (var i = 0; i < 200; i++) {
        this.itemsGridOptions.data.push(angular.copy(data))
    }

    var data2 = angular.copy(data);
    data2.Наименование = "шуруповерт";
    this.itemsGridOptions.data.push(data2);

    this.categoryGridOptions.data = [
        {"Категория": "Ручной инструмент", $$treeLevel: 0},
        {"Категория": "Молотки"},
        {"Категория": "Отвертки"},
        {"Категория": "Пилы"}
    ];
}

function configureItemGrid(items) {
    items.myAppScopeProvider = {
        gridRowClick: function(rowItem) {
            items.cartGridOptions.data.unshift(rowItem.entity);
            items.focusOnAmount();
        }
    };

    items.itemsGridOptions = {
        enableFiltering: true,
        flatEntityAccess: true,
        fastWatch: true,
        enableRowSelection: true,
        multiSelect: false,
        enableSelectAll: false,
        enableRowHeaderSelection: false,
        noUnselect: true,
        columnDefs: [
            {name: 'Код', width: '10%'},
            {name: 'Артикул', width: '10%'},
            {name: 'Наименование', width: '60%'},
            {name: 'Цена', width: '10%', enableFiltering: false},
            {name: 'Остаток', width: '10%', enableFiltering: false}
        ],
        appScopeProvider: items.myAppScopeProvider,
        rowTemplate: '<div ng-dblclick="grid.appScope.gridRowClick(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" ' +
            'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>'
    };
}

function configureCategoryGrid(items) {
    items.categoryGridOptions = {
        enableSorting: true,
        enableFiltering: true,
        showTreeExpandNoChildren: false,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        columnDefs: [
            {name: 'Категория'}
        ]
    };
}

function configureCartGrid(items, $timeout) {
    items.cartGridOptions = {
        enableFiltering: true,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        enableCellEditOnFocus: true,
        columnDefs: [
            {name: 'Код', width: '10%', enableCellEdit: false},
            {name: 'Артикул', width: '10%', enableCellEdit: false},
            {name: 'Наименование', width: '50%', enableCellEdit: false},
            {name: 'Количество', width: '10%', enableFiltering: false},
            {name: 'Цена', width: '10%', enableCellEdit: false, enableFiltering: false},
            {name: 'Сумма', width: '10%', enableCellEdit: false, enableFiltering: false}
        ],
        onRegisterApi: function(gridApi){
            items.cartGridApi = gridApi;
        },
        data: []
    };

    items.focusOnAmount = function() {
        $timeout(function() {
            items.cartGridApi.cellNav.scrollToFocus(
                items.cartGridOptions.data[0],
                items.cartGridOptions.columnDefs[3]
            )
        }, 100);
    };
}

function OrdersCtrl($state) {
    this.myAppScopeProvider = {
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
        appScopeProvider: this.myAppScopeProvider,
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

angular
    .module('ordering')
    .controller('MainCtrl', MainCtrl)
    .controller('ItemsCtrl', ItemsCtrl)
    .controller('OrdersCtrl', OrdersCtrl)
    .controller('OrderCtrl', OrderCtrl);