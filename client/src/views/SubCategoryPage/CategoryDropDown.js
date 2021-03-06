import React, { useEffect, useState} from 'react';
import Select from "react-select";
import { getCategoryList } from "../../actions/category";
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import styles from "assets/jss/material-kit-react/views/adminDashboard.js";
import { makeStyles } from "@material-ui/core/styles";
import SubCategoryPage from 'views/SubCategoryPage/SubCategoryPage';

const useStyles = makeStyles(styles);
const CategoryDropDown = ({getCategoryList,
                    categorylist : {categoryList}},props) => {

    const classes = useStyles();
    //console.log('inside category drop down', props.categoryIdFromDropdown)

    // const [formData,setFormData] = useState({
    //     categoryId : props.categoryIdFromDropdown
    // })

    // const {categoryId} = formData;
    // console.log('category Id', categoryId);
    
    const [formData,setFormData] = useState({
        categoryIdFromDropdown : ''
    })
    const {categoryIdFromDropdown} = formData;

    const onSelectChange = (e) => {
        setFormData({
            categoryIdFromDropdown : e.value
        })
    }

    useEffect(() => {
        getCategoryList();
    },[getCategoryList]);

    return(
        <div className={classes.dropDownCenter}>
            <form>
                <h4><strong>
                    Please select a category to view list of Sub categories
                    </strong></h4>
                 <Select
                    options={categoryList}
                    id="categoryId"
                    onChange={(e) => onSelectChange(e)}
                />
            </form>
            {categoryIdFromDropdown? ( <SubCategoryPage
                    categoryIdToDisplay = {categoryIdFromDropdown}
            />)  : (<></>)}
           
        </div>
        
    )
}

CategoryDropDown.propTypes = {
    getCategoryList:PropTypes.func.isRequired,
    categorylist:PropTypes.object.isRequired
}

const mapStateToProps = (state) => ({
    categorylist:state.categorylist
})

export default connect(mapStateToProps,{getCategoryList})(CategoryDropDown);