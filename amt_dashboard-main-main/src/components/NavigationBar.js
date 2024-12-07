import React, { useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useNavigate } from "react-router-dom"; 
import logo from "../logo_amt.svg";
import { MenuOptions } from "./MenuOptions";
import { ChooseFileModal } from "../components/ChooseFileModal";
import axios from "axios";

import UploadFileIcon from "../icons/upload_file.svg";
import ExportDashboardIcon from "../icons/export_dashboard.svg";
import GenerateReportIcon from "../icons/generate_report.svg";
import EventsRegistrationIcon from "../icons/event_registration.svg";
import ResetDashboard from "../icons/reset_dashboard.svg";
import DashboardIcon from "../icons/dashboard_icon.svg";
import LogoutIcon from "../icons/logout_icon.svg";
import UserIcon from "../icons/person_icon.svg";

export function NavigationBar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const exportDashboardAsPDF = () => {
    const dashboardElement = document.getElementById("dashboard-container");
  
    if (!dashboardElement) {
      console.error("Dashboard container not found.");
      return;
    }
  
    const totalHeight = dashboardElement.scrollHeight;
    const totalWidth = dashboardElement.scrollWidth;
  
    html2canvas(dashboardElement, {
      backgroundColor: getComputedStyle(dashboardElement).backgroundColor || "#38A3A5",
      scale: 2,
      useCORS: true,
      width: totalWidth,
      height: totalHeight,
      x: 0,
      y: 0,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("landscape", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("dashboard.pdf");
    }).catch((error) => {
      console.error("Erro ao capturar o conteúdo do dashboard: ", error);
    });
  };

  const resetDashboardData = async () => {
    try {
      const response = await axios.post("http://localhost:5000/reset_dados");
      alert(response.data.message);
    } catch (error) {
      console.error("Erro ao resetar os dados", error);
      alert("Erro ao resetar os dados.");
    }
  };

  const menuItems = [
    {
      icon: UploadFileIcon,
      option: "escolher arquivo",
      onClick: handleOpenModal,
    },
    {
      icon: ExportDashboardIcon,
      option: "exportar dashboard",
      onClick: exportDashboardAsPDF,
    },
    {
      icon: GenerateReportIcon,
      option: "gerar relatório",
      showDivider: true,
    },
    {
      icon: EventsRegistrationIcon,
      option: "registro de eventos",
      to: "/eventregister",
    },
    {
      icon: ResetDashboard,
      option: "resetar dashboard",
      onClick: resetDashboardData,
      spaceBetween: true
    },
  ];

  return (
    <header className="flex flex-col min-h-screen w-1/4 2xl:w-1/6">
      <div className="flex items-center text-center justify-center gap-4 mt-4 mb-10">
        <img src={logo} alt="logo" />
        <div className="h-12 w-0.5 bg-secondary rounded-full"></div>
        <p
          id="title_logo"
          className="text-xs text-primary font-outfit font-black"
        >
          ANALYZE MY TRASH
        </p>
      </div>
      <div className="flex-grow">
        {menuItems.map((item, index) => (
          <MenuOptions
            key={index}
            icon={item.icon}
            option={item.option}
            to={item.to}
            showDivider={item.showDivider}
            spaceBetween={item.spaceBetween}
            onClick={item.onClick}
          />
        ))}
      </div>
      <div className="mt-auto">
        <MenuOptions 
          icon={DashboardIcon} 
          option="voltar para o dashboard" 
          onClick={() => navigate("/")} 
        />
        <MenuOptions icon={LogoutIcon} option="logout" />
        <MenuOptions icon={UserIcon} option="usuário" />
      </div>

      <ChooseFileModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </header>
  );
}
