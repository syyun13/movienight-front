import React, { Component } from 'react';
import { Button } from '@mui/material';
import AWS from 'aws-sdk';

class Upload extends Component {
    constructor(props){
        super(props);
        this.state = {
            imagefile: null,
        }
        this.fileChange = this.fileChange.bind(this);
    }

    fileChange(event){
        const this_var = this;
        const file = event.target.files.item(0);
        this.setState({
            imagefile: file
        });
        const s3 = new AWS.S3({
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_KEY,
        });
        const params = {
            Bucket: 'movienight-photo-bucket',
            Key: file.name,
            Body: file
        };
        s3.upload(params, function(err, data){
            if(err) throw err;
            this_var.props.setImageFile(data.Location);
        })
    }

    render(){
        return (
            <div style={{marginTop: 10}}>
                <Button
                    variant="contained"
                    component="label"
                    style={{backgroundColor: '#4f57e8', fontWeight: 'bold'}}
                >
                    Upload new image
                    <input type="file" onChange={this.fileChange} hidden />
                </Button>
            </div>
        )
    }
}

export default Upload;