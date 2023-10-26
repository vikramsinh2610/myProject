// Helpers/EventBus.js

import Vue from 'vue';

export const ACTIONS = {
    SNACKBAR_OK: 'snackbarOk',
    SNACKBAR_KO: 'snackbarKo',
    OPEN_DOC: 'openDoc',
    OPEN_MOV: 'openMov',
};

const EventBus = new Vue();

export default EventBus;