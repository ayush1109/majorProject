import { Formik, Form } from 'formik';
import React, { useState } from 'react';
import TextField from './helpers/TextField';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { updateUser } from '../redux/actions/userAction'
import { useHistory } from 'react-router-dom';
import { Button } from '@mui/material';
import _ from 'lodash';
import Dropzone from 'react-dropzone'


const EditUser = (props) => {

    // const [pincode, setPincode] = useState([]);

    // React.useEffect(() => {
    //     if (props.user.pincode)
    //         setPincode(props.user.pincode);
    // }, []);
    console.log(props)


    const validate = Yup.object({
        firstName: Yup.string()
            .min(3, 'Minimum length should be 3')
            .required('First Name is required'),
        lastName: Yup.string()
            .min(2, 'Minimum length should be 3')
            .required('Last Name is required'),
        address: Yup.string()
            .required('Address is required'),
        email: Yup.string().email()
            .required('Company is required')
    })

    const initialValues = {
        firstName: props.user.firstName,
        lastName: props.user.lastName,
        address: props.user.address,
        email: props.user.email
    }

    // const handlePincodeChange = (pincode) => {
    //     setPincode(pincode);
    // }

    var myPic;
    var reader;

    const showImage = () => {
        reader = new FileReader();
        var url = reader.readAsDataURL(myPic[0]);
    }

    return (
        <>
            <h1>Edit Your Profile</h1>
            <Formik
                initialValues={initialValues}

                validationSchema={validate}

                onSubmit={values => {
                    console.log(values);
                    if (myPic !== undefined) {
                        values.file = myPic[0].name;
                        console.log(myPic);
                        props.updateUser(props.id, values, myPic[0]);
                    }
                    else {
                        props.updateUser(props.id, values);
                    }
                    props.handleClose();

                }}

            >
                {formik => (
                    <div className="addProduct-form container">
                        <Form>
                            <TextField label="First Name" name="firstName" type="text" autoFocus="autofocus" />
                            <TextField label="Last Name" name="lastName" type="text" />
                            <TextField label="Address" name="address" type="text" />
                            <TextField label="Email" name="email" type="text" />


                            {/* <label>Pincode delivery Location</label>
                            <TagsInput value={pincode} onChange={handlePincodeChange} /> */}

                            <Dropzone onDrop={acceptedFiles => {
                                myPic = acceptedFiles
                                showImage()
                            }}>
                                {({ getRootProps, getInputProps }) => (
                                    <section>
                                        <div {...getRootProps({
                                        })}>
                                            <input {...getInputProps({
                                                accept: 'image/*'
                                            })} />
                                            <p>Drag 'n' drop some files here, or click to select files</p>
                                        </div>
                                        <div>{myPic !== undefined ? <img src={reader.result} alt="image you uploaded" height={200} width={200}></img> : null}</div>
                                    </section>
                                )}
                            </Dropzone>

                            <Button type="submit" variant="contained" color="primary">Modify</Button>
                        </Form>
                    </div>
                )}
            </Formik>


        </>
    );

}


const mapStateToProps = (state) => {
    return {
        user: state.auth.user
    };
};

export default connect(mapStateToProps, {
    updateUser
})(EditUser);