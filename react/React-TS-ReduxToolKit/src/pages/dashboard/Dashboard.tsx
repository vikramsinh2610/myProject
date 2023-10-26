
import React, { useState } from "react";
import { Box, Container, Grid, IconButton, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

import { ReactComponent as LeftArrow } from "../../assets/images/leftAngle.svg";
import { ReactComponent as RightArrow } from "../../assets/images/rightAngle.svg";
import { ReactComponent as Edit } from "../../assets/images/pencil.svg";
import { ReactComponent as Tour } from "../../assets/images/tour.svg";
import { ReactComponent as Check } from "../../assets/images/check.svg";
import { ReactComponent as Production } from "../../assets/images/Expanded.svg";
import { ReactComponent as File } from "../../assets/images/file.svg";
import SuperscriptLink from '../../components/SuperscriptLink';

import './dashboard.scss'

const Dashboard = () => {
    const [data, setData] = useState('');

    const handleChange = (event: SelectChangeEvent) => {
        setData(event.target.value as string);
    };

    const Array = [
        { id: 1, driver: "Jörgen Schrödl", Area: "Nordwestdeutschland", status: "Pause" },
        { id: 2, driver: "Uwe Wagner", Area: "Ostdeutschland", status: "Entladen" },
        { id: 3, driver: "Karsten Voigt", Area: "Norddeutschland", status: "Unterwegs" }
    ]

    return (
        <div>
            <Box p={"40px 0"}>
                <Container maxWidth="xl">
                    <Grid container spacing={5}>
                        <SuperscriptLink
                            linkUrl="https://example.com"
                            linkText="Visit Example Website"
                            superscriptText="*"
                        />
                    </Grid>
                </Container>

            </Box>
        </div>
    );
};

export default Dashboard;