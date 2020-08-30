import React, {useEffect, useState} from 'react';
import {Container} from "react-bootstrap";
import 'office-ui-fabric-react/dist/css/fabric.css';
import {Label, TextField} from "office-ui-fabric-react";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTheme} from '@material-ui/core/styles';
import {CommandBarButton, DefaultButton} from "@fluentui/react";

const EditExam = (props) => {
    const [title, setTitle] = useState('');
    const [id, setId] = useState('');
    const [description, setDescription] = useState('');
    const [duration, setDuration] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [status] = useState(0); //setStatus
    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));


    const handleReset = () => {
        setId('');
        setTitle('');
        setDescription('');
        setDuration(0);
        setImageUrl('');
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });

    const handleImageChange = (event) => {
        const file = document.querySelector('#imgUploadInps').files[0];
        toBase64(file).then(response => {
            setImageUrl(response);
        }).catch(e => Error(e));

    }

    useEffect(() => {
        setOpen(!!props.open);
        if (!!props.open) {
            setId(props.id);
            setTitle(props.title);
            setDescription(props.description);
            setDuration(props.duration);
        }

        if (!props.open) {
            handleReset();
        }
    }, [props.description, props.duration, props.id, props.open, props.title]);

    return (
        <Dialog
            fullWidth={true}
            fullScreen={fullScreen}
            open={open}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">{'Edit Exam'}</DialogTitle>
            <DialogContent>
                <Container>
                    <TextField label='Title' multiline rows={3} value={title} onChange={event => {
                        setTitle(event.target.value);
                    }}/>
                    <TextField label='Description' multiline rows={3} value={description}
                               onChange={event => {
                                   setDescription(event.target.value);
                               }}/>
                    <TextField label='Duration' value={duration} onChange={event => {
                        setDuration(event.target.value);
                    }}/>
                    <Label
                        title='Image'
                    />
                    <TextField
                        name="upload-photo"
                        id='imgUploadInps'
                        type="file"
                        onChange={handleImageChange}
                    />
                </Container>
            </DialogContent>
            <DialogActions>
                <DefaultButton text="Submit" iconProps={{iconName: 'Save'}} onClick={() => {
                    props.handleEditExam({
                        id: id,
                        title: title,
                        description: description,
                        duration: parseInt(duration),
                        status: status,
                        imageUrl: !!imageUrl ? imageUrl : ''
                    });
                    handleReset();
                }}/>
                <DefaultButton text="Close" iconProps={{iconName: 'Cancel'}} onClick={props.onClose}/>
                <CommandBarButton width='5px'/>
            </DialogActions>
        </Dialog>

    );
};

export default EditExam;
