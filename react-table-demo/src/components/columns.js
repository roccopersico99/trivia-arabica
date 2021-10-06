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
        id: 'button',
        Header: "Edit",
        accessor: "phone",
        Cell: ({value}) => (<button onClick={()=>{console.log('clicked value', value)}}>Button</button>)
    },

]