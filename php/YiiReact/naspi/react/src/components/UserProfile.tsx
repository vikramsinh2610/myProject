import React, {FunctionComponent} from 'react'
import {User} from "../@types/model";

type UseProfileProps = {
    user: null | User
}

const UseProfile: FunctionComponent<UseProfileProps> = ({user}) => {
    return (<>
        <p className="text-center"><img src="/images/demo-profile-image.webp" alt="user-profile" className="rounded-circle" width="100" /></p>
        <h3 className='text-center'>{user?.name} {user?.surname}</h3>
        <p className="text-center">{user?.email}</p>
        <p className="text-center mt-3">
            {user?.mobile ?? user?.mobile}<br/>
            {user?.fiscal_code ?? user?.fiscal_code}
        </p>
    </>);
}

export default UseProfile;