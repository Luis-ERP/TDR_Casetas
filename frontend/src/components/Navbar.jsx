import '../styles/navbar.scss';

export default function Navbar(props) {
return (
    <div className='my-navbar'>
        <div>
            <img src="https://www.tdr.com.mx/imagenes/logos/LOGO%20BLANCIO%20130X64.png" alt="TDR logo" height={27} />
            <hr />
            <img src="https://seeklogo.com/images/C/colgate-new-logo-10C5AE6906-seeklogo.com.png" alt="Colgate logo" height={23} />
        </div>
    </div>
);
}
