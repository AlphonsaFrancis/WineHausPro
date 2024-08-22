import React, { useEffect, useState } from 'react'
import './Admin.css'
import Navbar from '../../components/Navbar'
import Menubox from '../../components/Menubox'
import BasicTable from '../../components/Basictable'
import { IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';




function Admin() {

    const [menu,setMenu]=useState('Products')
    const [rows,setRows]=useState([])
    const [columns,setColumns]=useState([])
    
    useEffect(()=>{
        console.log('menu',menu)
        if (menu==='Products'){
          setRows(productRows)
          setColumns(productColumns)
        }
        if(menu==='Orders'){
          setRows(orderRows)
          setColumns(orderColumns)
        }
        if(menu==='Staffs'){
          setRows(staffRows)
          setColumns(staffColumns)
        }
        if(menu==='Users'){
          setRows(usersRows)
          setColumns(usersColumns)
        }
    },[menu])
    

    const productColumns = [
      { field: 'id', headerName: 'ID', flex:1 },
      { field: 'name', headerName: 'Name',flex:1  },
      { field: 'category', headerName: 'Category', flex:1  },
      { field: 'price',headerName: 'Price',type: 'number',flex:1 ,},
      {field: 'stock',headerName: ' Stock Quantity',flex:1 },
      {field: 'actions',headerName: 'Actions',
        renderCell: (params) => (
          <div>
            <IconButton onClick={() => handleEdit(params.row.id)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ),
        flex:1 },
    ];
    


    const productRows = [
      { id: 1, name: 'Chateau Margaux', category: 'Red', price: 600 ,stock:50 },
      { id: 2, name: 'Dom Pérignon', category: 'Champaigne', price: 200,stock:100 },
      { id: 3, name: 'Screaming Eagle Cabernet Sauvignon', category: 'Red', price: 3500,stock:10 },
      { id: 4, name: 'Cloudy Bay Sauvignon Blanc', category: 'White', price: 300,stock:15 },
      
    ];

    const orderRows=[]
    const orderColumns=[
      { field: 'id', headerName: 'ID', flex:1 },
      { field: 'user_id', headerName: 'User',flex:1  },
      { field: 'order_date', headerName: 'Ordered On', flex:1  },
      { field: 'order_status', headerName: 'Order Status', flex:1  },
      { field: 'total_products', headerName: ' Total Products', flex:1  },
      { field: 'expected_delivery', headerName: 'Expected Delivery On', flex:1  },
      { field: 'total_amount', headerName: 'Total Amount', flex:1  },
      {field: 'actions',headerName: 'Actions',
        renderCell: (params) => (
          <div>
            <IconButton onClick={() => handleEditOrder(params.row.id)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteOrder(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ),
        flex:1 },

    ]

    const staffRows=[]
    const staffColumns=[
      { field: 'staff_id', headerName: 'Staff ID', flex:1 },
      { field: 'user_id', headerName: 'User Id',flex:1  },
      { field: 'name', headerName: 'Name',flex:1  },
      { field: 'email', headerName: 'Email',flex:1  },
      { field: 'status', headerName: 'Status',flex:1  },
      {field: 'actions',headerName: 'Actions',
        renderCell: (params) => (
          <div>
            <IconButton onClick={() => handleEditStaff(params.row.id)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteStaff(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ),
        flex:1 },
    ]


    const usersRows=[]
    const usersColumns=[
      { field: 'user_id', headerName: 'User Id',flex:1  },
      { field: 'name', headerName: 'Name',flex:1  },
      { field: 'email', headerName: 'Email',flex:1  },
      { field: 'joined_on', headerName: 'Joined On', flex:1 },
      { field: 'status', headerName: 'Status',flex:1  },
      {field: 'actions',headerName: 'Actions',
        renderCell: (params) => (
          <div>
            <IconButton onClick={() => handleEditUsers(params.row.id)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteUsers(params.row.id)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ),
        flex:1 },
    ]


    const handleEdit = (id) => {
      console.log('Edit ID:', id);
      // Add your edit logic here
    };
  
    const handleDelete = (id) => {
      console.log('Delete ID:', id);
      // Add your delete logic here
    };

    const handleEditOrder = (id) => {
      console.log('Edit ID:', id);
      // Add your edit logic here
    };
  
    const handleDeleteOrder = (id) => {
      console.log('Delete ID:', id);
      // Add your delete logic here
    };

    const handleEditStaff = (id) => {
      console.log('Edit ID:', id);
      // Add your edit logic here
    };
  
    const handleDeleteStaff = (id) => {
      console.log('Delete ID:', id);
      // Add your delete logic here
    };

    const handleEditUsers = (id) => {
      console.log('Edit ID:', id);
      // Add your edit logic here
    };
  
    const handleDeleteUsers = (id) => {
      console.log('Delete ID:', id);
      // Add your delete logic here
    };

  return (
    <div className='container'>
        <Navbar></Navbar>
        <div className='menu-container'>
          
        <div className='menus'>
          <Menubox text={'Products'} action={setMenu} menu={menu}/> 
          <Menubox text={'Orders'} action={setMenu} menu={menu}/> 
          <Menubox text={'Staffs'} action={setMenu} menu={menu}/>
          <Menubox text={'Users'} action={setMenu} menu={menu}/>  
        </div>    
        </div>
      <div className='table-container'>
        <BasicTable rows={rows} columns={columns}></BasicTable>
      </div>
    </div>
  )
}

export default Admin
