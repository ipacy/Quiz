import React, {Component} from 'react';
import {Route, BrowserRouter as Router, Switch} from 'react-router-dom';
import Layout from './hoc/Layout/Layout';
import {connect} from "react-redux";
import StudentExams from './components/Home/Student/Exam/Exam';
import TutorExams from './components/Home/Tutor/Exams/Exams';
import DashboardUI from "./components/Home/Tutor/Dashboard/Dashboard";
import * as actions from "./store/actions";
import AuthLogin from './containers/Authentication/AuthLogin/AuthLogin';
import CreateQuestion from './components/Home/Tutor/CreateQuestion/CreateQuestion';
import CreateExam from './components/Home/Tutor/CreateExam/CreateExam';
import Questions from "./components/Home/Student/Exam/Questions/Questions";
import './App.css';
// import {AnimatedSwitch, spring} from 'react-router-transition';
// import StudentExams from "./containers/Home/Student/Exams/Exams";


class App extends Component {
    componentDidMount() {
        this.props.onAuth();
    }


    render() {

        /* function slide(val) {
             return spring(val, {
                 stiffness: 125,
                 damping: 16,
             });
         }*/

        /* const pageTransitions = {
             atEnter: {
                 offset: 100,
             },
             atLeave: {
                 offset: slide(-100),
             },
             atActive: {
                 offset: slide(0),
             },
         };*/
        // {...pageTransitions} AnimatedSwitch
        let mainApp = <Switch

            atEnter={{opacity: 0}}
            atLeave={{opacity: 0}}
            atActive={{opacity: 1}}>
            <Route path="/create_question/:id" component={CreateQuestion}/>
            <Route path="/question_paper/:id/:eId" component={Questions}/>
            <Route path="/student_exams" component={StudentExams}/>
            <Route path="/tutor_exams" component={TutorExams}/>
            <Route path="/tutor_dashboard" component={DashboardUI}/>
            <Route path="/create_exam" component={CreateExam}/>
            <Route path="/" exact component={AuthLogin}/>
        </Switch>


        return (
            <Router>
                <Layout showHeaderToolbar={true}>
                    {mainApp}
                </Layout>
            </Router>
        );
    }
}

const mapStateToProps = state => {
    return {
        email: state.auth.email,
        fullName: state.auth.fullName,
        userName: state.auth.userName,
        authenticated: state.auth.authenticated,
        id: state.auth.id,
        error: state.auth.error,
        isAdmin: state.auth.isAdmin
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: () => dispatch(actions.auth()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
