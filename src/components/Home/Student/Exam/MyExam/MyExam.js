import React, {useCallback, useEffect, useState} from 'react';
import {
    Avatar,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Grid,
    IconButton,
    Typography
} from "@material-ui/core";
import {useHistory} from 'react-router-dom';
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {makeStyles} from "@material-ui/core/styles";
import {red} from "@material-ui/core/colors";
import Aux from "../../../../../hoc/_Aux/_Aux";
import {SearchBox} from "office-ui-fabric-react/lib/SearchBox";
import MessageToast from "../../../../Utils/MessageToast";
import {trackPromise} from 'react-promise-tracker';
import Vlogo from '../../../../../assets/v.png';
import {deleteUserExam, getExamsByUser, getUserExamById} from "../../../../../stores/actions/UserExamActions";
import UserExamStore from "../../../../../stores/store/UserExamStore";

const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
    },
    gridRoot: {
        flexGrow: 1,
    },
    media: {
        width: '21.5rem', paddingTop: '56.25%',
        border: 'grey 1px solid'
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
    },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
    avatar: {
        backgroundColor: red[500],
    },
}));
/**
 * Component for showing exams list.
 *
 * @component
 */
const MyExam = React.memo(() => {
    const history = useHistory();
    const classes = useStyles();
    const [myExamList, setMyExamList] = useState(UserExamStore.getExamsByUser());
    const [mainExamList, setMainExamList] = useState(UserExamStore.getExamsByUser());
    const [searchKey, setSearchKey] = useState('');
    const [messageToast, setMessageToast] = useState({open: false, title: ''});
    const onChange = useCallback(() => {
        const examsByUser = UserExamStore.getExamsByUser();
        if (examsByUser.length > 0) {
            setMyExamList(examsByUser);
            setMainExamList(examsByUser);
        }
        const userExamById = UserExamStore.getUserExamById();
        if (!!userExamById) {
            if(!!userExamById.status){
                setMessageToast({open: true, title: 'You have already taken this exam'});
            }else{
                history.push({
                    pathname: `/question_paper/${userExamById.examId}/${userExamById.id}`
                });
            }
        }

    },[history]);

    useEffect(() => {
        trackPromise(getExamsByUser()).then();
        UserExamStore.addChangeListener(onChange);
        return () => UserExamStore.removeChangeListener(onChange);
    }, [onChange]);



    /**
     * Handle search using following params
     * @param   {string} key  anonymous
     * @param   {string} val  Search Key
     */
    const handleSearch = (key, val) => {
        const onSearchList = [...myExamList];
        setSearchKey(val);
        if (val === '') {
            setMyExamList(mainExamList);
        } else {
            setMyExamList(onSearchList.filter(item => (item.title.toLowerCase().indexOf(val.toLowerCase()) !== -1)));
        }
    }
    const handleLeaveExam = async (id, examId) => {
        await trackPromise(deleteUserExam(id, examId));
        setMessageToast({open: true, title: 'You left the course'});
    }

    return (
        <Aux>
            <MessageToast open={messageToast.open} message={messageToast.title} onClose={() => {
                setMessageToast({open: false, title: ''});
            }}/>
            <SearchBox placeholder="Search" className="inputSearch" value={searchKey} onChange={handleSearch}/>
            <Grid container spacing={3}>
                {myExamList.map(
                    item => {
                        return <div style={{textDecoration: 'none', color: 'white', padding: '5px'}} key={item.exam.id}>
                            <Grid item xs={12}>
                                <Card className={classes.root}>
                                    <CardHeader
                                        avatar={
                                            <Avatar aria-label="recipe" className={classes.avatar}
                                                    src={Vlogo}/>
                                        }
                                        action={
                                            <IconButton aria-label="settings">
                                                {item.score > 0 ? `Score:${item.score}` : 'Open'}
                                            </IconButton>
                                        }
                                        title={item.exam.title}
                                        subheader={(`${new Date(item.exam['createdDate']).toDateString()}`)}
                                    />

                                    <CardMedia onClick={async () => {
                                        await trackPromise(getUserExamById(item.id, item.exam.id))
                                    }}
                                               className={classes.media}
                                               image={item.exam.imageUrl}
                                               title="Paella dish"
                                    />
                                    <CardContent>
                                        <Typography noWrap={true} variant="body2" color="textSecondary"
                                                    component="p">
                                            {item.exam.description}
                                        </Typography>
                                    </CardContent>
                                    <CardActions disableSpacing>
                                        <IconButton aria-label="share">
                                            <PlayCircleOutlineIcon/>
                                        </IconButton>
                                        <IconButton aria-label="share" onClick={() => {
                                            handleLeaveExam(item.id, item.exam.id)
                                        }}>
                                            <ExitToAppIcon/>
                                        </IconButton>
                                    </CardActions>
                                </Card>
                            </Grid>
                        </div>
                    }
                )}
            </Grid>
        </Aux>
    )

});

export default MyExam;
