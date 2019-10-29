import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../shared/services/home.service';
import 'ag-grid-enterprise';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  columnDefs = [
    {
      colId: 'checkbox',
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: true,
      width: 40,
      suppressMenu: true,
      hide: true
    },
    {
      colId: 'thumbnails',
      cellRenderer: item => {
        return `<img src="${item.data.title.snippet.thumbnails.default.url}" alt="">`;
      },
    },
    {
      field: 'publishedAt',
      headerName: 'Published on',
      cellRenderer: item => {
        return moment(item.data.publishedAt).local().format('DD-MMM-YYYY hh:mm:ss');
      },
      suppressMenu: true
    },
    {
      field: 'title',
      headerName: 'Video Title',
      suppressMenu: true,
      cellRenderer: item => {
        return `<a href="https://www.youtube.com/watch?v=${item.data.title.id.videoId}" target="_blank">${item.data.title.snippet.title}</a>`;
      }
    },
    {
      field: 'description',
      headerName: 'Description',
      suppressMenu: true,
      cellStyle: {'white-space': 'normal'}
    }
  ];

  gridApi;
  gridColumnApi;
  getRowHeight;
  rowData = [];
  rowSelection: string;
  defaultColDef: {};
  postProcessPopup: (params: any) => void;

  constructor(
    private service: HomeService
  ) {
    this.defaultColDef = {
      resizable: true,
    };
    this.rowSelection = 'multiple';
    this.postProcessPopup = params => {
      if (params.type !== 'columnMenu') {
        return;
      }
      const columnId = params.column.getId();
      if (columnId === 'gold') {
        const ePopup = params.ePopup;
        let oldTopStr = ePopup.style.top;
        oldTopStr = oldTopStr.substring(0, oldTopStr.indexOf('px'));
        const oldTop = parseInt(oldTopStr, 10);
        const newTop = oldTop + 25;
        ePopup.style.top = newTop + 'px';
      }
    };
    this.getRowHeight = params => {
      return params.data.rowHeight;
    };
  }

  ngOnInit(): void {
  }

  onGridReady(params: any): void {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;
    params.api.sizeColumnsToFit();

    this.service.getGridData().subscribe(data => {
      this.rowData = data.items.map(item => {
        return {
          publishedAt: item.snippet.publishedAt,
          title: item,
          description: item.snippet.description,
          rowHeight: item.snippet.thumbnails.default.height
        };
      });
    });
  }

  getMainMenuItems(params: any): Array<object> {
    if (params.column.getId() === 'thumbnails') {
        return [
          {
            name: 'Toggle selection',
            action() {
              params.columnApi.setColumnVisible('checkbox', params.columnApi.columnController.allDisplayedColumns.length === 4);
            }
          },
          {
            name: `Total records: ${params.columnApi.columnController.gridOptionsWrapper.gridOptions.rowData.length}`,
            action() {}
          },
          {
            name: `Selected records: ${params.api.getSelectedRows().length}`,
            action() {}
          }
        ];
    }
  }

  getContextMenuItems(params: any): Array<string | object> {
    let contextMenuItems: Array<string | object> = ['copy', 'copyWithHeaders', 'paste'];
    const extendedContextMenu: Array<string | object> = [
      'separator',
      {
        name: `<a href="https://www.youtube.com/watch?v=${params.node.data.title.id.videoId}" target="_blank">Open in new tab</a>`,
        action() {}
      }];
    if (params.column.getId() === 'title') {
      contextMenuItems = [...contextMenuItems, ...extendedContextMenu];
    }

    return contextMenuItems;
  }
}
