import React, {FunctionComponent} from 'react'

type FormProps = {
    errors: any,
    name: string,
    className: string,
    label: string,
    children: any
}

const FormLine: FunctionComponent<FormProps> = ({errors, name, className, label, children}) => {
    let classes = 'form-group ' + className
    if (errors && name in errors) {
        classes += ' has-error'
    }
    
    return <div className={classes}>
        <label className='control-label'>{label}</label>
        {children}
        {
            errors && name in errors &&
            <div className='help-block' dangerouslySetInnerHTML={{__html: errors[name]}}/>
        }
    </div>

}
export default FormLine