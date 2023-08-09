import React, { useState, useEffect } from 'react';
import { Container, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';

const OrderListPage = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/orders');
      const formattedOrders = response.data.map(order => ({
        ...order,
        SiparisTarihi: new Date(order.SiparisTarihi).toLocaleDateString(),
        TerminTarihi: order.TerminTarihi ? new Date(order.TerminTarihi).toLocaleDateString() : null,
      }));
      setOrders(formattedOrders);
    } catch (error) {
      console.error('Hata:', error);
    }
  };


  const columns = [
    { field: 'ID', headerName: 'ID', width: 70 },
    { field: 'SiparisTarihi', headerName: 'Sipariş Tarihi', width: 100 },
    { field: 'TerminTarihi', headerName: 'Termin Tarihi', width: 100 },
    { field: 'FirmaAdi', headerName: 'Firma Adı', width: 150 },
    { field: 'IsinAdi', headerName: 'İşin Adı', width: 150 },
    { field: 'IsinAdedi', headerName: 'Adedi', width: 100 },
    { field: 'BaskiMakinasi', headerName: 'Baski Makinasi', width: 150 },
    { field: 'KagitTuru', headerName: 'Kağıt Türü', width: 100 },
    { field: 'KagitEn', headerName: 'Kgt En', width: 75 },
    { field: 'KagitBoy', headerName: 'Kgt Boy', width: 75 },
    { field: 'KalipTuru', headerName: 'Kalıp', width: 75 },
    { field: 'KalipAdedi', headerName: 'Klp Ad.', width: 75 },
    { field: 'StandartBaskiRenkleri', headerName: 'Standart Baskı Renkleri', width: 150 },
    { field: 'BaskiTuru', headerName: 'BaskiTuru', width: 150 },
    { field: 'EkstraBaskiRenkleri', headerName: 'EkstraBaskiRenkleri', width: 150 },
    { field: 'Selefon', headerName: 'Selefon', width: 150 },
    { field: 'Kesim', headerName: 'Kesim', width: 150 },
  ];

  const sortModel = [
    {
      field: 'ID',
      sort: 'desc', // 'desc' sondan başa sıralama, 'asc' öncekinden sonrakine sıralama
    },
  ];

  return (
    <Container style={{ maxWidth: '100%' }}>
      <Typography variant="h4" gutterBottom>
        Sipariş Listesi
      </Typography>
      <div style={{ height: '100%', width: '100%' }}>
        <DataGrid
          rows={orders}
          columns={columns}
          pageSize={5}
          sortModel={sortModel}
          checkboxSelection
          disableRowSelectionOnClick
          getRowId={(row) => row.ID}
        />
      </div>
    </Container>
  );
};

export default OrderListPage;
