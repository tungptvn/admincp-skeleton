
import { GridOptions, GridApi, ColumnApi } from 'ag-grid';
import { HttpClient } from 'aurelia-fetch-client';
import { inject } from 'aurelia-dependency-injection';
// import 'ag-grid-enterprise/main';
@inject(HttpClient)
export class AgGridDemo {

  private gridOptions: GridOptions;
  private showGrid: boolean;
  private rowData: any[];
  private listOfCountries: any[];
  private rowCount: string;
  private api: GridApi;
  private columnApi: ColumnApi;
  private allOfTheData: any;
  private columnDefs: any[];
  constructor(private http: HttpClient) {
    this.listOfCountries =
      ['United States', 'Russia', 'Australia', 'Canada', 'Norway', 'China', 'Zimbabwe', 'Netherlands', 'South Korea', 'Croatia',
        'France', 'Japan', 'Hungary', 'Germany', 'Poland', 'South Africa', 'Sweden', 'Ukraine', 'Italy', 'Czech Republic', 'Austria', 'Finland', 'Romania',
        'Great Britain', 'Jamaica', 'Singapore', 'Belarus', 'Chile', 'Spain', 'Tunisia', 'Brazil', 'Slovakia', 'Costa Rica', 'Bulgaria', 'Switzerland',
        'New Zealand', 'Estonia', 'Kenya', 'Ethiopia', 'Trinidad and Tobago', 'Turkey', 'Morocco', 'Bahamas', 'Slovenia', 'Armenia', 'Azerbaijan', 'India',
        'Puerto Rico', 'Egypt', 'Kazakhstan', 'Iran', 'Georgia', 'Lithuania', 'Cuba', 'Colombia', 'Mongolia', 'Uzbekistan', 'North Korea', 'Tajikistan',
        'Kyrgyzstan', 'Greece', 'Macedonia', 'Moldova', 'Chinese Taipei', 'Indonesia', 'Thailand', 'Vietnam', 'Latvia', 'Venezuela', 'Mexico', 'Nigeria',
        'Qatar', 'Serbia', 'Serbia and Montenegro', 'Hong Kong', 'Denmark', 'Portugal', 'Argentina', 'Afghanistan', 'Gabon', 'Dominican Republic', 'Belgium',
        'Kuwait', 'United Arab Emirates', 'Cyprus', 'Israel', 'Algeria', 'Montenegro', 'Iceland', 'Paraguay', 'Cameroon', 'Saudi Arabia', 'Ireland', 'Malaysia',
        'Uruguay', 'Togo', 'Mauritius', 'Syria', 'Botswana', 'Guatemala', 'Bahrain', 'Grenada', 'Uganda', 'Sudan', 'Ecuador', 'Panama', 'Eritrea', 'Sri Lanka',
        'Mozambique', 'Barbados'];
    this.columnDefs = [
      // this row just shows the row index, doesn't use any data from the row
      {
        headerName: "#", width: 50,
        cellRenderer: function (params) {
          return params.node.id + 1;
        },
        // we don't want to sort by the row index, this doesn't make sense as the point
        // of the row index is to know the row index in what came back from the server
        suppressSorting: true,
        suppressMenu: true
      },
      { headerName: "Athlete", field: "athlete", width: 150, suppressMenu: true },
      { headerName: "Age", field: "age", width: 90, filter: 'number', filterParams: { newRowsAction: 'keep' } },
      { headerName: "Country", field: "country", width: 120, filter: 'set', filterParams: { values: this.listOfCountries, newRowsAction: 'keep' } },
      { headerName: "Year", field: "year", width: 90, filter: 'set', filterParams: { values: ['2000', '2004', '2008', '2012'], newRowsAction: 'keep' } },
      { headerName: "Date", field: "date", width: 110, suppressMenu: true },
      { headerName: "Sport", field: "sport", width: 110, suppressMenu: true },
      { headerName: "Gold", field: "gold", width: 100, suppressMenu: true },
      { headerName: "Silver", field: "silver", width: 100, suppressMenu: true },
      { headerName: "Bronze", field: "bronze", width: 100, suppressMenu: true },
      { headerName: "Total", field: "total", width: 100, suppressMenu: true }
    ];
    this.gridOptions = {
      enableServerSideSorting: true,
      enableServerSideFilter: true,
      enableColResize: true,
      paginationPageSize: 500,
      columnDefs: this.columnDefs,
      rowModelType: 'pagination',
      rowSelection: 'multiple',
      animateRows: true,
      getRowNodeId: function (item) {
        return item.id;
      }
    };
  }
  async activate(params, routeConfig, navigationInstruction) {


  }
  attached() {

  }
  onReady() {
    console.log("allOfTheData", this.allOfTheData);
    this.http.fetch("../../database-mockup/olympicWinners.json")
      .then((res) => res.json())
      .then((res) => {
        this.allOfTheData = res;
        this.allOfTheData.forEach( (data, index)=> {
          data.id = 'R' + (index + 1);
        });
        console.log("res", this.allOfTheData[0]);
        this.createNewDatasource();
      })

  }
  createNewDatasource() {
    if (!this.allOfTheData) {
      // in case user selected 'onPageSizeChanged()' before the json was loaded
      return;
    }
    var dataSource = {
      //rowCount: ???, - not setting the row count, infinite paging will be used
      getRows: (params) => {
        // this code should contact the server for rows. however for the purposes of the demo,
        // the data is generated locally, a timer is used to give the experience of
        // an asynchronous call
        console.log('asking for ' + params.startRow + ' to ' + params.endRow);
        setTimeout(() => {
          // take a chunk of the array, matching the start and finish times
          // var dataAfterSortingAndFiltering = sortAndFilter(params.sortModel, params.filterModel);
          console.log("allOfTheDate when create datasource : ", this.allOfTheData);
          var rowsThisPage = this.allOfTheData.slice(params.startRow, params.endRow);
          // see if we have come to the last page. if we have, set lastRow to
          // the very last row of the last page. if you are getting data from
          // a server, lastRow could be returned separately if the lastRow
          // is not in the current page.
          var lastRow = -1;
          if (this.allOfTheData.length <= params.endRow) {
            lastRow = this.allOfTheData.length;
          }
          params.successCallback(rowsThisPage, lastRow);
        }, 500);
      }
    };

    this.gridOptions.api.setDatasource(dataSource);

  }
}
