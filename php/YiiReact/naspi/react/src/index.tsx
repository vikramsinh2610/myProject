import React from 'react'
import ReactDOM from 'react-dom'
import {BrowserRouter, Route, Routes} from 'react-router-dom'

import moment from 'moment'
import momentLocalizer from 'react-widgets-moment'

import RecoverPassword from './views/user/recover-password'
import ResetPassword from './views/user/reset-password'
import ViewNaspi from './views/naspi/view';
import CreateNaspi from './views/naspi/create';
import Login from './views/user/login';
import Register from './views/user/register';
import MainPage from './views/main';
import CreateDsAgricola from "./views/ds-agricola/create";
import ViewDsAgricola from "./views/ds-agricola/view";
import CreateNaspiCom from './views/naspi-com/create'
import Contact from "./views/user/contact";
import ViewNaspiAnticipata from './views/naspi-anticipata/view'
import CreateNaspiAnticipata from './views/naspi-anticipata/create'

new momentLocalizer(moment)
moment.locale('it')

ReactDOM.render((
        <BrowserRouter>
            <Routes>
                <Route path={'/login'} element={<Login/>}/>
                <Route path={'/registrati'} element={<Register/>}/>
                <Route path={'/recupera-password'} element={<RecoverPassword/>}/>
                <Route path={'/reset-password'} element={<ResetPassword/>}/>
                {/* HOME PAGE */}
                <Route path={'/home'} element={<MainPage/>}/>
                {/* CONTATTI */}
                <Route path={'/contatti'} element={<Contact/>}/>
                {/* NASPI */}
                <Route path={'/naspi/:id/visualizza-domanda'} element={<ViewNaspi/>}/>
                <Route path={'/naspi/nuova-domanda'} element={<CreateNaspi/>}/>
                {/* NASPI COM */}
                <Route path={'/naspi-com/:id/variazione-domanda'} element={<CreateNaspiCom/>}/>
                {/* DS AGRICOLA */}
                <Route path={'/ds-agricola/:id/visualizza-domanda'} element={<ViewDsAgricola/>}/>
                <Route path={'/ds-agricola/nuova-domanda'} element={<CreateDsAgricola/>}/>
                {/* DS AGRICOLA */}
                <Route path={'/naspi-anticipata/:id/visualizza-domanda'} element={<ViewNaspiAnticipata/>}/>
                <Route path={'/naspi-anticipata/nuova-domanda'} element={<CreateNaspiAnticipata/>}/>

            </Routes>
        </BrowserRouter>
    ), document.getElementById('app')
)