import './App.css';
import { useTable, useGlobalFilter, useSortBy} from 'react-table'
import React, { useState, useEffect, useMemo } from 'react'
import "./table.css"
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBPTDrpr_7tfNr18Q5G_7kLGtZhPZ72zb8",
  authDomain: "reacttabledemo.firebaseapp.com",
  projectId: "reacttabledemo",
  storageBucket: "reacttabledemo.appspot.com",
  messagingSenderId: "506759418171",
  appId: "1:506759418171:web:1d1dc26c4b509eb0e3a71e"
};

const app = firebase.initializeApp(firebaseConfig);
const firestore = firebase.firestore();

const GlobalFilter = ({ filter, setFilter }) => {
  return (
      <span>
          Search: {' '}
          <input value={filter || ''} onChange={(e) => setFilter(e.target.value)} />
      </span>
  )
}

const EditableCell = ({
  value: initialValue,
  row: { index },
  column: { id },
  updateMyData,
}) => {
  const [value, setValue] = React.useState(initialValue)

  const onChange = e => {
    setValue(e.target.value)
  }

  const onBlur = () => {
    updateMyData(index, id, value)
  }

  React.useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  return <input value={value} onChange={onChange} onBlur={onBlur} />
}

const defaultColumn = {
  Cell: EditableCell,
}

function Table({ columns, data, updateMyData, skipPageReset }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    rows,
    state,
    setGlobalFilter,
  } = useTable({
      columns,
      data,
      defaultColumn,
      autoResetPage: !skipPageReset,
      updateMyData,
    },
    useGlobalFilter, useSortBy
  )

  const { globalFilter } = state

  return (
    <>
    <GlobalFilter filter={globalFilter} setFilter={setGlobalFilter} />
    <table {...getTableProps()}>
        <thead>
            {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                        <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                            {column.render("Header")}
                            <span>
                                {column.isSorted ? (column.isSortedDesc ? ' ⬇️' : ' ⬆️') : ''}
                            </span>
                        </th>
                    ))}
                </tr>
            ))}
        </thead>
        <tbody {...getTableBodyProps()}>
            {rows.map((row) => {
                prepareRow(row)
                return (
                    <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => {
                            return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                        })}
                    </tr>
                )
            })}
        </tbody>
    </table>
    </>
  ) 
}

function App() {

  useState(() => {
    firestore.collection("data").onSnapshot((snapshot) => {
      setData(snapshot.docs.map((doc) => doc.data()));
    });
  }, []);

  const [data, setData] = React.useState([]);

  const COLUMNS = React.useMemo( () => 
  [
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
        Header: "Email",
        accessor: "email"
    },
    {
        id: 'delete',
        Header: "Delete",
        accessor: (str) => "delete",
        Cell: (tableProps) => (<button type="button" className="btn btn-danger" onClick={()=>{
            console.log('delete row', tableProps.row.id);
            const dataCopy = [...data];
              const user_ref = firestore
                .collection("data")
                .where("id", "==", dataCopy[tableProps.row.index].id)
                .limit(1);

              let batch = firestore.batch();

              user_ref.get().then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                  batch.delete(doc.ref);
                  dataCopy.splice(tableProps.row.index, 1);
                  setData(dataCopy);
                });
                return batch.commit();
              });
        }}>Delete</button>)
    },
  ], [data] 
  );

  const updateMyData = (rowIndex, columnId, value) => {
    setData((old) =>
      old.map((row, index) => {
        if (index === rowIndex) {
          try {
            return {
              ...old[rowIndex],
              [columnId]: value,
            };
          } finally {
            const user_ref = firestore
              .collection("data")
              .where("id", "==", old[index].id)
              .limit(1);

            let batch = firestore.batch();
            const user = old[index];
            console.log("updating user: ", user);

            user_ref.get().then((snapshot) => {
              snapshot.docs.forEach((doc) => {
                batch.update(doc.ref, user);
              });
              return batch.commit();
            });
          }
        }
        return row;
      })
    );
  };

  return (
    <div className="App">
      <div>
        <Table columns={COLUMNS} data={data} updateMyData={updateMyData} />
      </div>
      <div className="toolbar">
        <button type="button" className="btn btn-success" onClick={() => 
          {
            const dataCopy = [...data];

            const new_user = {
              age: "",
              email: "",
              first_name: "",
              id: "",
              last_name: "",
            };

            var no_users = false;

            if (dataCopy.length === 0) {
              no_users = true;
              new_user.id = 1;
              dataCopy.push(new_user);
              setData(dataCopy);
              firestore.collection("data").add(new_user);
            } else {
              const query = firestore
                .collection("data")
                .orderBy("id", "desc")
                .limit(1);

              query.get().then((snapshot) => {
                snapshot.docs.forEach((doc) => {
                  new_user.id = doc.get("id") + 1;
                  dataCopy.push(new_user);
                  setData(dataCopy);
                  firestore.collection("data").add(new_user);
                });
              });
            }
          }}>Add User</button>
      </div>
    </div>
  );
}

export default App;
