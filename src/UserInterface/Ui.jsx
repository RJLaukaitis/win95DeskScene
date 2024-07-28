import React, { useEffect, useState } from 'react';
import './Ui.css';

const Ui = () => {
    const [time, setTime] = useState('');


    useEffect(() => {


        const startTime = () => {
          const today = new Date();
          const hours = String(today.getHours()).padStart(2, '0');
          const minutes = String(today.getMinutes()).padStart(2, '0');
          const seconds = String(today.getSeconds()).padStart(2, '0');
          setTime(`${hours}:${minutes}:${seconds}`);
        };
    
        const timer = setInterval(startTime, 1000);
        startTime();
    
        return () => clearInterval(timer);
      }, []);


    return (
        <div className='ui-container'>
            <div className='clickBox'>
            <p>
                Click anywhere to continue.
            </p>
            </div>

            <div className='panel'>
                <div className='info'>
                    <p> Ronald Laukaitis</p>
                    <p>Lehigh University Student</p>
                </div>
                
                <div className='time'>
                    <p>{time}</p>
                </div>

            </div>

        </div>
    );
};

export default Ui;