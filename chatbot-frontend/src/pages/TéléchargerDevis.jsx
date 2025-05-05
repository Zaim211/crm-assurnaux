import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  message,
  Modal,
  Card,
  Statistic,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  FilePdfOutlined,
  SendOutlined
} from "@ant-design/icons";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import moment from "moment";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo.jpeg";

const { confirm } = Modal;

const AllDevis = () => {
  const [allCommands, setAllCommands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
   totalHT: 0,
    totalTTC: 0,
    totalCommands: 0,
  });
  const token = localStorage.getItem("token");
  const decodedUser = token ? jwtDecode(token) : null;
  // const userLoged = decodedUser?.userId;
  const userRole = decodedUser?.role;

  useEffect(() => {
    fetchCommands();
  }, []);

  const fetchCommands = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      setLoading(true);
      const response = await axios.get("/command", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("API Response:", response);
      const commandsData = response?.data;
      const decodedToken = token ? jwtDecode(token) : null;
      const currentUserId = decodedToken?.userId;
      const role = decodedToken.role
      if (role === "Admin") {
        setAllCommands(commandsData); // Set only the "devis" commands
        updateStatistics(commandsData);
      } else {
    
      
        const filterecommand = commandsData.filter(
          (cmd) => cmd.session === currentUserId
        );

      // Filter commands to display only "devis" type
      const devisCommands = filterecommand.filter(
        (command) => command.command === "devis"
      );
      console.log('devisCommands', devisCommands)

      setAllCommands(devisCommands); // Set only the "devis" commands
      updateStatistics(devisCommands);
      }
      
     
      setLoading(false);
    } catch (error) {
      console.error("Error fetching commands:", error);
      message.error("Failed to fetch commands");
      setLoading(false);
    }
  };

  const updateStatistics = (commands) => {
    const totals = commands.reduce(
      (acc, cmd) => ({
        totalHT: acc.totalHT + (cmd.totalHT || 0),
        totalTTC: acc.totalTTC + (cmd.totalTTC || 0),
        totalCommands: acc.totalCommands + 1,
      }),
      { totalHT: 0, totalTTC: 0, totalCommands: 0 }
    );

    setStats(totals);
  };

  const handleEdit = (record, e) => {
    e.stopPropagation();
    window.location.href = `/leads/${record.lead}/create-command/${record._id}`;
  };
  

  const handleDelete = (id, e) => {
    e.stopPropagation();
    confirm({
      title: "Confirmation de suppression",
      icon: <ExclamationCircleOutlined />,
      content: "Êtes-vous sûr de vouloir supprimer ce devis ?",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: () => deleteCommand(id),
    });
  };

  const deleteCommand = async (id) => {
    try {
      await axios.delete(`/command/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      message.success("Devis supprimé avec succès");
      fetchCommands(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting command:", error);
      message.error("Failed to delete command");
    }
  };

  const safeRender = (value, fallback = "N/A") => {
    return value !== undefined && value !== null ? value : fallback;
  };

  const handleDownload = (commandId, e) => {
    e.stopPropagation();

    const command = allCommands.find((cmd) => cmd._id === commandId);
    if (!command) {
      message.error("Commande non trouvée");
      return;
    }

    const doc = new jsPDF();

    // === Add logo ===
    const logoWidth = 20;
    const logoHeight = 20;
    doc.addImage(logo, "JPEG", 15, 15, logoWidth, logoHeight);

    // === Company info just below logo ===
    const infoStartY = 10 + logoHeight + 18; // e.g., 40
    doc.setFontSize(10);
    doc.setTextColor(40, 40, 40);
    doc.text("Global energy", 15, infoStartY);
    doc.text("99c boulevard Constantin Descat", 15, infoStartY + 6);
    doc.text("9200 Tourcoing, France", 15, infoStartY + 12);
    doc.text("Tél: +33 6 10 08 33 86", 15, infoStartY + 20);
    doc.text("Email: global.energy@gmail.com", 15, infoStartY + 26);
    doc.setTextColor(0, 102, 204);
    doc.setFont(undefined, "bold");
    doc.text(`Devis n°: ${command.originalNumCommand}`, 15, infoStartY + 50);
    doc.setTextColor(0, 0, 0);
    doc.setFont(undefined, "normal");
    doc.setFontSize(8);
    doc.text(`Valable 10 jours`, 15, infoStartY + 55);
    doc.text(
      `En date du: ${moment(command.date).format("DD/MM/YYYY")}`,
      120,
      infoStartY + 50
    );

    const infoBoxWidth = 80;
    const infoBoxX = 120; // Starting X position

    // Set text color that contrasts with the background
    doc.setTextColor(40, 40, 40); // Dark gray text
    const maxAddressWidth = 80; // Maximum width in points (about 80mm)

    // Split the address into multiple lines if needed
    const addressLines = doc.splitTextToSize(
      command.address || "Non spécifié",
      maxAddressWidth
    );

    const lineHeight = 7; // Height per line in points

    const infoBoxHeights = 28 + (addressLines.length - 1) * lineHeight;
    doc.setFillColor(229, 231, 235);
    doc.setTextColor(40, 40, 40);
    doc.rect(infoBoxX, infoStartY, infoBoxWidth, infoBoxHeights, "F");
    // Add text on top of the background
    doc.setFontSize(8);
    doc.text(
      `MONSIEUR: ${command.nom || "Non spécifié"}`,
      infoBoxX + 5,
      infoStartY + 8
    );
    // doc.text(`${command.address || "Non spécifié"}`, infoBoxX + 5, infoStartY + 16);
    addressLines.forEach((line, index) => {
      doc.text(line, infoBoxX + 5, infoStartY + 16 + index * lineHeight);
    });
    doc.text(
      `${command.siret || "Non spécifié"}`,
      infoBoxX + 5,
      infoStartY + 16 + addressLines.length * lineHeight
    );
    // doc.text(`SIRET: ${command.siret || "Non spécifié"}`, infoBoxX + 5, infoBoxX + 24);

    // === Table headers ===
    const tableStartY = infoStartY + 70;
    doc.setFillColor(0, 102, 204);
    doc.setTextColor(255, 255, 255);
    doc.setDrawColor(209, 213, 219);
    doc.rect(15, tableStartY, 190, 10, "F");

    doc.text("N°", 20, tableStartY + 6);
    doc.text("Désignation", 35, tableStartY + 6);
    doc.text("Qté", 125, tableStartY + 6);
    doc.text("PU HT", 145, tableStartY + 6);
    doc.text("TVA", 165, tableStartY + 6);
    doc.text("Total HT", 200, tableStartY + 6, { align: "right" });

    // === Table row ===
    const cleanDescription = command.description.split(",")[0].trim();
    const splitDescription = doc.splitTextToSize(cleanDescription, 90);
    const rowHeight = Math.max(10, splitDescription.length * 30);
    const rowY = tableStartY + 10;

    doc.setFillColor(255, 255, 255);
    doc.setTextColor(40, 40, 40);

    // Borders
    doc.rect(15, rowY, 15, rowHeight); // N°
    doc.rect(30, rowY, 90, rowHeight); // Désignation
    doc.rect(120, rowY, 20, rowHeight); // Qté
    doc.rect(140, rowY, 20, rowHeight); // PU HT
    doc.rect(160, rowY, 20, rowHeight); // TVA
    doc.rect(180, rowY, 25, rowHeight); // Total HT

    // Content
    doc.text("1", 20, rowY + 12);
    doc.text(splitDescription, 32, rowY + 12);
    doc.text(command.quantite.toString() + " u", 125, rowY + 12);
    doc.text(
      `${(command.totalHT / command.quantite).toFixed(2)} €`,
      142,
      rowY + 12
    );
    doc.text("(20%)", 165, rowY + 12);
    doc.text(`${command.totalHT.toFixed(2)} €`, 200, rowY + 12, {
      align: "right",
    });

    // doc.setFont(undefined, "bold");
    // doc.text("Le client", 30, rowY + rowHeight + 40);
    const infoBoxWidths = 80;
    const infoBoxXs = 30;
    const infoStartYs = 250;
    const infoBoxHeightss = 28;

    doc.setFillColor(229, 231, 235);
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(8);
    doc.rect(infoBoxXs, infoStartYs, infoBoxWidths, infoBoxHeightss, "F");
    // Add text on top of the background
    doc.text("Le client", infoBoxXs + 5, infoStartYs + 4);
    doc.text("Mention manuscrite et datée :", infoBoxXs + 5, infoStartYs + 8);

    doc.text("« Bon pour accord. »", infoBoxXs + 5, infoStartYs + 12);

    const pageWidth = doc.internal.pageSize.getWidth(); // Get full width of the page
    const paymentY = rowY + rowHeight + 15;
    const totalsColWidth = 60;
    const totalsRowHeight = 8;

    // Align table to the far right
    const totalsX = pageWidth - totalsColWidth - 5;

    // Payment info (left side)
    doc.setTextColor(40, 40, 40);
    doc.text(
      "Paiement par virement bancaire ou par carte bleue.",
      15,
      paymentY
    );
    doc.setDrawColor(209, 213, 219); // black line
    doc.setLineWidth(0.2);
    doc.line(totalsX, paymentY - 3, totalsX + totalsColWidth, paymentY - 3);
    // Totals table data
    const totalsData = [
      { label: "Total HT", value: `${command.totalHT.toFixed(2)} €` },
      { label: "TVA à 20%", value: `${command.totalTVA.toFixed(2)} €` },
      {
        label: "Total TTC",
        value: `${command.totalTTC.toFixed(2)} €`,
        bold: true,
        bgColor: [229, 231, 235], // gray-200
      },
    ];

    // Draw table background and border
    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(209, 213, 219);
    doc.setLineWidth(0.2);

    // Add rows
    totalsData.forEach((row, index) => {
      const rowY = paymentY + index * totalsRowHeight;

      // Background
      if (row.bgColor) {
        doc.setFillColor(...row.bgColor);
        doc.rect(totalsX, rowY - 1, totalsColWidth, totalsRowHeight, "F");
      }

      // Text
      if (row.bold) {
        doc.setFont(undefined, "normal");
      } else {
        doc.setFont(undefined, "normal");
      }

      // Label and value
      doc.setTextColor(40, 40, 40);
      doc.text(row.label, totalsX + 4, rowY + 5);
      doc.text(row.value, totalsX + totalsColWidth - 4, rowY + 5, {
        align: "right",
      });

      // Divider line between rows
      if (index < totalsData.length - 1) {
        doc.line(
          totalsX,
          rowY + totalsRowHeight,
          totalsX + totalsColWidth,
          rowY + totalsRowHeight
        );
      }
    });

    // === Save ===
    doc.save(`Devis_${command.numCommand}.pdf`);
  };

  const handleSendPdf = async (commandId, e) => {
    e.stopPropagation();
  
    const command = allCommands.find((cmd) => cmd._id === commandId);
    if (command.command_type !== "devis") {
      return message.warning("Le devis est déjà validé et converti en commande.");

    }
  
    const doc = new jsPDF();
  
     // === Add logo ===
     const logoWidth = 20;
     const logoHeight = 20;
     doc.addImage(logo, "JPEG", 15, 15, logoWidth, logoHeight);
 
     // === Company info just below logo ===
     const infoStartY = 10 + logoHeight + 18; // e.g., 40
     doc.setFontSize(10);
     doc.setTextColor(40, 40, 40);
     doc.text("Global energy", 15, infoStartY);
     doc.text("99c boulevard Constantin Descat", 15, infoStartY + 6);
     doc.text("9200 Tourcoing, France", 15, infoStartY + 12);
     doc.text("Tél: +33 6 10 08 33 86", 15, infoStartY + 20);
     doc.text("Email: global.energy@gmail.com", 15, infoStartY + 26);
     doc.setTextColor(0, 102, 204);
     doc.setFont(undefined, "bold");
     doc.text(`Devis n°: ${command.numCommand}`, 15, infoStartY + 50);
     doc.setTextColor(0, 0, 0);
     doc.setFont(undefined, "normal");
     doc.setFontSize(8);
     doc.text(`Valable 10 jours`, 15, infoStartY + 55);
     doc.text(
       `En date du: ${moment(command.date).format("DD/MM/YYYY")}`,
       120,
       infoStartY + 50
     );
 
     const infoBoxWidth = 80;
     const infoBoxX = 120; // Starting X position
 
     // Set text color that contrasts with the background
     doc.setTextColor(40, 40, 40); // Dark gray text
     const maxAddressWidth = 80; // Maximum width in points (about 80mm)
 
     // Split the address into multiple lines if needed
     const addressLines = doc.splitTextToSize(
       command.address || "Non spécifié",
       maxAddressWidth
     );
 
     const lineHeight = 7; // Height per line in points
 
     const infoBoxHeights = 28 + (addressLines.length - 1) * lineHeight;
     doc.setFillColor(229, 231, 235);
     doc.setTextColor(40, 40, 40);
     doc.rect(infoBoxX, infoStartY, infoBoxWidth, infoBoxHeights, "F");
     // Add text on top of the background
     doc.setFontSize(8);
     doc.text(
       `MONSIEUR: ${command.nom || "Non spécifié"}`,
       infoBoxX + 5,
       infoStartY + 8
     );
     // doc.text(`${command.address || "Non spécifié"}`, infoBoxX + 5, infoStartY + 16);
     addressLines.forEach((line, index) => {
       doc.text(line, infoBoxX + 5, infoStartY + 16 + index * lineHeight);
     });
     doc.text(
       `${command.siret || "Non spécifié"}`,
       infoBoxX + 5,
       infoStartY + 16 + addressLines.length * lineHeight
     );
     // doc.text(`SIRET: ${command.siret || "Non spécifié"}`, infoBoxX + 5, infoBoxX + 24);
 
     // === Table headers ===
     const tableStartY = infoStartY + 70;
     doc.setFillColor(0, 102, 204);
     doc.setTextColor(255, 255, 255);
     doc.setDrawColor(209, 213, 219);
     doc.rect(15, tableStartY, 190, 10, "F");
 
     doc.text("N°", 20, tableStartY + 6);
     doc.text("Désignation", 35, tableStartY + 6);
     doc.text("Qté", 125, tableStartY + 6);
     doc.text("PU HT", 145, tableStartY + 6);
     doc.text("TVA", 165, tableStartY + 6);
     doc.text("Total HT", 200, tableStartY + 6, { align: "right" });
 
     // === Table row ===
     const cleanDescription = command.description.split(",")[0].trim();
     const splitDescription = doc.splitTextToSize(cleanDescription, 90);
     const rowHeight = Math.max(10, splitDescription.length * 30);
     const rowY = tableStartY + 10;
 
     doc.setFillColor(255, 255, 255);
     doc.setTextColor(40, 40, 40);
 
     // Borders
     doc.rect(15, rowY, 15, rowHeight); // N°
     doc.rect(30, rowY, 90, rowHeight); // Désignation
     doc.rect(120, rowY, 20, rowHeight); // Qté
     doc.rect(140, rowY, 20, rowHeight); // PU HT
     doc.rect(160, rowY, 20, rowHeight); // TVA
     doc.rect(180, rowY, 25, rowHeight); // Total HT
 
     // Content
     doc.text("1", 20, rowY + 12);
     doc.text(splitDescription, 32, rowY + 12);
     doc.text(command.quantite.toString() + " u", 125, rowY + 12);
     doc.text(
       `${(command.totalHT / command.quantite).toFixed(2)} €`,
       142,
       rowY + 12
     );
     doc.text("(20%)", 165, rowY + 12);
     doc.text(`${command.totalHT.toFixed(2)} €`, 200, rowY + 12, {
       align: "right",
     });
 
    //  doc.setFont(undefined, "bold");
    //  doc.text("Le client", 30, rowY + rowHeight + 40);
     const infoBoxWidths = 80;
     const infoBoxXs = 30;
     const infoStartYs = 250;
     const infoBoxHeightss = 28;
 
     doc.setFillColor(229, 231, 235);
     doc.setTextColor(40, 40, 40);
     doc.setFontSize(8);
     doc.rect(infoBoxXs, infoStartYs, infoBoxWidths, infoBoxHeightss, "F");
     // Add text on top of the background
     doc.text("Le client", infoBoxXs + 5, infoStartYs + 4);
     doc.text("Mention manuscrite et datée :", infoBoxXs + 5, infoStartYs + 8);
 
     doc.text("« Bon pour accord. »", infoBoxXs + 5, infoStartYs + 12);
 
     const pageWidth = doc.internal.pageSize.getWidth(); // Get full width of the page
     const paymentY = rowY + rowHeight + 15;
     const totalsColWidth = 60;
     const totalsRowHeight = 8;
 
     // Align table to the far right
     const totalsX = pageWidth - totalsColWidth - 5;
 
     // Payment info (left side)
     doc.setTextColor(40, 40, 40);
     doc.text(
       "Paiement par virement bancaire ou par carte bleue.",
       15,
       paymentY
     );
     doc.setDrawColor(209, 213, 219); // black line
     doc.setLineWidth(0.2);
     doc.line(totalsX, paymentY - 3, totalsX + totalsColWidth, paymentY - 3);
     // Totals table data
     const totalsData = [
       { label: "Total HT", value: `${command.totalHT.toFixed(2)} €` },
       { label: "TVA à 20%", value: `${command.totalTVA.toFixed(2)} €` },
       {
         label: "Total TTC",
         value: `${command.totalTTC.toFixed(2)} €`,
         bold: true,
         bgColor: [229, 231, 235], // gray-200
       },
     ];
 
     // Draw table background and border
     doc.setFillColor(255, 255, 255);
     doc.setDrawColor(209, 213, 219);
     doc.setLineWidth(0.2);
 
     // Add rows
     totalsData.forEach((row, index) => {
       const rowY = paymentY + index * totalsRowHeight;
 
       // Background
       if (row.bgColor) {
         doc.setFillColor(...row.bgColor);
         doc.rect(totalsX, rowY - 1, totalsColWidth, totalsRowHeight, "F");
       }
 
       // Text
       if (row.bold) {
         doc.setFont(undefined, "normal");
       } else {
         doc.setFont(undefined, "normal");
       }
 
       // Label and value
       doc.setTextColor(40, 40, 40);
       doc.text(row.label, totalsX + 4, rowY + 5);
       doc.text(row.value, totalsX + totalsColWidth - 4, rowY + 5, {
         align: "right",
       });
 
       // Divider line between rows
       if (index < totalsData.length - 1) {
         doc.line(
           totalsX,
           rowY + totalsRowHeight,
           totalsX + totalsColWidth,
           rowY + totalsRowHeight
         );
       }
     });
 
    const pdfBase64 = doc.output("datauristring"); // OR use doc.output("dataurlstring");
  
    try {
      await axios.post(
        `/command/send-devis-email/${commandId}`, 
        {
          email: command.email,
          pdf: pdfBase64,
          commandId: command._id,
          commandNum: command.numCommand,
          phone: command.phone,
          clientName: command.nom,
          societeName: command.nom_societé,
          code: command.code,
          description: command.description,
        },
      );
  
      message.success("Devis envoyé avec succès par email !");
    } catch (error) {
      console.error("Erreur lors de l'envoi par email :", error);
      message.error("Échec de l'envoi du devis.");
    }
  };
  

  const columns = [
    {
      title: "Devis",
      dataIndex: "originalNumCommand",
      key: "originalNumCommand",
      render: (text) => safeRender(text),
      sorter: (a, b) => (a.originalNumCommand || "").localeCompare(b.originalNumCommand || ""),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date) => moment(safeRender(date)).format("DD/MM/YYYY"),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: "Client",
      dataIndex: "nom",
      key: "nom",
      render: (text) => safeRender(text),
      ellipsis: true,
    },
    {
      title: "Créer par",
      dataIndex: "commercialName",
      key: "commercialName",
      render: (text) => safeRender(text),
      ellipsis: true,
    },
    // {
    //   title: "Produit",
    //   dataIndex: "code",
    //   key: "code",
    //   render: (text) => safeRender(text),
    //   ellipsis: true,
    // },
    {
      title: "Produit",
      dataIndex: "code",
      key: "code",
      render: (codes) => (
        <div style={{ lineHeight: "1.5" }}>
          {codes?.map((code, index) => (
            <div
              key={index}
              style={{
                // display: "flex",
                // alignItems: "flex-start",
                marginBottom: 4,
              }}
            >
              <span style={{ marginRight: 8 }}>•</span>
              <span>{code}</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      title: "Quantité",
      dataIndex: "quantite",
      key: "quantite",
      render: (text) => `${safeRender(text, "0")}`,
      // sorter: (a, b) => (a.quantite || 0) - (b.quantite || 0),
    },
    {
      title: "Total HT",
      dataIndex: "totalHT",
      key: "totalHT",
      render: (text) => `${safeRender(text, "0")} €`,
      sorter: (a, b) => (a.totalHT || 0) - (b.totalHT || 0),
    },
    {
      title: "Total TVA",
      dataIndex: "totalTVA",
      key: "totalTVA",
      render: (text) => `${safeRender(text, "0")} €`,
      sorter: (a, b) => (a.totalHT || 0) - (b.totalHT || 0),
    },
    {
      title: "Marge",
      dataIndex: "marge",
      key: "marge",
      render: (text) => `${safeRender(text, "0")} €`,
      sorter: (a, b) => (a.totalHT || 0) - (b.totalHT || 0),
    },
    {
      title: "Total TTC",
      dataIndex: "totalTTC",
      key: "totalTTC",
      render: (text) => `${safeRender(text, "0")} €`,
      sorter: (a, b) => (a.totalTTC || 0) - (b.totalTTC || 0),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={(e) => handleEdit(record, e)}
          />
          <Button
            icon={<FilePdfOutlined />}
            onClick={(e) => handleDownload(record._id, e)}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => handleDelete(record._id, e)}
          />
           <Button
    icon={<SendOutlined />}
    onClick={(e) => handleSendPdf(record._id, e)}
    title="Envoyer le devis"
  />
        </Space>
      ),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">Devis Management</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <Statistic title="Total Devis" value={stats.totalCommands} />
        </Card>
        <Card>
          <Statistic title="Total HT" value={stats.totalHT} suffix="€" />
        </Card>
        <Card>
          <Statistic title="Total TTC" value={stats.totalTTC} suffix="€" />
        </Card>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">
            {userRole === "commercial" ? "Mes Devis" : "Tous les Devis"}
          </h2>
        </div>

        <Table
          columns={columns.map((col) => ({
            ...col,
            title: (
              <div className="flex flex-col items-center">
                <div className="text-xs">{col.title}</div>
              </div>
            ),
          }))}
          dataSource={allCommands}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 10 }}
          scroll={{ x: true }}
          bordered
          onRow={(record) => ({
            onClick: () => (window.location.href = `/lead/${record.lead}`),
            style: { cursor: "pointer" },
          })}
        />
      </div>
    </div>
  );
};

export default AllDevis;
