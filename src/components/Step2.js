import React, { Component } from 'react';
import { Grid, Button, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

class Step2 extends Component {
    render(){
        const { event_date } = this.props;
        return(
            <Grid
                container
                justifyContent="center"
                alignItems="center"
                style={{paddingTop: 50}}
            >
                <Grid item xs={12} align="center">
                    <p style={{fontWeight: 'bold', fontSize: '1.5em'}}>
                        When is your movie night?
                    </p>
                </Grid>
                <Grid item xs={12} align="center">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            renderInput={(props) => <TextField {...props} />}
                            label="Date and Time"
                            value={event_date}
                            onChange={(newValue) => {
                                this.props.setValue("event_date", newValue);
                            }}
                        />
                    </LocalizationProvider>
                </Grid>
                <Grid item xs={12} align="center" style={{marginTop: 100}}>
                    <Button
                        variant="outlined"
                        style={{margin: 5}}
                        onClick={() => this.props.prevStep()}
                    >
                        Previous
                    </Button>
                    <Button
                        variant="outlined"
                        style={{margin: 5}}
                        onClick={() => this.props.nextStep()}
                    >
                        Next
                    </Button>
                </Grid>
            </Grid>
        )
    }
}

export default Step2;