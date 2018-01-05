import { TreeviewItem } from 'ngx-treeview';
import { TableColumn, TableColumns } from './model';

export const ColumnHelper = {
    createColumnTreeviewItems: createColumnTreeviewItems,
    updateCheckedBySelection: updateCheckedBySelection
};

function createColumnTreeviewItems(columns: TableColumns): TreeviewItem[] {
    const treeviewItems: TreeviewItem[] = [];
    for (const columnName in columns) {
        if (columns.hasOwnProperty(columnName)) {
            const column: TableColumn = columns[columnName];
            if (!column.hidden) {
                const text = column.text.replace(/<\/?[^>]+(>|$)/g, ' ');
                const treeviewItem = new TreeviewItem({ text: text, value: column, checked: column.checked });
                treeviewItems.push(treeviewItem);
            }
        }
    }
    return treeviewItems;
}

function updateCheckedBySelection(columns: TableColumns, selectedColumns: TableColumn[]) {
    for (const columnName in columns) {
        if (columns.hasOwnProperty(columnName)) {
            const column: TableColumn = columns[columnName];
            if (column.hidden) {
                continue;
            }

            column.checked = selectedColumns.filter(x => x === column).length === 1;
        }
    }
}
