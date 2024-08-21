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
    },[menu])
    const orderRows=[]
    const orderColumns=[]

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

    const handleEdit = (id) => {
      console.log('Edit ID:', id);
      // Add your edit logic here
    };
  
    const handleDelete = (id) => {
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
