angular.module('ordering').controller('ItemsCtrl', ['$scope', '$timeout', '$http', 'uiGridConstants',
  function ($scope, $timeout, $http, uiGridConstants) {

    var allItems = [];

    prepareItemGrid();
    prepareCategoryGrid();
    prepareCartGrid();

    function prepareItemGrid() {

      $scope.kPressOnItems = function ($event) {
        console.log($event)
      };

      $scope.itemsGridScopeProvider = {
        gridRowClick: function(rowItem) {
          $scope.cartGridOptions.data.unshift(rowItem.entity);
          $scope.focusOnAmount();
        }
      };

      $scope.itemsGridOptions = {
        enableColumnMenus: false,
        enableFiltering: true,
        flatEntityAccess: true,
        fastWatch: true,
        enableRowSelection: true,
        multiSelect: false,
        enableSelectAll: false,
        enableRowHeaderSelection: false,
        rowHeight: 25,
        noUnselect: true,
        columnDefs: [
          {name: 'Код', field: 'code', width: '10%'},
          {name: 'Артикул', field: 'article', width: '10%'},
          {name: 'Наименование', field: 'name', width: '60%'},
          {name: 'Цена', field: 'price', width: '10%', enableFiltering: false},
          {name: 'Остаток', field: 'stock', width: '10%', enableFiltering: false}
        ],
        appScopeProvider: $scope.itemsGridScopeProvider,
        rowTemplate: '<div ng-dblclick="grid.appScope.gridRowClick(row)" ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.uid" ' +
        'class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>',
        data: []
      };

      $http.get("data/items.json").then(function (response) {
        $scope.itemsGridOptions.data = response.data;
        allItems = response.data
      });
    }

    function getChildrenCategories(row, ids) {
      var children = row.treeNode.children;
      if (children.length) {
        children.forEach(function (child) {
          getChildrenCategories(child.row, ids)
        });
      } else {
        ids.push(row.entity.id);
      }
    }

    function filterItemsByCategory(CategoriesRow) {
      if (CategoriesRow.isSelected) {
        var ids = [];
        getChildrenCategories(CategoriesRow, ids);
        $scope.itemsGridOptions.data = allItems.filter(function (item) {
          return ids.indexOf(item.categoryId) >= 0
        });
      } else {
        $scope.itemsGridOptions.data = allItems
      }
    }

    function prepareCategoryGrid() {
      $scope.categoryGridOptions = {
        enableColumnMenus: false,
        enableSorting: true,
        enableFiltering: true,
        enableColumnMenu: false,
        showTreeExpandNoChildren: false,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        rowHeight: 25,
        columnDefs: [
          {name: 'Категория', field: 'name'}
        ],
        onRegisterApi: function (gridApi) {
          gridApi.selection.on.rowSelectionChanged($scope, filterItemsByCategory)
        },
        data: []
      };

      $http.get("data/categories.json").then(function (response) {
        $scope.categoryGridOptions.data = response.data
      });
    }

    function prepareCartGrid() {
      $scope.cartGridOptions = {
        enableColumnMenus: false,
        enableGridMenu: true,
        enableFiltering: true,
        enableRowSelection: true,
        enableRowHeaderSelection: false,
        multiSelect: false,
        enableCellEditOnFocus: true,
        rowHeight: 25,
        columnDefs: [
          {name: 'Код', field: 'code', width: '10%', enableCellEdit: false},
          {name: 'Артикул', field: 'article', width: '10%', enableCellEdit: false},
          {name: 'Наименование', field: 'name', width: '50%', enableCellEdit: false},
          {name: 'Количество', field: 'amount', width: '10%', enableFiltering: false, type: 'number'},
          {name: 'Цена', field: 'price', width: '10%', enableCellEdit: false, enableFiltering: false },
          {name: 'Сумма', field: 'sum', width: '10%', enableCellEdit: false, enableFiltering: false}
        ],
        onRegisterApi: function (gridApi) {
          $scope.cartGridApi = gridApi;
          gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue){
            if (rowEntity.amount){
              rowEntity.sum = rowEntity.amount * rowEntity.price;
            }
          });
        },
        importerDataAddCallback: function (grid, newObjects) {
          $scope.cartGridOptions.data = $scope.cartGridOptions.data.concat(newObjects);
        },
        data: []
      };

      $scope.focusOnAmount = function () {
        $timeout(function() {
          $scope.cartGridApi.cellNav.scrollToFocus(
            $scope.cartGridOptions.data[0],
            $scope.cartGridOptions.columnDefs[3]
          )
        }, 100);
      };
    }
  }
]);






