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
    AllowTruncate: boolean;
    CellAlign: CellAlign;
    CssClass: string;
    CustomAttr: string;
    HeaderAlign: string;
    HeaderText: string;
    Name: string;
    ShowCollapseExpand: boolean;
    Width: number;
}

interface Row {
    Columns: DataRow[];
    CssClass: string;
    CustomAttr: string;
    SubRows: Row[];
}

interface DataRow {
    CellAlign: CellAlign;
    MergeRowNumber: number;
    Name: string;
    Value: string;
    CustomAttr: string;
}

interface GridOptions {
    TitleInfoText: string;
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
