// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link, withRouter } from 'react-router-dom';
// @material-ui/core components
import { makeStyles } from '@material-ui/core/styles';
// core components
import Footer from 'components/Footer/Footer.js';
import GridContainer from 'components/Grid/GridContainer.js';
import GridItem from 'components/Grid/GridItem.js';
import Button from 'components/CustomButtons/Button.js';
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
import CardFooter from 'components/Card/CardFooter.js';
import CustomInput from 'components/CustomInput/CustomInput.js';
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import FormLabel from "@material-ui/core/FormLabel";
import styles from 'assets/jss/material-kit-react/views/loginPage.js';
import CustomDropdown from 'components/CustomDropdown/CustomDropdown.js';
//icons
import FiberManualRecord from "@material-ui/icons/FiberManualRecord";


import image from 'assets/img/bg7.jpg';

//Import register from other component
import { updateProduct, getSingleProduct } from '../../actions/product';

const useStyles = makeStyles(styles);

function UpdateProduct({ 
  updateProduct,
  history,
  match,
  product: { product , loading , products},
  getSingleProduct }) {

  const [selectedEnabled, setSelectedEnabled] = React.useState("b");
  const [cardAnimaton, setCardAnimation] = React.useState('cardHidden');
  setTimeout(function() {
    setCardAnimation('');
  }, 700);

  const [values, setValues] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    shipping: '',
    categories: [],
    category: '',
    photo: '',
    formData: ''
  });
  const classes = useStyles();

  const {
    name,
    description,
    price,
    quantity,
    shipping,
    categories,
    category,
    photo,
    formData
  } = values;
  
  var productName
  var productDescription
  var productPrice
  var productQuantity
  var productShipping
  var productCategory
  
  
  useEffect(() => {
    //getSingleProduct(match.params.id)
    products.map(product =>{
      if(product._id === match.params.id){
        productName = product.name;
        productDescription = product.description;
        productPrice = product.price;
        productQuantity = product.quantity;
        productShipping = product.shipping;
        productCategory = product.category;
      } 
    })
          setValues({
              name: productName,
              description: productDescription,
              price: productPrice,
              category: productCategory,
              quantity: productQuantity,
              shipping: productShipping,
              formData: new FormData()
          });
  },[match.params.id]);

  //OnChange event Handler
  const onChange = e => {
      const name = e.target.id
      const value = name ==='photo' ? e.target.files[0] : e.target.value;
      formData.set(name, value);
      setValues({ ...values,
               [name]: value});
     
  };

  // OnSubmit Event Handler
  const onSubmit = e => {
    e.preventDefault();
    updateProduct(formData, history , match.params.id)
  };
  return (
    <div>
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: 'url(' + image + ')',
          backgroundSize: 'cover',
          backgroundPosition: 'top center'
        }}
      >
        <div className={classes.container}>
          <GridContainer justify='center'>
            <GridItem xs={12} sm={12} md={4}>
              <Card className={classes[cardAnimaton]}>
                <form className={classes.form} onSubmit={e => onSubmit(e)}>
                  <CardHeader color='primary' className={classes.cardHeader}>
                    <h4>Update Your Product</h4>
                    <p></p>
                    <div className={classes.socialLine}></div>
                  </CardHeader>
                  <CardBody>
                    <CustomInput
                      labelText='Name...'
                      id='name'
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: 'text',
                        value: name,
                        required: true,
                        onChange: e => onChange(e)
                      }}
                    />
                    <CustomInput
                      labelText='Description...'
                      id='description'
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: 'text',
                        value: description,
                        onChange: e => onChange(e)
                      }}
                    />
                    <CustomInput
                      labelText='Price...'
                      id='price'
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: 'number',
                        value: price,
                        required: true,
                        onChange: e => onChange(e)
                      }}
                    />
                    <CustomInput
                      labelText='Quantity...'
                      id='quantity'
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: 'number',
                        value: quantity,
                        required: true,
                        onChange: e => onChange(e),
                        autoComplete: 'off'
                      }}
                    />
                    <FormLabel component="legend">Shipping</FormLabel>
      <RadioGroup
        aria-label="shipping"
        name="shipping"
        inputProps={{
          type: 'boolean',
          value: {shipping},
          required: true,
          onChange: e => onChange(e),
          autoComplete: 'off'
        }}
      >
        <FormControlLabel
          value="true"
          control={<Radio />}
          label="I will ship the product"
        />
        <FormControlLabel
          value="false"
          control={<Radio />}
          label="I won't ship this product"
        />
      </RadioGroup>
                    <CustomDropdown
                      buttonText="Category"
                      dropdownHeader="Categories"
                      buttonProps={{
                        className: classes.navLink,
                        color: "transparent"
                      }}
                      inputProps={{
                        type: 'text',
                        value: category,
                        required: true,
                        onChange: e => onChange(e),
                        autoComplete: 'off'
                      }}
                      dropdownList={[
                        "Action",
                        "Another action",
                        "Something else here",
                        { divider: true },
                        "Separated link",
                        { divider: true },
                        "One more separated link"
                      ]}
                    />
                    {/* <CustomInput
                      labelText='Category...'
                      id='category'
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: 'text',
                        value: category,
                        required: true,
                        onChange: e => onChange(e),
                        autoComplete: 'off'
                      }}
                    /> */}
                    <CustomInput
                      labelText='Photo...'
                      id='photo'
                      formControlProps={{
                        fullWidth: true
                      }}
                      inputProps={{
                        type: 'file',
                        required: true,
                        onChange: e => onChange(e)
                      }}
                    />
                  </CardBody>
                  <CardFooter className={classes.cardFooter}>
                    <Button simple type='submit' color='primary' size='lg'>
                     Save
                    </Button>
                    <Button simple color="primary" size='lg' component={Link} to="/dashboard/products">
                       Cancel
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        <Footer whiteFont />
      </div>
    </div>
  );
}

UpdateProduct.propTypes = {
    updateProduct: PropTypes.func.isRequired,
    getSingleProduct: PropTypes.func.isRequired,
    product: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  product: state.product
});

export default connect(
  mapStateToProps,
  { updateProduct, getSingleProduct }
)(withRouter(UpdateProduct));
