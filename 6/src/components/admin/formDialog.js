import React, {useRef} from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@material-ui/core';

String.prototype.toDate = function(format)
{
    var normalized      = this.replace(/[^a-zA-Z0-9]/g, '-');
    var normalizedFormat= format.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-');
    var formatItems     = normalizedFormat.split('-');
    var dateItems       = normalized.split('-');

    var monthIndex  = formatItems.indexOf("mm");
    var dayIndex    = formatItems.indexOf("dd");
    var yearIndex   = formatItems.indexOf("yyyy");
    var hourIndex     = formatItems.indexOf("hh");
    var minutesIndex  = formatItems.indexOf("ii");

    var today = new Date();

    var year  = yearIndex>-1  ? dateItems[yearIndex]    : today.getFullYear();
    var month = monthIndex>-1 ? dateItems[monthIndex]-1 : today.getMonth()-1;
    var day   = dayIndex>-1   ? dateItems[dayIndex]     : today.getDate();

    var hour    = hourIndex>-1      ? dateItems[hourIndex]    : today.getHours();
    var minute  = minutesIndex>-1   ? dateItems[minutesIndex] : today.getMinutes();

    return new Date(year,month,day,hour,minute);
};

export default function FormDialog(props) {
    const [open, setOpen] = React.useState(false);
    const intervalRef = useRef();
    const dateRef = useRef();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleStart = () => {
        const date = (dateRef.current.value).toDate("yyyy-mm-ddThh:ii");
        const today = new Date();

        if (props && intervalRef.current.value > 5 && date.getFullYear() >= today.getFullYear() &&
        date.getMonth() >= today.getMonth() && date.getDay() >= today.getDay()) {
            props.settings.interval = intervalRef.current.value;
            props.settings.datetimeEnd = dateRef.current.value;
            props.onBeginClick();
            setOpen(false);
        }
        else {
            alert('Интервал должен быть > 5, дата должна быть больше текущей');
        }
    };

    return (
        <div>
            <button style={{width: '80%'}} onClick={handleClickOpen}>
                Начало торгов
            </button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Настройки торгов</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Введите данные торгов
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Интервал"
                        type="number"
                        fullWidth
                        inputRef={intervalRef}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        type="datetime-local"
                        fullWidth
                        inputRef={dateRef}
                    />
                </DialogContent>
                <DialogActions>
                    <button onClick={handleClose}>
                        Отмена
                    </button>
                    <button onClick={handleStart}>
                        Начать торги
                    </button>
                </DialogActions>
            </Dialog>
        </div>
    );
}