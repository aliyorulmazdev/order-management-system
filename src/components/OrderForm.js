import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import tr from 'date-fns/locale/tr'; // Türkçe dil desteği
import TextField from '@mui/material/TextField';
import { Button, makeStyles } from '@material-ui/core';
import Autocomplete from '@mui/material/Autocomplete';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import pantoneColors from './pantone-coated.json';
import firmalar from './firmalar.json';
import Avatar from '@mui/material/Avatar';
import { Chip } from '@mui/material';
import ermatLogo from '../assets/ermat_logo.png';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


registerLocale('tr', tr);
const getPhotoSwatchStyle = {
    width: '40px',
    height: '40px',
    marginRight: '5px',
};
const useStyles = makeStyles((theme) => ({
    button: {
        backgroundColor: '#3e8490',
        color: 'white',
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center', // Vertically center the content
        '&:hover': {
            backgroundColor: '#bde2e8'
        },
    },
    buttonNote: {
        backgroundColor: '#66c3d0',
        color: 'white',
        padding: '10px 20px',
        fontSize: '16px',
        borderRadius: '5px',
        display: 'flex',
        alignItems: 'center', // Vertically center the content
        '&:hover': {
            backgroundColor: '#bde2e8'
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
  position: relative; /* Add position relative to the FormWrapper */
  width: 50%;
  padding: 20px;
  border: 1px solid #ccc;
  background-color: #f7f7f7;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const ComponentWrapper = styled.div`
  margin-bottom: 20px;
`;

const ErmatLogoImage = styled.img`
  position: absolute;
  top: 25px;
  right: 25px;
  width: 200px; /* Adjust the width as needed */
`;

const OrderForm = () => {
    const [isIsinAdiEmpty, setIsIsinAdiEmpty] = useState(false);
    const [open, setOpen] = React.useState(false);
    const classes = useStyles();
    const [order, setOrder] = useState({
        siparisTarihi: new Date(),
        terminTarihi: null,
        firmaAdi: '',
        isinAdi: '',
        isinAdedi: '',
        kagitTuru: null,
        kagitGramaji: '',
        kagitOlculeri: {
            en: '',
            boy: '',
        },
        baskiOlculeri: {
            en: '',
            boy: '',
        },
        standartBaskiRenkleri: null,
        baskiTuru: null,
        baskiRenkleri: [],
        ekstraBaskiRenkleri: [],
        baskiMakinasi: null,
        kalipTuru: null,
        kalipAdedi: '',
        selefon: { value: 'Yok', label: 'Yok' },
        kesim: { value: 'Yok', label: 'Yok' },
        bicakTuru: { value: 'Bıçak Yok', label: 'Bıçak Yok' },
        bicakKodu: '',
        siparisDurumu: 'Onay bekliyor',
        note: '',
    });
    const handleDelete = (color) => {
        const updatedColors = order.ekstraBaskiRenkleri.filter((c) => c.pantone !== color.pantone);
        setOrder({ ...order, ekstraBaskiRenkleri: updatedColors });
    };
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const handleSubmitDialog = () => {
        // Sipariş notunu order objesine ekleyebilirsiniz.
        // Örneğin: setOrder({ ...order, note: order.note });
        handleClose();
    };

    const handleNoteChange = (e) => {
        setOrder({ ...order, note: e.target.value });
    };
    const invertColor = (hex) => {
        // Assuming hex is in the format "#RRGGBB" or "RRGGBB"
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        // Calculate the inverse color values
        const inverseR = 255 - r;
        const inverseG = 255 - g;
        const inverseB = 255 - b;

        // Convert the inverse color values to hex
        const inverseHex =
            "#" +
            ("0" + inverseR.toString(16)).slice(-2) +
            ("0" + inverseG.toString(16)).slice(-2) +
            ("0" + inverseB.toString(16)).slice(-2);

        return inverseHex;
    };

    const [baskiRenkSecimi] = useState([
        { value: 'C', label: 'Cyan (C)' },
        { value: 'M', label: 'Magenta (M)' },
        { value: 'Y', label: 'Yellow (Y)' },
        { value: 'K', label: 'Key (Black) (K)' },
        { value: 'CM', label: 'Cyan and Magenta (CM)' },
        { value: 'CY', label: 'Cyan and Yellow (CY)' },
        { value: 'CMY', label: 'Cyan, Magenta, and Yellow (CMY)' },
        { value: 'CK', label: 'Cyan and Key (CK)' },
        { value: 'MK', label: 'Magenta and Key (MK)' },
        { value: 'YK', label: 'Yellow and Key (YK)' },
        { value: 'CMK', label: 'Cyan, Magenta, and Key (CMK)' },
        { value: 'CYK', label: 'Cyan, Yellow, and Key (CYK)' },
        { value: 'MYK', label: 'Magenta, Yellow, and Key (MYK)' },
        { value: 'CMYK', label: 'Cyan, Magenta, Yellow, and Key (CMYK)' },
    ]);
    const isOptionEqualToValue = (option, value) => option.pantone === value.pantone;
    const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Check if the "Sipariş Adı" field is empty
        if (!order.isinAdi) {
            setIsIsinAdiEmpty(true); // Set the error state to true
            return;
        }
    
        // If the "Sipariş Adı" field is not empty, proceed with form submission
        setIsIsinAdiEmpty(false); // Reset the error state to false
    
        try {
            // Send the order data to the server using axios
            const response = await axios.post('http://localhost:5000/api/createOrder', order, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
    
            if (response.status === 200) {
                console.log('Sipariş gönderildi:', order);
                alert('Sipariş gönderildi!');
                window.location.reload();
            } else {
                console.log('Sipariş gönderilirken bir hata oluştu.');
                alert('Sipariş gönderilirken bir hata oluştu.');
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Bir hata oluştu.');
        }
    };
    

    return (
        <ThemeProvider theme={theme}>
            <Container>
                <FormWrapper>

                    <div>
                        <h2>Sipariş Oluşturma Sayfası</h2>
                        <ErmatLogoImage src={ermatLogo} alt="ERMAT Logo" />
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
                                    <div style={{ display: 'flex', alignItems: 'center', width: '50%' }}>
                                        <div style={{ paddingRight: '10px', flex: '1' }}>
                                            <Autocomplete
                                                options={firmalar}
                                                isOptionEqualToValue={(option, value) => option.label === value.label}
                                                getOptionLabel={(option) => option.firma_adi}
                                                value={order.firmaAdi !== '' ? firmalar.find((firma) => firma.firma_adi === order.firmaAdi) : null}
                                                onChange={(event, newValue) => setOrder({ ...order, firmaAdi: newValue ? newValue.firma_adi : '' })}
                                                renderInput={(params) => <TextField {...params} label="Firma Adı" />}
                                                fullWidth
                                                renderOption={(props, option) => (
                                                    <li {...props}>
                                                        <div style={{ display: 'flex', alignItems: 'center' }}>
                                                            <Avatar alt={option.firma_adi} src={option.firma_foto_url} style={getPhotoSwatchStyle} />
                                                            Firma Adı: {option.firma_adi}
                                                        </div>
                                                    </li>
                                                )}
                                            />

                                        </div>
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
                                                error={isIsinAdiEmpty} // Apply error style if the field is empty
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
                                            isOptionEqualToValue={(option, value) => option.label === value.label}
                                            options={[
                                                { value: 'KRAFT', label: 'KRAFT' },
                                                { value: 'KROME', label: 'KROME' },
                                                { value: 'BRISTOL', label: 'BRISTOL' },
                                                { value: 'I.HAMUR', label: 'I.HAMUR' },
                                                { value: 'KUŞE ÇIKARTMA', label: 'KUŞE ÇIKARTMA' },
                                                { value: 'PELUR', label: 'PELUR' },
                                            ]}
                                            value={order.kagitTuru !== null ? order.kagitTuru : null} // Use null explicitly
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
                                    {/* Kağıt Gramajı */}
                                    <div style={{ flex: '1', paddingLeft: '10px' }}>
                                        <TextField
                                            label="Kağıt Gramajı"
                                            type="number"
                                            value={order.kagitGramaji}
                                            onChange={(e) => setOrder({ ...order, kagitGramaji: e.target.value })}
                                            placeholder="gr/m2"
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
                                            isOptionEqualToValue={(option, value) => option.label === value.label}
                                            value={order.kalipTuru !== null ? order.kalipTuru : null} // Use null explicitly
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
                                            fullWidth
                                        />
                                    </div>
                                </div>
                            </ComponentWrapper>


                            <ComponentWrapper>
                                <div style={{ display: 'flex', width: '100%' }}>
                                    <div style={{ flex: '1', paddingRight: '10px' }}>
                                        <Autocomplete
                                            options={baskiRenkSecimi}
                                            isOptionEqualToValue={(option, value) => option.label === value.label}
                                            value={order.standartBaskiRenkleri !== null ? order.standartBaskiRenkleri : null} // Use null explicitly
                                            onChange={(event, newValue) => setOrder({ ...order, standartBaskiRenkleri: newValue })}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => <TextField {...params} label="Standart Baskı Renkleri" />}
                                        />
                                    </div>
                                    <div style={{ flex: '1' }}>
                                        <Autocomplete
                                            options={[
                                                { value: '4+0', label: '4+0 (CMYK)' },
                                                { value: '4+1', label: '4+1 (CMYK + 1 PMS)' },
                                                { value: '4+2', label: '4+2 (CMYK + 2 PMS)' },
                                                { value: '4+3', label: '4+3 (CMYK + 3 PMS)' },
                                                { value: '5+4', label: '5+4 (CMYK + 4 PMS)' },
                                            ]}
                                            isOptionEqualToValue={(option, value) => option.label === value.label}
                                            value={order.baskiTuru !== null ? order.baskiTuru : null} // Use null explicitly
                                            onChange={(event, newValue) => setOrder({ ...order, baskiTuru: newValue })}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => <TextField {...params} label="Baskı Türü" />}
                                        />
                                    </div>
                                </div>
                            </ComponentWrapper>

                            <ComponentWrapper>
                                <div style={{ display: 'flex', width: '100%' }}>
                                    <div style={{ flex: '1' }}>
                                        <Autocomplete
                                            multiple

                                            options={pantoneColors}
                                            getOptionLabel={(option) => option.pantone || ''} // this line style should changed to background: option.hex
                                            value={order.ekstraBaskiRenkleri}
                                            onChange={(event, newValue) => setOrder({ ...order, ekstraBaskiRenkleri: newValue })}
                                            renderInput={(params) => <TextField  {...params} label="Ekstra Baskı Renkleri Seçin" />}
                                            isOptionEqualToValue={isOptionEqualToValue}
                                            fullWidth
                                            renderTags={(value) =>
                                                value.map((option, index) => (
                                                    <Chip
                                                        onDelete={() => handleDelete(option)}
                                                        key={index}
                                                        variant="outlined"
                                                        label={
                                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                                {option.pantone}
                                                            </div>
                                                        }
                                                        sx={{ background: option.hex, color: invertColor(option.hex) }}
                                                    />
                                                ))
                                            }
                                            renderOption={(props, option) => (
                                                <li {...props}>
                                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                                        <div
                                                            style={{
                                                                background: option.hex, // Set the background color to hex color Aight
                                                                width: '10px',
                                                                height: '10px',
                                                                marginRight: '5px',
                                                            }}
                                                        />
                                                        <span style={{ color: option.hex }}>{option.pantone}</span>
                                                    </div>
                                                </li>
                                            )}
                                        />


                                    </div>
                                </div>
                            </ComponentWrapper>




                            <ComponentWrapper>
                                <div style={{ display: 'flex', width: '100%' }}>
                                    <div style={{ flex: '1', paddingRight: '10px' }}>
                                        <Autocomplete
                                            options={[
                                                { value: 'Seçiniz', label: 'Seçiniz' },
                                                { value: 'Komori 70X100', label: 'Komori 70X100' },
                                                { value: 'Roland 70X100', label: 'Roland 70X100' },
                                                { value: 'Planeta 100X140', label: 'Planeta 100X140' },

                                            ]}
                                            isOptionEqualToValue={(option, value) => option.label === value.label}
                                            value={order.baskiMakinasi !== null ? order.baskiMakinasi : null} // Use null explicitly
                                            onChange={(event, newValue) => setOrder({ ...order, baskiMakinasi: newValue })}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => <TextField {...params} label="Baskı Makinası" />}
                                        />
                                    </div>
                                    {/* Kağıt Ölçüsü (En) */}
                                    <div style={{ flex: '1', paddingRight: '10px' }}>
                                        <TextField
                                            label="Baskı Ölçüsü (En)"
                                            type="number"
                                            value={order.baskiOlculeri.en}
                                            onChange={(e) => setOrder({ ...order, baskiOlculeri: { ...order.baskiOlculeri, en: e.target.value } })}
                                            placeholder="En (mm)"
                                            fullWidth
                                        />
                                    </div>

                                    {/* Kağıt Ölçüsü (Boy) */}
                                    <div style={{ flex: '1' }}>
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
                            </ComponentWrapper>
                            <ComponentWrapper>
                                <div style={{ flex: '1' }}>
                                    <Autocomplete
                                        options={[
                                            { value: 'Yok', label: 'Yok' },
                                            { value: 'Mat Selefon', label: 'Mat Selefon' },
                                            { value: 'Parlak Selefon', label: 'Parlak Selefon' },
                                            { value: 'Soft Selefon', label: 'Soft Selefon' },
                                            { value: 'Renkli Selefon', label: 'Renkli Selefon' },
                                        ]}
                                        isOptionEqualToValue={(option, value) => option.label === value.label}
                                        value={order.selefon !== null ? order.selefon : null} // Use null explicitly
                                        onChange={(event, newValue) => setOrder({ ...order, selefon: newValue })}
                                        getOptionLabel={(option) => option.label}
                                        renderInput={(params) => <TextField {...params} label="Selefon" />}
                                    />
                                </div>
                            </ComponentWrapper>
                            <ComponentWrapper>
                                <div style={{ display: 'flex', width: '100%' }}>
                                    <div style={{ flex: '1', paddingRight: '10px' }}>
                                        <Autocomplete
                                            options={[
                                                { value: 'Yok', label: 'Yok' },
                                                { value: 'Giyotin Kesim', label: 'Giyotin Kesim' },
                                                { value: 'Kazanlı Kesim', label: 'Kazanlı Kesim' },
                                            ]}
                                            isOptionEqualToValue={(option, value) => option.label === value.label}
                                            value={order.kesim !== null ? order.kesim : null} // Use null explicitly
                                            onChange={(event, newValue) => setOrder({ ...order, kesim: newValue })}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => <TextField {...params} label="Kesim" />}
                                        />
                                    </div>

                                    <div style={{ flex: '1' }}>
                                        <Autocomplete
                                            options={[
                                                { value: 'Bıçak Yok', label: 'Bıçak Yok' },
                                                { value: 'Bıçak Var', label: 'Bıçak Var' },
                                            ]}
                                            isOptionEqualToValue={(option, value) => option.label === value.label}
                                            value={order.bicakTuru !== null ? order.bicakTuru : null} // Use null explicitly
                                            onChange={(event, newValue) => setOrder({ ...order, bicakTuru: newValue })}
                                            getOptionLabel={(option) => option.label}
                                            renderInput={(params) => <TextField {...params} label="Bıçak Türü" />}
                                        />
                                    </div>
                                </div>
                            </ComponentWrapper>


                            <ComponentWrapper>
                                <div style={{ display: 'flex', width: '100%' }}>
                                    <div style={{ flex: '1' }}>
                                        <TextField
                                            label="Bıçak Kodu"
                                            type="text"
                                            value={order.bicakKodu}
                                            onChange={(e) => setOrder({ ...order, bicakKodu: e.target.value })}
                                            fullWidth
                                        />
                                    </div>
                                </div>
                            </ComponentWrapper>
                            <div>
                                <Button className={classes.buttonNote} variant="contained" style={{ width: '100%' }} onClick={handleClickOpen}>
                                    Sipariş Notu Ekle
                                </Button>
                                <Dialog open={open} onClose={handleClose}>
                                    <DialogTitle>Sipariş Notu Ekle</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>
                                            Siparişinizle ilgili eklemek istediğiniz notu aşağıya yazabilirsiniz.
                                        </DialogContentText>
                                        <TextField
                                            autoFocus
                                            margin="dense"
                                            id="note"
                                            label="Sipariş Notu"
                                            type="text"
                                            fullWidth
                                            variant="standard"
                                            value={order.note}
                                            onChange={handleNoteChange}
                                        />
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleClose}>İptal</Button>
                                        <Button onClick={handleSubmitDialog}>Ekle</Button>
                                    </DialogActions>
                                </Dialog>
                            </div>
                            <br></br>
                            <Button
                                className={classes.button}
                                variant="contained"
                                type="submit"
                                style={{ width: '100%' }}
                            >
                                Siparişi Gönder
                            </Button>
                        </form>
                    </div>
                </FormWrapper>
            </Container>
        </ThemeProvider>
    );
};
export default OrderForm;