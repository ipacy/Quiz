import React, {useCallback, useEffect, useState} from 'react';
import {Container} from "react-bootstrap";
import {
    AppBar,
    Button,
    Drawer,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    Toolbar,
    Typography
} from '@material-ui/core';
import Banner from "../../../../Navigation/Toolbar/Banner";
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import Hidden from "@material-ui/core/Hidden";
import QuestionList from "./QuestionList";
import {Checkbox, DefaultButton, Label} from "office-ui-fabric-react";
import QuillEditor from "../../../../Utils/QuillEditor";
import './Questions.css';
import {DoneAll, DoneOutline, SkipNext} from "@material-ui/icons";
import MessageToast from "../../../../Utils/MessageToast";
import {trackPromise} from 'react-promise-tracker';
import Aux from "../../../../../hoc/_Aux/_Aux";
import {getOptionByQuestion, getQuestionsByExam} from "../../../../../stores/actions/QuestionActions";
import QuestionStore from "../../../../../stores/store/QuestionStore";
import {updateUserExamStatus, submitUserAnswer} from "../../../../../stores/actions/UserExamActions";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    rootDummy: {
        display: 'flex',
        marginLeft: '25rem',
        flexWrap: 'wrap',
        '& > *': {
            width: '44rem',
            height: theme.spacing(16),
        },
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 200,
    },
    drawerPaper: {
        width: 350,
    },
    content: {
        flexGrow: 1,
        marginTop: '2rem',
        marginLeft: '15rem'
    },
    items: {
        marginBottom: '1px solid transparent'
    },
    question: {
        marginLeft: '4rem',
        marginBottom: '2rem',
        fontWeight: 'bold'
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
    bar: {
        backgroundColor: '#003678'
    }

}));

/**
 * Component for Enrolling Exam to User
 *
 * @component
 */
const Questions = (props) => {
    const [questionList, setQuestionList] = useState(QuestionStore.getQuestionsByExam());
    const [questionItem, setQuestionItem] = useState({});
    const [mobileOpen, setMobileOpen] = useState(false);
    const [messageComponent, setMessageComponent] = useState(false);
    const [messageToast, SetMessageToast] = useState({open: false, title: ''});
    const classes = useStyles();
    const history = useHistory();
    const sId = props.match.params.id;
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };


    const onChange = useCallback(() => {
        const questions = QuestionStore.getQuestionsByExam();
        setQuestionList(questions.length > 0 ? questions : []);
    }, []);

    useEffect(() => {
        trackPromise(getQuestionsByExam(sId)).then();
        QuestionStore.addChangeListener(onChange);
        return () => QuestionStore.removeChangeListener(onChange);
    }, [onChange, sId]);


    const handleQuestionsByExam = (value, ind) => {
        const newValue = {...value};
        newValue['index'] = ind + 1;
        newValue['title'] = newValue.question;
        handleOptionsByQuestion(newValue);
    }

    const handleNext = async (index) => {
        let newList = {...questionList};
        const eId = props.match.params.eId;
        let options = [];
        questionItem.options.forEach((item) => {
            if (item.isCorrect) {
                options.push({
                    userExamId: eId,
                    optionId: item.id
                })
            }
        });
        if (!!options.length) {
            await trackPromise(submitUserAnswer(options)).then(
                (responseData) => {
                    if (responseData.data && questionList.length !== index) {
                        debugger;
                        newList[index]['index'] = index + 1;
                        handleOptionsByQuestion(newList[index]);
                    }
                }).catch(e => {
                SetMessageToast({open: true, title: e.message});
            });
        }
    }

    const handleOptionsByQuestion = (newValue) => {
        const eId = props.match.params.eId;
        //await trackPromise(getOptionByQuestion(newValue['questionId'], eId));
        trackPromise(getOptionByQuestion(newValue['questionId'], eId)).then((responseData) => {
            if (responseData.data) {
                newValue['options'] = responseData.data;
                newValue['title'] = newValue.question;
                setMessageComponent(false);
                setQuestionItem(newValue);
            } else {
                setMessageComponent(true);
            }
        }).catch((e) => {
            SetMessageToast({open: true, title: e.message});
        });
    }


    const handleCheckChange = (i) => {
        let abc = {...questionItem};
        abc.options[i].isCorrect = !abc.options[i].isCorrect;
        if (questionItem.type === 0) {
            abc.options.map((item, j) => {
                if (i !== j) {
                    item.isCorrect = false
                }
                return item.isCorrect;
            })
        }
        setQuestionItem(abc);
    }

    const handleFinishExam = async () => {
        const eId = props.match.params.eId;
        const updated = await trackPromise(updateUserExamStatus(eId));
        if (!!updated.data) {
            history.push({
                pathname: '/student_exams'
            });
        } else {
            SetMessageToast({open: true, title: updated.message});
        }
    }

    const tableItems = (!!questionItem && !!questionItem.options) ? questionItem.options.map(
        (item, i) => {
            return <TableRow key={i}>
                <TableCell padding="checkbox" style={{marginBottom: '1px solid transparent'}}>
                    <Checkbox
                        className={questionItem.type === 0 ? 'checkBoxX' : ''}
                        checked={item.isCorrect} onChange={() => handleCheckChange(i)}/>
                </TableCell>
                <TableCell align="left">
                    <QuillEditor readOnly={true} id={`optionId${i}`} value={item.title}/>
                </TableCell>
            </TableRow>
        }
    ) : null;
//{/*{timerComponents.length ? timerComponents : <span>Time's up!</span>}*/}
    const individualItem = !!questionItem.title ? <Container>
        <Paper>
            <div>
                <Label
                    className={classes.question}>{`${questionItem.index}. ${questionItem.title}`}</Label>
                <TableContainer>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size='small'
                        aria-label="enhanced table">
                        <TableBody>
                            {tableItems}
                        </TableBody>
                    </Table>
                </TableContainer>
                <AppBar position="static" className={classes.bar}>
                    <Toolbar>
                        <Button color="inherit" edge="start" endIcon={<DoneAll/>} onClick={handleFinishExam}
                                className={classes.menuButton}>Finish</Button>
                        <Typography variant="h6" className={classes.title}/>
                        {/* {(questionItem.index > 1) ?
                                                <Button startIcon={<SkipPrevious/>} color="inherit"
                                                        onClick={(i) => {
                                                            handlePrevious(questionItem.index)
                                                        }}>Previous</Button> : null}*/}
                        {(questionList.length !== questionItem.index) ?
                            <Button endIcon={<SkipNext/>} color="inherit"
                                    onClick={(i) => {
                                        handleNext(questionItem.index)
                                    }}>Submit & Next</Button> : null}
                        {(questionList.length === questionItem.index) ?
                            <Button endIcon={<DoneOutline/>} color="inherit"
                                    onClick={(i) => {
                                        handleNext(questionItem.index);
                                        handleFinishExam();
                                    }}>Submit</Button> : null}
                    </Toolbar>
                </AppBar>
            </div>
        </Paper>
    </Container> : null
    return (
        <Aux className={classes.root}>
            <MessageToast open={messageToast.open} message={messageToast.title}/>

            <nav className={classes.drawer} aria-label="mailbox folders">
                <Hidden xsDown implementation="css">
                    <Drawer
                        // container={container}
                        variant="permanent"
                        anchor={'left'}
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        ModalProps={{
                            keepMounted: true,
                        }}>
                        <Banner/>
                        <QuestionList questionList={questionList} handleQuestionsByExam={handleQuestionsByExam}/>
                    </Drawer>
                </Hidden>
                {!messageComponent
                    ? <main className={classes.content}>{individualItem} </main>
                    : <main className={classes.content}>
                        <div className={classes.rootDummy}>
                            <Paper elevation={3} style={{textAlign: 'center'}}>
                                <Label>You cannot answer this question anymore</Label>
                                <DefaultButton text={'Finish Exam'} onClick={handleFinishExam}/>
                            </Paper>
                        </div>
                    </main>}
            </nav>
        </Aux>
    )
};


export default Questions;

