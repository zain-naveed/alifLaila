import React from 'react'
import styles from './style.module.scss'
interface Props {
    title:string,
    titleStyle:any
}

function Title(props: Partial<Props>) {
    const {title,titleStyle} = props

    return (
        <label htmlFor='title' className={titleStyle ? titleStyle:styles.title}>{title}</label>
    )
}

export default Title
