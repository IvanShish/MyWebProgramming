import React, {useRef} from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@material-ui/core';

export default function FormBuy(props) {
    const [open, setOpen] = React.useState(false);
    const countRef = useRef();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleStart = () => {
        const count = parseInt(countRef.current.value);
        if (count > props.max || count <= 0) {
            const m = props.max + 1;
            alert('Количество акций должно быть меньше ' + m + ' и больше 0');
        }
        else {
            props.onBuyClick(count);
            setOpen(false);
        }
    };

    return (
        <div>
            <button className={'miniButton'} onClick={handleClickOpen}>
                Купить
            </button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Покупка акций</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Сколько акций Вы хотите купить?
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Количество"
                        type="number"
                        fullWidth
                        inputRef={countRef}
                    />
                </DialogContent>
                <DialogActions>
                    <button onClick={handleClose}>
                        Отмена
                    </button>
                    <button onClick={handleStart}>
                        Купить
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    );
}