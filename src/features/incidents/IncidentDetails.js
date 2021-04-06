import React, { useEffect, useState } from 'react';
import { useParams, useRouteMatch } from "react-router-dom";
import { withStyles } from '@material-ui/core/styles';
import DetailsContainer from '../../components/DetailsContainer';
import DetailsBlock from '../../components/DetailsBlock';
import DetailsHeader from '../../components/DetailsHeader';
import { useSelector, useDispatch } from 'react-redux';
import _ from "lodash";
import {
    selectIncident, getIncidentDetailBlocks, select
} from '../../app/reducers/incidents/incidentSlice'
import { LinearProgress } from '@material-ui/core';
import DetailsTable from '../../components/DetailsTable';
// import DetailsSelect from '../../components/DetailsSelect';
// import labels from '../../app/detailStatusLabels';
import IncidentFormFields from './IncidentFormFields';

const BorderLinearProgress = withStyles((theme) => ({
    root: {
        height: theme.spacing(10),
    },
    colorPrimary: {
        backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    bar: {
        backgroundColor: theme.palette.secondary.lighter
    },
}))(LinearProgress);

const IncidentDetails = (props) => {
    // const classes = useStyles();
    let { path, url } = useRouteMatch();
    
    const { incidents } = props;
    const isLoaded = !_.isEmpty(incidents);
    const [loading, setloading] = useState(isLoaded);
    const { incidentId } = useParams();
    const dispatch = useDispatch();
    const selectedId = useSelector(selectIncident);
    const detailBlocks = useSelector(getIncidentDetailBlocks);

    const selectedIncident = incidents.find((incident) => !incident._id.indexOf(selectedId));

    useEffect(() => {
        setloading(!isLoaded ? true : false);
        if (!selectedId) {
            dispatch(select(incidentId));
        }
        // If hard refresh, dispatch a select incident id based on the URL params to keep in sync
        // Self: If want to keep the tabs in sync use local storage to store data alternative to useEffect.
    }, [selectedId, selectedIncident]);

    if (!selectedIncident) { return null; }
    // If the incident is not selected, return early to prevent re-renders

    const { geographics, incident } = selectedIncident;
    const [incidentInfo] = detailBlocks;
    const [IncidentInformation, AreasAffected] = incidentInfo.incidentDetails;
    // To deconstruct the array for easier use

    return <DetailsContainer query={!loading && isLoaded ? incident.status : ''}>
        {
            !loading ?
                <>
                    <DetailsHeader header={`Incident: ${geographics.municipal}`} />
                    <DetailsBlock title={IncidentInformation.title} detailRows={IncidentInformation.rows} />
                    <DetailsBlock title={`Incident Cases`} >
                        <DetailsTable
                            data={incident.cases}
                            linkAccessors={'zip_code'}
                            path={`${url}/case`}
                            // base url to have links within the table rows.
                            allowedKeys={["zip_code", "initial_time", "volume_traffic", "reviewed"]}
                            // for filtering specific data properties
                            tableHeader={["Zip Code", "Initial Time", "Volume Traffic", "Review"]}
                        />
                    </DetailsBlock>
                    <DetailsBlock title={AreasAffected.title} detailRows={AreasAffected.rows} />
                    <DetailsBlock title={`Incident Progress`}>
                        <IncidentFormFields data={incident}/>
                    </DetailsBlock>
                </>
                :
                <>
                    <BorderLinearProgress variant="indeterminate" />
                </>
        }

    </DetailsContainer>
}

export default IncidentDetails;
