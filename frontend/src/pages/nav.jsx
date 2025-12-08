import react from 'react';
function Nav(props) {
    return (
        <div className='dd3' style={{position: 'fixed', top: 0, width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px', background: 'Linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(16, 16, 17, 1) 35%, rgba(231, 21, 10, 1) 100%)', zIndex:'100'}}>
            <div className='dd1'>
                <h1 style={{ color: 'white', marginLeft:'30px'}}>Welcome {props.name}</h1>
            </div>
            <div className='dd2'>
                <nav>
                    <ul>
                        <li><a href='/home' style={{color:'white', textDecoration:'none'}}>Home</a></li>
                        <li><a href='/detection' style={{color:'white', textDecoration:'none'}}>Detection</a></li>
                        <li><a href='/dashboard' style={{color:'white', textDecoration:'none'}}>Dashboard</a></li>
                        <li style={{color:'white'}}><a href='/about' style={{color:'white', textDecoration:'none'}}>About Us</a></li>
                        <li className='l1'><button onClick={props.handleLogout}>Logout</button></li>
                    </ul>
                </nav>
            </div>
        </div>
    )
}

export default Nav;