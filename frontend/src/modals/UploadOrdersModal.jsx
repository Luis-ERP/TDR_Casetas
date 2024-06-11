import { useState, useEffect } from "react";
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from "reactstrap";
import Papa from "papaparse";
import { createRawOrder } from "../client/orders";

export default function UploadOrdersModal({
    isOpen,
    toggle,
}) {
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        const allowedTypes = ['text/csv'];
        if (selectedFile && allowedTypes.includes(selectedFile.type)) {
        setFile(selectedFile);
        setError(null);
        } else {
        setFile(null);
        setError('Please select a CSV file');
        }
    };
    
    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file');
            return;
        }
        setLoading(true);
        // convert file to js array
        const reader = new FileReader();
        reader.readAsText(file);
        
        reader.onload = async ({ target }) => {
            const csv = Papa.parse(target.result, {header: true,});
            const parsedData = csv?.data;
            const headers = Object.keys(parsedData[0]);
            let rows = parsedData.map((x) => Object.values(x));
            rows = rows.filter(row => row[1] === 'COLITU');
            for (let i = 1; i < rows.length; i += 1000) {
                const bulk = rows.slice(i, i + 1000);
                bulk.unshift(headers);

                try {
                    await createRawOrder(bulk);
                } catch(error) {
                    setLoading(false);
                    error = error.response.data;
                    setError(error.response.data);
                }
            }
            setLoading(false);
            setFile(null);
            setError(null);
            alert('Orders uploaded successfully');
        };
    };
    
    return (
        <Modal isOpen={isOpen} toggle={toggle}>
            <ModalHeader>Subir órdenes</ModalHeader>
            <ModalBody>
                <div>
                    <p>Sleccione el archivo de órdenes de TMW en formato .csv</p>
                    <p>NOTA: solo se importarán las órdenes de "COLGATE ITURBIDE"</p>
                </div>
                <input type='file' onChange={handleFileChange} />
                {error && <p className='text-danger'>{error}</p>}
            </ModalBody>
            <ModalFooter>
                <Button color='primary' onClick={handleUpload} disabled={loading}>
                    {loading ? 'Cargando...' : 'Subir'}
                </Button>
                <Button color='secondary' onClick={toggle}>
                    Cancelar
                </Button>
            </ModalFooter>
        </Modal>
    );
}
    