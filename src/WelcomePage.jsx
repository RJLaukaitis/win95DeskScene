import React, { useEffect, useRef } from 'react';
import "./WelcomePage.css";

const WelcomePage = ({ onEnter }) => {
  const infoRef = useRef(null);

  useEffect(() => {
    const systemInfo = [
      "Welcome to laukaitis OS.",
      "System information",
      "Version 2.0",
      "OS Version: Home Assistant OS 8.4",
      "IP address: 192.168.1.1",
      "MAC address: 00:1A:2B:3C:4D:5E",
      "Uptime: 72 hours",
      "CPU Usage: 23%",
      "Memory Usage: 45%",
      "Disk Space: 120GB free of 256GB",
      "Network: Connected to Wi-Fi",
      "Battery: 87% (charging)",
      "Temperature: 42°C",
      "GPU Usage: 15%",
      "Processes: 128 running",
      "System Load: 1.2",
      "Kernel Version: 5.4.0-42-generic",
      "Update Status: Up to date",
      "Time Zone: UTC+0",
      "Locale: en_US.UTF-8",
      "Virtualization: KVM",
      "Firewall: Enabled",
      "SSH Status: Active",
      "Docker: Running",
      "Kubernetes: Inactive",
      "SELinux: Permissive",
      "AppArmor: Enabled",
      "Swap Space: 2GB used of 8GB",
      "Logs: No errors found"
    ];

    const displayInfo = () => {
      systemInfo.forEach((info, index) => {
        setTimeout(() => {
          infoRef.current.innerText += `${info}\n`;
        }, index * 500); // Adjust the delay here for different speeds
      });
    };

    displayInfo();
  }, []);

  return (
    <div className="splash-screen">
      <pre className="logo">
        {`
  __                __         _ __  _      ____  _____
 / /   ____ ___  __/ /______ _(_) /_(_)____/ __ \\/ ___/
/ /   / __ \`/ / / / //_/ __ \`/ / __/ / ___/ / / /\\__ \\ 
/ /___/ /_/ / /_/ / ,  / /_/ / / /_/ (__  ) /_/ /___/ / 
\\____/\\__,_/\\__,_/_/|_|\\__,_/_/\\__/_/____/\\____//____/  
                                                         
        `}
      </pre>
      <div className="system-info">
        <pre ref={infoRef} className="tasks"></pre>
      </div>
      <button onClick={onEnter}>Enter</button>
    </div>
  );
};

export default WelcomePage;
