/*jshint maxdepth:false, maxstatements:false*/
/*global fanexGridLanguage, moment,numeral*/

var fanexGridCurrentLanguage = fanexGridCurrentLanguage || {};

(function ($) {
    //'use strict';

    //// Method expose for user use
    var methods =
    {
        createFanexGrid: function (opts) {
            if (opts.showColumnsShowHide === false || opts.enableHiddenColumns === false) {
                opts.enableHiddenColumns = false;
                opts.hiddenColumns = opts.hiddenColumns || [];
                opts.hiddenColumns = opts.hiddenColumns.concat(opts.columnsNeedHide || []);
                opts.columns = Fanex.Grid.Helper.SetColumnDisplay(opts.columns, opts.hiddenColumns);
            }
            opts = $.extend({}, $.fn.fanexGrid.defaults, opts);
            return this.each(function () {
                var fanexGrid = new Fanex.Grid(this, opts);
                fanexGrid.RenderGrid();
                return fanexGrid.GetjQueryInstance();
            });
        },
        reRender: function (opts) {
            if (opts.showColumnsShowHide === false || opts.enableHiddenColumns === false) {
                opts.enableHiddenColumns = false;
                opts.hiddenColumns = opts.hiddenColumns || [];
                opts.hiddenColumns = opts.hiddenColumns.concat(opts.columnsNeedHide);
                opts.columns = Fanex.Grid.Helper.SetColumnDisplay(opts.columns, opts.hiddenColumns);
            }
            opts = $.extend({}, $.fn.fanexGrid.defaults, opts);
            return this.each(function () {
                var fanexGrid = new Fanex.Grid(this, opts);
                fanexGrid.RenderGrid();
                return fanexGrid.GetjQueryInstance();
            });
        },
        reRenderBodyAfterSort: function (opts, sortColumnName, sortDirection) {
            opts = $.extend({}, $.fn.fanexGrid.defaults, opts);
            return this.each(function () {
                var fanexGrid = new Fanex.Grid(this, opts);
                fanexGrid.ReRenderBodyAfterSort(sortColumnName, sortDirection);
                if (opts.showPager === true) {
                    fanexGrid.RenderPager();
                }
                return fanexGrid.GetjQueryInstance();
            });
        },
        showColumns: function (opts, columnsNeedShow) {
            opts.enableHiddenColumns = true;
            opts.columns = Fanex.Grid.Helper.SetColumnDisplay(opts.columns, columnsNeedShow);
            opts = $.extend({}, $.fn.fanexGrid.defaults, opts);
            return this.each(function () {
                var fanexGrid = new Fanex.Grid(this, opts);
                opts.pagerOption = Fanex.Grid.List[fanexGrid.tableContentId].pagerOption;
                Fanex.Grid.Helper.UpdateSortInforAfterShowHideColumns(opts, Fanex.Grid.List[fanexGrid.tableContentId].sortOption);
                fanexGrid.RenderGrid();
                return fanexGrid.GetjQueryInstance();
            });
        },
        hideColumns: function (opts, hiddenColumns) {
            opts.enableHiddenColumns = false;
            opts.columns = Fanex.Grid.Helper.SetColumnDisplay(opts.columns, hiddenColumns);
            opts.hiddenColumns = hiddenColumns;
            opts = $.extend({}, $.fn.fanexGrid.defaults, opts);
            return this.each(function () {
                var fanexGrid = new Fanex.Grid(this, opts);
                opts.pagerOption = Fanex.Grid.List[fanexGrid.tableContentId].pagerOption;
                Fanex.Grid.Helper.UpdateSortInforAfterShowHideColumns(opts, Fanex.Grid.List[fanexGrid.tableContentId].sortOption);
                fanexGrid.RenderShowHideColumns(false);
                return fanexGrid.GetjQueryInstance();
            });
        },
        resizeGrid: function () {
            return this.each(function () {
                var $this = $(this);
                var currentContentId = 'tblContent_' + $this.attr('id');
                var gridOptions = Fanex.Grid.List[currentContentId].gridOptions;
                gridOptions.isResetScroller = false;
                $this.gridScroller(Fanex.Grid.List[currentContentId].gridOptions);
                return $this;
            });
        },
        resizeHeight: function (gridHeight) {
            return this.each(function () {
                var $this = $(this);
                if (gridHeight) {
                    var currentContentId = 'tblContent_' + $this.attr('id');
                    var currentOptions = Fanex.Grid.List[currentContentId].gridOptions;
                    currentOptions.gridHeight = gridHeight;
                    $this.gridScroller(currentOptions);
                }
                return $this;
            });
        },
        appendBody: function (opts, rows) {
            opts = $.extend({}, $.fn.fanexGrid.defaults, opts);
            return this.each(function () {
                var fanexGrid = new Fanex.Grid(this, opts);
                fanexGrid.AppendBodyRows(rows);
                $(this).fanexGrid('resizeGrid');
            });
        },
        getCurrentPage: function () { },
        getColumnsIdentify: function (opts) {
            return Fanex.Grid.Helper.GetColumnsHastable(opts.columns);
        }
    };

    //// Plugin
    $.fn.fanexGrid = function (options) {
        if (methods[options]) {
            return methods[options].apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else if (typeof options === 'object' || !options) {
            return methods.createFanexGrid.apply(this, arguments);
        }
        else {
            throw new Error('Options cannot be null');
        }
    };

    //// Default Options
    $.fn.fanexGrid.defaults =
    {
        customizeHeader: false,
        headerRows: [],
        columns: [],
        bodyRows: [],
        numberOfFrozenColumn: 0,
        showFooter: false,
        footerRows: [],
        showTitle: false,
        headerColumnHeight: 25,
        bodyRowHeight: 21,
        footerRowHeight: 21,
        titleInfo:
        {
            text: "",
            hideWhenNoData: true,
            showExcelButton: false,
            exportExcelFunction: null,
            showBackButton: false,
            backFunction: null,
            showSendMailButton: false,
            sendMailFunction: null,
            showCollapseExpandButton: false,
            customButtons: '',
            showButtonsWhenNoData: false
        },
        showPager: false,
        pagerOption:
        {
            itemsPerPage: 100,
            maxItemsPerPage: 500,
            currentPage: 1,
            totalItem: 0,
            startPerPage: 100,
            pageStep: 50,
            afterPagedFunction: null,
            showDetail: true
        },
        showTree: false,
        gridExpandHeight: 150,
        showNoDataOnFrozen: false,
        showColumnsShowHide: true,
        enableHiddenColumns: true,
        showDistinctRow: true,
        showHighlightRow: true,
        highlightFrozenWidth: 1,
        showNumberColumn: false,
        marginRight: 5,
        allowTruncate: false,
        columnsNeedHide: [],
        hiddenColumns: [],
        sortOption:
        {
            customGridSort: null,
            serverSortFunction: null,
            afterGridSorted: null,
            beforeGridSorted: null
        },
        hideYBackGroundScroller: false,
        bottomBorderWidth: 1,
        treeParentPaddingLeft: 20,
        isResetScroller: false,
        fullHeight: true,
        gridHeight: 400,
        gridWidth: 0,
        noDataText: "There is no data",
        language: 'en-US',
        autoFixFrozenRowHeight: false,
        autoResizeColumn: false,
        pixelsPerCharacter: 0,
        calTextWidthWithFontSize: true,
        timeZone: '',
        scrollWidth: 24
    };

    var Fanex = Fanex || {};

    Fanex.Grid = function (grid, options) {
        this.$grid = $(grid);
        //// Calculate fontsize for hide cell value if cell value exceed
        try {
            this.currentFontSize = parseInt(this.$grid.css('font-size').replace('px', ''));
        }
        catch (e) {
            this.currentFontSize = 12;
        }
        this.currentFontSize -= 4;
        if (options.pixelsPerCharacter === 0) {
            options.pixelsPerCharacter = this.currentFontSize;
        }
        this.Options = options.autoResizeColumn ? Fanex.Grid.Helper.ComputeResizeColumn(this.$grid, options) : options;

        this.gridObject = grid;
        this.gridId = this.$grid.attr('id');
        this.tableContentId = 'tblContent_' + this.gridId;
        this.frozenContentId = 'frozenContent_' + this.gridId;
        this.headerColumnsCloneFromOptionColumns = Fanex.Grid.Helper.CreateHeaderColumnsFromOptionsColumn(options.columns.slice(0));

        if (fanexGridLanguage[options.language] == null) {
            alert('Cannot load language: ' + options.language);
        }
        else {
            fanexGridCurrentLanguage = fanexGridLanguage[options.language];
        }


        //// Create a hashtable contain columns information for esay retrieve data
        this.columnsHastable = Fanex.Grid.Helper.GetColumnsHastable(options.columns);
        //// Create columnswidth array
        this.columnsWidth = Fanex.Grid.Helper.GetArrayWidth(options.columns, options.enableHiddenColumns, false);
        this.columnsForComputingWidth = Fanex.Grid.Helper.GetArrayWidth(options.columns, options.enableHiddenColumns, true);
        if (this.Options.customPager !== true) {
            this.Options.pagerOption.totalItem = this.Options.bodyRows.length;
        }
        this.gridOptions = null;
        this.frozenColsName = [];
        //// If frozen, then create an array contain frozen columns name
        if (options.numberOfFrozenColumn > 0) {
            for (var colIndex = 0; colIndex < options.numberOfFrozenColumn; colIndex++) {
                this.frozenColsName.push(options.columns[colIndex].name);
            }
            //// If highlight frozen then set width for hightligth
            if (options.highlightFrozenWidth > 1) {
                var lastFrozenCol = options.columns[options.numberOfFrozenColumn - 1];
                if (isValid(lastFrozenCol.TrClass)) {
                    lastFrozenCol.TdClass += " border-right-highlight ";
                }
                else {
                    lastFrozenCol.TdClass = "border-right-highlight ";
                }
                options.highlightFrozenWidth--;
            }
        }
    };

    Fanex.Grid.prototype =
    {
        RenderGrid: function () {
            if (typeof (fanexGridLanguage) === 'undefined') {
                return;
            }
            var me = this;
            var options = me.Options;
            var footer = '';
            if (options.showFooter && options.bodyRows.length > 0) {
                if (typeof (options.pagerOption.customRenderFooter) === 'function') {
                    var startIndex = (options.pagerOption.currentPage * options.pagerOption.itemsPerPage);
                    var endIndex = ((options.pagerOption.currentPage + 1) * options.pagerOption.itemsPerPage);
                    var currentBodyRows = options.bodyRows.slice(startIndex, endIndex);
                    me.Options.footerRows = options.pagerOption.customRenderFooter(
                                                                                currentBodyRows,
                                                                                options.pagerOption.currentPage,
                                                                                options.pagerOption.itemsPerPage);
                }

                footer = me.RenderFooter();
            }
            //// Render Table Main Frame
            var html = me.RenderBody(me.RenderHeader()) + footer;
            if (me.gridObject) {
                me.gridObject.innerHTML = html;
            }
            me.$grid.before(me.RenderTitle());
            me.RegisterMouseHoverEvent();
            me.Initialize();
            //// Render Title
            //
        },
        RenderShowHideColumns: function (isShow) {
            var me = this;
            var options = me.Options;
            var currentMainBodyHtml = me.$grid.find('#' + me.tableContentId + '> tbody').html();
            var currentFrozenBodyHeader = me.$grid.find('#' + me.frozenContentId + '> tbody').html();
            var bodyHtml = me.RenderHeader() + me.RenderCommonHeader('mainbody');
            var footer = (options.showFooter && options.bodyRows.length > 0 ? me.RenderFooter() : "");
            var bodyHtmlTemp = '',
                currentCol;
            // Fixbug for replace $' string
            if (options.numberOfFrozenColumn > 0) {
                bodyHtmlTemp = bodyHtml.split('{$}frozenBody');
                if (bodyHtmlTemp.length === 2) {
                    bodyHtml = bodyHtmlTemp[0] + currentFrozenBodyHeader + bodyHtmlTemp[1];
                }
            }
            bodyHtmlTemp = bodyHtml.split('{$}_');
            if (bodyHtmlTemp.length === 2) {
                bodyHtml = bodyHtmlTemp[0] + currentMainBodyHtml + bodyHtmlTemp[1];
            }

            bodyHtml += footer;

            me.$grid.empty(); //.html(bodyHtml);
            if (me.gridObject) {
                me.gridObject.innerHTML = bodyHtml;
            }

            var selector = [];
            var columnsShowLength = options.columns.length;
            for (var colIndex = 0; colIndex < columnsShowLength; colIndex++) {
                me.$grid.find('.free-grid-td-' + colIndex).removeClass("grid-show-hide-column");
            }

            if (!isShow) {
                var columnsHideLength = options.hiddenColumns.length,
                    nhIndex;
                selector = [];
                try {
                    for (var colIndex1 = 0; colIndex1 < columnsHideLength; colIndex1++) {
                        currentCol = options.hiddenColumns[colIndex1];
                        me.$grid.find('.free-cell, .row_header_wrapper, .col_header, .grid-container')
                        .find('.free-grid-td-' + currentCol)
                        .addClass("grid-show-hide-column");
                    }

                    if (options.showFooter) {
                        var needHideCols = options.hiddenColumns.slice(0);
                        for (nhIndex = 0; nhIndex < needHideCols.length; nhIndex++) {
                            currentCol = needHideCols[nhIndex];
                            me.$grid.find('.row_footer, .col_footer').find('.free-grid-td-' + currentCol).addClass("grid-show-hide-column");
                        }
                    }
                }
                catch (e) {
                    window.console.log(e);
                }
            }

            me.RegisterMouseHoverEvent();
            me.Initialize();
        },
        ReRenderBodyAfterSort: function (sortColumnName, sortDirection) {
            var me = this;
            me.RenderBody('', true);
            me.gridOptions = Fanex.Grid.List[me.tableContentId].gridOptions;
            me.gridOptions.isResetScroller = false;
            me.RegisterMouseHoverEvent();
            me.AutoResizeRowHeight();
            $(me.$grid).gridScroller(me.gridOptions);
            //// Save Current Sor
            Fanex.Grid.List[me.tableContentId].sortOption =
            {
                sortColumnName: sortColumnName,
                sortDirection: sortDirection
            };
        },
        AppendBodyRows: function (rows) {
            var me = this;
            var options = me.Options;
            var rowLength = rows.length,
                currentRow;
            if (rowLength > 0) {
                var currentFrozenRows = (options.numberOfFrozenColumn > 0) ?
                                        Fanex.Grid.Helper.CreateRowsForFrozenColumn(rows, options.numberOfFrozenColumn, me.frozenColsName) :
                                        [];
                var frozenBodyLength = currentFrozenRows.length;
                var bodyRowsHtml = [], bodyFrozenHtml = [];
                var currentPageStartIndex = options.bodyRows.length;

                //// Render Frozen Row and Main Row at the same time
                for (var rowIndex = 0; rowIndex < frozenBodyLength; rowIndex++) {
                    currentRow = rows[rowIndex];
                    var currentFrozenRow = currentFrozenRows[rowIndex];
                    bodyRowsHtml.push(me.RenderNormalRow(currentRow, 'td', true, rowIndex + currentPageStartIndex, '', false, rowIndex, 0));
                    bodyFrozenHtml.push(me.RenderFrozenRow(currentFrozenRow, 'td', true, rowIndex + currentPageStartIndex, '', false, rowIndex, 0));
                }

                //// If MainRow still has item, then continue render
                for (var rowIndex = frozenBodyLength; rowIndex < rowLength; rowIndex++) {
                    currentRow = rows[rowIndex];
                    bodyRowsHtml.push(me.RenderNormalRow(currentRow, 'td', true, rowIndex + currentPageStartIndex, '', false, rowIndex, 0));
                }

                //// Update Data
                me.$grid.find('#' + me.tableContentId + '> tbody').append(bodyRowsHtml.join(''));
                me.$grid.find('#' + me.frozenContentId + '> tbody').append(bodyFrozenHtml.join(''));
            }
        },
        GetjQueryInstance: function () {
            return this.$grid;
        },
        Initialize: function () {
            var me = this;
            var options = this.Options;
            var numberOfFrozenColumnNew = (options.enableHiddenColumns === false ?
                                            Fanex.Grid.Helper.ComputeNewFrozenColumn(options.hiddenColumns, options.numberOfFrozenColumn) :
                                            options.numberOfFrozenColumn);
            //// Render Grid Scroller
            me.gridOptions =
            {
                tblContentId: me.tableContentId,
                column: me.columnsWidth,
                gridHeight: options.fullHeight ? options.gridExpandHeight : options.gridHeight,
                gridWidth: options.gridWidth,
                numberFreezeCol: numberOfFrozenColumnNew,
                highlightFrozenWidth: options.highlightFrozenWidth,
                heightScrollYAdd: 0,
                marginRight: options.marginRight,
                hideYBackGroundScroller: options.hideYBackGroundScroller,
                bottomBorderWidth: options.bottomBorderWidth,
                isResetScroller: options.isResetScroller,
                fullHeight: options.fullHeight
            };
            $(me.$grid).initGrid({
                isShowPager: (options.showPager && (options.bodyRows.length > 0))
            }).gridScroller(me.gridOptions);

            //// Render Pager
            if (options.showPager === true) {
                me.RenderPager();
                Fanex.Grid.List[me.tableContentId].pagerOption = options.pagerOption;
            }
            me.RegisterEvents();
            me.AutoResizeRowHeight();

        },
        RenderTitle: function () {
            var me = this;
            var options = me.Options;
            var titleId = me.gridId + '-grid-title';
            if (options.showTitle === false) {
                return '';
            }
            else {
                me.$grid.parent().find('#' + titleId).remove();
                // style="width:' + me.$grid.width() + 'px"
                var titleHtml = [];
                titleHtml.push('<div id="' + me.gridId + '-grid-title' + '" class="grid-title display-none"><div class="grid-title-label" id="reporttile">');
                titleHtml.push(options.titleInfo.text);
                titleHtml.push('</div>');
                titleHtml.push('<div class="grid-toolbox">');
                if (options.titleInfo.showBackButton === true) {
                    titleHtml.push('<input id="btnBack' + me.gridId + '" class="btnBack" type="button" title="Back" value="" name="btnBack" />');
                }
                if (options.bodyRows.length > 0 || options.titleInfo.showButtonsWhenNoData === true) {
                    if (options.titleInfo.customButtons !== '') {
                        titleHtml.push(options.titleInfo.customButtons);
                    }
                    if (options.titleInfo.showCollapseExpandButton === true) {
                        titleHtml.push('<input class="btExpand expanded" id="btnCollapseExpand' +
                                        me.gridId +
                                        '" type="button" value="" title="Collapse/Expand" />');
                    }
                    if (options.titleInfo.showExcelButton === true) {
                        titleHtml.push('<input type="button" id="btnExport' + me.gridId + '" class="btnExcel" title="Export to Excel" />');
                    }
                    if (options.titleInfo.showSendMailButton === true) {
                        titleHtml.push('<input id="btnSendMail' + me.gridId + '" class="btnSendMail" type="button" title="Send Mail" />');
                    }
                }
                titleHtml.push('</div></div>');

                return titleHtml.join('');
            }
        },
        RenderHeader: function () {
            var me = this;
            var options = this.Options;
            var headerHtml = [];

            //// Clone and Add last row of Group Header
            if (options.customizeHeader) {
                this.Options.cloneGroupHeaderRows = options.groupHeaderRows.slice(0);
                this.Options.cloneGroupHeaderRows.push({
                    Columns: me.headerColumnsCloneFromOptionColumns.slice(0)
                });
            }

            //// If there are any item of header column
            var columnLength = options.columns.length;
            if (columnLength > 0) {
                if (options.numberOfFrozenColumn > 0) {
                    headerHtml.push(me.RenderCommonHeader('frozenheader').replace('{$}_', ''));
                    headerHtml.push(me.RenderCommonHeader('frozenbody'));
                }
                headerHtml.push(me.RenderCommonHeader('mainheader').replace('{$}_', ''));
            }

            return headerHtml.join('');
        },
        RenderCommonHeader: function (type) {
            var me = this;
            var options = this.Options;
            var divHeaderClass = '';
            var divContainerClass = '';
            var tableClass = '';
            var hasId = false;
            var tableContainId = me.tableContentId;
            var columnLength = me.headerColumnsCloneFromOptionColumns.length;
            var replaceMark = '_';

            // Grid Frame
            //////////////////////////////////
            // frozen Header //  main header//
            //////////////////////////////////
            // frozen body   // main body   //
            //////////////////////////////////
            switch (type) {
                case 'frozenheader':
                    divContainerClass = 'free-cell free-top-left';
                    tableClass = 'grid-fixed-table free-cell-top-left';
                    columnLength = options.numberOfFrozenColumn;
                    break;
                case 'frozenbody':
                    divHeaderClass = 'row_header_wrapper';
                    divContainerClass = 'row_header row-headers-background';
                    tableClass = 'grid-fixed-table row_header_content';
                    columnLength = options.numberOfFrozenColumn;
                    hasId = true;
                    tableContainId = me.frozenContentId;
                    replaceMark = 'frozenBody';
                    break;
                case 'mainheader':
                    divHeaderClass = 'col_header row-headers-background scroll-y';
                    divContainerClass = 'header-container';
                    tableClass = 'grid-fixed-table col_header_content';
                    break;
                case 'mainbody':
                    divHeaderClass = 'grid-container';
                    divContainerClass = 'content-container';
                    tableClass = 'grid-fixed-table col_body_content';
                    hasId = true;
                    break;
            }

            var headerHtml = [],
                trsHeader = [],
                cellInfo,
                colIndex,
                currentCol,
                customSpan;
            //// Build Header
            if (divHeaderClass !== '') {
                headerHtml.push('<div class="' + divHeaderClass + '">');
            }
            headerHtml.push('<div class="' + divContainerClass + '">');
            headerHtml.push('<table class="' + tableClass + '" ' + (hasId ? ('id="' + tableContainId + '"') : '') + ' ><thead>');

            if (options.customizeHeader) {
                var currentGroupHeader = options.cloneGroupHeaderRows;
                if (type === 'frozenheader' || type === 'frozenbody') {
                    //// Create Header Rows for Frozen Table
                    currentGroupHeader = Fanex.Grid.Helper.CreateRowsForFrozenColumn(
                                                    options.cloneGroupHeaderRows.slice(0),
                                                    options.numberOfFrozenColumn,
                                                    me.frozenColsName);
                }
                for (var rowIndex = 0; rowIndex < currentGroupHeader.length; rowIndex++) {
                    var currentRow = currentGroupHeader[rowIndex];

                    if (currentRow.columns.length > 0) {
                        headerHtml.push('<tr>');

                        for (colIndex = 0; colIndex < currentRow.columns.length && colIndex < columnLength; colIndex++) {
                            currentCol = currentRow.columns[colIndex];
                            if (isValid(currentCol)) {
                                customSpan = '';
                                var currentHeight = options.headerColumnHeight;
                                var showHeaderMergeCol = true;

                                if (isValid(currentCol) && isValid(currentCol.MergeRowNumber)) {
                                    //// If It has merge row and current row has only one columns and column has merge row, then remove next row
                                    Fanex.Grid.Helper.RemoveItemForRowSpan(currentGroupHeader, rowIndex, currentCol, me.columnsHastable);
                                    var currentMergeRowNumber = ' rowspan="' + currentCol.mergeRowNumber + '"';
                                    //if (type === 'frozenheader' || type === 'frozenbody') {
                                    //// Calculate height for merger row
                                    currentHeight = ((options.headerColumnHeight * currentCol.mergeRowNumber) + (currentCol.mergeRowNumber - 1) * 5);
                                    //}
                                    customSpan += currentMergeRowNumber;
                                }

                                //// If Current cell has merge Col
                                if (isValid(currentCol) && isValid(currentCol.mergeColNumber)) {
                                    //// Compute for With for merge
                                    currentCol.width = Fanex.Grid.Helper.GetColMergeWidth(me.columnsForComputingWidth,
                                                                                            me.columnsHastable[currentCol.name].columnIndex,
                                                                                            currentCol.MergeColNumber,
                                                                                            options.enableHiddenColumns,
                                                                                            options.columns);
                                    if (options.enableHiddenColumns === false) {
                                        showHeaderMergeCol = Fanex.Grid.Helper.HideHeaderGroupWhenShowHide(options.hiddenColumns,
                                                                                                            me.columnsHastable[currentCol.name].columnIndex,
                                                                                                            currentCol.MergeColNumber);
                                        customSpan += ' colspan="' + Fanex.Grid.Helper.ReComputeMergeColumAfterShowHide(options.hiddenColumns,
                                                                                                            me.columnsHastable[currentCol.name].columnIndex,
                                                                                                            currentCol.mergeColNumber) + '"';
                                    }
                                    else {
                                        customSpan += ' colspan="' + currentCol.MergeColNumber + '"';
                                    }
                                }

                                if (isValid(currentCol) && isValid(currentCol.mergeHeaderColNumber)) {
                                    customSpan += ' colspan="' + currentCol.mergeHeaderColNumber + '"';
                                }

                                cellInfo =
                                {
                                    cellTag: 'th',
                                    customSpan: customSpan,
                                    cssClass: currentCol.cssClass,
                                    sortClass: (currentRow.columns[colIndex].sort === true ? ' colSorter' : ''),
                                    cellWidth: (currentCol.width || me.columnsHastable[currentCol.name].width),
                                    cellHeight: currentHeight,
                                    cellId: (me.columnsHastable[currentCol.name].sort === true ? (me.gridId + '_header_sort_' + currentCol.name) : ''),
                                    sort: currentRow.columns[colIndex].sort,
                                    cellColumnName: currentCol.name,
                                    headerText: currentCol.headerText,
                                    customAttr: (currentGroupHeader.length > 1 && rowIndex === (currentGroupHeader.length - 1)) ?
                                                    me.columnsHastable[currentCol.name].customAttr :
                                                    undefined,
                                    customHeaderRender: currentCol.customHeaderRender || me.columnsHastable[currentCol.name].customHeaderRender,
                                    sortDirection: currentRow.columns[colIndex].sortDirection || '',
                                    canShowHide: (me.columnsHastable[currentCol.name].canShowHide && (!options.enableHiddenColumns) && showHeaderMergeCol),
                                    tdClass: me.columnsHastable[currentCol.name].tdClass || '',
                                    thClass: currentRow.columns[colIndex].thClass || '',
                                    //                                    (currentGroupHeader.length > 1 && rowIndex === (currentGroupHeader.length - 1)) ?
                                    //                                                        me.columnsHastable[currentCol.Name].ThClass :
                                    //                                                        '',
                                    cellAlign: me.columnsHastable[currentCol.name].headerAlign || (me.columnsHastable[currentCol.name].cellAlign || 'center')
                                };
                                trsHeader.push(me.RenderHeaderCell(cellInfo, currentCol));
                            }
                        }
                        headerHtml.push(trsHeader.join(''));
                        headerHtml.push('</tr>');
                        trsHeader = [];
                    }
                }
            }
            else {
                //// Has no frozen column
                headerHtml.push('<tr>');
                for (colIndex = 0; colIndex < columnLength; colIndex++) {
                    currentCol = me.headerColumnsCloneFromOptionColumns[colIndex];
                    customSpan = '';
                    if (isValid(currentCol) && isValid(currentCol.mergeHeaderColNumber)) {
                        customSpan += ' colspan="' + currentCol.mergeHeaderColNumber + '"';
                    }
                    cellInfo =
                    {
                        cellTag: 'th',
                        customSpan: customSpan,
                        cssClass: currentCol.cssClass,
                        sortClass: (currentCol.sort === true ? ' colSorter' : ''),
                        cellWidth: (currentCol.width || me.columnsHastable[currentCol.name].width),
                        cellHeight: options.headerColumnHeight,
                        cellId: (me.columnsHastable[currentCol.name].sort === true ? (me.gridId + '_header_sort_' + currentCol.name) : ''),
                        sort: currentCol.sort,
                        cellColumnName: currentCol.name,
                        headerText: currentCol.headerText,
                        customHeaderRender: currentCol.customHeaderRender || me.columnsHastable[currentCol.name].customHeaderRender,
                        sortDirection: currentCol.sortDirection || '',
                        customAttr: me.columnsHastable[currentCol.name].customAttr,
                        canShowHide: me.columnsHastable[currentCol.name].canShowHide && (!options.enableHiddenColumns),
                        tdClass: me.columnsHastable[currentCol.name].tdClass || '',
                        thClass: me.columnsHastable[currentCol.name].thClass || '',
                        cellAlign: me.columnsHastable[currentCol.name].headerAlign || (me.columnsHastable[currentCol.name].cellAlign || 'center')
                    };
                    trsHeader.push(me.RenderHeaderCell(cellInfo, currentCol));
                }
                headerHtml.push(trsHeader.join(''));
                headerHtml.push('</tr>');
            }
            headerHtml.push('</thead><tbody>{$}' + replaceMark + '</tbody></table>');
            headerHtml.push('</div>');
            if (divHeaderClass !== '') {
                headerHtml.push('</div>');
            }
            return headerHtml.join('');
        },
        RenderFrozenRow: function (currentRow, colHtmlTag, isBody, rowIndex, treeCollapseExpandClass, isForNoData, parentHighlight, level) {
            var me = this;
            var options = me.Options;
            var frozenRowHtml = [];
            var colsLength = currentRow.columns.length;
            var currentCollapseExpandId = '';
            var parentRowClass = '';
            var currentMergeColsIndex = 0;
            var trHighlightAtt = (options.showHighlightRow ? (' highlightatt="highlight-att-frozen-' + parentHighlight + '-' + rowIndex + '"') : '');
            var trClass = (options.showHighlightRow ? 'highlight-row ' : '') +
                            (treeCollapseExpandClass || '') +
                            (currentRow.cssClass || '') +
                            (options.showDistinctRow ? ((rowIndex + 1) % 2 === 0 ? ' freegrid-even' : '') : '');
            if (options.showTree === true && currentRow.subRows) {
                parentRowClass = 'parent-row parent-level-' + level;
            }

            frozenRowHtml.push('<tr class="' + trClass + ' ' + parentRowClass + '" ' + (currentRow.customAttr || '') + trHighlightAtt + '>');
            for (var columnIndex = 0; columnIndex < colsLength; columnIndex++) {
                var currentCol = currentRow.columns[columnIndex];
                var customSpan = '';
                var currentHeight = 'height:' + (currentRow.rowHeight || options.bodyRowHeight) + 'px;';
                var currentWidth = me.columnsHastable[currentCol.name].width;
                var currentHeightForComputeCenter = options.bodyRowHeight;

                //// If Merge Row, then add rowspan, If in the same row and there are no other columns, then cal height, 
                //// or there are some columns but they also have colspan, then cal height
                if (isValid(currentCol.mergeRowNumber)) {
                    customSpan += ' rowspan="' + currentCol.mergeRowNumber + '" ';
                    if (Fanex.Grid.Helper.CheckHideColSpan(currentRow.columns)) {
                        currentHeightForComputeCenter = ((options.bodyRowHeight * currentCol.mergeRowNumber) + (currentCol.mergeRowNumber - 1) * 5);
                        currentHeight = 'height:' + currentHeightForComputeCenter + 'px;';
                        customSpan = '';
                    }
                }

                //// If Merge Column and current row is footer, then calculate height
                if (isValid(currentCol.mergeColNumber)) {
                    customSpan += ' colspan="' + currentCol.mergeColNumber + '" ';
                    currentWidth = Fanex.Grid.Helper.GetColMergeWidth(me.columnsForComputingWidth,
                                                                        me.columnsHastable[currentCol.name].columnIndex,
                                                                        currentCol.mergeColNumber,
                                                                        options.enableHiddenColumns,
                                                                        options.columns);
                }

                if (currentCol.prevRowsColMergeNumber) {
                    currentMergeColsIndex += currentCol.prevRowsColMergeNumber;
                }

                var renderObject = me.RenderBodyCell(
                        {
                            htmlTag: colHtmlTag,
                            customSpan: customSpan,
                            height: currentHeight
                        },
                        {
                            isNoData: isForNoData,
                            colIndex: columnIndex,
                            rowIndex: rowIndex,
                            cssClass: (currentCol.cssClass || (me.columnsHastable[currentCol.name].cellCssClass || '')),
                            width: currentWidth,
                            align: (currentCol.cellAlign || (me.columnsHastable[currentCol.name].cellAlign || 'left')),
                            customAttr: (currentCol.customAttr || ''),
                            parentHighlight: parentHighlight,
                            mergeColumnIndex: currentMergeColsIndex
                        },
                        currentCol,
                        currentRow,
                        isBody,
                        level
                    );
                frozenRowHtml.push(renderObject.cellHtml);
                if (renderObject.currentColumnShowTree === true) {
                    currentCollapseExpandId = renderObject.currentCollapseExpandId;
                }
                if (isValid(currentCol.mergeColNumber)) {
                    currentMergeColsIndex += currentCol.mergeColNumber - 1;
                }
            }
            frozenRowHtml.push('</tr>');

            if (options.showTree === true && currentRow.subRows) {
                frozenRowHtml.push(me.RenderSubRow(currentRow, false, isBody, 0, currentCollapseExpandId, parentHighlight, level));
            }

            return frozenRowHtml.join('');
        },
        RenderNormalRow: function (currentRow, colHtmlTag, isBody, rowIndex, treeCollapseExpandClass, isForNoData, parentHighlight, level) {
            var me = this;
            var options = me.Options;
            var rowHtml = [];
            var colsLength = currentRow.columns.length;
            var currentCollapseExpandId = '';
            var parentRowClass = '';
            var currentMergeColsIndex = 0;
            var trHighlightAtt = (options.showHighlightRow && isBody ? (' highlightatt="highlight-att-main-' + parentHighlight + '-' + rowIndex + '"') : '');
            var trClass = (options.showHighlightRow ? 'highlight-row ' : '') +
                            (currentRow.cssClass || '') + ' ' +
                            (treeCollapseExpandClass || '') + ' ' +
                            (options.showDistinctRow ? ((rowIndex + 1) % 2 === 0 ? ' freegrid-even' : '') : '');

            if (colsLength > 0) {
                //// If show grid with tree, then add class to parent row
                if (options.showTree === true && currentRow.subRows) {
                    parentRowClass = 'parent-row parent-level-' + level;
                }
                rowHtml.push('<tr class="' + trClass + ' ' + parentRowClass + '" ' + (currentRow.customAttr || '') + ' ' + trHighlightAtt + '>');

                for (var colIndex = 0; colIndex < colsLength; colIndex++) {
                    var currentCol = currentRow.columns[colIndex];
                    var currentWidth = me.columnsHastable[currentCol.name].width;
                    var customSpan = '';
                    var currentHeight = 'height:' + (currentRow.rowHeight || options.bodyRowHeight) + 'px;';
                    var currentHeightForComputeCenter = options.bodyRowHeight;
                    if (isValid(currentCol.mergeRowNumber)) {
                        customSpan += ' rowspan="' + currentCol.mergeRowNumber + '" ';
                        currentHeightForComputeCenter *= currentCol.mergeRowNumber;
                    }

                    //// If merge Column, then calculate width for merging
                    if (isValid(currentCol.mergeColNumber)) {
                        customSpan += ' colspan="' + currentCol.mergeColNumber + '" ';
                        currentWidth = Fanex.Grid.Helper.GetColMergeWidth(me.columnsForComputingWidth,
                                                                            me.columnsHastable[currentCol.name].columnIndex,
                                                                            currentCol.mergeColNumber,
                                                                            options.enableHiddenColumns,
                                                                            options.columns);
                    }
                    if (currentCol.prevRowsColMergeNumber) {
                        currentMergeColsIndex += currentCol.prevRowsColMergeNumber;
                    }
                    var renderObject = me.RenderBodyCell({
                        htmlTag: colHtmlTag,
                        customSpan: customSpan,
                        height: currentHeight
                    }, {
                        isNoData: isForNoData,
                        colIndex: colIndex,
                        rowIndex: rowIndex,
                        cssClass: (currentCol.cssClass || (me.columnsHastable[currentCol.name].cellCssClass || '')),
                        width: currentWidth,
                        align: (currentCol.cellAlign || (me.columnsHastable[currentCol.name].cellAlign || 'left')),
                        customAttr: (currentCol.customAttr || ''),
                        parentHighlight: parentHighlight,
                        mergeColumnIndex: currentMergeColsIndex
                    },
                        currentCol,
                        currentRow,
                        isBody,
                        level
                    );
                    rowHtml.push(renderObject.cellHtml);
                    if (renderObject.currentColumnShowTree === true) {
                        currentCollapseExpandId = renderObject.currentCollapseExpandId;
                    }
                    if (isValid(currentCol.mergeColNumber)) {
                        currentMergeColsIndex += currentCol.mergeColNumber - 1;
                    }
                }
                rowHtml.push('</tr>');

                if (options.showTree === true && currentRow.subRows) {
                    rowHtml.push(me.RenderSubRow(currentRow, true, isBody, 0, currentCollapseExpandId, parentHighlight, level));
                }
            }

            return rowHtml.join('');
        },
        RenderSubRow: function (currentRow, isMain, isBody, rowIndex, currentCollapseExpandId, parentHighlight, level) {
            var me = this;
            var options = me.Options;
            var subRowHtml = [];
            var currentSubRows = (isMain === true ? currentRow.subRows :
                                    Fanex.Grid.Helper.CreateRowsForFrozenColumn(currentRow.subRows, options.numberOfFrozenColumn, me.frozenColsName));
            var subRowsLength = currentSubRows.length;
            level++;
            for (var subRowIndex = 0; subRowIndex < subRowsLength; subRowIndex++) {
                var currentSubRow = currentSubRows[subRowIndex];
                if (isMain === true) {
                    subRowHtml.push(me.RenderNormalRow(currentSubRow,
                                                        'td',
                                                        isBody,
                                                        subRowIndex,
                                                        currentCollapseExpandId,
                                                        false,
                                                        parentHighlight + '-' + rowIndex + '-' + subRowIndex, level));
                }
                else {
                    subRowHtml.push(me.RenderFrozenRow(
                                                    currentSubRow,
                                                    'td',
                                                    isBody,
                                                    subRowIndex,
                                                    currentCollapseExpandId,
                                                    false,
                                                    parentHighlight + '-' + rowIndex + '-' + subRowIndex, level));
                }
            }
            return subRowHtml.join('');
        },
        RenderBodyCell: function (container, cell, currentCol, currentRow, isBody, level) {
            var me = this;
            var options = me.Options;
            var cellHtml = [];
            var currentCollapseExpandId = '';

            var currentValue = currentCol.value;
            if (me.columnsHastable[currentCol.name].isAbs && currentValue < 0) {
                currentValue = Math.abs(currentValue);
            }

            if (me.columnsHastable[currentCol.name].formatNumber && !isNaN(currentValue) && currentValue !== '') {
                currentValue = numeral(currentValue).format(me.columnsHastable[currentCol.name].formatNumber);
            }

            if (me.columnsHastable[currentCol.name].formatDateTime &&
                isValid(currentValue) &&
                currentValue !== '' &&
                currentValue != null) {
                    var momentObject = moment(currentValue);
                if (momentObject.isValid()) {
                    if (options.timeZone !== '') {
                        momentObject = momentObject.zone(options.timeZone);
                    }

                    currentValue = momentObject.format(me.columnsHastable[currentCol.name].formatDateTime);
                }
            }

            if (me.columnsHastable[currentCol.name].formatNegative) {
                if (currentCol.value < 0) {
                    currentValue = '<span class="format-negative">' + me.columnsHastable[currentCol.name].formatNegative.replace('$', currentValue) + '</span>';
                }
            }

            if (me.columnsHastable[currentCol.name].formatPositive) {
                if (currentCol.value > 0) {
                    currentValue = '<span class="format-positive">' + me.columnsHastable[currentCol.name].formatPositive.replace('$', currentValue) + '</span>';
                }
            }

            var cellContent = '';
            if (cell.IsNoData === true) {
                cellContent = currentCol.value;
            }
            else {
                cellContent = typeof currentCol.customCellRender === 'function' ?
                                                currentCol.CustomCellRender(currentCol, currentValue) :
                                                ((typeof (me.columnsHastable[currentCol.name].customCellRender) === 'function' && isBody) ?
                                                            me.columnsHastable[currentCol.name].CustomCellRender(currentCol, currentValue) :
                                                            currentValue);
            }

            //// If show tree, then add icon expand
            var tdClass = 'free-grid-td-' + (cell.colIndex + cell.mergeColumnIndex) + ' '
                            + (currentCol.tdClass || (me.columnsHastable[currentCol.name].tdClass || ''));
            if (options.showTree === true && currentRow.subRows && me.columnsHastable[currentCol.name].showCollapseExpand === true) {
                tdClass = 'tr-grid-collapse-expand';
            }

            //// For show/hide column
            if (me.columnsHastable[currentCol.name].canShowHide && me.columnsHastable[currentCol.name].canShowHide === true && (!options.enableHiddenColumns)) {
                tdClass += ' grid-show-hide-column';
            }

            var truncateClass = '';
            var allowTruncate = me.columnsHastable[currentCol.name].allowTruncate === true ? true : options.allowTruncate;
            if (allowTruncate === true) {
                truncateClass = ' column-truncate';
            }

            var titvarooltip = '';
            if (typeof (currentCol.value) === 'string' &&
                (currentCol.value.length * me.currentFontSize > me.columnsHastable[currentCol.name].width) &&
                allowTruncate === true) {
                titvarooltip = ' title="' + currentCol.value + '" ';
            }

            var isCurrentColShowTree = (options.showTree === true &&
            currentRow.subRows &&
            currentRow.subRows.length > 0 && me.columnsHastable[currentCol.name].showCollapseExpand === true);

            var paddingLeft = '';
            if ((isCurrentColShowTree && level !== 0) ||
            (level > 0 &&
                !(currentRow.subRows && currentRow.subRows.length > 0) &&
                me.columnsHastable[currentCol.name].showCollapseExpand === true) ||
            (level === 0 && isCurrentColShowTree &&
                (!isValid(currentRow.subRows) || currentRow.subRows.length === 0))) {
                    var totalPaddingLeft = level * options.treeParentPaddingLeft;
                paddingLeft = 'padding-left:' + totalPaddingLeft + 'px;';
                cell.width -= totalPaddingLeft;
            }

            cellHtml.push('<' + container.htmlTag + ' ' + container.customSpan + ' class="' + tdClass + '"' + ' style="' + container.height + '"' + ' >');
            cellHtml.push('<div class="table-cell ' +
                            cell.cssClass + ' ' +
                            truncateClass +
                            '" style="width:' + cell.width + 'px;' + paddingLeft + '" ' +
                            'align="' + cell.align + '" ' + titvarooltip + cell.customAttr + '>');

            if (isCurrentColShowTree) {
                currentCollapseExpandId = me.gridId + '_tree_' + cell.parentHighlight;
                cellHtml.push('<span class="grid-collapse-expand grid-expand ' +
                                currentCollapseExpandId + '-class' +
                                '" id="' + currentCollapseExpandId + '"></span>');
                currentCollapseExpandId += ' child-row';
            }

            var showRowIndexNumber = (isBody && options.showNumberColumn && cell.colIndex === 0 && !cell.isNoData);
            var currentRowIndexForCustomPager = 0;
            if (showRowIndexNumber) {
                if (options.customPager) {
                    currentRowIndexForCustomPager = cell.rowIndex + options.currentStartRowIndex + 1;
                }
                else {
                    currentRowIndexForCustomPager = (cell.rowIndex + 1);
                }
            }

            cellHtml.push(showRowIndexNumber ? currentRowIndexForCustomPager : cellContent);
            cellHtml.push('</div></' + container.htmlTag + '>');

            return {
                cellHtml: cellHtml.join(''),
                currentCollapseExpandId: currentCollapseExpandId,
                currentColumnShowTree: isCurrentColShowTree
            };
        },
        RenderEmptyRow: function (columnName, columnValue, mergeColumnNumber, cssClass, showOnMainBody) {
            var me = this;
            var options = me.Options;
            var minusColumnNumber = 0;
            var hiddenColumns = options.hiddenColumns,
                i;
            if (options.numberOfFrozenColumn > 0) {
                for (i = 0; i < hiddenColumns.length; i++) {
                    if (hiddenColumns[i] < mergeColumnNumber) {
                        minusColumnNumber++;
                    }
                }
            }
            var columns = [{
                name: columnName,
                value: columnValue,
                mergeColNumber: mergeColumnNumber - minusColumnNumber,
                cssClass: cssClass
            }];
            if (showOnMainBody) {
                var minusMainColumnNumber = mergeColumnNumber - minusColumnNumber;
                if (options.numberOfFrozenColumn > 0) {
                    for (i = 0; i < hiddenColumns.length; i++) {
                        if (hiddenColumns[i] >= mergeColumnNumber) {
                            minusMainColumnNumber++;
                        }
                    }
                }
                columns.push({
                    name: options.columns[minusMainColumnNumber].name,
                    value: fanexGridCurrentLanguage.noData,
                    mergeColNumber: (options.columns.length - minusMainColumnNumber),
                    cssClass: cssClass
                });
            }

            var emptyRowHtml = this.RenderNormalRow({
                columns: columns
            }, 'td', true, 0, '', true, '');
            return emptyRowHtml;
        },
        RenderHeaderCell: function (cellInfo, currentColumn) {
            var me = this;
            var options = me.Options;
            var cellHtml = [];
            var cellTag = cellInfo.cellTag || 'td';
            var customSpan = cellInfo.customSpan || ' ';
            var cssClass = cellInfo.cssClass || ' ';
            var sortClass = cellInfo.sortClass || ' ';
            var customAttr = cellInfo.customAttr || ' ';
            var thClass = cellInfo.thClass || ' ';
            var cellWidth = 'width:' + (cellInfo.cellWidth || '200') + 'px;';
            var cellHeight = isValid(cellInfo.cellHeight) ? ('height:' + (cellInfo.cellHeight || options.headerColumnHeight) + 'px;') : ' ';
            var cellId = isValid(cellInfo.cellId) ? ' id="' + cellInfo.cellId + '"' : " ";
            var sort = cellInfo.sort || false;
            var cellColumnName = cellInfo.cellColumnName || '';
            var showClass = (isValid(cellInfo.canShowHide) && cellInfo.canShowHide) ? ('grid-show-hide-column') : ' ' + thClass;

            cellHtml.push('<' + cellTag + ' ' + customSpan + ' class="' + showClass + '" >');

            cellHtml.push('<div class="table-cell ' + cssClass + ' ' + sortClass +
                            '" style="' + cellWidth + cellHeight + '" ' + cellId +
                            ' align="' + cellInfo.cellAlign + '" ' + customAttr + '>');
            if (sort === true) {
                cellHtml.push('<div class="display-inline-block">');
            }

            if (typeof cellInfo.customHeaderRender === 'function') {
                cellHtml.push(cellInfo.CustomHeaderRender(currentColumn));
            }
            else {
                cellHtml.push(cellInfo.headerText);
            }

            if (sort === true) {
                var sortDirection = cellInfo.sortDirection || '';
                cellHtml.push('</div><div class="divSorter ' + sortDirection.toLowerCase() + '" data-columnname="' + cellColumnName + '"> </div>');
            }

            cellHtml.push('</div>');
            cellHtml.push('</' + cellTag + '>');
            return cellHtml.join('');
        },
        RenderBody: function (headerHtml, reRenderBody) {
            var me = this;
            var options = this.Options;
            var bodyHtml = (reRenderBody === true ? '' : (headerHtml + me.RenderCommonHeader('mainbody')));
            var bodyRowsHtml = [];
            var bodyFrozenHtml = [];
            var currentBodyRows = [];
            var currentPageStartIndex = 0,
                currentRow;

            if (options.sortOption.serverSortFunction == null &&
                options.sortOption.customGridSort == null) {
                var defaultSort = false,
                customSortFunction = null,
                sortType = null,
                columnName = '',
                currentDirection = '';
                for (var colIndex = 0; colIndex < options.columns.length; colIndex++) {
                    if (options.columns[colIndex].sortDirection != null
                    && options.columns[colIndex].sortDirection !== '') {
                        defaultSort = true;
                        currentDirection = options.columns[colIndex].sortDirection;
                        customSortFunction = options.columns[colIndex].customSortFunction;
                        columnName = options.columns[colIndex].name;
                        sortType = options.columns[colIndex].sortType;
                        break;
                    }
                }

                if (defaultSort) {
                    options.bodyRows = Fanex.Grid.Helper.GetSortedArray(options.bodyRows,
                                                                    columnName,
                                                                    currentDirection,
                                                                    customSortFunction,
                                                                    sortType);

                }
            }

            //// If show pager, then take approriate data range
            if (options.showPager === true && options.customPager !== true) {
                var startIndex = (options.pagerOption.currentPage * options.pagerOption.itemsPerPage);
                var endIndex = ((options.pagerOption.currentPage + 1) * options.pagerOption.itemsPerPage);
                currentBodyRows = options.bodyRows.slice(startIndex, endIndex);
                currentPageStartIndex = startIndex;
            }
            else {
                this.Options.currentStartRowIndex = options.pagerOption.currentPage * options.pagerOption.itemsPerPage;
                currentBodyRows = options.bodyRows;
            }

            var bodyLength = currentBodyRows.length;
            var currentFrozenRows = (options.numberOfFrozenColumn > 0) ?
                                    Fanex.Grid.Helper.CreateRowsForFrozenColumn(currentBodyRows, options.numberOfFrozenColumn, me.frozenColsName) :
                                    [];
                                    var frozenBodyLength = currentFrozenRows.length;

            if (bodyLength > 0) {
                //// Render Frozen Row and Main Row at the same time
                for (var rowIndex = 0; rowIndex < frozenBodyLength; rowIndex++) {
                    currentRow = currentBodyRows[rowIndex];
                    var currentFrozenRow = currentFrozenRows[rowIndex];
                    bodyRowsHtml.push(me.RenderNormalRow(currentRow, 'td', true, rowIndex + currentPageStartIndex, '', false, rowIndex, 0));
                    bodyFrozenHtml.push(me.RenderFrozenRow(currentFrozenRow, 'td', true, rowIndex + currentPageStartIndex, '', false, rowIndex, 0));
                }

                //// If MainRow still has item, then continue render
                for (rowIndex = frozenBodyLength; rowIndex < bodyLength; rowIndex++) {
                    currentRow = currentBodyRows[rowIndex];
                    bodyRowsHtml.push(me.RenderNormalRow(currentRow, 'td', true, rowIndex + currentPageStartIndex, '', false, rowIndex, 0));
                }
            }
            else {
                //// Render There is no data, showNoDataOnFrozen
                var emptyData = fanexGridCurrentLanguage.noData;
                if (options.numberOfFrozenColumn > 0) {
                    if (options.showNoDataOnFrozen) {
                        //// Show No Info on the frozen table
                        bodyRowsHtml.push(me.RenderEmptyRow(options.columns[0].name, emptyData, options.columns.length, 'no-data-frozen', false));
                        bodyFrozenHtml.push(me.RenderEmptyRow(options.columns[0].name, emptyData, options.numberOfFrozenColumn, 'no-data-frozen', false));
                    }
                    else {
                        //// Show No Info on the main table
                        bodyRowsHtml.push(me.RenderEmptyRow(options.columns[0].name, '', options.numberOfFrozenColumn, 'no-data-frozen', true));
                        bodyFrozenHtml.push(me.RenderEmptyRow(options.columns[0].name, '', options.numberOfFrozenColumn, '', false));
                    }
                }
                else {
                    //// Show No Info on the main table
                    bodyRowsHtml.push(me.RenderEmptyRow(options.columns[0].name, emptyData, options.columns.length, 'no-data-not-frozen', false));
                }
            }

            if (reRenderBody === true) {
                me.$grid.find('#' + me.frozenContentId + '> tbody').remove();
                me.$grid.find('#' + me.tableContentId + '> tbody').remove();
                var div = document.createElement("div");
                div.innerHTML = "<table><tbody>" + bodyFrozenHtml.join('') + "</tbody></table>";
                var frozenContainer = document.getElementById(me.frozenContentId);
                if (frozenContainer) {
                    frozenContainer.appendChild(div.firstChild.tBodies[0]);
                }
                div.innerHTML = "<table><tbody>" + bodyRowsHtml.join('') + "</tbody></table>";
                var mainContainer = document.getElementById(me.tableContentId);
                if (mainContainer) {
                    mainContainer.appendChild(div.firstChild.tBodies[0]);
                }
            }
            else {
                // Fixbug for replace $' string
                var bodyHtmlTemp = bodyHtml.split('{$}frozenBody');
                if (bodyHtmlTemp.length === 2) {
                    bodyHtml = bodyHtmlTemp[0] + bodyFrozenHtml.join('') + bodyHtmlTemp[1];
                }
                bodyHtmlTemp = bodyHtml.split('{$}_');
                if (bodyHtmlTemp.length === 2) {
                    bodyHtml = bodyHtmlTemp[0] + bodyRowsHtml.join('') + bodyHtmlTemp[1];
                }
            }

            return Fanex.Grid.Helper.RemoveSpaceIE9(bodyHtml);
        },
        RenderFooter: function (reRender) {
            var me = this,
                footerHtml = [],
                frozenFooterHtml = [],
                currentFooterHtml = me.RenderFooterBody();
            reRender = reRender || false;
            if (reRender) {
                //currentFooterHtml
                me.$grid.find('.row_footer_content > thead').empty().append(currentFooterHtml.frozenFooterHtml);
                me.$grid.find('.col_footer_content > thead').empty().append(currentFooterHtml.footerHtml);
            }
            else {
                footerHtml.push('<div class="col_footer row-footer-background scroll-y">' +
                                '<div class="footer-container">' +
                                    '<table class="col_footer_content grid-fixed-table">' +
                                        '<thead>');

                frozenFooterHtml.push(' <div class="row_footer row-footer-background z999">' +
                                    ' <table class="grid-fixed-table row_footer_content">' +
                                    '    <thead>');


                currentFooterHtml = me.RenderFooterBody();

                footerHtml.push(currentFooterHtml.footerHtml);

                frozenFooterHtml.push(currentFooterHtml.frozenFooterHtml);

                frozenFooterHtml.push('   </thead>' + '</table>' + '</div>');

                footerHtml.push(' </thead>' + '</table>' + '</div>' + '</div>');

                return frozenFooterHtml.join('') + footerHtml.join('');
            }
        },
        RenderFooterBody: function () {
            var me = this;
            var options = me.Options;
            var footerHtml = [];
            var frozenFooterHtml = [];
            var footerRowsLength = options.footerRows.length,
                currentRow;

            var currentFrozenRows = (options.numberOfFrozenColumn > 0) ?
                                    Fanex.Grid.Helper.CreateRowsForFrozenColumn(options.footerRows, options.numberOfFrozenColumn, me.frozenColsName) :
                                    [];
            var frozenFooterLength = currentFrozenRows.length;

            //// Render Frozen fotter and main Footer
            for (var rowIndex = 0; rowIndex < frozenFooterLength; rowIndex++) {
                currentRow = options.footerRows[rowIndex];
                var currentFrozenRow = currentFrozenRows[rowIndex];
                footerHtml.push(me.RenderNormalRow(currentRow, 'th', false, rowIndex, '', false, ''));
                frozenFooterHtml.push(me.RenderFrozenRow(currentFrozenRow, 'th', false, rowIndex, '', false, ''));
            }

            //// Render only main Footer
            for (rowIndex = frozenFooterLength; rowIndex < footerRowsLength; rowIndex++) {
                currentRow = options.footerRows[rowIndex];
                footerHtml.push(me.RenderNormalRow(currentRow, 'th', false, rowIndex, '', false, ''));
            }

            return {
                footerHtml: footerHtml.join(''),
                frozenFooterHtml: frozenFooterHtml.join('')
            };
        },
        RenderPager: function () {
            var me = this;
            var options = this.Options;
            var pagerOption = {};
            if (options.bodyRows.length > 0) {
                if ($.fn.fanexPagination === undefined) {
                    alert('Please include Fanex.Pagination.cs');
                    return;
                }

                if (options.customPager && options.customPager === true) {
                    pagerOption =
                    {
                        callback: function (pageIndex, itemsPerPage, jq) {
                            if (me.Options.pagerOption.itemsPerPage !== itemsPerPage) {
                                pageIndex = 0;
                            }
                            options.pagerOption.pagerSelectCallBack(pageIndex, itemsPerPage, jq);
                        }
                    };
                }
                else {
                    pagerOption =
                    {
                        callback: function (pageIndex, itemsPerPage) {
                            if (me.Options.pagerOption.itemsPerPage !== itemsPerPage) {
                                pageIndex = 0;
                            }
                            me.Options.pagerOption.currentPage = pageIndex;
                            me.Options.pagerOption.itemsPerPage = itemsPerPage;
                            me.RenderBody('', true);
                            ////Re-render footer 
                            ////options.showFooter && options.bodyRows.length > 0 ? me.RenderFooter() : ""
                            if (options.showFooter && options.bodyRows.length > 0 && typeof (options.pagerOption.customRenderFooter) === 'function') {
                                var startIndex = (options.pagerOption.currentPage * options.pagerOption.itemsPerPage);
                                var endIndex = ((options.pagerOption.currentPage + 1) * options.pagerOption.itemsPerPage);
                                var currentBodyRows = options.bodyRows.slice(startIndex, endIndex);
                                me.Options.footerRows = options.pagerOption.customRenderFooter(
                                                                                                currentBodyRows,
                                                                                                options.pagerOption.currentPage,
                                                                                                options.pagerOption.itemsPerPage);
                                me.RenderFooter(true);
                            }
                            me.gridOptions.isResetScroller = true;
                            $(me.$grid).gridScroller(me.gridOptions);
                            me.RenderPager();
                            me.RegisterMouseHoverEvent();
                            me.AutoResizeRowHeight();
                            //// Save for rerender
                            Fanex.Grid.List[me.tableContentId].pagerOption = me.Options.pagerOption;
                            if (typeof (options.pagerOption.afterPagedFunction) === 'function') {
                                options.pagerOption.afterPagedFunction(options.pagerOption);
                            }
                            return false;
                        }
                    };
                }

                pagerOption.startPerPage = options.pagerOption.startPerPage;
                pagerOption.stepPerPage = options.pagerOption.pageStep;
                pagerOption.maxTtemsPerPage = options.pagerOption.maxItemsPerPage;
                pagerOption.itemsPerPage = options.pagerOption.itemsPerPage;
                pagerOption.currentPage = options.pagerOption.currentPage;
                pagerOption.totalItem = options.pagerOption.totalItem;
                pagerOption.itemsPerPageArray = options.pagerOption.itemsPerPageArray;
                pagerOption.showDetail = options.pagerOption.showDetail;

                this.$grid.find('#pagination').fanexPagination(pagerOption.totalItem, pagerOption);
            }
        },
        RegisterEvents: function () {
            var me = this;
            var options = me.Options;
            //// Sorting
            me.RegisterSortEvent();

            //// For Onclick Title Button
            if (options.showTitle === true) {
                if (typeof options.titleInfo.exportExcelFunction === 'function') {
                    me.$grid.parent().off('click', '#btnExport' + me.gridId, null).on('click', '#btnExport' + me.gridId, options.titleInfo.exportExcelFunction);
                }
                if (typeof options.titleInfo.backFunction === 'function') {
                    me.$grid.parent().off('click', '#btnBack' + me.gridId, null).on('click', '#btnBack' + me.gridId, options.titleInfo.backFunction);
                }
                if (typeof options.titleInfo.sendMailFunction === 'function') {
                    me.$grid.parent()
                            .off('click', '#btnSendMail' + me.gridId, null)
                            .on('click', '#btnSendMail' + me.gridId, options.titleInfo.sendMailFunction);
                }
                if (options.titleInfo.showCollapseExpandButton === true) {
                    me.$grid.parent().off('click', '#btnCollapseExpand' + me.gridId, null).on('click', '#btnCollapseExpand' + me.gridId, function () {
                        var $this = $(this);
                        if ($this.hasClass('expanded')) {
                            me.$grid.find('.child-row').hide();
                            me.$grid.find('.grid-collapse-expand').removeClass('grid-expand').addClass('grid-collapse');
                            $this.removeClass('expanded').addClass('collapsed');
                        }
                        else {
                            $this.removeClass('collapsed').addClass('expanded');
                            me.$grid.find('.grid-collapse-expand').removeClass('grid-collapse').addClass('grid-expand');
                            me.$grid.find('.child-row').show();
                        }
                        me.gridOptions.isResetScroller = false;
                        var gridOptions = Fanex.Grid.List[me.tableContentId].gridOptions;
                        if (gridOptions) {
                            me.gridOptions.gridHeight = gridOptions.gridHeight;
                        }
                        $(me.$grid).gridScroller(me.gridOptions);
                    });
                }
            }

            //// Bind collapse expand event
            if (options.showTree === true) {
                me.$grid.off('click', '.parent-row > td.tr-grid-collapse-expand', null).on('click', '.parent-row > td.tr-grid-collapse-expand', function () {
                    var $this = $(this);
                    var collapseexpandspan = $this.find('.grid-collapse-expand');
                    var isExpand = false;
                    if (collapseexpandspan.hasClass('grid-expand')) {
                        me.$grid.find('.' + collapseexpandspan.attr('id') + '-class').removeClass('grid-expand').addClass('grid-collapse');
                        isExpand = false;
                    }
                    else {
                        me.$grid.find('.' + collapseexpandspan.attr('id') + '-class').removeClass('grid-collapse').addClass('grid-expand');
                        isExpand = true;
                    }
                    var $child = me.$grid.find('.' + collapseexpandspan.attr('id'));
                    if ($child.length > 0) {
                        $child.toggle();
                        for (var index = 0; index < $child.length; index++) {
                            var $currentChild = $($child[index]);
                            me.RecursiveCollapseExpandChild($currentChild, isExpand);
                        }
                        me.gridOptions.isResetScroller = false;
                        $(me.$grid).gridScroller(me.gridOptions);
                    }
                });
            }
        },
        RecursiveCollapseExpandChild: function ($current, isExpand) {
            var me = this;
            var collapseexpandspan = $current.find('.grid-collapse-expand');
            var $child = me.$grid.find('.' + collapseexpandspan.attr('id'));

            if (isExpand) {
                if (collapseexpandspan.hasClass('grid-expand')) {
                    $child.show();
                }
                else {
                    $child.hide();
                }
            }
            else {
                $child.hide();
            }

            for (var index = 0; index < $child.length; index++) {
                var $currentChild = $($child[index]);
                me.RecursiveCollapseExpandChild($currentChild, isExpand);
            }
        },
        RegisterSortEvent: function () {
            var me = this;
            var options = me.Options;
            //// For Sorting
            var colsLength = options.columns.length;
            for (var colIndex = 0; colIndex < colsLength; colIndex++) {
                var currentCol = options.columns[colIndex];

                if (currentCol.Sort === true) {
                    /*jshint ignore:start*/
                    me.$grid.off('click', '#' + me.gridId + '_header_sort_' + currentCol.name, null)
                            .on('click', '#' + me.gridId + '_header_sort_' + currentCol.name, function () {
                                var $this = $(this).find('.divSorter');
                                var currentDirection = '';
                                if ($this.hasClass('desc')) {
                                    me.$grid.find('.divSorter').removeClass('asc').removeClass('desc');
                                    $this.addClass('asc');
                                    currentDirection = 'asc';
                                }
                                else if ($this.hasClass('asc')) {
                                    me.$grid.find('.divSorter').removeClass('asc').removeClass('desc');
                                    $this.addClass('desc');
                                    currentDirection = 'desc';
                                }
                                else {
                                    me.$grid.find('.divSorter').removeClass('asc').removeClass('desc');
                                    $this.addClass('desc');
                                    currentDirection = 'desc';
                                }
                                var customSortFunction = null;
                                var sortType = null;
                                for (var colIndex = 0; colIndex < options.columns.length; colIndex++) {
                                    if (options.columns[colIndex].name === $this.data('columnname')) {
                                        options.columns[colIndex].sortDirection = currentDirection.toLowerCase();
                                        customSortFunction = options.columns[colIndex].customSortFunction;
                                        sortType = options.columns[colIndex].sortType;
                                    }
                                    else {
                                        options.columns[colIndex].sortDirection = '';
                                    }
                                }
                                //customGridSort: null
                                if (typeof (options.sortOption.serverSortFunction) === 'function') {
                                    options.sortOption.serverSortFunction($this.data('columnname'), currentDirection);
                                }
                                else {
                                    if (typeof (options.sortOption.beforeGridSorted) === 'function') {
                                        options.bodyRows = options.sortOption.beforeGridSorted(options.bodyRows, $this.data('columnname'), currentDirection);
                                    }
                                    if (typeof (options.sortOption.customGridSort) === 'function') {
                                        options.bodyRows = options.sortOption.customGridSort(
                                                            options.bodyRows,
                                                            $this.data('columnname'),
                                                            currentDirection,
                                                            customSortFunction,
                                                            sortType);
                                    }
                                    else {
                                        options.bodyRows = Fanex.Grid.Helper.GetSortedArray(options.bodyRows,
                                                                                        $this.data('columnname'),
                                                                                        currentDirection,
                                                                                        customSortFunction,
                                                                                        sortType);
                                    }
                                    me.ReRenderBodyAfterSort($this.data('columnname'), currentDirection);
                                    if (typeof (options.sortOption.afterGridSorted) === 'function') {
                                        options.bodyRows = options.sortOption.afterGridSorted(options.bodyRows, $this.data('columnname'), currentDirection);
                                    }
                                }
                            });
                    /*jshint ignore:end*/
                    continue;
                }
            }
        },
        RegisterMouseHoverEvent: function () {
            var me = this;
            var options = me.Options;
            //// For Mouse hover event
            if (options.showHighlightRow === true && options.numberOfFrozenColumn > 0) {
                me.$grid.find('.highlight-row').unbind('mouseenter mouseleave').mouseenter(function () {
                    var $this = $(this);
                    var hlattr = $this.attr('highlightatt');
                    if (isValid(hlattr)) {
                        if (hlattr.indexOf('frozen') > 0) {
                            me.$grid.find('tr[highlightatt="' + hlattr.replace('frozen', 'main') + '"]').addClass('mousehoverbeyond');
                        }
                        else {
                            me.$grid.find('tr[highlightatt="' + hlattr.replace('main', 'frozen') + '"]').addClass('mousehoverbeyond');
                        }
                    }
                }).mouseleave(function () {
                    var $this = $(this);
                    var hlattr = $this.attr('highlightatt');
                    if (isValid(hlattr)) {
                        if (hlattr.indexOf('frozen') > 0) {
                            me.$grid.find('tr[highlightatt="' + hlattr.replace('frozen', 'main') + '"]').removeClass('mousehoverbeyond');
                        }
                        else {
                            me.$grid.find('tr[highlightatt="' + hlattr.replace('main', 'frozen') + '"]').removeClass('mousehoverbeyond');
                        }
                    }
                });
            }
        },

        AutoResizeRowHeight: function () {
            var me = this,
                options = me.Options;
            if (options.autoFixFrozenRowHeight) {
                me.$grid.find('.content-container .highlight-row').each(function () {
                    var $this = $(this),
                        currentHeight = $this.height(),
                        hlattr = $this.attr('highlightatt');

                    if (isValid(hlattr)) {
                        me.$grid.find('.row_header tr[highlightatt="' + hlattr.replace('main', 'frozen') + '"]').css('height', currentHeight + 'px');
                    }
                });
                // Header
                var currentFrozenHeader = me.$grid.find('.grid-fixed-table.free-cell-top-left thead tr'),
                    currentFrozenBody = me.$grid.find('.grid-fixed-table.row_header_content thead tr');
                if (currentFrozenHeader.length > 0 && currentFrozenBody.length) {
                    me.$grid.find('.grid-fixed-table.col_header_content thead tr').each(function (index) {
                        var $trTable = $(this),
                            currentHeight = $trTable.height();

                        $(currentFrozenHeader[index]).css('height', currentHeight + 'px');
                        $(currentFrozenBody[index]).css('height', currentHeight + 'px');
                    });
                }
                // Footer
                var currentFrozenFooter = me.$grid.find('.grid-fixed-table.row_footer_content thead tr');
                if (currentFrozenFooter.length > 0) {
                    me.$grid.find('.col_footer_content.grid-fixed-table thead tr').each(function (index) {
                        var $trTable = $(this),
                            currentHeight = $trTable.height();

                        $(currentFrozenFooter[index]).css('height', currentHeight + 'px');
                    });
                }
            }
        }
    };

    //// Grid Helper
    Fanex.Grid.Helper =
    {
        DetectBrowser: function () {
            //// Grid Scroller
            var matchedBrowser, browserDectect;

            // Use of jQuery.browser is frowned upon.
            // More details: http://api.jquery.com/jQuery.browser
            // jQuery.uaMatch maintained for back-compat
            function ubMatch(ua) {
                ua = ua.toLowerCase();

                var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                /(trident)(?:.*rv:([\w.]+))?/.exec(ua) ||
                /(msie) ([\w.]+)/.exec(ua) ||
                ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
                [];

                return {
                    browserDectect: match[1] || "",
                    version: match[2] || "0"
                };
            }

            matchedBrowser = ubMatch(navigator.userAgent);
            browserDectect = {};

            if (matchedBrowser.browserDectect) {
                browserDectect[matchedBrowser.browserDectect] = true;
                browserDectect.version = matchedBrowser.version;

                if (matchedBrowser.browserDectect === 'trident') {
                    browserDectect.msie = true;
                }
            }

            // Chrome is Webkit, but Webkit is also Safari.
            if (browserDectect.chrome) {
                browserDectect.webkit = true;
            } else if (browserDectect.webkit) {
                browserDectect.safari = true;
            }

            return browserDectect;
        },
        RemoveItemForRowSpan: function (rows, currentRowIndex, mainColumn) {
            var rowSpanSize = mainColumn.mergeRowNumber;
            var columnName = mainColumn.name;
            var currentLength = currentRowIndex + rowSpanSize;
            var rowsLength = currentLength < rows.length ? currentLength : rows.length;
            for (var rowIndex = currentRowIndex + 1; rowIndex < rowsLength; rowIndex++) {
                for (var colIndex = 0; colIndex < rows[rowIndex].columns.length; colIndex++) {
                    var currentCol = rows[rowIndex].columns[colIndex];
                    if (currentCol.name === columnName) {
                        if (isValid(currentCol.sort) && currentCol.sort === true) {
                            var firstColIndex = Fanex.Grid.Helper.GetColumnIndexFromColumnName(rows[currentRowIndex], currentCol.name);
                            rows[currentRowIndex].columns[firstColIndex].sort = true;
                            rows[currentRowIndex].columns[firstColIndex].sortDirection = currentCol.sortDirection;
                        }

                        if (isValid(mainColumn.mergeColNumber)) {
                            var mergeColLength = mainColumn.mergeColNumber + colIndex;
                            mergeColLength = (mergeColLength <= rows[rowIndex].columns.length ? mergeColLength : 0);
                            for (var mergeColIndex = mergeColLength; mergeColIndex >= colIndex; mergeColIndex--) {
                                rows[rowIndex].columns.splice(mergeColIndex, 1);
                            }
                        }
                        rows[rowIndex].columns.splice(colIndex, 1);
                    }
                }
            }
        },
        GetColumnIndexFromColumnName: function (row, columnName) {
            for (var index = 0; index < row.columns.length; index++) {
                if (row.Columns[index].name === columnName) {
                    return index;
                }
            }
            return -1;
        },
        CreateRowsForFrozenColumn: function (mainRows, frozenColNumber, frozenColsName) {
            var frozenRows = [];
            var rowLength = mainRows.length;

            for (var rowIndex = 0; rowIndex < rowLength; rowIndex++) {
                var currentRow = mainRows[rowIndex];
                var newRow = clone(currentRow);
                newRow.Columns = [];
                var isset = false;
                var colsLength = currentRow.columns.length < frozenColNumber ? currentRow.columns.length : frozenColNumber;

                for (var colIndex = 0; colIndex < colsLength; colIndex++) {
                    var currentCol = currentRow.columns[colIndex];
                    if (Fanex.Grid.Helper.CheckExistName(frozenColsName, currentCol.name)) {
                        newRow.columns.push(clone(currentRow.columns[colIndex]));
                        isset = true;
                    }
                }
                if (isset) {
                    frozenRows.push(newRow);
                }
            }

            return frozenRows;
        },
        CheckExistName: function (frozenColsName, name) {
            for (var colIndex = 0; colIndex < frozenColsName.length; colIndex++) {
                if (frozenColsName[colIndex] === name) {
                    return true;
                }
            }
            return false;
        },
        CheckHideColSpan: function (currentFrozenColums) {
            var colsLength = currentFrozenColums.length;
            for (var colIndex = 0; colIndex < colsLength; colIndex++) {
                if (!isValid(currentFrozenColums[colIndex].mergeRowNumber)) {
                    return false;
                }
            }
            return true;
        },
        GetArrayWidth: function (columns, enableHiddenColumns, isForComputingWidth) {
            var arrayWidth = [];
            var columnLength = columns.length;
            for (var columnIndex = 0; columnIndex < columnLength; columnIndex++) {
                var currentColumn = columns[columnIndex];
                if (isValid(enableHiddenColumns) &&
                    enableHiddenColumns === false &&
                    currentColumn.canShowHide &&
                    currentColumn.canShowHide === true &&
                    isForComputingWidth === false) {
                    continue;
                }
                else {
                    arrayWidth.push(currentColumn.width);
                }
            }
            return arrayWidth;
        },
        GetColMergeWidth: function (arrayWidth, startIndex, colMergeNumber, enableHiddenColumns, columns) {
            var colWidth = 0;
            var finalColMergeNumber = colMergeNumber;
            var colLength = arrayWidth.length < (startIndex + colMergeNumber) ? arrayWidth.length : (startIndex + colMergeNumber);
            for (var colIndex = startIndex; colIndex < colLength; colIndex++) {
                if (isValid(enableHiddenColumns) && enableHiddenColumns === false && columns[colIndex].canShowHide && columns[colIndex].canShowHide === true) {
                    finalColMergeNumber--;
                }
                else {
                    colWidth += arrayWidth[colIndex];
                }
            }
            colWidth += ((finalColMergeNumber - 1) * 5);
            return colWidth;
        },
        GetColumnWidth: function (columns, name) {
            var colLength = columns.length;
            for (var colIndex = 0; colIndex < colLength; colIndex++) {
                if (columns[colIndex].name === name) {
                    return columns[colIndex].width;
                }
            }
            return 0;
        },
        GetColumnsHastable: function (columns) {
            var hastable = {};
            var colLength = columns.length;
            for (var colIndex = 0; colIndex < colLength; colIndex++) {
                var currentCol = columns[colIndex];
                hastable[currentCol.name] = currentCol;
                hastable[currentCol.name].columnIndex = colIndex;
            }
            return hastable;
        },
        SortByNumber: function (col1Value, col2Value, sortDirection) {
            var isNumber1 = !isNaN(col1Value);
            var isNumber2 = !isNaN(col2Value);

            if (isNumber1 && isNumber2) {
                var parseValCol1 = parseFloat(col1Value);
                var parseValCol2 = parseFloat(col2Value);
                if (sortDirection === 'asc') {
                    return parseValCol1 > parseValCol2 ? 1 : -1;
                }
                else {
                    return parseValCol1 < parseValCol2 ? 1 : -1;
                }
            }

            if (sortDirection === 'asc') {
                if (!isNumber1) {
                    return 1;
                }
            }
            else {
                if (!isNumber2) {
                    return 1;
                }
            }

            return -1;
        },
        GetSortedArray: function (rows, sortField, sortDirection, customSortFunction, sortType) {
            var sortColIndex = null;
            if (rows.length > 0) {
                var firstRow = rows[0];
                var colLength = firstRow.columns.length;

                for (var colIndex = 0; colIndex < colLength; colIndex++) {
                    if (firstRow.columns[colIndex].name === sortField) {
                        sortColIndex = colIndex;
                        break;
                    }
                }
            }

            if (sortType != null) {
                sortType = sortType.toLowerCase();
            }

            sortDirection = sortDirection.toLowerCase();

            if (sortDirection === 'asc') {
                return rows.sort(function (row1, row2) {
                    return Fanex.Grid.Helper.CompareRow(sortColIndex, row1, row2, sortField, sortType, function (col1Value, col2Value) {
                        if (typeof (customSortFunction) === 'function') {
                            return customSortFunction(col1Value, col2Value, sortDirection);
                        }

                        if (sortType != null) {
                            switch (sortType) {
                                case 'number':
                                    return Fanex.Grid.Helper.SortByNumber(col1Value, col2Value, sortDirection);
                                case 'string':
                                    break;
                            }
                        }

                        return col1Value > col2Value ? 1 : -1;
                    });
                });
            }
            else {
                return rows.sort(function (row1, row2) {
                    return Fanex.Grid.Helper.CompareRow(sortColIndex, row1, row2, sortField, sortType, function (col1Value, col2Value) {
                        if (typeof (customSortFunction) === 'function') {
                            return customSortFunction(col1Value, col2Value, sortDirection);
                        }

                        if (sortType != null) {
                            switch (sortType) {
                                case 'number':
                                    return Fanex.Grid.Helper.SortByNumber(col1Value, col2Value, sortDirection);
                                case 'string':
                                    break;
                            }
                        }

                        return col1Value < col2Value ? 1 : -1;
                    });
                });
            }
        },
        CompareRow: function (sortColIndex, row1, row2, sortField, sortType, compareFunction) {
            return compareFunction(row1.columns[sortColIndex].value, row2.columns[sortColIndex].value);
        },
        SetColumnDisplay: function (columns, showHideArray) {
            var columnsLengh = columns.length;
            for (var colIndex = 0; colIndex < columnsLengh; colIndex++) {
                columns[colIndex].canShowHide = false;
            }
            var showhidelength = showHideArray.length;
            for (var index = 0; index < showhidelength; index++) {
                columns[showHideArray[index]].canShowHide = true;
            }
            return columns;
        },
        ComputeNewFrozenColumn: function (showhideArray, frozenColumnNumber) {
            var currentFrozenNumber = frozenColumnNumber;
            for (var index = 0; index < showhideArray.length; index++) {
                if (showhideArray[index] < currentFrozenNumber) {
                    frozenColumnNumber--;
                }
            }
            return frozenColumnNumber;
        },
        HideHeaderGroupWhenShowHide: function (hideColumns, startIndex, mergeColNumber) {
            var length = startIndex + mergeColNumber;
            for (var index = startIndex; index < length; index++) {
                if (!Fanex.Grid.Helper.ArrayContains(hideColumns, index)) {
                    return false;
                }
            }
            return true;
        },
        ReComputeMergeColumAfterShowHide: function (hideColumns, startIndex, mergeColNumber) {
            var currentMergeCol = mergeColNumber;
            var length = startIndex + mergeColNumber;
            for (var index = startIndex; index < length; index++) {
                if (Fanex.Grid.Helper.ArrayContains(hideColumns, index)) {
                    currentMergeCol--;
                }
            }
            return currentMergeCol;
        },
        UpdateSortInforAfterShowHideColumns: function (options, sortOption) {
            if (isValid(sortOption)) {
                var colsLength = options.columns.length;
                var customSortFunction = null;
                for (var colIndex = 0; colIndex < colsLength; colIndex++) {
                    if (options.columns[colIndex].name === sortOption.sortColumnName) {
                        options.columns[colIndex].sortDirection = sortOption.sortDirection.toLowerCase();
                        customSortFunction = options.columns[colIndex].customSortFunction;
                    }
                }
                options.bodyRows = Fanex.Grid.Helper.GetSortedArray(options.bodyRows, sortOption.sortColumnName, sortOption.sortDirection, customSortFunction);
            }
        },
        RemoveSpaceIE9: function (html) {
            if (ub.msie && parseInt(ub.version, 10) === 9 && html !== undefined) {
                var expr = new RegExp('>[ \t\r\n\v\f]*<', 'g');
                html = html.replace(expr, '><');
            }

            return html;
        },
        CreateHeaderColumnsFromOptionsColumn: function (columns) {
            var colLength = columns.length;
            var colArray = [];
            for (var colIndex = 0; colIndex < colLength; colIndex++) {
                var currentCol = clone(columns[colIndex]);
                var currentWidth = currentCol.width;
                if (isValid(currentCol.mergeHeaderColNumber) && currentCol.mergeHeaderColNumber > 0) {
                    var currentMaxLength = currentCol.mergeHeaderColNumber + colIndex;
                    colIndex++;
                    for (; colIndex < currentMaxLength && colIndex < colLength; colIndex++) {
                        currentWidth += columns[colIndex].width + 5;
                    }
                    colIndex--;
                }
                currentCol.width = currentWidth;
                colArray.push(currentCol);
            }
            return colArray;
        },
        ArrayContains: function (array, obj) {
            var i = array.length;
            while (i--) {
                if (array[i] === obj) {
                    return true;
                }
            }
            return false;
        },
        ComputeResizeColumn: function (mainContainer, options) {
            var resizeObject = {},
                columnHashtable = Fanex.Grid.Helper.GetColumnsHastable(options.columns),
                pixelsPerCharacter = options.pixelsPerCharacter;

            resizeObject = Fanex.Grid.Helper.ComputeMaxWidthInRows(options.bodyRows, resizeObject, columnHashtable, pixelsPerCharacter);

            if (options.showFooter) {
                resizeObject = Fanex.Grid.Helper.ComputeMaxWidthInRows(options.footerRows, resizeObject, columnHashtable, pixelsPerCharacter);
            }

            var mainColLength = options.columns.length;
            for (var mainColIndex = 0; mainColIndex < mainColLength; mainColIndex++) {
                var currentResizeObject = resizeObject[options.columns[mainColIndex].name];
                if (currentResizeObject != null) {
                    if (currentResizeObject.calculated || options.calTextWidthWithFontSize) {
                        options.columns[mainColIndex].width = resizeObject[options.columns[mainColIndex].name].length;
                    }
                    else {
                        options.columns[mainColIndex].width = Fanex.Grid.Helper.ComputeTextWidth(mainContainer, currentResizeObject.rawData) + 20;
                    }
                }
            }

            options = Fanex.Grid.Helper.AutoAddWidthForFullScreen(options, mainContainer);

            return options;
        },
        AutoAddWidthForFullScreen: function (options, mainContainer) {
            var currentContainerWidth = mainContainer.parent().width(),
                totalCalulatedWidth = 0,
                colLength = options.columns.length,
                resizeCols = [];

            for (var i = 0; i < colLength; i++) {
                var currentCol = options.columns[i];
                if (currentCol.canResize === true) {
                    if (typeof (currentCol.maxResizeWidth) !== 'undefined' && currentCol.width > currentCol.maxResizeWidth) {
                        currentCol.width = currentCol.maxResizeWidth;
                    }

                    resizeCols.push({
                        colIndex: i,
                        colName: currentCol.name,
                        colWidth: currentCol.width
                    });
                }
                totalCalulatedWidth += currentCol.width;

            }

            //// Add width for others columns
            totalCalulatedWidth += (options.columns.length - 1) * 5 + options.marginRight + (options.hideYBackGroundScroller ? 0 : options.scrollWidth);
            if (resizeCols.length > 0 && currentContainerWidth > totalCalulatedWidth) {
                var totalAddWidth = currentContainerWidth - totalCalulatedWidth,
                    addRowForEachColumn = totalAddWidth / resizeCols.length;

                for (i = 0; i < resizeCols.length; i++) {
                    var currentResizeCol = resizeCols[i];
                    options.columns[currentResizeCol.colIndex].width = currentResizeCol.colWidth + addRowForEachColumn;
                }
            }

            return options;
        },
        ComputeMaxWidthInRows: function (rows, resizeObject, columnHashtable, pixelsPerCharacter) {
            var rowLength = rows.length;

            for (var rowIndex = 0; rowIndex < rowLength; rowIndex++) {
                var currentRow = rows[rowIndex],
                    colLength = currentRow.columns.length;
                for (var colIndex = 0; colIndex < colLength; colIndex++) {
                    var currentCol = currentRow.columns[colIndex];
                    if (columnHashtable[currentCol.name].canResize === true) {
                        var textLength = 0;
                        var calculated = true;
                        if (typeof (resizeObject[currentCol.name]) === 'undefined') {
                            resizeObject[currentCol.name] = {
                                length: columnHashtable[currentCol.name].width,
                                calculated: true,
                                rawData: ''
                            };
                        }

                        if (columnHashtable[currentCol.name].calResizeFunction != null) {
                            textLength = columnHashtable[currentCol.name].CalResizeFunction(currentCol.value);
                        }
                        else {
                            if (columnHashtable[currentCol.name].pixelsPerCharacter != null) {
                                if (currentCol.value != null) {
                                    textLength = currentCol.value.toString().length * columnHashtable[currentCol.name].pixelsPerCharacter;
                                }
                            }
                            else {
                                //currentpixelsPerChar = Fanex.Grid.;
                                if (currentCol.value != null) {
                                    textLength = currentCol.value.toString().length * pixelsPerCharacter;
                                }
                                calculated = false;
                            }

                            ////resizeResult = currentCol.Value.toString().length * currentpixelsPerChar;
                        }

                        if (resizeObject[currentCol.name].length < textLength) {
                            resizeObject[currentCol.name].length = textLength;
                            if (calculated === false) {
                                resizeObject[currentCol.name].calculated = calculated;
                                if (currentCol.value != null) {
                                    resizeObject[currentCol.name].rawData = currentCol.value.toString();
                                }
                            }
                        }
                    }
                }
            }

            return resizeObject;
        },
        ComputeTextWidth: function (mainContainer, text) {
            var tempElement = $('<div>' + text + '</div>')
            .css({
                'position': 'absolute',
                'float': 'left',
                'white-space': 'nowrap',
                'visibility': 'hidden'
            }).appendTo(mainContainer);
            var textWidth = tempElement.width();

            tempElement.remove();

            return textWidth;
        }
    };

    Fanex.Grid.List = Fanex.Grid.List || {};

    Fanex.Grid.Constant = Fanex.Grid.Constant ||
    {
        NO_DATA_INFO: $.fn.fanexGrid.defaults.noDataText
    };

    Fanex.Grid.Language = Fanex.Grid.Language || {};

    $.fn.gridScroller = function (opts) {
        return this.each(function () {
            var o = $(this);
            var xscrollbar = o.find(".x-scrollbar");
            var yscrollbar = o.find(".y-scrollbar");
            var container = o.find(".grid-container");
            var rowheader = o.find(".row_header");
            o.parent().removeClass('display-none');
            o.parent().show();
            o.show();
            o.parent().find('.grid-title').removeClass('display-none');
            var options = $.extend({}, $.fn.renderScroller.defaults, opts);

            if (!isValid(Fanex.Grid.List[options.tblContentId])) {
                $(window).resize(function () {
                    if (!o.hasClass("display-none")) {
                        var opt = $.extend({}, {}, Fanex.Grid.List[options.tblContentId].gridOptions);
                        opt.manualCopyHeader = true;
                        o.renderScroller(opt);
                    }
                });
                Fanex.Grid.List[options.tblContentId] =
                {
                    gridOptions: options,
                    pagerOption: null,
                    sortOption: null
                };
            }
            else {
                Fanex.Grid.List[options.tblContentId].gridOptions = options;
            }

            o.renderScroller(options);

            if (options.isResetScroller) {
                o.resetScroller(o, container, rowheader, xscrollbar, yscrollbar);
            } else {
                var top = yscrollbar.scrollTop();
                container.prop("scrollTop", top);
                rowheader.prop("scrollTop", top);
            }

            return new Scroller(o, container, rowheader, xscrollbar, yscrollbar);
        });
    };

    $.fn.initGrid = function (options) {
        return this.each(function () {
            var o = $(this);
            //Render Free Cell
            var freeCellTpl = '<div class="free-cell free-bottom-left">\
                    <table class="grid-fixed-table">\
                        <thead>\
                            <tr>\
                                <th class="free-cell-bottom-left">\
                                    <div>\
                                    </div>\
                                </th>\
                            </tr>\
                        </thead>\
                    </table>\
                </div>\
                <div class="free-cell free-top-right">\
                    <table class="grid-fixed-table">\
                        <thead>\
                            <tr>\
                                <th class="free-cell-top-right">\
                                    <div>\
                                    </div>\
                                </th>\
                            </tr>\
                        </thead>\
                    </table>\
                </div>\
                <div class="free-cell free-bottom-right">\
                    <table class="grid-fixed-table">\
                        <thead>\
                            <tr>\
                                <th class="free-cell-bottom-right">\
                                    <div>\
                                    </div>\
                                </th>\
                            </tr>\
                        </thead>\
                    </table>\
                </div>';
            o.append(freeCellTpl);
            //Render Scrollbar
            var scrollbarTpl = '<div class="y-scrollbar">\
                    <div class="scrollbar-y-content">\
                        &nbsp;</div>\
                </div>\
                <div class="x-scrollbar">\
                    <div class="scrollbar-x-content">\
                        &nbsp;</div>\
                </div>';
            o.append(scrollbarTpl);
            if (options.isShowPager) {
                var pagerTpl = '<div class="grid-pager">\
                                <div class="grid-pager-content">\
                                    <div id="pagination">&nbsp;</div>\
                                </div>\
                            </div>';
                o.append(pagerTpl);
            }
        });
    };

    $.fn.resetGrid = function () {
        return this.each(function () {
            var o = $(this);
            var xscrollbar = o.find(".x-scrollbar");
            var container = o.find(".grid-container");
            var colHeaderContainer = o.find(".col_header");
            var colFooterContainer = o.find(".col_footer");

            o.css("width", "");
            container.css("width", "");
            o.find(".content-container").css("width", "");
            xscrollbar.css("width", "");
            colHeaderContainer.css("width", "");
            colFooterContainer.css("width", "");
            colHeaderContainer.find(".header-container").css("width", "");
            o.find(".footer-container").css("width", "");
            o.find(".scrollbar-x-content").css("width", "");
            o.find(".free-cell-bottom-left").css("width", "");
        });
    };

    $.fn.resetScroller = function (o, container, rowheader, xscrollbar, yscrollbar) {
        yscrollbar.prop("scrollTop", 0);
        container.prop("scrollTop", 0);
        rowheader.prop("scrollTop", 0);

        container.prop("scrollLeft", 0);
        xscrollbar.prop("scrollLeft", 0);
        o.find(".col_header").prop("scrollLeft", 0);
        o.find(".col_footer").prop("scrollLeft", 0);
    };

    $.fn.renderScroller = function (options) {
        return this.each(function () {
            var bar = 17;
            var o = $(this);

            var isParentShow = o.parent().is(':visible');
            if (!isParentShow) {
                o.parent().css({ position: "absolute", visibility: "hidden", display: "block" });
            }

            var title = o.find(".grid-title");
            var titleHeight = (!title.hasClass('display-none') && title.length > 0) ? title.height() : 0;
            var pager = o.find(".grid-pager");
            var pagerHeight = pager.length > 0 ? pager.height() : 0;
            var xscrollbar = o.find(".x-scrollbar");
            var yscrollbar = o.find(".y-scrollbar");
            var container = o.find(".grid-container");
            var tblContent = o.find("#" + options.tblContentId);

            var freeCellTop = o.find(".free-top-right");
            var freeCellBottom = o.find(".free-bottom-right");

            var colHeaderContainer = o.find(".col_header");
            var rowHeaderContainer = o.find(".row_header");
            var rowHeaderWarpper = o.find(".row_header_wrapper");
            var colFooterContainer = o.find(".col_footer");
            var rowFooterContainer = o.find(".row_footer");
            var isShowFooter = !colFooterContainer.hasClass('display-none') && colFooterContainer.find("thead tr").length > 0;

            var numOfFreezeCol = options.numberFreezeCol;
            var col = options.column.length,
                i;
            if (col > 0) {
                options.gridWidth = 0;
                options.freezeWidth = 0;
                for (i = 0; i < col; i++) {
                    var colw = options.column[i];
                    options.gridWidth += colw;
                    if (i < numOfFreezeCol) {
                        options.freezeWidth += colw;
                    }
                }

                options.gridWidth += (options.padding + 1 + options.padding) * col;
                options.freezeWidth += (numOfFreezeCol - 1) * options.padding * 2 + numOfFreezeCol - 1;
            }

            if (tblContent.height() === 0 && options.fullHeight === false) {
                tblContent.height(options.gridHeight);
            }

            var tblWidth = Math.max(tblContent.width(), options.gridWidth);
            var freezeWidth = options.freezeWidth;

            var parentWidth = o.parent().width();
            var browserWindowWidth = $(window).width();
            if (parentWidth > browserWindowWidth) {
                parentWidth = browserWindowWidth;
            }

            var gridWidth = options.fullWidth ? ((parentWidth < options.minWidth ? options.minWidth : parentWidth) - options.marginRight) : options.gridWidth;
            var isScrollX = gridWidth < tblWidth + 17;
            gridWidth = isScrollX ? gridWidth : (tblWidth + bar);

            o.css("width", gridWidth + "px");
            o.find(".content-container").css("width", tblWidth + "px");
            o.find(".col_header_content").css("width", tblWidth + "px");
            container.css("width", gridWidth + "px");
            xscrollbar.css("width", (gridWidth - freezeWidth - bar - (options.padding) * 2 - 1) + "px");
            colHeaderContainer.css("width", gridWidth + "px");
            colHeaderContainer.find(".header-container").css("width", tblWidth + "px");
            o.find(".footer-container").css("width", tblWidth + "px");
            o.find(".scrollbar-x-content").css("width", (tblWidth - freezeWidth - (isOnChromeBrowser ? 5 : 0)) + "px");
            o.find(".free-cell-bottom-left").css("width", freezeWidth + "px");
            pager.css("width", gridWidth + "px");
            rowHeaderContainer.css({
                "width": (freezeWidth + 5 + 17 + options.highlightFrozenWidth) + "px"
            });
            rowHeaderWarpper.css({
                "width": (freezeWidth + 5 + options.highlightFrozenWidth) + "px"
            });

            var tblHeight = tblContent.height();
            var freezeHeight = tblContent.find("thead").height();
            var freezeFooterHeight = isShowFooter ? colFooterContainer.find("thead").height() + options.bottomBorderWidth : 0;
            var gridHeight = options.fullHeight ? ($(window).height() - options.gridHeight) : options.gridHeight;
            var isScrollY = gridHeight - titleHeight - pagerHeight - bar - freezeFooterHeight < tblHeight;
            gridHeight = isScrollY ? gridHeight : tblHeight + titleHeight + pagerHeight + bar + freezeFooterHeight;

            if (options.hideYBackGroundScroller) {
                o.css("width", (gridWidth - (!isScrollY && !isScrollX ? 18 : 0)) + "px");
                pager.css("width", (gridWidth - ((!isScrollY && !isScrollX ? 18 : 0) ? 18 : 0)) + "px");
            }

            var containerHeight = gridHeight - titleHeight - freezeFooterHeight - pagerHeight - bar + 1 - extraPosition;
            o.css("height", (gridHeight - 1 - (isScrollX ? -1 : bar)) + "px");
            rowHeaderContainer.css("height", containerHeight + "px");
            container.css("height", containerHeight + "px");
            rowHeaderWarpper.css("height", containerHeight + "px");
            yscrollbar.css("height", (containerHeight - freezeHeight - (ub.chrome || ub.msie ? 1 : 0) - options.heightScrollYAdd) + "px");
            o.find(".free-cell-top-right").css("height", (freezeHeight - ((ub.msie || ub.chrome || ff16) ? (options.padding * 2 + 1) : 0) + (ub.chrome ? 1 : 0)) + "px");
             
            if (isShowFooter) {
                o.find(".free-cell-bottom-right").css("height", (freezeFooterHeight + (isScrollX ? bar : 0) + 1) + "px");
            }
            freeCellBottom.css("top", (gridHeight - pagerHeight - freezeFooterHeight - bar) + "px");
            o.find(".scrollbar-y-content").css("height", (tblHeight - freezeHeight) + "px");

            //// Fixed bug for IE10, wrong body Height
            var newTblHeight = tblContent.height();
            if (ub.msie && tblHeight !== newTblHeight) {
                tblHeight = newTblHeight;
                o.find(".scrollbar-y-content").css("height", (tblHeight - freezeHeight) + "px");
            }

            yscrollbar.css("top", (freezeHeight + titleHeight -
                                    (ub.chrome ? (colHeaderContainer.find("thead tr").length - 2) : 0) +
                                    options.heightScrollYAdd) + "px");
            xscrollbar.css("top", (gridHeight - pagerHeight - bar - 1 + extraPosition) + "px");
            if (numOfFreezeCol > 0) {
                o.find(".free-bottom-left").css("top", (gridHeight - pagerHeight - bar - 1 + extraPosition) + "px");
            }
            else {
                o.find(".free-bottom-left").remove();
            }

            rowFooterContainer.css({
                "top": (gridHeight - pagerHeight - freezeFooterHeight - bar + 1 - extraPosition) + "px",
                "border-top-width": options.bottomBorderWidth + "px"
            });
            colFooterContainer.css({
                "width": gridWidth + "px",
                "top": (gridHeight - pagerHeight - freezeFooterHeight - bar + 1 - extraPosition) + "px",
                "border-top-width": options.bottomBorderWidth + "px"
            });
            pager.css("top", (gridHeight - pagerHeight - (isScrollX ? -(isShowFooter ? 0 : 1) : bar) - 2 + extraPosition * 2) + "px");

            xscrollbar.css("left", (freezeWidth + (options.padding) * 2 + 1 - extraPosition) + "px");
            yscrollbar.css("left", (gridWidth - bar - 1 + extraPosition) + "px");
            freeCellTop.css("left", (gridWidth - bar - 1 + extraPosition) + "px");
            freeCellBottom.css("left", (gridWidth - bar - 1) + "px");

            if (isScrollY) {
                yscrollbar.css("overflow-y", "scroll");
            }
            else {
                yscrollbar.css("overflow-y", "hidden");
            }

            if (isScrollX) {
                xscrollbar.css("overflow-x", "scroll");
            }
            else {
                xscrollbar.css("overflow-x", "hidden");
            }

            ////Recalculate Title Width
            var gridTitle = o.parent().find(".grid-title");
            if (gridTitle.length > 0) {
                gridTitle.width(o.width());
            }
            //// Fixbug show scroller on row header on chrome
            if (isOnChromeBrowser) {
                rowHeaderContainer.css("overflow", "hidden !important");
            }

            ////fix bug scoll in IE
            if (ub.msie) {
                yscrollbar.addClass("y-scrollbar-fix-width");
                xscrollbar.addClass("x-scrollbar-fix-height");
            }

            if (!isParentShow) {
                o.parent().css({ position: "", visibility: "", display: "" });
            }
        });
    };

    $.fn.renderScroller.defaults =
    {
        tblContentId: 'grid1',
        isUseLeftTable: false,
        isShowPager: false,
        column: [],
        numberFreezeCol: 2,
        fullWidth: true,
        fullHeight: true,
        gridWidth: 0,
        //=totalColumnWidth + totalColumn*4 +totalColumn
        minWidth: 600,
        gridHeight: 300,
        freezeWidth: 241,
        //=totalColumnWidth + (totalColumn-1)*2 + (totalColumn-1)
        padding: 2,
        marginRight: 20,
        isResetScroller: true,
        highlightFrozenWidth: 0,
        heightScrollYAdd: 0,
        hideYBackGroundScroller: true,
        bottomBorderWidth: 3
    };

    var Scroller = function (obj, container, rowheader, xscrollbar, yscrollbar) {
        this.preLeft = xscrollbar.scrollLeft();
        this.preTop = yscrollbar.scrollTop();
        this.colHeaderContainer = $(obj).find(".col_header");
        this.rowHeaderContainer = $(obj).find(".row_header");
        this.colFooterContainer = $(obj).find(".col_footer");
        this.init(container, rowheader, xscrollbar, yscrollbar);
    };

    Scroller.prototype =
    {
        init: function (container, rowheader, xscrollbar, yscrollbar) {
            var me = this;
            yscrollbar.scroll(function () {
                var top = yscrollbar.scrollTop();
                if (me.preTop !== top) {
                    container.prop("scrollTop", top);
                    me.rowHeaderContainer.prop("scrollTop", top);
                    me.preTop = top;
                }
            });

            container.scroll(function () {
                var top = container.scrollTop();
                if (me.preTop !== top) {
                    me.rowHeaderContainer.prop("scrollTop", top);
                    yscrollbar.prop("scrollTop", top);
                    me.preTop = top;
                }
                //
                if (isOnSmartPhoneBrowser) {
                    var left = container.scrollLeft();
                    if (me.preLeft !== left) {
                        me.colHeaderContainer.prop("scrollLeft", left);
                        me.colFooterContainer.prop("scrollLeft", left);
                        xscrollbar.prop("scrollLeft", top);
                        me.preLeft = left;
                    }
                }
            });

            rowheader.scroll(function () {
                var top = rowheader.scrollTop();
                if (me.preTop !== top) {
                    container.prop("scrollTop", top);
                    yscrollbar.prop("scrollTop", top);
                    me.preTop = top;
                }
            });

            xscrollbar.scroll(function () {
                var left = xscrollbar.scrollLeft();
                if (me.preLeft !== left) {
                    me.colHeaderContainer.prop("scrollLeft", left);
                    me.colFooterContainer.prop("scrollLeft", left);
                    container.prop("scrollLeft", left);
                    me.preLeft = left;
                }
            });

            if (isOnSmartPhoneBrowser) {
                me.colHeaderContainer.scroll(function () {
                    var left = me.colHeaderContainer.scrollLeft();
                    if (me.preLeft !== left) {
                        container.prop("scrollLeft", left);
                        me.colFooterContainer.prop("scrollLeft", left);
                        xscrollbar.prop("scrollLeft", top);
                        me.preLeft = left;
                    }
                });
                me.colFooterContainer.scroll(function () {
                    var left = me.colFooterContainer.scrollLeft();
                    if (me.preLeft !== left) {
                        container.prop("scrollLeft", left);
                        me.colHeaderContainer.prop("scrollLeft", left);
                        xscrollbar.prop("scrollLeft", top);
                        me.preLeft = left;
                    }
                });
            }
        }
    };


    //----------------------------------------------
    // Search Devives

    var deviceIphone = "iphone";
    var deviceIpod = "ipod";
    var deviceIpad = "ipad";
    var deviceS60 = "series60";
    var deviceSymbian = "symbian";
    var engineWebKit = "webkit";
    var deviceAndroid = "android";
    var deviceBB = "blackberry";
    var devicePalm = "palm";
    var deviceWinMob = "windows ce";

    var uagent = navigator.userAgent.toLowerCase();
    var currentDevice = "";
    function detectSmartPhone() {
        if (uagent.indexOf(deviceIphone) > -1) {
            currentDevice = deviceIphone;
            return true;
        }
        else if (uagent.indexOf(deviceIpod) > -1) {
            currentDevice = deviceIpod;
            return true;
        }
        else if (uagent.indexOf(deviceIpad) > -1) {
            currentDevice = deviceIpad;
            return true;
        }
        else if (uagent.indexOf(deviceS60) > -1) {
            currentDevice = deviceS60;
            return true;
        }
        else if (uagent.indexOf(deviceSymbian) > -1) {
            currentDevice = deviceSymbian;
            return true;
        }
        else if (uagent.indexOf(engineWebKit) > -1) {
            currentDevice = engineWebKit;
            return true;
        }
        else if (uagent.indexOf(deviceAndroid) > -1) {
            currentDevice = deviceAndroid;
            return true;
        }
        else if (uagent.indexOf(deviceBB) > -1) {
            currentDevice = deviceBB;
            return true;
        }
        else if (uagent.indexOf(devicePalm) > -1) {
            currentDevice = devicePalm;
            return true;
        }
        else if (uagent.indexOf(deviceWinMob) > -1) {
            currentDevice = deviceWinMob;
            return true;
        }
        else {
            return false;
        }
    }

    var isOnSmartPhoneBrowser = detectSmartPhone();
    var isOnChromeBrowser = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

    var ub = Fanex.Grid.Helper.DetectBrowser();
    ub.chrome = /chrome/.test(navigator.userAgent.toLowerCase());
    var ff16 = ub.mozilla && parseInt(ub.version, 10) >= 16;
    var ff18 = ub.mozilla && (parseInt(ub.version, 10) >= 18 && parseInt(ub.version, 10) < 25);
    var extraPosition = ff18 ? 1 : 0;

    function isValid(obj) {
        if (typeof obj !== "undefined" && obj != null) {
            return true;
        }
        return false;
    }

    function clone(obj) {
        var target = {};
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                target[i] = obj[i];
            }
        }
        return target;
    }
})(jQuery);

//// Language
/* jshint ignore:start */
if (typeof (fanexGridLanguage) === 'undefined') {
    /* File Created: December 4, 2013 */
    var fanexGridLanguage = {};
    fanexGridLanguage['en-US'] = {
        noData: 'There is no data',
        pageSize: 'Page size',
        goToPage: 'Go To Page',
        pagingText: 'Displaying <b>{0}</b> to <b>{1}</b> of <b>{2}</b> item(s)'
    };

    var fanexGridCurrentLanguage = fanexGridLanguage['en-US'];
}
/* jshint ignore:end */
// Array Remove - By John Resig (MIT Licensed)
//Array.prototype.removeArrayItem1 = function (from, to) {
//    var rest = this.slice((to || from) + 1 || this.length);
//    this.length = from < 0 ? this.length + from : from;
//    return this.push.apply(this, rest);
//};



