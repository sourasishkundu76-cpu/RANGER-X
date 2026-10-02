/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavigationPath } from './types';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Footer } from './components/Footer';
import { CommandCenterView } from './components/CommandCenterView';
import { LiveSensorMonitorView } from './components/LiveSensorMonitorView';
import { RangerXDeviceView } from './components/RangerXDeviceView';
import { RescueModulesView } from './components/RescueModulesView';
import { EmergencyResponseView } from './components/EmergencyResponseView';
import { IncidentSimulatorView } from './components/IncidentSimulatorView';
import { SystemLogsView } from './components/SystemLogsView';
import { DeviceSettingsView } from './components/DeviceSettingsView';
import { ProjectInfoView } from './components/ProjectInfoView';
import { OfficerProfileModal } from './components/OfficerProfileModal';

export default function App() {
  const [currentPath, setCurrentPath] = useState<NavigationPath>('command-center');
  const [sosActive, setSosActive] = useState<boolean>(false);
  const [isOfficerProfileOpen, setIsOfficerProfileOpen] = useState<boolean>(false);

  const handleSosToggle = () => {
    setSosActive((prev) => !prev);
  };

  const handleNavigate = (path: NavigationPath) => {
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0d1322] text-[#dde2f8] font-['Geist'] selection:bg-[#0ea5e9] selection:text-[#003751] relative">
      {/* Top System Header */}
      <Header
        sosActive={sosActive}
        onSosToggle={handleSosToggle}
        onOpenOfficerProfile={() => setIsOfficerProfileOpen(true)}
      />

      {/* Fixed Left Navigation Console */}
      <Sidebar currentPath={currentPath} onNavigate={handleNavigate} />

      {/* Main Content Area */}
      <div className="pl-72">
        <main className="w-full pt-20 pb-14 px-6 min-h-screen bg-[#0d1322]">
          {currentPath === 'command-center' && (
            <CommandCenterView
              onNavigate={handleNavigate}
              onSosTrigger={() => setSosActive(true)}
            />
          )}

          {currentPath === 'live-sensor-monitor' && <LiveSensorMonitorView />}

          {currentPath === 'ranger-x-device' && <RangerXDeviceView />}

          {currentPath === 'rescue-modules' && <RescueModulesView />}

          {currentPath === 'emergency-response' && (
            <EmergencyResponseView
              sosActive={sosActive}
              onSosToggle={handleSosToggle}
            />
          )}

          {currentPath === 'incident-simulator' && <IncidentSimulatorView />}

          {currentPath === 'system-logs' && <SystemLogsView />}

          {currentPath === 'device-settings' && <DeviceSettingsView />}

          {currentPath === 'project-info-and-design-thinking' && <ProjectInfoView />}
        </main>
      </div>

      {/* Persistent Bottom Status Ribbon */}
      <Footer />

      {/* Officer Vance Credentials Modal */}
      <OfficerProfileModal
        isOpen={isOfficerProfileOpen}
        onClose={() => setIsOfficerProfileOpen(false)}
        sosActive={sosActive}
      />
    </div>
  );
}
