import {Component, OnInit} from '@angular/core';
import {HomeService} from '../../shared/services/home.service';
import 'ag-grid-enterprise';
import * as moment from 'moment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private columnDefs = [
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
      autoHeight: true,
      cellRenderer: item => {
        return `<img src="${item.data.title.snippet.thumbnails.default.url}" alt="">`;
      }
    },
    {
      headerName: 'Published on',
      field: 'publishedAt',
      cellRenderer: item => {
        return moment(item.data.publishedAt).format('YYYY-MMM-DD hh:mm');
      },
      suppressMenu: true
    },
    {
      headerName: 'Video Title',
      field: 'title',
      suppressMenu: true,
      cellRenderer: item => {
        return `<a href="https://www.youtube.com/watch?v=${item.data.title.id.videoId}">${item.data.title.snippet.title}</a>`;
      }
    },
    {
      headerName: 'Description',
      field: 'description',
      suppressMenu: true,
      cellStyle: {'white-space': 'normal'}
    }
  ];

  private rowData = [];
  private rowSelection: string;
  private defaultColDef: {};
  private postProcessPopup: (params: any) => void;

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
        // tslint:disable-next-line:radix
        const oldTop = parseInt(oldTopStr);
        const newTop = oldTop + 25;
        ePopup.style.top = newTop + 'px';
      }
    };
  }

  ngOnInit(): void {
  }

  onGridReady(params: any): void {
    params.api.sizeColumnsToFit();
    this.service.getGridData().subscribe(data => {
      const arrayData = [];
      data.items.forEach(item => {
        arrayData.push({
          publishedAt: item.snippet.publishedAt,
          title: item,
          description: item.snippet.description
        });
      });
      this.rowData = arrayData;
    });
  }

  getMainMenuItems(params: any): Array<object> {
    if (params.column.getId() === 'thumbnails') {
      if (params.columnApi.columnController.allDisplayedColumns.length === 4) {
        return [
          {
            name: 'Toggle selection',
            action() {
              params.columnApi.setColumnVisible('checkbox', true);
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
      } else {
        return [
          {
            name: 'Toggle selection',
            action() {
              params.columnApi.setColumnVisible('checkbox', false);
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
  }

  getContextMenuItems(params: any): Array<any> {
    if (params.column.getId() === 'title') {
      return [
        'copy',
        'copyWithHeaders',
        'paste',
        'separator',
        {
          name: 'Open in new tab',
          action() {
            const link = document.createElement('a');
            link.style.display = 'none';
            link.href = `https://www.youtube.com/watch?v=${params.node.data.title.id.videoId}`;
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        },
      ];
    } else {
      return [
        'copy',
        'copyWithHeaders',
        'paste',
      ];
    }
  }
}
