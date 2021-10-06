export const COLUMNS = [
    {
        Header: "Id",
        accessor: "id"
    },
    {
        Header: "First Name",
        accessor: "first_name"
    },
    {
        Header: "Last Name",
        accessor: "last_name"
    },
    {
        Header: "Age",
        accessor: "age"
    },
    {
        Header: "Country",
        accessor: "country"
    },
    {
        Header: "Phone",
        accessor: "phone"
    },
    {
        id: 'edit',
        Header: "Edit",
        Cell: ({row}) => (<button type="button" className="btn btn-success" onClick={()=>{console.log('edit row', row.id)}}>Edit</button>)
    },
    {
        id: 'delete',
        Header: "Delete",
        Cell: ({row}) => (<button type="button" className="btn btn-danger" onClick={()=>{
            console.log('delete row', row.id);
        }}>Delete</button>)
    },

]