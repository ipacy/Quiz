import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
    AppBar,
    Button,
    Container,
    CssBaseline,
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
import {makeStyles} from "@material-ui/core/styles";
import {useHistory} from "react-router-dom";
import QuestionList from "./QuestionList";
import {Checkbox, DefaultButton, Label} from "office-ui-fabric-react";
import QuillEditor from "../../../../Utils/QuillEditor";
import './Questions.css';
import {DoneAll, DoneOutline, SkipNext} from "@material-ui/icons";
import MessageToast from "../../../../Utils/MessageToast";
import {trackPromise} from 'react-promise-tracker';
import {getOptionByQuestion, getQuestionsByExam} from "../../../../../stores/actions/QuestionActions";
import QuestionStore from "../../../../../stores/store/QuestionStore";
import {submitUserAnswer, updateUserExamStatus} from "../../../../../stores/actions/UserExamActions";
import clsx from 'clsx';
import Countdown from 'react-countdown';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    rootDummy: {
        display: 'flex',
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
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
    },
    container: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
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
        // flexGrow: 1,
    },
    bar: {
        backgroundColor: '#003678',
        position: 'fixed',
        bottom: '0',
        left: '0'
    },
    appbar: {
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: '#003678',
    },
    drawerPaper: {
        position: 'unset',
        whiteSpace: 'nowrap',
        width: 240
    },
    appBarShift: {
        marginLeft: 240,
        width: `calc(100% - ${240}px)`,
        backgroundColor: '#003678',
    },
    appBarSpacer: theme.mixins.toolbar,
}));

/**
 * Component for Enrolling Exam to User
 *
 * @component
 */
const Questions = (props) => {
    const [questionList, setQuestionList] = useState(QuestionStore.getQuestionsByExam());
    const [questionItem, setQuestionItem] = useState({});
    const [messageComponent, setMessageComponent] = useState(false);
    const [messageToast, SetMessageToast] = useState({open: false, title: ''});
    const classes = useStyles();
    const history = useHistory();
    const sId = props.match.params.id;
    const [open] = React.useState(true);
    const [examTitle, setExamTitle] = useState('');

    const onChange = useCallback(() => {
        const questions = QuestionStore.getQuestionsByExam();
        if (questions.length > 0) {
            setExamTitle(questions[0].exam);
        }
        setQuestionList(questions.length > 0 ? questions : []);
    }, []);

    useEffect(() => {
        trackPromise(getQuestionsByExam(sId)).then();
        QuestionStore.addChangeListener(onChange);
        showToolbar(false);
        return () => {
            showToolbar(true);
            QuestionStore.removeChangeListener(onChange);
        }
    }, [onChange, sId]);

    const showToolbar = (flag) => {
        const hide = !!flag ? '' : 'none';
        document.getElementById('mainExamHeader').style.display = hide;
        document.getElementById('vBanner').style.display = hide;
        document.getElementById('extraHeader').style.display = hide;
    }

    const handleQuestionsByExam = (value, ind) => {
        const newValue = {...value};
        newValue['index'] = ind + 1;
        newValue['title'] = newValue.question;
        handleOptionsByQuestion(newValue);
    }

    const handleNext = async (index) => {
        let newList = {...questionList};
        const eId = props.match.params['eId'];
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

    const individualItem = !!questionItem.title ?
        <Paper>
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
                <Toolbar variant="dense">
                    <Button color="inherit" edge="start" endIcon={<DoneAll/>} onClick={handleFinishExam}
                            className={classes.menuButton}>Finish</Button>
                    <Typography variant="h6" className={classes.title}/>
                    {(questionList.length !== questionItem.index) ?
                        <Button endIcon={<SkipNext/>} color="inherit"
                                onClick={async (i) => {
                                    await handleNext(questionItem.index)
                                }}>Submit & Next</Button> : null}
                    {(questionList.length === questionItem.index) ?
                        <Button endIcon={<DoneOutline/>} color="inherit"
                                onClick={async (i) => {
                                    await handleNext(questionItem.index);
                                    await handleFinishExam();
                                }}>Submit</Button> : null}
                </Toolbar>
            </AppBar>
        </Paper> : <Paper>
            <Typography variant='h1' style={{textAlign: 'Center'}}>{examTitle} Exam</Typography>
        </Paper>


    const CompletionList = () => <span>Exam Over</span>;
    const renderer = ({hours, minutes, seconds, completed}) => {
        if (completed) {
            // Render a completed state
            return <CompletionList/>;
        } else {
            // Render a countdown
            return <span>Time Left : Hours:{hours} Minutes:{minutes} Seconds:{seconds}</span>;
        }
    };
    const countDownTimer = useMemo(() => {
        return <Countdown date={Date.now() + 10000} renderer={renderer}/>
    }, []);
    return (
        <div className={classes.root}>
            <CssBaseline/>
            <AppBar position="fixed" className={clsx(classes.appBar, open && classes.appBarShift)}>
                <Toolbar>
                    <Typography variant="h6" align='center' className={classes.title}/>
                    <Typography variant='h6' style={{flexGrow: "1"}}>
                        {countDownTimer}
                    </Typography>
                    <Button color='primary' onClick={() => {
                        history.push('/student_exams');
                    }}
                            style={{backgroundColor: '#003678', color: 'white'}}
                            endIcon={<ExitToAppIcon/>}>Leave</Button>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                classes={{paper: clsx(classes.drawerPaper)}}
                open={open}>
                <QuestionList questionList={questionList} handleQuestionsByExam={handleQuestionsByExam}/>
            </Drawer>
            <main className={classes.content}>
                <MessageToast open={messageToast.open} message={messageToast.title}/>
                <div className={classes.appBarSpacer}/>
                <Container maxWidth="lg" className={classes.container}>
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
                </Container>
            </main>
        </div>)
};


export default Questions;

