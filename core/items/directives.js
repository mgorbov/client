angular.module('ordering')
    .directive('uiGridKeyNav', ['$compile', 'gridUtil', function ($compile, gridUtil) {
        return {
            require: '^uiGrid',
            scope: false,
            link: function ($scope, $elm, $attrs, uiGridCtrl) {
                var grid = uiGridCtrl.grid;
                var focuser = $compile('<div class="ui-grid-focuser" role="region" aria-live="assertive" aria-atomic="false" tabindex="0" aria-controls="' + grid.id + '-aria-speakable ' + grid.id + '-grid-container' + '" aria-owns="' + grid.id + '-grid-container' + '"></div>')($scope);
                $elm.append(focuser);

                $elm.bind('click', function () {
                    gridUtil.focus.byElement(focuser[0]);
                });

                focuser.bind('keydown', function (e) {
                    $scope.$apply(function () {
                        var selectedEntities,
                            visibleRows,
                            selectedIndex;

                        if (e.keyCode !== 38 && e.keyCode !== 40 && e.keyCode !== 37 && e.keyCode !== 39
                            && e.keyCode !== 33 && e.keyCode !== 34 && e.keyCode !== 13)
                            return;

                        selectedEntities = grid.api.selection.getSelectedRows();

                        if (selectedEntities.length === 1) {
                            visibleRows = grid.getVisibleRows();

                            selectedIndex = visibleRows.map(function (item) {
                                return item.entity;
                            }).indexOf(selectedEntities[0]);

                            if (selectedIndex < 0)
                                return;
                            // Enter
                            if (e.keyCode === 13) {
                                grid.appScope.gridRowClick(visibleRows[selectedIndex]);

                                // Left
                            } else if (e.keyCode === 37) {
                                grid.api.treeBase.collapseRow(grid.rowHashMap.get(selectedEntities[0]));
                                // Right
                            } else if (e.keyCode === 39) {
                                grid.api.treeBase.expandRow(grid.rowHashMap.get(selectedEntities[0]));
                                // Up
                            } else if (e.keyCode === 38 && selectedIndex > 0) {
                                --selectedIndex;
                                // Down
                            } else if (e.keyCode === 40 && selectedIndex < grid.getVisibleRows().length - 1) {
                                ++selectedIndex;
                                // pgUp
                            } else if (e.keyCode === 33 && selectedIndex > 0) {
                                selectedIndex = selectedIndex - 15;
                                if (selectedIndex < 0) {
                                    selectedIndex = 0;
                                }
                                // pgDown
                            } else if (e.keyCode === 34 && selectedIndex < grid.getVisibleRows().length - 1) {
                                selectedIndex = selectedIndex + 15;
                                if (selectedIndex > grid.getVisibleRows().length - 1) {
                                    selectedIndex = grid.getVisibleRows().length - 1;
                                }
                            }

                            grid.api.selection.selectRowByVisibleIndex(selectedIndex, e);
                            grid.api.core.scrollToIfNecessary(visibleRows[selectedIndex], grid.columns[0]);
                        }
                    });
                });
            }
        };
    }]);
