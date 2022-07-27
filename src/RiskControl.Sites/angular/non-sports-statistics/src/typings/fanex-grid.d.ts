type CellAlign = 'left' | 'right' | 'center';
type Method = 'resizeGrid' | 'reRender';
type MethodResizeHeight = 'resizeHeight';

interface JQuery {
    fanexGrid(gridOptions: GridOptions): JQuery;
    fanexGrid(methodName: Method): JQuery;
    fanexGrid(methodName: MethodResizeHeight, height: number): JQuery;
}

interface TitleInfo {
    text: string;
    showExcelButton?: boolean;
    exportExcelFunction?: () => void;
    showBackButton?: boolean;
    backFunction?: () => void;
}

interface PagerOption {
    itemsPerPage: number;
    currentPage: number;
    itemsPerPageArray: number[];
    showDetail: boolean;
    afterPagedFunction?: (pagerOption: PagerOption) => void;
}

interface SortOption {
    serverSortFunction: (sortColumnName: string, sortDirection: string) => void;
}

interface Column {
    allowTruncate: boolean;
    cellAlign: CellAlign;
    cssClass: string;
    customAttr: string;
    headerAlign: string;
    headerText: string;
    name: string;
    showCollapseExpand: boolean;
    width: number;
}

interface Row {
    columns: DataRow[];
    cssClass: string;
    customAttr: string;
    subRows: Row[];
}

interface DataRow {
    cellAlign: CellAlign;
    mergeRowNumber: number;
    name: string;
    value: string;
    customAttr: string;
}

interface GridOptions {
    titleInfoText: string;
    bodyRowHeight: number;
    gridExpandHeight: number;
    bodyRows: Row[];
    columns: Column[];
    customPager: boolean;
    footerRows: Row[];
    fullHeight: boolean;
    gridHeight: number;
    gridWidth: number;
    pagerOption: PagerOption;
    showTitle: boolean;
    showTree: boolean;
    showPager: boolean;
    showHighlightRow: boolean;
    titleInfo: TitleInfo;
    totalItems: number;
    sortOption: SortOption;
}
