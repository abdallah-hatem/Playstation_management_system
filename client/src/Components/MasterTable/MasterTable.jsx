import React, {
  useState,
  useEffect,
  createRef,
  useMemo,
  useCallback,
} from "react";
import ExcelJS from "exceljs";
import saveAs from "file-saver";
import { exportDataGrid } from "devextreme/excel_exporter";
import CustomStore from "devextreme/data/custom_store";
import { alert } from "devextreme/ui/dialog";
import "devextreme/dist/css/dx.light.css";
import "devextreme-react/text-area";

import {
  Column,
  DataGrid,
  FilterRow,
  HeaderFilter,
  GroupPanel,
  Scrolling,
  Editing,
  KeyboardNavigation,
  ColumnChooser,
  Pager,
  Paging,
  Grouping,
  Lookup,
  MasterDetail,
  Summary,
  RangeRule,
  RequiredRule,
  StringLengthRule,
  GroupItem,
  TotalItem,
  ValueFormat,
  Texts,
  Button,
  Export,
  Selection,
  SearchPanel,
  Sorting,
  Form,
  Item,
  Popup,
} from "devextreme-react/data-grid";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { exportDataGrid as exportDataGridToPdf } from "devextreme/pdf_exporter";
// import { GET_SEARCH_ITEMS } from "../../../Services/ApiServices/ItemsAPI";
import { useTranslation } from "react-i18next";
import { t } from "i18next";

const dataGridRef = React.createRef();

function MasterTable({
  id = "",
  disabled = false,
  //* "single" "multiple"
  selectionMode = "single",
  //* [{ }, ...]
  dataSource = [],
  //* colAttributes = [{ field : "Target attribute in our object",
  //*                    caption : "Text will appear in column header",
  //*                    isVisable : true or false
  //*                    dataType? : "string" as defualt "number" "data" "dataTime" "boolean" "object",
  //*                    alignment? : "right" as defualt "left" "center"
  //*                    format?: "currency"
  //*                    widthRatio? : "150px" as defualt
  //*                  }, ... ]
  colAttributes = [],
  width = "100%",
  height = "100%",
  filterRow = false,
  groupPanel = false,
  headerFilter = false,
  allowAdd = false,
  allowUpdate = false,
  allowDelete = false,
  allowPrint = false,
  allowExcel = false,
  allowPdf = false,
  allowPaging = false,
  columnChooser = true,
  pageSize = 5,
  onSelectionChanged,
  onRowRemoving,
  onRowRemoved,
  onRowDoubleClick,
  onRowInserting,
  onSaving,
  /*
   *   summaryItems = [{column:"id",
   *                    summaryType:"sum",
   *                    valueFormat:"currency",
   *                    cssClass:"summaryNetSum",
   *                    showInColumn:"id"
   *                    customizeText:customizeTextHandler}
   *                  ]
   * */
  summaryItems = [],
  tableGroupSummary = [],
  deleteMessage = "Are you sure to delete this element?",
  remoteOperations = false,
  apiMethod,
  removeApiMethod,
  removeApiPayload = {},
  otherMethod,
  apiPayload,
  apiKey,
  allowSelectAllMode = true,
  onFilterValuesChange,
  showCheckBoxesMode = "always",
  cellRender,
  searchPanel = true,
  children,
  keyExpr,
  selectedRowKeys = "none",
  handleStyle = false,
  ColoredRows = false,
  placeholder = "Search...",
  options = [],
  editingMode = "row",
  onEditorPreparing,
  allowSorting = false,
  onContentReady,
  onRowPrepared,
  allowColumnReordering,
  allowSelection = false,
  onCellClick,
  popupTitle = "pop-up Title",
}) {
  const { t, i18n } = useTranslation();

  const sqlStatementGenerator = useCallback((data) => {
    if (data[1] !== "and") {
      data[0] = data[0].replace("~", ".");
      data[1] = data[1].includes("not") ? "not like" : "like";
      data[2] = "'%" + data[2] + "%'";
      data = data.join(" ");
      return data;
    } else {
      let temp = "";
      for (let i = 0; i < data.length; i += 2) {
        let element = data[i];
        element[0] = element[0].replace("~", ".");
        element[1] = element[1].includes("<>" || "not") ? "not like" : "like";
        element[2] = "'%" + element[2] + "%'";
        element = element.join(" ");
        temp += i + 2 < data.length ? element + " and " : element;
      }
      return temp;
    }
  }, []);

  // Store of API data
  const store = useMemo(
    () =>
      new CustomStore({
        // Key of this object
        key: apiKey,
        // OnLoad Event
        // (skip, take) => {return {data, totalCount}}
        load: function ({ skip = 0, take = 20, filter, userData }) {
          // Create a filter sql statement
          let FilterQuery =
            filter !== undefined && filterRow
              ? sqlStatementGenerator(filter)
              : "";
          // API method
          return (
            userData &&
            apiMethod({
              ...apiPayload,
              skip,
              take,
              FilterQuery,
            }).then((data) => {
              otherMethod && otherMethod(data);
              // Return must be in this structure
              return {
                // Array of data that will shown in table
                data: data.data,
                // Total count of element will get from API
                totalCount: data.totalCount ? data.totalCount : 0,

                summary: data.summary,
              };
            })
          );
        },
        remove: (key) => {
          removeApiMethod && removeApiMethod({ ...key, ...removeApiPayload });
        },
      }),
    [
      apiKey,
      apiMethod,
      apiPayload,
      filterRow,
      otherMethod,
      removeApiMethod,
      removeApiPayload,
      sqlStatementGenerator,
    ]
  );

  let data = remoteOperations ? store : dataSource;

  return (
    <React.Fragment>
      <DataGrid
        dataSource={data}
        disabled={disabled}
        id={id}
        ref={dataGridRef}
        width={width}
        height={height}
        showRowLines={true}
        hoverStateEnabled={true}
        rtlEnabled={i18n.language === "ar"}
        showBorders={true}
        ///////////////////
        columnAutoWidth={true} // Not Responsive
        allowColumnResizing={true}
        ///////////////////////
        wordWrapEnabled={true}
        // selection={{
        //   mode: selectionMode,
        //   allowSelectAll: allowSelectAllMode,
        // }}
        onRowRemoving={onRowRemoving}
        onRowRemoved={onRowRemoved}
        onRowInserting={onRowInserting}
        onToolbarPreparing={allowPrint && onToolbarPreparing}
        onExporting={onExportingHandle}
        onRowDblClick={onRowDoubleClick}
        onSaving={onSaving}
        remoteOperations={remoteOperations}
        //   sorting={remoteOperations ? false : true}
        keyExpr={keyExpr}
        onSelectionChanged={onSelectionChanged}
        selectedRowKeys={selectedRowKeys}
        onCellPrepared={(e) => handleStyle && handleStyle(e)}
        rowAlternationEnabled={ColoredRows}
        onEditorPreparing={onEditorPreparing}
        //   sorting={"null"}
        onContentReady={onContentReady}
        onRowPrepared={onRowPrepared}
        allowColumnReordering={allowColumnReordering}
        onCellClick={onCellClick}
      >
        {allowSelection && (
          <Selection
            mode="multiple"
            selectAllMode={"allPages"}
            showCheckBoxesMode={"always"}
            allowSelectAll={true}
          />
        )}
        <Sorting mode={allowSorting && "multiple"} />

        <SearchPanel placeholder={t(placeholder)} visible={searchPanel} />
        <ColumnChooser enabled={columnChooser} />
        <FilterRow visible={filterRow} />
        <HeaderFilter visible={headerFilter} />
        <GroupPanel visible={groupPanel} />
        <Editing
          mode={editingMode}
          useIcons={true}
          allowAdding={allowAdd}
          allowDeleting={allowDelete}
          allowUpdating={allowUpdate}
        >
          <Texts
            exportAll={t("export all")}
            exportSelectedRows={t("export selected")}
            exportTo={t("export to")}
            addRow={t("add new")}
            editRow={t("Update")}
            saveRowChanges={t("Save")}
            cancelRowChanges={t("Cancel")}
            deleteRow={t("Remove")}
            confirmDeleteMessage={t(deleteMessage)}
          />
          <Popup title={popupTitle} showTitle={true} />

          <Form>
            {colAttributes?.length > 0 &&
              colAttributes.map((el) => (
                <Item dataField={el.field} editorType={el.editorType} />
              ))}
          </Form>
        </Editing>
        {/* <Scrolling mode="virtual" rowRenderingMode="virtual" /> */}

        <Paging defaultPageSize={pageSize} enabled={allowPaging} />
        <Pager
          visible={allowPaging}
          showPageSizeSelector={true}
          allowedPageSizes={[pageSize, pageSize * 2, pageSize * 4]}
          showInfo={true}
        />
        {colAttributes?.length > 0 &&
          colAttributes.map((col, index) => {
            return (
              <Column
                key={index}
                name={col.field}
                dataType={col.dataType || "string"}
                visible={col.visible}
                dataField={col.field}
                caption={
                  i18n.language === "en"
                    ? col.captionEn ?? t(col.caption)
                    : t(col.caption)
                }
                alignment={
                  col.alignment || (i18n.language === "ar" ? "right" : "left")
                }
                format={col.format}
                cssClass={col.cssClass}
                grouped={col.grouped}
                groupIndex={col.groupIndex}
                autoExpandGroup={false}
                onFilterValuesChange={onFilterValuesChange}
                allowFiltering={col.hideFilter ? false : true}
                calculateCellValue={col.calculateCellValueHandle}
                cellRender={col.cellRender}
                width={col.width}
                allowEditing={col.allowEditing}
                headerCellRender={col.headerCellRender}
                minWidth={col.minWidth}
                // width={
                //     col.widthRatio
                //         ? `${col.widthRatio}px`
                //         : "150px"
                // }
              >
                {col.options && (
                  <Lookup
                    dataSource={col.options}
                    displayExpr="label"
                    valueExpr="value"
                    allowClearing={true}
                  />
                )}
              </Column>
            );
          })}
        {children}
        <Export
          enabled={allowExcel || allowPdf}
          formats={allowExcel ? ["excel"] : ["pdf"]}
          allowExportSelectedData={true}
        />

        {summaryItems.length > 0 && (
          <Summary>
            {summaryItems.map((item, index) => {
              return (
                <TotalItem
                  key={index}
                  column={item.column}
                  summaryType={item.summaryType}
                  valueFormat={item.valueFormat}
                  showInColumn={item.showInColumn}
                  cssClass={item.cssClass}
                  skipEmptyValues={true}
                  customizeText={item.customizeText}
                  alignment={item.alignment}
                />
              );
            })}
            {tableGroupSummary.map((groupItem) => {
              return (
                <GroupItem
                  column={groupItem.column}
                  summaryType={groupItem.summaryType}
                  showInGroupFooter={groupItem.showInGroupFooter}
                  displayFormat={groupItem.displayFormat}
                  alignByColumn={groupItem.alignByColumn}
                  showInColumn={groupItem.showInColumn}
                />
              );
            })}
          </Summary>
        )}
      </DataGrid>
    </React.Fragment>
  );
}

const onToolbarPreparing = (e) => {
  let toolbarItems = e.toolbarOptions.items;
  // Modifies an existing item
  // toolbarItems.forEach(function (item) {
  // 	if (item.name === "exportButton") {
  // 		item.options = {
  // 			// icon: "exportxlsx",
  // 			text: "إضافة",
  // 			// onClick: function (e) {
  // 			//     // Implement custom save logic here
  // 			// },
  // 		};
  // 	}
  // });

  // Adds a new item
  toolbarItems.push({
    widget: "dxButton",
    options: {
      icon: "exportpdf",
      hint: t("Print"),
      onClick: function () {
        const doc = new jsPDF();
        const dataGrid = dataGridRef.current.instance;
        console.log(dataGrid);
        exportDataGridToPdf({
          jsPDFDocument: doc,
          component: dataGrid,
        }).then(() => {
          doc.save("grid.pdf");
        });
      },
    },
    location: "after",
  });
};

const onExportingHandle = (e) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Main sheet");

  exportDataGrid({
    component: e.component,
    worksheet: worksheet,
    autoFilterEnabled: true,
  }).then(() => {
    workbook.xlsx.writeBuffer().then((buffer) => {
      saveAs(
        new Blob([buffer], { type: "application/octet-stream" }),
        "DataGrid.xlsx"
      );
    });
  });
  e.cancel = true;
};

export default React.memo(MasterTable);
