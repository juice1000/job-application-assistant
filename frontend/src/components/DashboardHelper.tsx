import { GridColDef } from '@mui/x-data-grid';

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return '#ffd54f'; // Vivid yellow
    case 'ready':
      return '#64b5f6'; // Vivid blue
    case 'review':
      return '#b0aac0'; // Vivid purple
    case 'applied':
      return '#81c784'; // Vivid green
    case 'rejected':
      return '#ff8a80'; // Vivid red
    case 'irrelevant':
      return '#b0bec5'; // Vivid grey
    default:
      return 'transparent';
  }
};

// Add table data
export const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 40, headerClassName: 'super-app-theme--header' },
  {
    field: 'title',

    headerName: 'Job Title',
    width: 230,
    headerClassName: 'super-app-theme--header',
    renderCell: (params) => <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5', padding: 10 }}>{params.value}</div>,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 100,
    headerClassName: 'super-app-theme--header',
    renderCell: (params) => (
      <div
        style={{
          backgroundColor: getStatusColor(params.value as string),
          width: '100%',
          textAlign: 'center',
        }}
      >
        {params.value}
      </div>
    ),
  },
  {
    field: 'keywords',
    headerName: 'Keywords',
    flex: 1,
    minWidth: 200,
    headerClassName: 'super-app-theme--header',
    renderCell: (params) => <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5', padding: 10 }}>{params.value}</div>,
  },
  {
    field: 'description',
    headerName: 'Description',
    flex: 2,
    minWidth: 300,
    headerClassName: 'super-app-theme--header',
    renderCell: (params) => <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.5', padding: 10 }}>{params.value}</div>,
  },
  { field: 'language', headerName: 'Language', width: 120, headerClassName: 'super-app-theme--header' },
  { field: 'dateApplied', headerName: 'Applied at', width: 120, headerClassName: 'super-app-theme--header' },
];

export const gridStyles = {
  '& .MuiDataGrid-root': {
    width: '100%',
  },
  '& .MuiDataGrid-cell': {
    overflow: 'auto !important',
    whiteSpace: 'normal',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  '& .MuiDataGrid-cell:focus-within': {
    outline: 'none',
  },
  '& .MuiDataGrid-columnHeaders': {
    borderBottom: '2px solid #bdbdbd',
  },
  '& .super-app-theme--header': {
    fontWeight: '700',
    fontSize: '1.2rem',
  },
};
