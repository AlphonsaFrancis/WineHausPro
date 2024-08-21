import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';


export default function DataTable({rows,columns}) {
  return (
    <div style={{ height: 400, width: '76.5%',background: '#abe2bd' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        sx={{
          '& .MuiDataGrid-row': {
            borderBottom: '1px solid #ffff',  // Change border color here
          },
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
      />
    </div>
  );
}
