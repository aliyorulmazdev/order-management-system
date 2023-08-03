import React, { useState } from 'react';
import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import tr from 'date-fns/locale/tr'; // Türkçe dil desteği
import TextField from '@mui/material/TextField';
import { Button, makeStyles } from '@material-ui/core';
import Autocomplete from '@mui/material/Autocomplete';
import { createTheme, ThemeProvider } from '@mui/material/styles';

registerLocale('tr', tr);
const useStyles = makeStyles((theme) => ({
    button: {
        backgroundColor: '#4CAF50',
        color: 'white',
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center', // Vertically center the content
        '&:hover': {
            backgroundColor: '#45a049',
        },
    },
}));
const theme = createTheme();

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const FormWrapper = styled.div`
  width: 50%;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #f7f7f7;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const ComponentWrapper = styled.div`
  margin-bottom: 20px;
`;
const OrderForm = () => {
    const classes = useStyles();
    const [order, setOrder] = useState({
        siparisTarihi: new Date(),
        terminTarihi: null,
        firmaAdi: '',
        isinAdi: '',
        isinAdedi: '',
        kagitTuru: null, // Change this to null to match the Autocomplete options format
        kagitGramaji: '',
        kagitOlculeri: {
            en: '',
            boy: ''
        },
        baskiOlculeri: {
            en: '',
            boy: ''
        },
        baskiRenkAdedi: null, // Change this to null to match the Autocomplete options format
        baskiTuru: null, // Change this to null to match the Autocomplete options format
        baskiRenkleri: [],
        ekstraBaskiRenkleri: [],
        baskiMakinasi: null, // Change this to null to match the Autocomplete options format
        kalipTuru: null, // Change this to null to match the Autocomplete options format
        kalipAdedi: '',
        selefon: { value: 'Selefon Yok', label: 'Selefon Yok' }, // Set the default value as an object
        kesim: { value: 'Kesim Yok', label: 'Kesim Yok' }, // Set the default value as an object
        bicakTuru: { value: 'Bıçak Yok', label: 'Bıçak Yok' }, // Set the default value as an object
        bicakKodu: '',
        siparisDurumu: 'Onay bekliyor',
    });

    const [baskiRenkSecimi] = useState([
        { value: 'C', label: 'Cyan (C)' },
        { value: 'M', label: 'Magenta (M)' },
        { value: 'Y', label: 'Yellow (Y)' },
        { value: 'K', label: 'Key (Black) (K)' },
    ]);

    const [ekstraBaskiRenk, setEkstraBaskiRenk] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Add the selected extra color directly to the baskiRenkleri array
            if (ekstraBaskiRenk !== '') {
                setOrder((prevOrder) => ({
                    ...prevOrder,
                    baskiRenkleri: [...prevOrder.baskiRenkleri, { value: ekstraBaskiRenk, label: ekstraBaskiRenk }],
                    ekstraBaskiRenkleri: [...prevOrder.ekstraBaskiRenkleri, ekstraBaskiRenk],
                }));
                setEkstraBaskiRenk('');
            }

            // Siparişi kaydetmek için API çağrısı yapabilirsiniz.
            // Örnek bir API çağrısı aşağıda gösterilmiştir:
            // const response = await axios.post('http://localhost:3000/api/siparis', order);
            console.log('Sipariş gönderildi:', order);
            alert('Sipariş gönderildi!');
        } catch (error) {
            console.error('Sipariş gönderilirken bir hata oluştu:', error);
            alert('Sipariş gönderilirken bir hata oluştu!');
        }
    };
    const handleAddExtraColor = () => {
        if (ekstraBaskiRenk !== '') {
            setOrder((prevOrder) => ({
                ...prevOrder,
                baskiRenkleri: [...prevOrder.baskiRenkleri, { value: ekstraBaskiRenk, label: ekstraBaskiRenk }],
                ekstraBaskiRenkleri: [...prevOrder.ekstraBaskiRenkleri, ekstraBaskiRenk],
            }));
            setEkstraBaskiRenk('');
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <FormWrapper>
                    <div>
                        <h2>Sipariş Oluşturma Sayfası</h2>

                        <form onSubmit={handleSubmit}>
                            <ComponentWrapper>
                                <div style={{ display: 'flex', width: '100%' }}>
                                    <div style={{ paddingRight: '10px' }}>
                                        <TextField
                                            label="Sipariş Tarihi"
                                            type="date"
                                            value={order.siparisTarihi.toISOString().substr(0, 10)}
                                            onChange={(e) => setOrder({ ...order, siparisTarihi: new Date(e.target.value) })}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </div>
                                    <div style={{ paddingRight: '10px' }}>
                                        <TextField
                                            label="Termin Tarihi"
                                            type="date"
                                            value={order.terminTarihi ? order.terminTarihi.toISOString().substr(0, 10) : ''}
                                            onChange={(e) => setOrder({ ...order, terminTarihi: new Date(e.target.value) })}
                                            InputLabelProps={{
                                                shrink: true,
                                            }}
                                        />
                                    </div>
                                </div>
                            </ComponentWrapper>
                            <ComponentWrapper>
                                <div style={{ display: 'flex', width: '100%' }}>
                                    {/* Firma Adı */}
                                    <div style={{ paddingRight: '10px', flex: '1' }}>
                                        <TextField
                                            label="Firma Adı"
                                            type="text"
                                            value={order.firmaAdi}
                                            onChange={(e) => setOrder({ ...order, firmaAdi: e.target.value })}
                                            fullWidth
                                        />
                                    </div>

                                    <div style={{ display: 'flex', flex: '2', justifyContent: 'space-between' }}>
                                        {/*      */}
                                        <div style={{ paddingRight: '10px', flex: '2' }}>
                                            <TextField
                                                label="Sipariş Adı"
                                                type="text"
                                                value={order.isinAdi}
                                                onChange={(e) => setOrder({ ...order, isinAdi: e.target.value })}
                                                fullWidth
                                            />
                                        </div>

                                        {/* Sipariş Adedi */}
                                        <div style={{ flex: '1' }}>
                                            <TextField
                                                label="Sipariş Adedi"
                                                type="number"
                                                value={order.isinAdedi}
                                                onChange={(e) => setOrder({ ...order, isinAdedi: e.target.value })}
                                                fullWidth
                                            />
                                        </div>
                                    </div>
                                </div>
                            </ComponentWrapper>

                            <ComponentWrapper>
                                <div style={{ display: 'flex', width: '100%' }}>
                                    {/* Kağıt Türü */}
                                    <div style={{ flex: '1', paddingRight: '10px' }}>
                                        <Autocomplete
                                            autoHighlight
                                            options={[
                                                { value: 'KRAFT', label: 'KRAFT' },
                                                { value: 'KROME', label: 'KROME' },
                                                { value: 'BRISTOL', label: 'BRISTOL' },
                                                { value: 'I.HAMUR', label: 'I.HAMUR' },
                                                { value: 'KUŞE ÇIKARTMA', label: 'KUŞE ÇIKARTMA' },
                                                { value: 'PELUR', label: 'PELUR' },
                                            ]}
                                            value={order.kagitTuru}
                                            onChange={(event, newValue) => setOrder({ ...order, kagitTuru: newValue })}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => <TextField {...params} label="Kağıt Türü" />}
                                            fullWidth
                                        />
                                    </div>

                                    {/* Kağıt Ölçüsü (En) */}
                                    <div style={{ flex: '1', paddingRight: '10px' }}>
                                        <TextField
                                            label="Kağıt Ölçüsü (En)"
                                            type="number"
                                            value={order.kagitOlculeri.en}
                                            onChange={(e) => setOrder({ ...order, kagitOlculeri: { ...order.kagitOlculeri, en: e.target.value } })}
                                            placeholder="En (mm)"
                                            fullWidth
                                        />
                                    </div>

                                    {/* Kağıt Ölçüsü (Boy) */}
                                    <div style={{ flex: '1' }}>
                                        <TextField
                                            label="Kağıt Ölçüsü (Boy)"
                                            type="number"
                                            value={order.kagitOlculeri.boy}
                                            onChange={(e) => setOrder({ ...order, kagitOlculeri: { ...order.kagitOlculeri, boy: e.target.value } })}
                                            placeholder="Boy (mm)"
                                            fullWidth
                                        />
                                    </div>
                                </div>
                            </ComponentWrapper>


                            <ComponentWrapper>
                                <div style={{ display: 'flex', width: '100%' }}>
                                    <div style={{ flex: '1%', paddingRight: '10px' }}>
                                        <Autocomplete
                                            options={[
                                                { value: 'Arşiv', label: 'Arşiv' },
                                                { value: 'Müşteri', label: 'Müşteri' },
                                                { value: 'Yeni', label: 'Yeni' },
                                            ]}
                                            isOptionEqualToValue={(option, value) => option.value === value.value}
                                            value={order.kalipTuru}
                                            onChange={(event, newValue) => setOrder({ ...order, kalipTuru: newValue })}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => <TextField {...params} label="Kalıp Türü" />}
                                        />
                                    </div>

                                    <div style={{ flex: '50%' }}>
                                        <TextField
                                            label="Kalıp Adedi"
                                            type="number"
                                            value={order.kalipAdedi}
                                            onChange={(e) => setOrder({ ...order, kalipAdedi: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </ComponentWrapper>
                            <ComponentWrapper>
                                <div style={{ display: 'flex', width: '100%', marginBottom: '10px' }}>
                                    {/* Baskı Makinası */}
                                    <div style={{ flex: '4', paddingRight: '10px' }}>
                                        <Autocomplete
                                            options={[
                                                { value: 'KOMORİ 70X100', label: 'KOMORİ 70X100' },
                                                { value: 'ROLAND 70X100', label: 'ROLAND 70X100' },
                                                { value: 'PLANETA 100X140', label: 'PLANETA 100X140' },
                                            ]}
                                            isOptionEqualToValue={(option, value) => option.value === value.value}
                                            value={order.baskiMakinasi}
                                            onChange={(event, newValue) => setOrder({ ...order, baskiMakinasi: newValue })}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => <TextField {...params} label="Baskı Makinası" />}
                                            fullWidth
                                        />
                                    </div>

                                    {/* Baskı Ölçüsü (En) */}
                                    <div style={{ flex: '2', paddingRight: '10px' }}>
                                        <TextField
                                            label="Baskı Ölçüsü (En)"
                                            type="number"
                                            value={order.baskiOlculeri.en}
                                            onChange={(e) => setOrder({ ...order, baskiOlculeri: { ...order.baskiOlculeri, en: e.target.value } })}
                                            placeholder="En (mm)"
                                            fullWidth
                                        />
                                    </div>

                                    {/* Baskı Ölçüsü (Boy) */}
                                    <div style={{ flex: '2' }}>
                                        <TextField
                                            label="Baskı Ölçüsü (Boy)"
                                            type="number"
                                            value={order.baskiOlculeri.boy}
                                            onChange={(e) => setOrder({ ...order, baskiOlculeri: { ...order.baskiOlculeri, boy: e.target.value } })}
                                            placeholder="Boy (mm)"
                                            fullWidth
                                        />
                                    </div>
                                </div>

                                <div style={{ marginBottom: '10px' }}>
                                    {/* Baskı Türü */}
                                    <Autocomplete
                                        options={[
                                            { value: 'Tek Yön', label: 'Tek Yön' },
                                            { value: 'Forma', label: 'Forma' },
                                            { value: 'Revolta', label: 'Revolta' },
                                            { value: 'Tumba', label: 'Tumba' }
                                        ]}
                                        value={order.baskiTuru}
                                        onChange={(event, newValue) => setOrder({ ...order, baskiTuru: newValue })}
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => <TextField {...params} label="Baskı Türü" />}
                                        fullWidth
                                    />
                                </div>
                            </ComponentWrapper>

                            <ComponentWrapper>
                                <div style={{ marginBottom: '10px' }}>
                                    <Autocomplete
                                        options={[
                                            { value: 'Tek Renk', label: 'Tek Renk' },
                                            { value: 'İki Renk', label: 'İki Renk' },
                                            { value: 'Üç Renk', label: 'Üç Renk' },
                                            { value: 'Dört Renk', label: 'Dört Renk' },
                                            { value: 'Beş Renk', label: 'Beş Renk' },
                                            { value: 'Altı Renk', label: 'Altı Renk' },
                                            { value: 'Yedi Renk', label: 'Yedi Renk' },
                                            { value: 'Sekiz Renk', label: 'Sekiz Renk' },
                                        ]}
                                        value={order.baskiRenkAdedi}
                                        onChange={(event, newValue) => setOrder({ ...order, baskiRenkAdedi: newValue })}
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => <TextField {...params} label="Baskı Renk Adedi" />}
                                    />
                                </div>
                                <div style={{ display: 'flex', width: '100%', alignItems: 'flex-end' }}>
                                    <div style={{ flex: '6', paddingRight: '10px', marginBottom: '10px' }}>
                                        <Autocomplete
                                            multiple // Set 'multiple' for multi-select
                                            options={baskiRenkSecimi}
                                            value={order.baskiRenkleri}
                                            onChange={(event, newValue) => setOrder({ ...order, baskiRenkleri: newValue })}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => <TextField {...params} label="Baskı Renkleri" />}
                                        />
                                    </div>
                                    <div style={{ flex: '4', marginBottom: '10px' }}>
                                        {order.ekstraBaskiRenkleri.map((renk, index) => (
                                            <div key={index}>
                                                {/* Add your content for each extra color here */}
                                            </div>
                                        ))}
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', marginTop: '10px' }}>
                                            {/* Add a marginTop of 10px to create the gap */}
                                            <TextField
                                                label="Yeni Renk"
                                                type="text"
                                                value={ekstraBaskiRenk}
                                                onChange={(e) => setEkstraBaskiRenk(e.target.value)}
                                            />
                                            <div style={{ marginLeft: '10px' }}>
                                                {/* Add marginLeft of 10px to create the gap */}
                                                <Button
                                                    variant="contained"
                                                    onClick={handleAddExtraColor}
                                                    size='large'
                                                    className={classes.button}
                                                >
                                                    Ekle
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </ComponentWrapper>
                            <ComponentWrapper>
                                <Autocomplete
                                    options={[
                                        { value: 'Selefon Yok', label: 'Selefon Yok' },
                                        { value: 'Ön Parlak', label: 'Ön Parlak' },
                                        { value: 'Arka Parlak', label: 'Arka Parlak' },
                                        { value: 'Ön/Arka Parlak', label: 'Ön/Arka Parlak' },
                                    ]}
                                    isOptionEqualToValue={(option, value) => option.value === value.value}
                                    value={order.selefon}
                                    onChange={(event, newValue) => setOrder({ ...order, selefon: newValue })}
                                    getOptionLabel={(option) => option.label}
                                    renderInput={(params) => <TextField {...params} label="Selefon" />}
                                />
                            </ComponentWrapper>
                            <ComponentWrapper>
                                <div style={{ display: 'flex', width: '100%' }}>
                                    {/* Kesim */}
                                    <div style={{ flex: 2, paddingRight: '10px' }}>
                                        <Autocomplete
                                            options={[
                                                { value: 'Kesim Yok', label: 'Kesim Yok' },
                                                { value: 'Kazanlı Kesim', label: 'Kazanlı Kesim' },
                                                { value: 'Giyotin Kesim', label: 'Giyotin Kesim' },
                                            ]}
                                            isOptionEqualToValue={(option, value) => option.value === value.value}
                                            value={order.kesim}
                                            onChange={(event, newValue) => setOrder({ ...order, kesim: newValue })}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => <TextField {...params} label="Kesim" />}
                                            fullWidth
                                        />
                                    </div>

                                    {/* Bıçak Türü */}
                                    <div style={{ flex: 2, paddingRight: '10px' }}>
                                        <Autocomplete
                                            options={[
                                                { value: 'Bıçak Yok', label: 'Bıçak Yok' },
                                                { value: 'Arşiv', label: 'Arşiv' },
                                                { value: 'Müşteri', label: 'Müşteri' },
                                                { value: 'Yeni', label: 'Yeni' },
                                            ]}
                                            value={order.bicakTuru}
                                            isOptionEqualToValue={(option, value) => option.value === value.value}
                                            onChange={(event, newValue) => setOrder({ ...order, bicakTuru: newValue })}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => <TextField {...params} label="Bıçak Türü" />}
                                            fullWidth
                                        />
                                    </div>

                                    {/* Bıçak Kodu */}
                                    <div style={{ flex: 2 }}>
                                        <TextField
                                            label="Bıçak Kodu"
                                            type="number"
                                            value={order.bicakKodu}
                                            onChange={(e) => setOrder({ ...order, bicakKodu: e.target.value })}
                                            fullWidth
                                        />
                                    </div>
                                </div>
                            </ComponentWrapper>


                            <Button type="submit" variant="contained" color="primary">
                                Sipariş Oluştur
                            </Button>

                        </form>
                    </div >
                </FormWrapper>
            </Container>
        </ThemeProvider >
    );
};

export default OrderForm;
