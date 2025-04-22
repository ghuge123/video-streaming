

function Alert({ alert }) {
    const capitalize = (word) => {
        if (word === 'danger') word = 'error';
        let lower = word.toLowerCase();
        return lower.charAt(0).toUpperCase() + lower.slice(1);
    }
    return (
        <div style={{ height: alert?'50px': ''}} className='container'>
            {alert && <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                <strong>{capitalize(alert.type)}</strong> : {alert.msg}
            </div>}
        </div>

    )
}

export default Alert
