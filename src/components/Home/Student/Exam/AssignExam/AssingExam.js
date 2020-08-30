import React, {useCallback, useEffect} from 'react';
import {Container} from "react-bootstrap";
import 'office-ui-fabric-react/dist/css/fabric.css';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import {useTheme} from '@material-ui/core/styles';
import {CommandBarButton, DefaultButton} from "@fluentui/react";
import {Typography} from "@material-ui/core";
import {connect} from "react-redux";
import moment from "moment";
import {enrollUserExam} from "../../../../../stores/actions/UserExamActions";
import UserExamsStore from "../../../../../stores/store/UserExamStore";
import UserExamStore from "../../../../../stores/store/UserExamStore";

/**
 * Component for Enrolling Exam to User
 *
 * @component
 */
const AssignExam = (props) => {

    const onChange = useCallback(() => {
        const enrolled = UserExamStore.getEnrolled();
        const messages = UserExamStore.getMessages();
        if (!!enrolled) {
            setOpen(false);
        }
        if (messages.length > 0) {
            props.onExamAssigned(messages[0].text);
        }
    }, [props]);

    useEffect(() => {
        UserExamsStore.addChangeListener(onChange);
        return () => UserExamsStore.removeChangeListener(onChange);
    }, [onChange]);


    const [open, setOpen] = React.useState(false);
    const theme = useTheme();
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    const handleEnrollExam = async () => {
        await enrollUserExam({
            "applicationUserId": props.id,
            "examId": props.examId,
            "status": 0,
            "startDate": moment().format(),
            "endDate": "2020-08-16T19:57:48.914Z",
            "score": 0
        });
    }

    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    return (
        <Dialog
            fullWidth={true}
            fullScreen={fullScreen}
            open={open}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogTitle id="responsive-dialog-title">{'Enroll Exam'}</DialogTitle>
            <DialogContent>
                <Container>
                    <Typography>
                        Would you like to enroll for the following course
                    </Typography>
                </Container>
            </DialogContent>
            <DialogActions>
                <DefaultButton text="Yes" iconProps={{iconName: 'Save'}} onClick={handleEnrollExam}/>
                <DefaultButton text="No" iconProps={{iconName: 'Cancel'}} onClick={props.onClose}/>
                <CommandBarButton width='5px'/>
            </DialogActions>
        </Dialog>

    );
};

const mapStateToProps = state => {
    return {
        email: state.auth.email,
        fullName: state.auth.fullName,
        userName: state.auth.userName,
        authenticated: state.auth.authenticated,
        id: state.auth.id,
        error: state.auth.error,
        isAdmin: state.auth.isAdmin,
    };
};


export default connect(mapStateToProps)(AssignExam);
