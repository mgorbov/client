function ItemsCtrl($timeout, $http) {

    this.allItems = [];
    prepareItemGrid(this, $http);
    prepareCategoryGrid(this, $http);
    prepareCartGrid(this, $timeout);

}

function prepareItemGrid(items, $http) {
    items.itemsGridScopeProvider = {
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
            {name: 'Код', field: 'code', width: '10%'},
            {name: 'Артикул', field: 'article', width: '10%'},
            {name: 'Наименование', field: 'name', width: '60%'},
            {name: 'Цена', field: 'price', width: '10%', enableFiltering: false},
            {name: 'Остаток', field: 'stock', width: '10%', enableFiltering: false}
        ],
        appScopeProvider: items.itemsGridScopeProvider,
        rowTemplate: '<div ng-dblclick="grid.appScope.gridRowClick(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" ' +
        'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>'
    };


    $http.get("data/items.json").then(function(response) {
        items.itemsGridOptions.data = response.data;
        items.allItems = response.data
    });
}

function prepareCategoryGrid(items, $http) {

    function filterItems(CategoriesRow) {
        function getChildrenCategories(row) {
            var children = row.treeNode.children;
            if (children.length) {
                children.forEach(function (child) {
                    getChildrenCategories(child.row)
                });
            } else {
                ids.push(row.entity.id);
            }
        }


        if (CategoriesRow.isSelected){
            var ids = [];
            getChildrenCategories(CategoriesRow);
            items.itemsGridOptions.data = items.allItems.filter(function (item) {
                return ids.indexOf(item.categoryId) >= 0
            });
        } else {
            items.itemsGridOptions.data = items.allItems
        }
    }

    items.categoryGridOptions = {
        enableSorting: true,
        enableFiltering: true,
        showTreeExpandNoChildren: false,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        columnDefs: [
            {name: 'Категория', field: 'name'}
        ],
        onRegisterApi: function(gridApi){
            gridApi.selection.on.rowSelectionChanged(items, filterItems);
        },
        data: []
    };

    $http.get("data/categories.json").then(function(response) {
        items.categoryGridOptions.data = response.data
    });
}

function prepareCartGrid(items, $timeout) {
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


angular
    .module('ordering')
    .controller('ItemsCtrl', ItemsCtrl);