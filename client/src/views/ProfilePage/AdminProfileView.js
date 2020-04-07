import React,{Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';
import Button from 'components/CustomButtons/Button.js';
import Spinner from '../Dashboard/Spinner';
import {getProfileById} from '../../actions/profile';
import { makeStyles } from '@material-ui/core/styles';
import styles from 'assets/jss/material-kit-react/views/landingPage.js';
import Delete from '@material-ui/icons/Delete';
import GridContainer from 'components/Grid/GridContainer.js';

const useStyles = makeStyles(styles);
const AdminProfileView = (
    {getProfileById,
      profile : {profile,loading}, 
      auth:{users},
      match}) =>{
    const classes = useStyles();
    console.log('inside admin profile view')
    useEffect(() => {
        console.log('inside profileview use effect', match.params.id)
        getProfileById(match.params.id);
    },[getProfileById,match.params.id]);
    return loading && profile === null ? (
        <Spinner/>
    ) : (
        <Fragment>
            <div className={classes.landingContainer}>
                <div className={classes.dashboardTitle}>
                    {users.length > 0 && users !== null? (users.map(user => (profile.user === user._id ? (
                        <div>
                        <p>First Name: {user.name}</p>
                        <p> Email Id: {user.email}</p>
                        </div>
                    ) : (<p></p>)))) : (<p></p>)}
                    
                    
                    <p>User's current Address:</p>
                    {profile !== null ? (<div>
                        <p> {profile.address.address1}, {profile.address.address2}, {profile.address.city} </p>
                        {/* <p> {profile.address.address2}, </p>
                        <p> {profile.address.city} </p> */}
                        <p> {profile.address.state}, {profile.address.country}, {profile.address.zipcode}</p>
                        {/* <p> {profile.address.country}, </p>
                        <p> {profile.address.zipcode} </p> */}
                    </div>) : (<p> User is yet to create a profile</p>)}
                    
                <Button
                    simple
                    component={Link}
                    // to={`/admin-delete-profile/${user._id}`}
                    color='primary'
                    size='lg'
                >
                    <Delete/>
                </Button>
               </div> 
            </div>
        </Fragment>
    )
    
}

AdminProfileView.propTypes = {
    getProfileById:PropTypes.func.isRequired,
    profile:PropTypes.object.isRequired,
    auth:PropTypes.object.isRequired
   
}

const mapStateToProps = state => ({
    profile:state.profile,
    auth:state.auth
   
})

export default connect(mapStateToProps,{getProfileById})(AdminProfileView);